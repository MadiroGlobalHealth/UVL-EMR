package com.ozonehis.eip.odoo.openmrs.handlers.openmrs;

import ca.uhn.fhir.rest.client.api.IGenericClient;
import org.hl7.fhir.r4.model.Patient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class PatientHandler {
    private static final Logger log = LoggerFactory.getLogger(PatientHandler.class);

    private IGenericClient openmrsFhirClient;

    public PatientHandler(IGenericClient openmrsFhirClient) {
        this.openmrsFhirClient = openmrsFhirClient;
    }

    public Patient getPatientByPatientID(String patientId) {
        String normalizedPatientId = normalizePatientId(patientId);
        Patient patient = openmrsFhirClient.read().resource(Patient.class).withId(normalizedPatientId).execute();
        log.info(
            "PatientHandler: Patient getPatientByPatientID original={} normalized={} resolved={}",
            patientId,
            normalizedPatientId,
            patient.getId()
        );
        return patient;
    }

    public void setOpenmrsFhirClient(IGenericClient openmrsFhirClient) {
        this.openmrsFhirClient = openmrsFhirClient;
    }

    private String normalizePatientId(String patientId) {
        if (patientId == null || patientId.isBlank()) {
            return patientId;
        }

        String normalized = patientId.trim();
        int patientSegmentIndex = normalized.indexOf("/Patient/");
        if (patientSegmentIndex >= 0) {
            normalized = normalized.substring(patientSegmentIndex + "/Patient/".length());
        } else if (normalized.startsWith("Patient/")) {
            normalized = normalized.substring("Patient/".length());
        }

        int historySegmentIndex = normalized.indexOf("/_history/");
        if (historySegmentIndex >= 0) {
            normalized = normalized.substring(0, historySegmentIndex);
        }

        int pathSeparatorIndex = normalized.indexOf('/');
        if (pathSeparatorIndex >= 0) {
            normalized = normalized.substring(0, pathSeparatorIndex);
        }

        return normalized;
    }
}
