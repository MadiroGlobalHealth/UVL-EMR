INSERT INTO openmrs.reporting_report_request (`id`,`uuid,base_cohort_uuid,base_cohort_parameters`,`report_definition_uuid,report_definition_parameters`,`renderer_type`,`renderer_argument`,`requested_by,request_datetime`,`priority`,`status`,`evaluation_start_datetime`,`evaluation_complete_datetime`,`render_complete_datetime`,`description`,`schedule`,`process_automatically`,`minimum_days_to_preserve`) VALUES
	 (4,'8ae17def-b68e-44da-b063-ae5fcf1f5ccc',NULL,NULL,'aa636aa4-fd96-415b-b569-f40cab389473','<linked-hash-map id="1">
  <entry>
    <string>startDate</string>
    <string>${start_of_today-31d}</string>
  </entry>
  <entry>
    <string>endDate</string>
    <string>${end_of_today-1d}</string>
  </entry>
</linked-hash-map>','org.openmrs.module.reporting.web.renderers.DefaultWebRenderer',NULL,3,'2024-10-21 18:20:56','NORMAL','SCHEDULED',NULL,NULL,NULL,NULL,'0 0 12 1 * ?',0,NULL);
