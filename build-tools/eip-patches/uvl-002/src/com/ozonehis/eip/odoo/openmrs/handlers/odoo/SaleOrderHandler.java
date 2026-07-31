package com.ozonehis.eip.odoo.openmrs.handlers.odoo;

import com.ozonehis.eip.odoo.openmrs.client.OdooClient;
import com.ozonehis.eip.odoo.openmrs.client.OdooUtils;
import com.ozonehis.eip.odoo.openmrs.handlers.openmrs.ObservationHandler;
import com.ozonehis.eip.odoo.openmrs.mapper.odoo.SaleOrderMapper;
import com.ozonehis.eip.odoo.openmrs.model.Partner;
import com.ozonehis.eip.odoo.openmrs.model.Product;
import com.ozonehis.eip.odoo.openmrs.model.SaleOrder;
import com.ozonehis.eip.odoo.openmrs.model.SaleOrderLine;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.apache.camel.ProducerTemplate;
import org.hl7.fhir.r4.model.Encounter;
import org.hl7.fhir.r4.model.Observation;
import org.hl7.fhir.r4.model.Resource;
import org.openmrs.eip.EIPException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class SaleOrderHandler {
    private static final Logger log = LoggerFactory.getLogger(SaleOrderHandler.class);

    @Value("${eip.weight.concept}")
    private String weightConcept;

    @Value("${odoo.customer.weight.field}")
    private String odooCustomerWeightField;

    @Value("${odoo.customer.dob.field}")
    private String odooCustomerDobField;

    @Value("${odoo.customer.id.field}")
    private String odooCustomerIdField;

    @Autowired
    private OdooClient odooClient;

    @Autowired
    private SaleOrderLineHandler saleOrderLineHandler;

    @Autowired
    private SaleOrderMapper saleOrderMapper;

    @Autowired
    private ProductHandler productHandler;

    @Autowired
    private ObservationHandler observationHandler;

    @Autowired
    private OdooUtils odooUtils;

    public List<String> orderDefaultAttributes;

    public SaleOrder getDraftSaleOrderIfExistsByVisitId(String visitUuid) {
        orderDefaultAttributes = List.of("id", "client_order_ref", "partner_id", "state", "order_line");
        Object[] records =
                odooClient.searchAndRead(
                        "sale.order",
                        List.of(List.of("client_order_ref", "=", visitUuid), List.of("state", "=", "draft")),
                        orderDefaultAttributes);
        if (records == null) {
            throw new EIPException(String.format("Got null response while fetching for Sale order with client_order_ref %s", visitUuid));
        }
        if (records.length == 1) {
            SaleOrder saleOrder = odooUtils.convertToObject((Map<String, Object>) records[0], SaleOrder.class);
            log.debug("Sale order exists with client_order_ref {} sale order {}", visitUuid, saleOrder);
            return saleOrder;
        }
        if (records.length == 0) {
            log.warn("No Sale order found with client_order_ref {}", visitUuid);
            return null;
        }
        log.warn("Multiple Sale order exists with client_order_ref {}", visitUuid);
        throw new EIPException(String.format("Multiple Sale order found with client_order_ref %s", visitUuid));
    }

    public void sendSaleOrder(ProducerTemplate producerTemplate, String endpointUri, SaleOrder saleOrder) {
        HashMap<String, Object> headers = new HashMap<>();
        if (endpointUri.contains("update")) {
            headers.put("odoo.attribute.value", List.of(saleOrder.getOrderId()));
        }
        producerTemplate.sendBodyAndHeaders(endpointUri, saleOrder, headers);
    }

    public void updateSaleOrderIfExistsWithSaleOrderLine(
            Resource resource,
            SaleOrder saleOrder,
            String visitUuid,
            int partnerId,
            String patientId,
            ProducerTemplate producerTemplate) {
        SaleOrderLine saleOrderLine = saleOrderLineHandler.buildSaleOrderLineIfProductExists(resource, saleOrder);
        if (saleOrderLine == null) {
            log.info("{}: Skipping create sale order line for encounter Visit {}", resource.getClass().getName(), visitUuid);
            return;
        }
        if (saleOrder.getPartnerWeight() == null
                || saleOrder.getPartnerWeight().isEmpty()
                || "false".equals(saleOrder.getPartnerWeight())) {
            updateSaleOrderWithPatientWeight(partnerId, patientId, saleOrder, producerTemplate);
        }
        producerTemplate.sendBody("direct:odoo-create-sale-order-line-route", saleOrderLine);
        log.debug(
                "{}: Created sale order line {} and linked to sale order {}",
                resource.getClass().getName(),
                saleOrderLine,
                saleOrder);
    }

    public void createSaleOrderWithSaleOrderLine(
            Resource resource,
            Encounter encounter,
            Partner partner,
            String visitUuid,
            String patientId,
            ProducerTemplate producerTemplate) {
        SaleOrder saleOrder = saleOrderMapper.toOdoo(encounter);
        saleOrder.setOrderPartnerId(partner.getPartnerId());
        saleOrder.setOrderState("draft");
        saleOrder.setPartnerBirthDate(partner.getPartnerBirthDate());
        if (partner.getPartnerExternalId() != null) {
            saleOrder.setOdooCustomerId(partner.getPartnerExternalId().replaceAll("(?i)</?p>", ""));
        }
        String partnerWeight = getPartnerWeight(patientId);
        if (partnerWeight != null) {
            saleOrder.setPartnerWeight(partnerWeight);
        }
        sendSaleOrder(producerTemplate, "direct:odoo-create-sale-order-route", saleOrder);
        log.debug("{}: Created sale order with partner_id {}", resource.getClass().getName(), partner.getPartnerId());

        SaleOrder fetchedOrder = getDraftSaleOrderIfExistsByVisitId(visitUuid);
        if (fetchedOrder != null) {
            SaleOrderLine saleOrderLine = saleOrderLineHandler.buildSaleOrderLineIfProductExists(resource, fetchedOrder);
            if (saleOrderLine == null) {
                log.info("{}: Skipping create sale order line and sale order for partner_id {}", resource.getClass().getName(), partner.getPartnerId());
                return;
            }
            producerTemplate.sendBody("direct:odoo-create-sale-order-line-route", saleOrderLine);
            log.debug(
                    "{}: Created sale order {} and sale order line {} and linked to sale order",
                    resource.getClass().getName(),
                    fetchedOrder.getOrderId(),
                    saleOrderLine);
        }
    }

    public void deleteSaleOrderLine(Resource resource, String visitUuid, ProducerTemplate producerTemplate) {
        SaleOrder saleOrder = getDraftSaleOrderIfExistsByVisitId(visitUuid);
        if (saleOrder != null) {
            Product product = productHandler.getProduct(resource);
            if (product != null) {
                SaleOrderLine saleOrderLine =
                        saleOrderLineHandler.getSaleOrderLineIfExists(
                                saleOrder.getOrderId().intValue(), product.getProductResId().intValue());
                if (saleOrderLine != null) {
                    saleOrderLineHandler.sendSaleOrderLine(producerTemplate, "direct:odoo-delete-sale-order-line-route", saleOrderLine);
                }
            }
        }
    }

    public void cancelSaleOrderWhenNoSaleOrderLine(int partnerId, String visitUuid, ProducerTemplate producerTemplate) {
        SaleOrder saleOrder = getDraftSaleOrderIfExistsByVisitId(visitUuid);
        if (saleOrder != null && (saleOrder.getOrderLine() == null || saleOrder.getOrderLine().isEmpty())) {
            log.debug("SaleOrderHandler: Count of sale order line {}", saleOrder.getOrderLine());
            saleOrder.setOrderState("cancel");
            saleOrder.setOrderPartnerId(partnerId);
            sendSaleOrder(producerTemplate, "direct:odoo-update-sale-order-route", saleOrder);
        }
    }

    public void updateSaleOrderWithPatientWeight(int partnerId, String patientId, SaleOrder saleOrder, ProducerTemplate producerTemplate) {
        String partnerWeight = getPartnerWeight(patientId);
        if (saleOrder != null && partnerWeight != null) {
            log.debug("SaleOrderHandler: Update sale order with Patient weight {}", saleOrder.getOrderId());
            saleOrder.setOrderPartnerId(partnerId);
            saleOrder.setPartnerWeight(partnerWeight);
            sendSaleOrder(producerTemplate, "direct:odoo-update-sale-order-route", saleOrder);
        }
    }

    public String getPartnerWeight(String patientId) {
        Observation observation = observationHandler.getObservationBySubjectIDAndConceptID(patientId, weightConcept);
        if (observation == null) {
            return null;
        }
        return String.valueOf(observation.getValueQuantity().getValue()) + observation.getValueQuantity().getUnit();
    }

    public void setWeightConcept(String weightConcept) {
        this.weightConcept = weightConcept;
    }

    public void setOdooCustomerWeightField(String odooCustomerWeightField) {
        this.odooCustomerWeightField = odooCustomerWeightField;
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

    public void setSaleOrderLineHandler(SaleOrderLineHandler saleOrderLineHandler) {
        this.saleOrderLineHandler = saleOrderLineHandler;
    }

    public void setSaleOrderMapper(SaleOrderMapper saleOrderMapper) {
        this.saleOrderMapper = saleOrderMapper;
    }

    public void setProductHandler(ProductHandler productHandler) {
        this.productHandler = productHandler;
    }

    public void setObservationHandler(ObservationHandler observationHandler) {
        this.observationHandler = observationHandler;
    }

    public void setOdooUtils(OdooUtils odooUtils) {
        this.odooUtils = odooUtils;
    }

    public void setOrderDefaultAttributes(List<String> orderDefaultAttributes) {
        this.orderDefaultAttributes = orderDefaultAttributes;
    }
}
