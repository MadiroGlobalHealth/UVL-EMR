package com.ozonehis.eip.odoo.openmrs.handlers.odoo;

import com.ozonehis.eip.odoo.openmrs.client.OdooClient;
import com.ozonehis.eip.odoo.openmrs.client.OdooUtils;
import com.ozonehis.eip.odoo.openmrs.mapper.odoo.PartnerMapper;
import com.ozonehis.eip.odoo.openmrs.model.Partner;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.apache.camel.ProducerTemplate;
import org.hl7.fhir.r4.model.CodeableConcept;
import org.hl7.fhir.r4.model.Extension;
import org.hl7.fhir.r4.model.Patient;
import org.hl7.fhir.r4.model.Type;
import org.openmrs.eip.EIPException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class PartnerHandler {
    private static final Logger log = LoggerFactory.getLogger(PartnerHandler.class);
    private static final String PERSON_ATTRIBUTE_URL = "http://fhir.openmrs.org/ext/person-attribute";
    private static final String PERSON_ATTRIBUTE_TYPE_URL = "http://fhir.openmrs.org/ext/person-attribute-type";
    private static final String PERSON_ATTRIBUTE_VALUE_URL = "http://fhir.openmrs.org/ext/person-attribute-value";
    private static final String INSURANCE_COVERAGE_ATTRIBUTE_NAME = "Insurance Coverage Tier";
    private static final String POLICY_OPTIONAL = "optional";
    private static final String POLICY_REQUIRED = "required";
    private static final String POLICY_DEFAULT = "default";

    @Value("${odoo.customer.dob.field}")
    private String odooCustomerDobField;

    @Value("${odoo.customer.id.field}")
    private String odooCustomerIdField;

    @Value("${insurance.coverage.tier.mode:required}")
    private String insuranceCoverageTierMode;

    @Value("${insurance.coverage.tier.default:}")
    private String insuranceCoverageTierDefault;

    @Autowired
    private OdooClient odooClient;

    @Autowired
    private PartnerMapper partnerMapper;

    @Autowired
    private OdooUtils odooUtils;

    public List<String> partnerDefaultAttributes;

    public Partner getPartnerByID(String partnerRefID) {
        this.partnerDefaultAttributes = List.of(
            "id",
            "name",
            "ref",
            "street",
            "street2",
            "city",
            "zip",
            "active",
            "comment",
            "property_product_pricelist"
        );
        Object[] records = this.odooClient.searchAndRead(
            "res.partner",
            List.of(Arrays.asList("ref", "=", partnerRefID)),
            this.partnerDefaultAttributes
        );
        if (records == null) {
            throw new EIPException(String.format("Got null response while searching for Partner with reference id %s", partnerRefID));
        }
        if (records.length == 1) {
            log.debug("Partner exists with reference id {} record {}", partnerRefID, records[0]);
            Map<String, Object> partnerRecord = new HashMap<>((Map<String, Object>) records[0]);
            Object partnerPricelist = partnerRecord.get("property_product_pricelist");
            if (partnerPricelist instanceof Object[] pricelistTuple && pricelistTuple.length > 0 && pricelistTuple[0] != null) {
                partnerRecord.put("property_product_pricelist", Integer.parseInt(pricelistTuple[0].toString()));
            }
            return this.odooUtils.convertToObject(partnerRecord, Partner.class);
        }
        if (records.length == 0) {
            log.warn("No Partner found with reference id {}", partnerRefID);
            return null;
        }
        log.warn("Multiple Partners exists with reference id {}", partnerRefID);
        throw new EIPException(String.format("Multiple Partners exists with reference id %s", partnerRefID));
    }

    public Partner createOrUpdatePartner(ProducerTemplate producerTemplate, Patient patient) {
        Partner fetchedPartner = this.getPartnerByID(patient.getIdPart());
        if (fetchedPartner != null && fetchedPartner.getPartnerId() > 0) {
            int partnerId = fetchedPartner.getPartnerId();
            log.info("Partner with reference id {} already exists, updating...", patient.getIdPart());
            Partner partner = this.partnerMapper.toOdoo(patient);
            this.applyExplicitPricelist(patient, partner);
            partner.setPartnerId(partnerId);
            this.sendPartner(producerTemplate, "direct:odoo-update-partner-route", partner);
            return this.getPartnerByID(partner.getPartnerRef());
        }
        log.info("Partner with reference id {} does not exist, creating...", patient.getIdPart());
        Partner partner = this.partnerMapper.toOdoo(patient);
        this.applyExplicitPricelist(patient, partner);
        this.sendPartner(producerTemplate, "direct:odoo-create-partner-route", partner);
        return this.getPartnerByID(partner.getPartnerRef());
    }

    public void applyExplicitPricelist(Patient patient, Partner partner) {
        String patientRef = patient.getIdPart();
        String configuredMode = normalizePolicyMode();
        String rawTierLabel = extractCoverageTierLabel(patient);
        if (rawTierLabel == null || rawTierLabel.isBlank()) {
            if (POLICY_OPTIONAL.equals(configuredMode)) {
                log.warn(
                    "insuranceCoverageTierSync patientRef={} coverageTierRaw=<missing> coverageTierResolved=<unchanged> odooPricelistName=<unchanged> odooPricelistId=<unchanged> policyMode={} syncOutcome=skipped-missing-tier",
                    patientRef,
                    configuredMode
                );
                return;
            }
            if (POLICY_DEFAULT.equals(configuredMode)) {
                rawTierLabel = insuranceCoverageTierDefault;
                if (rawTierLabel == null || rawTierLabel.isBlank()) {
                    throw new EIPException(
                        String.format(
                            "insurance.coverage.tier.default must be configured when insurance.coverage.tier.mode=default for patient %s",
                            patientRef
                        )
                    );
                }
            } else {
                throw new EIPException(
                    String.format("Patient %s is missing required %s person attribute", patientRef, INSURANCE_COVERAGE_ATTRIBUTE_NAME)
                );
            }
        }
        String pricelistName = resolveExpectedPricelistName(rawTierLabel, patientRef);
        String resolvedTier = pricelistName.replace("Insurance ", "");
        int pricelistId = findPricelistId(pricelistName, patient.getIdPart());
        partner.setPartnerPricelistId(pricelistId);
        log.info(
            "insuranceCoverageTierSync patientRef={} coverageTierRaw={} coverageTierResolved={} odooPricelistName={} odooPricelistId={} policyMode={} syncOutcome=applied",
            patientRef,
            rawTierLabel,
            resolvedTier,
            pricelistName,
            pricelistId,
            configuredMode
        );
    }

    public void sendPartner(ProducerTemplate producerTemplate, String endpointUri, Partner partner) {
        HashMap<String, Object> headers = new HashMap<>();
        if (endpointUri.contains("update")) {
            headers.put("odoo.attribute.value", List.of(partner.getPartnerId()));
        }
        producerTemplate.sendBodyAndHeaders(endpointUri, partner, headers);
    }

    private int findPricelistId(String pricelistName, String patientRef) {
        Object[] records = this.odooClient.searchAndRead(
            "product.pricelist",
            List.of(Arrays.asList("name", "=", pricelistName)),
            List.of("id", "name")
        );
        if (records == null) {
            throw new EIPException(
                String.format("Got null response while searching for Odoo pricelist %s for patient %s", pricelistName, patientRef)
            );
        }
        if (records.length == 0) {
            throw new EIPException(
                String.format("No Odoo pricelist named %s found for patient %s", pricelistName, patientRef)
            );
        }
        if (records.length > 1) {
            throw new EIPException(
                String.format("Multiple Odoo pricelists named %s found for patient %s", pricelistName, patientRef)
            );
        }
        Object id = ((Map<String, Object>) records[0]).get("id");
        if (id == null) {
            throw new EIPException(
                String.format("Odoo pricelist %s for patient %s did not return an id", pricelistName, patientRef)
            );
        }
        return Integer.parseInt(id.toString());
    }

    private String extractCoverageTierLabel(Patient patient) {
        for (Extension extension : patient.getExtension()) {
            if (!PERSON_ATTRIBUTE_URL.equals(extension.getUrl())) {
                continue;
            }
            String attributeName = null;
            Type attributeValue = null;
            for (Extension nested : extension.getExtension()) {
                if (PERSON_ATTRIBUTE_TYPE_URL.equals(nested.getUrl()) && nested.getValue() != null) {
                    attributeName = nested.getValue().primitiveValue();
                } else if (PERSON_ATTRIBUTE_VALUE_URL.equals(nested.getUrl())) {
                    attributeValue = nested.getValue();
                }
            }
            if (INSURANCE_COVERAGE_ATTRIBUTE_NAME.equals(attributeName)) {
                String label = extractCoverageLabel(attributeValue);
                if (label == null || label.isBlank()) {
                    throw new EIPException(
                        String.format("Patient %s has an empty %s value", patient.getIdPart(), INSURANCE_COVERAGE_ATTRIBUTE_NAME)
                    );
                }
                return label;
            }
        }
        return null;
    }

    private String extractCoverageLabel(Type attributeValue) {
        if (attributeValue == null) {
            return null;
        }
        if (attributeValue instanceof CodeableConcept codeableConcept) {
            if (codeableConcept.hasText() && codeableConcept.getText() != null && !codeableConcept.getText().isBlank()) {
                return codeableConcept.getText();
            }
            if (!codeableConcept.getCoding().isEmpty()) {
                if (codeableConcept.getCodingFirstRep().hasDisplay()) {
                    return codeableConcept.getCodingFirstRep().getDisplay();
                }
                if (codeableConcept.getCodingFirstRep().hasCode()) {
                    return codeableConcept.getCodingFirstRep().getCode();
                }
            }
            return null;
        }
        return attributeValue.primitiveValue();
    }

    private String resolveExpectedPricelistName(String rawTierLabel, String patientRef) {
        String normalized = rawTierLabel == null ? "" : rawTierLabel.trim();
        return switch (normalized) {
            case "50", "50%", "Insurance 50%" -> "Insurance 50%";
            case "60", "60%", "Insurance 60%" -> "Insurance 60%";
            case "70", "70%", "Insurance 70%" -> "Insurance 70%";
            case "80", "80%", "Insurance 80%" -> "Insurance 80%";
            case "90", "90%", "Insurance 90%" -> "Insurance 90%";
            case "100", "100%", "Insurance 100%" -> "Insurance 100%";
            default -> throw new EIPException(
                String.format(
                    "Unsupported %s value %s for patient %s; expected one of 50, 60, 70, 80, 90, 100",
                    INSURANCE_COVERAGE_ATTRIBUTE_NAME,
                    rawTierLabel,
                    patientRef
                )
            );
        };
    }

    private String normalizePolicyMode() {
        String normalized = insuranceCoverageTierMode == null ? "" : insuranceCoverageTierMode.trim().toLowerCase();
        return switch (normalized) {
            case "", POLICY_OPTIONAL -> POLICY_OPTIONAL;
            case POLICY_REQUIRED -> POLICY_REQUIRED;
            case POLICY_DEFAULT -> POLICY_DEFAULT;
            default -> throw new EIPException(
                String.format(
                    "Unsupported insurance.coverage.tier.mode value %s; expected one of %s, %s, %s",
                    insuranceCoverageTierMode,
                    POLICY_OPTIONAL,
                    POLICY_REQUIRED,
                    POLICY_DEFAULT
                )
            );
        };
    }

    public void setOdooCustomerDobField(String odooCustomerDobField) {
        this.odooCustomerDobField = odooCustomerDobField;
    }

    public void setOdooCustomerIdField(String odooCustomerIdField) {
        this.odooCustomerIdField = odooCustomerIdField;
    }

    public void setOdooClient(OdooClient odooClient) {
        this.odooClient = odooClient;
    }

    public void setPartnerMapper(PartnerMapper partnerMapper) {
        this.partnerMapper = partnerMapper;
    }

    public void setOdooUtils(OdooUtils odooUtils) {
        this.odooUtils = odooUtils;
    }

    public void setPartnerDefaultAttributes(List<String> partnerDefaultAttributes) {
        this.partnerDefaultAttributes = partnerDefaultAttributes;
    }
}
