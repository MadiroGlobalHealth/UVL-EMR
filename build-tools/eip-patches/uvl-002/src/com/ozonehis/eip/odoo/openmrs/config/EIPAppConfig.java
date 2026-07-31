package com.ozonehis.eip.odoo.openmrs.config;

import ca.uhn.fhir.rest.client.api.IGenericClient;
import com.ozonehis.eip.odoo.openmrs.ProductSynchronizer;
import com.ozonehis.eip.odoo.openmrs.client.OdooFhirClient;
import com.ozonehis.eip.odoo.openmrs.client.OpenmrsRestClient;
import com.ozonehis.eip.odoo.openmrs.handlers.openmrs.PatientHandler;
import org.openmrs.eip.app.config.AppConfig;
import org.openmrs.eip.fhir.spring.OpenmrsFhirAppConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.scheduling.annotation.EnableScheduling;

@Configuration
@Import({AppConfig.class, OpenmrsFhirAppConfig.class})
@EnableScheduling
public class EIPAppConfig {

    @Bean
    public ProductSynchronizer productCatalogSynchronizer(
        OdooFhirClient odooFhirClient,
        IGenericClient openmrsFhirClient,
        OpenmrsRestClient openmrsRestClient
    ) {
        return new ProductSynchronizer(odooFhirClient, openmrsFhirClient, openmrsRestClient);
    }

    @Bean
    public PatientHandler patientHandler(IGenericClient openmrsFhirClient) {
        return new PatientHandler(openmrsFhirClient);
    }
}
