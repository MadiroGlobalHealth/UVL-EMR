package com.ozonehis.eip.odoo.openmrs.processors;

import com.ozonehis.eip.odoo.openmrs.handlers.openmrs.PatientHandler;
import com.ozonehis.eip.odoo.openmrs.handlers.odoo.PartnerHandler;
import com.ozonehis.eip.odoo.openmrs.mapper.odoo.PartnerMapper;
import com.ozonehis.eip.odoo.openmrs.model.Partner;
import java.util.HashMap;
import java.util.List;
import org.apache.camel.CamelExecutionException;
import org.apache.camel.Exchange;
import org.apache.camel.Message;
import org.apache.camel.Processor;
import org.hl7.fhir.r4.model.Patient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class PatientProcessor implements Processor {
    @Autowired
    private PartnerMapper mapper;

    @Autowired
    private PartnerHandler partnerHandler;

    @Autowired
    private PatientHandler patientHandler;

    @Override
    public void process(Exchange exchange) {
        try {
            Message message = exchange.getMessage();
            Patient patient = message.getBody(Patient.class);
            if (patient != null && patient.hasIdElement()) {
                patient = this.patientHandler.getPatientByPatientID(patient.getIdElement().getValue());
            }

            Partner partner = this.mapper.toOdoo(patient);
            if (patient == null || partner == null) {
                return;
            }

            this.partnerHandler.applyExplicitPricelist(patient, partner);

            String eventType = message.getHeader("openmrs.fhir.event", String.class);
            Partner fetchedPartner = this.partnerHandler.getPartnerByID(partner.getPartnerRef());
            if (fetchedPartner != null) {
                partner.setPartnerId(fetchedPartner.getPartnerId());
                HashMap<String, Object> headers = new HashMap<>();
                headers.put("odoo.attribute.value", List.of(partner.getPartnerId()));
                if ("c".equals(eventType) || "u".equals(eventType)) {
                    headers.put("openmrs.fhir.event", "u");
                } else {
                    headers.put("openmrs.fhir.event", "d");
                }
                exchange.getMessage().setHeaders(headers);
            }
            exchange.getMessage().setBody(partner);
        } catch (Exception e) {
            throw new CamelExecutionException("Error processing Patient", exchange, e);
        }
    }

    public void setMapper(PartnerMapper mapper) {
        this.mapper = mapper;
    }

    public void setPartnerHandler(PartnerHandler partnerHandler) {
        this.partnerHandler = partnerHandler;
    }

    public void setPatientHandler(PatientHandler patientHandler) {
        this.patientHandler = patientHandler;
    }

    public PartnerMapper getMapper() {
        return this.mapper;
    }

    public PartnerHandler getPartnerHandler() {
        return this.partnerHandler;
    }

    public PatientHandler getPatientHandler() {
        return this.patientHandler;
    }
}
