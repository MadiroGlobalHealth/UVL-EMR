INSERT INTO serialized_object (`serialized_object_id`,`name`,`description`,`type`,`subtype`,`serialization_class`,`serialized_data`,`date_created`,`creator`,`date_changed`,`changed_by`,`retired`,`date_retired`,`retired_by`,`retire_reason`,`uuid`) VALUES
	 (12,'under 5 years old','','org.openmrs.module.reporting.cohort.definition.CohortDefinition','org.openmrs.module.reporting.cohort.definition.AgeCohortDefinition','org.openmrs.module.reporting.serializer.ReportingSerializer','<org.openmrs.module.reporting.cohort.definition.AgeCohortDefinition id="1" uuid="7931b1bf-3fba-45f6-b895-60ff2de5515c" retired="false">
  <name>under 5 years old</name>
  <description></description>
  <creator id="2" uuid="8a1df571-b8c4-45fd-b5e3-015119c21a7a"/>
  <dateCreated id="3">2024-10-18 14:59:17 UTC</dateCreated>
  <changedBy reference="2"/>
  <dateChanged id="4">2024-10-18 15:30:04 UTC</dateChanged>
  <parameters id="5"/>
  <id>12</id>
  <minAge>0</minAge>
  <minAgeUnit>YEARS</minAgeUnit>
  <maxAge>4</maxAge>
  <maxAgeUnit>YEARS</maxAgeUnit>
  <unknownAgeIncluded>false</unknownAgeIncluded>
</org.openmrs.module.reporting.cohort.definition.AgeCohortDefinition>','2024-10-18 14:59:17',2,'2024-10-18 15:30:04',2,0,NULL,NULL,NULL,'7931b1bf-3fba-45f6-b895-60ff2de5515c'),
	 (13,'amount of under 5 years old','','org.openmrs.module.reporting.indicator.Indicator','org.openmrs.module.reporting.indicator.CohortIndicator','org.openmrs.module.reporting.serializer.ReportingSerializer','<org.openmrs.module.reporting.indicator.CohortIndicator id="1" uuid="ec6ef910-65ee-4deb-b707-85402dd0708e" retired="false">
  <name>amount of under 5 years old</name>
  <description></description>
  <creator id="2" uuid="8a1df571-b8c4-45fd-b5e3-015119c21a7a"/>
  <dateCreated id="3">2024-10-18 15:00:22 UTC</dateCreated>
  <changedBy reference="2"/>
  <dateChanged id="4">2024-10-21 15:11:18 UTC</dateChanged>
  <parameters id="5">
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="6">
      <name>startDate</name>
      <label>Start Date</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="7">
      <name>endDate</name>
      <label>End Date</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
  </parameters>
  <id>13</id>
  <type>COUNT</type>
  <cohortDefinition id="8">
    <parameterizable class="org.openmrs.module.reporting.cohort.definition.CompositionCohortDefinition" id="9" uuid="1ae29e13-abf9-4528-8007-ed6e8968e7a3"/>
    <parameterMappings id="10">
      <entry>
        <string>endDate</string>
        <string>${endDate}</string>
      </entry>
      <entry>
        <string>startDate</string>
        <string>${startDate}</string>
      </entry>
    </parameterMappings>
  </cohortDefinition>
</org.openmrs.module.reporting.indicator.CohortIndicator>','2024-10-18 15:00:22',2,'2024-10-21 15:11:18',2,0,NULL,NULL,NULL,'ec6ef910-65ee-4deb-b707-85402dd0708e'),
	 (14,'(Main query)Child under 5 years old seen between dates','','org.openmrs.module.reporting.cohort.definition.CohortDefinition','org.openmrs.module.reporting.cohort.definition.CompositionCohortDefinition','org.openmrs.module.reporting.serializer.ReportingSerializer','<org.openmrs.module.reporting.cohort.definition.CompositionCohortDefinition id="1" uuid="1ae29e13-abf9-4528-8007-ed6e8968e7a3" retired="false">
  <name>(Main query)Child under 5 years old seen between dates</name>
  <description></description>
  <creator id="2" uuid="8a1df571-b8c4-45fd-b5e3-015119c21a7a"/>
  <dateCreated id="3">2024-10-18 15:10:18 UTC</dateCreated>
  <changedBy reference="2"/>
  <dateChanged id="4">2024-10-21 21:28:25 UTC</dateChanged>
  <parameters id="5">
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="6">
      <name>startDate</name>
      <label>Start Date</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="7">
      <name>endDate</name>
      <label>End Date</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
  </parameters>
  <id>15</id>
  <compositionString>under-5-years-old AND seen</compositionString>
  <searches id="8">
    <entry>
      <string>under-5-years-old</string>
      <org.openmrs.module.reporting.evaluation.parameter.Mapped id="9">
        <parameterizable class="org.openmrs.module.reporting.cohort.definition.AgeCohortDefinition" id="10" uuid="7931b1bf-3fba-45f6-b895-60ff2de5515c"/>
        <parameterMappings id="11"/>
      </org.openmrs.module.reporting.evaluation.parameter.Mapped>
    </entry>
    <entry>
      <string>seen</string>
      <org.openmrs.module.reporting.evaluation.parameter.Mapped id="12">
        <parameterizable class="org.openmrs.module.reporting.cohort.definition.VisitCohortDefinition" id="13" uuid="dc5fdc24-8655-4d2a-a31d-d48c20b5bcc2"/>
        <parameterMappings id="14">
          <entry>
            <string>activeOnOrAfter</string>
            <string>${startDate}</string>
          </entry>
          <entry>
            <string>activeOnOrBefore</string>
            <string>${endDate}</string>
          </entry>
        </parameterMappings>
      </org.openmrs.module.reporting.evaluation.parameter.Mapped>
    </entry>
  </searches>
</org.openmrs.module.reporting.cohort.definition.CompositionCohortDefinition>','2024-10-18 15:10:18',2,'2024-10-21 21:28:25',2,0,NULL,NULL,NULL,'1ae29e13-abf9-4528-8007-ed6e8968e7a3'),
	 (15,'seen','','org.openmrs.module.reporting.cohort.definition.CohortDefinition','org.openmrs.module.reporting.cohort.definition.VisitCohortDefinition','org.openmrs.module.reporting.serializer.ReportingSerializer','<org.openmrs.module.reporting.cohort.definition.VisitCohortDefinition id="1" uuid="dc5fdc24-8655-4d2a-a31d-d48c20b5bcc2" retired="false">
  <name>seen</name>
  <description></description>
  <creator id="2" uuid="8a1df571-b8c4-45fd-b5e3-015119c21a7a"/>
  <dateCreated id="3">2024-10-18 15:27:55 UTC</dateCreated>
  <changedBy reference="2"/>
  <dateChanged id="4">2024-10-18 15:39:51 UTC</dateChanged>
  <parameters id="5">
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="6">
      <name>activeOnOrAfter</name>
      <label>onOrAfter</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="7">
      <name>activeOnOrBefore</name>
      <label>onOrBefore</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
  </parameters>
  <id>18</id>
  <returnInverse>false</returnInverse>
</org.openmrs.module.reporting.cohort.definition.VisitCohortDefinition>','2024-10-18 15:27:55',2,'2024-10-18 15:39:51',2,0,NULL,NULL,NULL,'dc5fdc24-8655-4d2a-a31d-d48c20b5bcc2'),
	 (16,'Report of under 5 years Data Set',NULL,'org.openmrs.module.reporting.dataset.definition.DataSetDefinition','org.openmrs.module.reporting.dataset.definition.CohortIndicatorDataSetDefinition','org.openmrs.module.reporting.serializer.ReportingSerializer','<org.openmrs.module.reporting.dataset.definition.CohortIndicatorDataSetDefinition id="1" uuid="3c4146c2-3891-42c6-940b-c1e39e98199d" retired="false">
  <name>Report of under 5 years Data Set</name>
  <creator id="2" uuid="8a1df571-b8c4-45fd-b5e3-015119c21a7a"/>
  <dateCreated id="3">2024-10-18 15:45:14 UTC</dateCreated>
  <parameters id="4">
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="5">
      <name>startDate</name>
      <label>Start date</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="6">
      <name>endDate</name>
      <label>End date</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="7">
      <name>location</name>
      <label>Location</label>
      <type>org.openmrs.Location</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
  </parameters>
  <dimensions id="8"/>
  <columns id="9"/>
</org.openmrs.module.reporting.dataset.definition.CohortIndicatorDataSetDefinition>','2024-10-18 15:45:14',2,NULL,2,0,NULL,NULL,NULL,'3c4146c2-3891-42c6-940b-c1e39e98199d'),
	 (17,'Report of child under 5 years old Data Set',NULL,'org.openmrs.module.reporting.dataset.definition.DataSetDefinition','org.openmrs.module.reporting.dataset.definition.CohortIndicatorDataSetDefinition','org.openmrs.module.reporting.serializer.ReportingSerializer','<org.openmrs.module.reporting.dataset.definition.CohortIndicatorDataSetDefinition id="1" uuid="191a310e-85d5-4cfb-86eb-bf8b93819407" retired="false">
  <name>Report of child under 5 years old Data Set</name>
  <creator id="2" uuid="8a1df571-b8c4-45fd-b5e3-015119c21a7a"/>
  <dateCreated id="3">2024-10-21 14:48:04 UTC</dateCreated>
  <parameters id="4">
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="5">
      <name>startDate</name>
      <label>Start date</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="6">
      <name>endDate</name>
      <label>End date</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="7">
      <name>location</name>
      <label>Location</label>
      <type>org.openmrs.Location</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
  </parameters>
  <dimensions id="8"/>
  <columns id="9"/>
</org.openmrs.module.reporting.dataset.definition.CohortIndicatorDataSetDefinition>','2024-10-21 14:48:04',2,NULL,2,0,NULL,NULL,NULL,'191a310e-85d5-4cfb-86eb-bf8b93819407'),
	 (18,'Child Report','Report of children under 5 years old','org.openmrs.module.reporting.report.definition.ReportDefinition','org.openmrs.module.reporting.report.definition.ReportDefinition','org.openmrs.module.reporting.serializer.ReportingSerializer','<org.openmrs.module.reporting.report.definition.ReportDefinition id="1" uuid="aa636aa4-fd96-415b-b569-f40cab389473" retired="false">
  <name>Child Report</name>
  <description>Report of children under 5 years old</description>
  <creator id="2" uuid="8a1df571-b8c4-45fd-b5e3-015119c21a7a"/>
  <dateCreated id="3">2024-10-21 15:25:21 UTC</dateCreated>
  <changedBy reference="2"/>
  <dateChanged id="4">2024-10-21 18:06:34 UTC</dateChanged>
  <parameters id="5">
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="6">
      <name>startDate</name>
      <label>Start Date</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="7">
      <name>endDate</name>
      <label>End Date</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
  </parameters>
  <id>35</id>
  <baseCohortDefinition id="8">
    <parameterizable class="org.openmrs.module.reporting.cohort.definition.CompositionCohortDefinition" id="9" uuid="1ae29e13-abf9-4528-8007-ed6e8968e7a3"/>
    <parameterMappings id="10">
      <entry>
        <string>endDate</string>
        <string>${endDate}</string>
      </entry>
      <entry>
        <string>startDate</string>
        <string>${startDate}</string>
      </entry>
    </parameterMappings>
  </baseCohortDefinition>
  <dataSetDefinitions class="linked-hash-map" id="11">
    <entry>
      <string>Small-info</string>
      <org.openmrs.module.reporting.evaluation.parameter.Mapped id="12">
        <parameterizable class="org.openmrs.module.reporting.dataset.definition.SimplePatientDataSetDefinition" id="13" uuid="4f7a4803-eff0-4ad9-b21c-f6349cbb2e49"/>
        <parameterMappings id="14"/>
      </org.openmrs.module.reporting.evaluation.parameter.Mapped>
    </entry>
  </dataSetDefinitions>
</org.openmrs.module.reporting.report.definition.ReportDefinition>','2024-10-21 15:25:21',2,'2024-10-21 18:06:34',2,0,NULL,NULL,NULL,'aa636aa4-fd96-415b-b569-f40cab389473'),
	 (19,'Small info','','org.openmrs.module.reporting.dataset.definition.DataSetDefinition','org.openmrs.module.reporting.dataset.definition.SimplePatientDataSetDefinition','org.openmrs.module.reporting.serializer.ReportingSerializer','<org.openmrs.module.reporting.dataset.definition.SimplePatientDataSetDefinition id="1" uuid="4f7a4803-eff0-4ad9-b21c-f6349cbb2e49" retired="false">
  <name>Small info</name>
  <description></description>
  <creator id="2" uuid="8a1df571-b8c4-45fd-b5e3-015119c21a7a"/>
  <dateCreated id="3">2024-10-21 17:59:18 UTC</dateCreated>
  <changedBy reference="2"/>
  <dateChanged id="4">2024-10-21 21:29:52 UTC</dateChanged>
  <parameters id="5"/>
  <id>51</id>
  <patientProperties id="6">
    <string>patientId</string>
    <string>birthdate</string>
    <string>age</string>
    <string>givenName</string>
    <string>familyName</string>
  </patientProperties>
</org.openmrs.module.reporting.dataset.definition.SimplePatientDataSetDefinition>','2024-10-21 17:59:18',2,'2024-10-21 21:29:52',2,0,NULL,NULL,NULL,'4f7a4803-eff0-4ad9-b21c-f6349cbb2e49'),
	 (20,'Amount of unique patients','','org.openmrs.module.reporting.report.definition.ReportDefinition','org.openmrs.module.reporting.report.definition.ReportDefinition','org.openmrs.module.reporting.serializer.ReportingSerializer','<org.openmrs.module.reporting.report.definition.ReportDefinition id="1" uuid="3cb6b3ab-9130-4e09-bef0-5ac4e3158f1a" retired="false">
  <name>Amount of unique patients</name>
  <description></description>
  <creator id="2" uuid="82f18b44-6814-11e8-923f-e9a88dcb533f"/>
  <dateCreated id="3">2024-11-02 17:45:57 UTC</dateCreated>
  <changedBy reference="2"/>
  <dateChanged id="4">2024-11-02 22:08:09 UTC</dateChanged>
  <parameters id="5">
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="6">
      <name>startDate</name>
      <label>Start Date</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="7">
      <name>endDate</name>
      <label>End Date</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
  </parameters>
  <id>20</id>
  <dataSetDefinitions class="linked-hash-map" id="8">
    <entry>
      <string>Get-amount-of-unique-patient</string>
      <org.openmrs.module.reporting.evaluation.parameter.Mapped id="9">
        <parameterizable class="org.openmrs.module.reporting.dataset.definition.SqlDataSetDefinition" id="10" uuid="135cc414-d172-4e9c-ab21-7175dc4d53ec"/>
        <parameterMappings id="11">
          <entry>
            <string>endDate</string>
            <string>${endDate}</string>
          </entry>
          <entry>
            <string>startDate</string>
            <string>${startDate}</string>
          </entry>
        </parameterMappings>
      </org.openmrs.module.reporting.evaluation.parameter.Mapped>
    </entry>
  </dataSetDefinitions>
</org.openmrs.module.reporting.report.definition.ReportDefinition>','2024-11-02 17:45:57',2,'2024-11-02 22:08:09',2,0,NULL,NULL,NULL,'3cb6b3ab-9130-4e09-bef0-5ac4e3158f1a'),
	 (21,'Get amount of unique patient','','org.openmrs.module.reporting.dataset.definition.DataSetDefinition','org.openmrs.module.reporting.dataset.definition.SqlDataSetDefinition','org.openmrs.module.reporting.serializer.ReportingSerializer','<org.openmrs.module.reporting.dataset.definition.SqlDataSetDefinition id="1" uuid="135cc414-d172-4e9c-ab21-7175dc4d53ec" retired="false">
  <name>Get amount of unique patient</name>
  <description></description>
  <creator id="2" uuid="82f18b44-6814-11e8-923f-e9a88dcb533f"/>
  <dateCreated id="3">2024-11-02 17:47:57 UTC</dateCreated>
  <changedBy reference="2"/>
  <dateChanged id="4">2024-11-02 22:13:03 UTC</dateChanged>
  <parameters id="5">
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="6">
      <name>startDate</name>
      <label>startDate</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="7">
      <name>endDate</name>
      <label>endDate</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
  </parameters>
  <id>21</id>
  <sqlQuery>SELECT COUNT(DISTINCT patient_id) as unique_patients&#xd;
FROM visit v&#xd;
WHERE v.date_started &gt;= :startDate AND v.date_started &lt;= :endDate</sqlQuery>
</org.openmrs.module.reporting.dataset.definition.SqlDataSetDefinition>','2024-11-02 17:47:57',2,'2024-11-02 22:13:03',2,0,NULL,NULL,NULL,'135cc414-d172-4e9c-ab21-7175dc4d53ec'),
	 (22,'Get amount of unique patients under 5','','org.openmrs.module.reporting.dataset.definition.DataSetDefinition','org.openmrs.module.reporting.dataset.definition.SqlDataSetDefinition','org.openmrs.module.reporting.serializer.ReportingSerializer','<org.openmrs.module.reporting.dataset.definition.SqlDataSetDefinition id="1" uuid="06164aeb-905e-498b-a741-18a6bc3f22d6" retired="false">
  <name>Get amount of unique patients under 5</name>
  <description></description>
  <creator id="2" uuid="82f18b44-6814-11e8-923f-e9a88dcb533f"/>
  <dateCreated id="3">2024-11-05 11:48:22 UTC</dateCreated>
  <changedBy id="4" uuid="de6f3485-9c4b-4542-80a8-b30a301c6ad8"/>
  <dateChanged id="5">2024-11-05 12:36:44 UTC</dateChanged>
  <parameters id="6">
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="7">
      <name>startDate</name>
      <label>startDate</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="8">
      <name>endDate</name>
      <label>endDate</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
  </parameters>
  <id>22</id>
  <sqlQuery>SELECT COUNT(DISTINCT p.patient_id) as unique_patients&#xd;
FROM visit v&#xd;
LEFT JOIN patient p ON p.patient_id = v.patient_id&#xd;
LEFT JOIN person p2 ON p.patient_id = p2.person_id &#xd;
WHERE v.date_started &gt;= :startDate AND v.date_started &lt;= :endDate&#xd;
	AND (DATEDIFF(v.date_started, p2.birthdate) / 365.2425) &lt; 5</sqlQuery>
</org.openmrs.module.reporting.dataset.definition.SqlDataSetDefinition>','2024-11-05 11:48:22',2,'2024-11-05 12:36:44',2,0,NULL,NULL,NULL,'06164aeb-905e-498b-a741-18a6bc3f22d6'),
	 (24,'Get amount of vistits under 5 yo patients','','org.openmrs.module.reporting.dataset.definition.DataSetDefinition','org.openmrs.module.reporting.dataset.definition.SqlDataSetDefinition','org.openmrs.module.reporting.serializer.ReportingSerializer','<org.openmrs.module.reporting.dataset.definition.SqlDataSetDefinition id="1" uuid="a93af50e-e822-4af7-9304-14b177b7a7de" retired="false">
  <name>Get amount of vistits under 5 yo patients</name>
  <description></description>
  <creator id="2" uuid="82f18b44-6814-11e8-923f-e9a88dcb533f"/>
  <dateCreated id="3">2024-11-05 11:52:13 UTC</dateCreated>
  <changedBy id="4" uuid="de6f3485-9c4b-4542-80a8-b30a301c6ad8"/>
  <dateChanged id="5">2024-11-05 12:38:22 UTC</dateChanged>
  <parameters id="6">
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="7">
      <name>startDate</name>
      <label>startDate</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="8">
      <name>endDate</name>
      <label>endDate</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
  </parameters>
  <id>24</id>
  <sqlQuery>SELECT COUNT(p.patient_id) as number_of_visits&#xd;
FROM visit v&#xd;
LEFT JOIN patient p ON p.patient_id = v.patient_id&#xd;
LEFT JOIN person p2 ON p.patient_id = p2.person_id &#xd;
WHERE v.date_started &gt;= :startDate AND v.date_started &lt;= :endDate&#xd;
	AND (DATEDIFF(v.date_started, p2.birthdate) / 365.2425) &lt; 5</sqlQuery>
</org.openmrs.module.reporting.dataset.definition.SqlDataSetDefinition>','2024-11-05 11:52:13',2,'2024-11-05 12:38:22',2,0,NULL,NULL,NULL,'a93af50e-e822-4af7-9304-14b177b7a7de'),
	 (26,'List of lab tests','','org.openmrs.module.reporting.dataset.definition.DataSetDefinition','org.openmrs.module.reporting.dataset.definition.SqlDataSetDefinition','org.openmrs.module.reporting.serializer.ReportingSerializer','<org.openmrs.module.reporting.dataset.definition.SqlDataSetDefinition id="1" uuid="2650fe2d-df08-4738-b63b-0c732f116ab6" retired="false">
  <name>List of lab tests</name>
  <description></description>
  <creator id="2" uuid="de6f3485-9c4b-4542-80a8-b30a301c6ad8"/>
  <dateCreated id="3">2024-11-05 12:04:12 UTC</dateCreated>
  <changedBy reference="2"/>
  <dateChanged id="4">2024-11-07 15:47:48 UTC</dateChanged>
  <parameters id="5">
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="6">
      <name>startDate</name>
      <label>startDate</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="7">
      <name>endDate</name>
      <label>endDate</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="8">
      <name>language</name>
      <label>language</label>
      <type>java.lang.String</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
  </parameters>
  <id>26</id>
  <sqlQuery>SELECT cn.name, COUNT(DISTINCT o.patient_id)&#xd;
FROM orders o&#xd;
LEFT JOIN concept c ON c.concept_id = o.concept_id  &#xd;
LEFT JOIN concept_name cn ON cn.concept_id = o.concept_id&#xd;
WHERE o.date_activated &gt;= :startDate &#xd;
    AND o.date_activated &lt;= :endDate&#xd;
    AND c.class_id = 1&#xd;
    AND (cn.locale = :language OR NOT EXISTS (&#xd;
        SELECT 1 FROM concept_name cn2 &#xd;
        WHERE cn2.concept_id = cn.concept_id AND cn2.locale = :language&#xd;
    ))&#xd;
GROUP BY cn.concept_id</sqlQuery>
</org.openmrs.module.reporting.dataset.definition.SqlDataSetDefinition>','2024-11-05 12:04:12',2,'2024-11-07 15:47:48',2,0,NULL,NULL,NULL,'2650fe2d-df08-4738-b63b-0c732f116ab6'),
	 (27,'List of lab tests for under 5 yo','','org.openmrs.module.reporting.dataset.definition.DataSetDefinition','org.openmrs.module.reporting.dataset.definition.SqlDataSetDefinition','org.openmrs.module.reporting.serializer.ReportingSerializer','<org.openmrs.module.reporting.dataset.definition.SqlDataSetDefinition id="1" uuid="30aa32db-dde1-4b2f-bce5-db835b23e736" retired="false">
  <name>List of lab tests for under 5 yo</name>
  <description></description>
  <creator id="2" uuid="de6f3485-9c4b-4542-80a8-b30a301c6ad8"/>
  <dateCreated id="3">2024-11-05 12:04:39 UTC</dateCreated>
  <changedBy reference="2"/>
  <dateChanged id="4">2024-11-07 15:46:58 UTC</dateChanged>
  <parameters id="5">
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="6">
      <name>startDate</name>
      <label>startDate</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="7">
      <name>endDate</name>
      <label>endDate</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="8">
      <name>language</name>
      <label>language</label>
      <type>java.lang.String</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
  </parameters>
  <id>27</id>
  <sqlQuery>SELECT cn.name, COUNT(DISTINCT o.patient_id)&#xd;
FROM orders o&#xd;
LEFT JOIN concept c ON c.concept_id = o.concept_id  &#xd;
LEFT JOIN concept_name cn ON cn.concept_id = o.concept_id&#xd;
LEFT JOIN person p ON p.person_id = o.patient_id&#xd;
WHERE o.date_activated &gt;= :startDate &#xd;
    AND o.date_activated &lt;= :endDate&#xd;
    AND (DATEDIFF(o.date_activated, p.birthdate) / 365.2425) &lt; 5&#xd;
    AND c.class_id = 1&#xd;
    AND (cn.locale = :language OR NOT EXISTS (&#xd;
        SELECT 1 FROM concept_name cn2 &#xd;
        WHERE cn2.concept_id = cn.concept_id AND cn2.locale = :language&#xd;
    ))&#xd;
GROUP BY cn.concept_id &#xd;
</sqlQuery>
</org.openmrs.module.reporting.dataset.definition.SqlDataSetDefinition>','2024-11-05 12:04:39',2,'2024-11-07 15:46:58',2,0,NULL,NULL,NULL,'30aa32db-dde1-4b2f-bce5-db835b23e736'),
	 (28,'List of drugs','','org.openmrs.module.reporting.dataset.definition.DataSetDefinition','org.openmrs.module.reporting.dataset.definition.SqlDataSetDefinition','org.openmrs.module.reporting.serializer.ReportingSerializer','<org.openmrs.module.reporting.dataset.definition.SqlDataSetDefinition id="1" uuid="d56ad9f5-43b1-4960-aab5-5d5b3b9bb482" retired="false">
  <name>List of drugs</name>
  <description></description>
  <creator id="2" uuid="de6f3485-9c4b-4542-80a8-b30a301c6ad8"/>
  <dateCreated id="3">2024-11-05 12:05:09 UTC</dateCreated>
  <changedBy reference="2"/>
  <dateChanged id="4">2024-11-07 15:43:01 UTC</dateChanged>
  <parameters id="5">
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="6">
      <name>startDate</name>
      <label>startDate</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="7">
      <name>endDate</name>
      <label>endDate</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
  </parameters>
  <id>28</id>
  <sqlQuery>SELECT &#xd;
    d.name,&#xd;
    COUNT(do.order_id) AS num_drugs&#xd;
FROM drug_order do&#xd;
LEFT JOIN drug d ON d.drug_id = do.drug_inventory_id &#xd;
LEFT JOIN orders o ON o.order_id = do.order_id &#xd;
WHERE o.date_activated &gt;= :startDate &#xd;
    AND o.date_activated &lt;= :endDate&#xd;
GROUP BY d.name </sqlQuery>
</org.openmrs.module.reporting.dataset.definition.SqlDataSetDefinition>','2024-11-05 12:05:09',2,'2024-11-07 15:43:01',2,0,NULL,NULL,NULL,'d56ad9f5-43b1-4960-aab5-5d5b3b9bb482'),
	 (29,'List of drugs for under 5yo','','org.openmrs.module.reporting.dataset.definition.DataSetDefinition','org.openmrs.module.reporting.dataset.definition.SqlDataSetDefinition','org.openmrs.module.reporting.serializer.ReportingSerializer','<org.openmrs.module.reporting.dataset.definition.SqlDataSetDefinition id="1" uuid="d5c03bc7-9617-462a-940d-c6073d6bbf98" retired="false">
  <name>List of drugs for under 5yo</name>
  <description></description>
  <creator id="2" uuid="de6f3485-9c4b-4542-80a8-b30a301c6ad8"/>
  <dateCreated id="3">2024-11-05 12:05:36 UTC</dateCreated>
  <changedBy reference="2"/>
  <dateChanged id="4">2024-11-07 14:31:50 UTC</dateChanged>
  <parameters id="5">
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="6">
      <name>startDate</name>
      <label>startDate</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="7">
      <name>endDate</name>
      <label>endDate</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
  </parameters>
  <id>29</id>
  <sqlQuery>SELECT &#xd;
    d.name,&#xd;
    COUNT(do.order_id) AS num_drugs&#xd;
FROM drug_order do&#xd;
LEFT JOIN drug d ON d.drug_id = do.drug_inventory_id &#xd;
LEFT JOIN orders o ON o.order_id = do.order_id&#xd;
LEFT JOIN person p ON p.person_id = o.patient_id &#xd;
WHERE o.date_activated &gt;= :startDate &#xd;
    AND o.date_activated &lt;= :endDate&#xd;
    AND (DATEDIFF(o.date_activated , p.birthdate) / 365.2425) &lt; 5&#xd;
GROUP BY d.name;</sqlQuery>
</org.openmrs.module.reporting.dataset.definition.SqlDataSetDefinition>','2024-11-05 12:05:36',2,'2024-11-07 14:31:50',2,0,NULL,NULL,NULL,'d5c03bc7-9617-462a-940d-c6073d6bbf98'),
	 (30,'Total income','','org.openmrs.module.reporting.dataset.definition.DataSetDefinition','org.openmrs.module.reporting.dataset.definition.SqlDataSetDefinition','org.openmrs.module.reporting.serializer.ReportingSerializer','<org.openmrs.module.reporting.dataset.definition.SqlDataSetDefinition id="1" uuid="b4f34fa7-9b58-4596-9d59-ed278858fd48" retired="false">
  <name>Total income</name>
  <description></description>
  <creator id="2" uuid="de6f3485-9c4b-4542-80a8-b30a301c6ad8"/>
  <dateCreated id="3">2024-11-05 12:05:59 UTC</dateCreated>
  <changedBy reference="2"/>
  <dateChanged id="4">2024-11-05 21:08:37 UTC</dateChanged>
  <parameters id="5">
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="6">
      <name>startDate</name>
      <label>startDate</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="7">
      <name>endDate</name>
      <label>endDate</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
  </parameters>
  <id>30</id>
  <sqlQuery>SELECT SUM(cbli.price * cbli.quantity) as income, cbli.payment_status &#xd;
FROM cashier_bill_line_item cbli&#xd;
LEFT JOIN cashier_bill cb ON cb.bill_id = cbli.bill_id &#xd;
WHERE cbli.date_created &gt;= :startDate &#xd;
    AND cbli.date_created &lt;= :endDate&#xd;
GROUP BY cbli.payment_status</sqlQuery>
</org.openmrs.module.reporting.dataset.definition.SqlDataSetDefinition>','2024-11-05 12:05:59',2,'2024-11-05 21:08:37',2,0,NULL,NULL,NULL,'b4f34fa7-9b58-4596-9d59-ed278858fd48'),
	 (31,'Total income under 5 yo','','org.openmrs.module.reporting.dataset.definition.DataSetDefinition','org.openmrs.module.reporting.dataset.definition.SqlDataSetDefinition','org.openmrs.module.reporting.serializer.ReportingSerializer','<org.openmrs.module.reporting.dataset.definition.SqlDataSetDefinition id="1" uuid="b3c65762-1f2c-4c51-a2b8-041c42a20b50" retired="false">
  <name>Total income under 5 yo</name>
  <description></description>
  <creator id="2" uuid="de6f3485-9c4b-4542-80a8-b30a301c6ad8"/>
  <dateCreated id="3">2024-11-05 12:06:33 UTC</dateCreated>
  <changedBy reference="2"/>
  <dateChanged id="4">2024-11-05 21:09:47 UTC</dateChanged>
  <parameters id="5">
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="6">
      <name>startDate</name>
      <label>startDate</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="7">
      <name>endDate</name>
      <label>endDate</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
  </parameters>
  <id>31</id>
  <sqlQuery>SELECT SUM(cbli.price * cbli.quantity) as income, cbli.payment_status &#xd;
FROM cashier_bill_line_item cbli&#xd;
LEFT JOIN cashier_bill cb ON cb.bill_id = cbli.bill_id &#xd;
LEFT JOIN person p ON cb.patient_id = p.person_id &#xd;
WHERE cbli.date_created &gt;= :startDate &#xd;
    AND cbli.date_created &lt;= :endDate&#xd;
    AND (DATEDIFF(cbli.date_created , p.birthdate) / 365.2425) &lt; 5&#xd;
GROUP BY cbli.payment_status</sqlQuery>
</org.openmrs.module.reporting.dataset.definition.SqlDataSetDefinition>','2024-11-05 12:06:33',2,'2024-11-05 21:09:47',2,0,NULL,NULL,NULL,'b3c65762-1f2c-4c51-a2b8-041c42a20b50'),
	 (32,'Amount unique patients unde 5 years old','','org.openmrs.module.reporting.report.definition.ReportDefinition','org.openmrs.module.reporting.report.definition.ReportDefinition','org.openmrs.module.reporting.serializer.ReportingSerializer','<org.openmrs.module.reporting.report.definition.ReportDefinition id="1" uuid="e51e02ab-1d26-4788-868e-d0f4cca2430e" retired="false">
  <name>Amount unique patients unde 5 years old</name>
  <description></description>
  <creator id="2" uuid="de6f3485-9c4b-4542-80a8-b30a301c6ad8"/>
  <dateCreated id="3">2024-11-05 21:14:24 UTC</dateCreated>
  <changedBy reference="2"/>
  <dateChanged id="4">2024-11-05 21:15:10 UTC</dateChanged>
  <parameters id="5">
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="6">
      <name>startDate</name>
      <label>Start Date</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="7">
      <name>endDate</name>
      <label>End Date</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
  </parameters>
  <id>32</id>
  <dataSetDefinitions class="linked-hash-map" id="8">
    <entry>
      <string>Get-amount-of-unique-patients-under-5</string>
      <org.openmrs.module.reporting.evaluation.parameter.Mapped id="9">
        <parameterizable class="org.openmrs.module.reporting.dataset.definition.SqlDataSetDefinition" id="10" uuid="06164aeb-905e-498b-a741-18a6bc3f22d6"/>
        <parameterMappings id="11">
          <entry>
            <string>endDate</string>
            <string>${endDate}</string>
          </entry>
          <entry>
            <string>startDate</string>
            <string>${startDate}</string>
          </entry>
        </parameterMappings>
      </org.openmrs.module.reporting.evaluation.parameter.Mapped>
    </entry>
  </dataSetDefinitions>
</org.openmrs.module.reporting.report.definition.ReportDefinition>','2024-11-05 21:14:24',2,'2024-11-05 21:15:10',2,0,NULL,NULL,NULL,'e51e02ab-1d26-4788-868e-d0f4cca2430e'),
	 (33,'Amount of visits under 5 years old','','org.openmrs.module.reporting.report.definition.ReportDefinition','org.openmrs.module.reporting.report.definition.ReportDefinition','org.openmrs.module.reporting.serializer.ReportingSerializer','<org.openmrs.module.reporting.report.definition.ReportDefinition id="1" uuid="0fc145e4-34c8-475b-960c-ad2876e451ae" retired="false">
  <name>Amount of visits under 5 years old</name>
  <description></description>
  <creator id="2" uuid="de6f3485-9c4b-4542-80a8-b30a301c6ad8"/>
  <dateCreated id="3">2024-11-05 21:16:12 UTC</dateCreated>
  <changedBy reference="2"/>
  <dateChanged id="4">2024-11-05 21:17:03 UTC</dateChanged>
  <parameters id="5">
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="6">
      <name>startDate</name>
      <label>Start Date</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="7">
      <name>endDate</name>
      <label>End Date</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
  </parameters>
  <id>33</id>
  <dataSetDefinitions class="linked-hash-map" id="8">
    <entry>
      <string>Get-amount-of-vistits-under-5-yo-patients</string>
      <org.openmrs.module.reporting.evaluation.parameter.Mapped id="9">
        <parameterizable class="org.openmrs.module.reporting.dataset.definition.SqlDataSetDefinition" id="10" uuid="a93af50e-e822-4af7-9304-14b177b7a7de"/>
        <parameterMappings id="11">
          <entry>
            <string>endDate</string>
            <string>${endDate}</string>
          </entry>
          <entry>
            <string>startDate</string>
            <string>${startDate}</string>
          </entry>
        </parameterMappings>
      </org.openmrs.module.reporting.evaluation.parameter.Mapped>
    </entry>
  </dataSetDefinitions>
</org.openmrs.module.reporting.report.definition.ReportDefinition>','2024-11-05 21:16:12',2,'2024-11-05 21:17:03',2,0,NULL,NULL,NULL,'0fc145e4-34c8-475b-960c-ad2876e451ae'),
	 (34,'List of lab test','','org.openmrs.module.reporting.report.definition.ReportDefinition','org.openmrs.module.reporting.report.definition.ReportDefinition','org.openmrs.module.reporting.serializer.ReportingSerializer','<org.openmrs.module.reporting.report.definition.ReportDefinition id="1" uuid="df98f6d0-b2d7-438f-bea5-763f2a1db79d" retired="false">
  <name>List of lab test</name>
  <description></description>
  <creator id="2" uuid="de6f3485-9c4b-4542-80a8-b30a301c6ad8"/>
  <dateCreated id="3">2024-11-05 21:17:50 UTC</dateCreated>
  <changedBy reference="2"/>
  <dateChanged id="4">2024-11-07 16:01:40 UTC</dateChanged>
  <parameters id="5">
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="6">
      <name>startDate</name>
      <label>Start Date</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="7">
      <name>endDate</name>
      <label>End Date</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="8">
      <name>preferred language</name>
      <label>language</label>
      <type>java.lang.String</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
  </parameters>
  <id>34</id>
  <dataSetDefinitions class="linked-hash-map" id="9">
    <entry>
      <string>List-of-lab-tests</string>
      <org.openmrs.module.reporting.evaluation.parameter.Mapped id="10">
        <parameterizable class="org.openmrs.module.reporting.dataset.definition.SqlDataSetDefinition" id="11" uuid="2650fe2d-df08-4738-b63b-0c732f116ab6"/>
        <parameterMappings id="12">
          <entry>
            <string>endDate</string>
            <string>${endDate}</string>
          </entry>
          <entry>
            <string>language</string>
            <string>${preferred language}</string>
          </entry>
          <entry>
            <string>startDate</string>
            <string>${startDate}</string>
          </entry>
        </parameterMappings>
      </org.openmrs.module.reporting.evaluation.parameter.Mapped>
    </entry>
  </dataSetDefinitions>
</org.openmrs.module.reporting.report.definition.ReportDefinition>','2024-11-05 21:17:50',2,'2024-11-07 16:01:40',2,0,NULL,NULL,NULL,'df98f6d0-b2d7-438f-bea5-763f2a1db79d'),
	 (36,'List of drugs','','org.openmrs.module.reporting.report.definition.ReportDefinition','org.openmrs.module.reporting.report.definition.ReportDefinition','org.openmrs.module.reporting.serializer.ReportingSerializer','<org.openmrs.module.reporting.report.definition.ReportDefinition id="1" uuid="13b59ac6-0b70-4ee5-bc4c-30dd99ae087f" retired="false">
  <name>List of drugs</name>
  <description></description>
  <creator id="2" uuid="de6f3485-9c4b-4542-80a8-b30a301c6ad8"/>
  <dateCreated id="3">2024-11-05 21:22:01 UTC</dateCreated>
  <changedBy reference="2"/>
  <dateChanged id="4">2024-11-05 21:22:33 UTC</dateChanged>
  <parameters id="5">
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="6">
      <name>startDate</name>
      <label>Start Date</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="7">
      <name>endDate</name>
      <label>End Date</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
  </parameters>
  <id>36</id>
  <dataSetDefinitions class="linked-hash-map" id="8">
    <entry>
      <string>List-of-drugs</string>
      <org.openmrs.module.reporting.evaluation.parameter.Mapped id="9">
        <parameterizable class="org.openmrs.module.reporting.dataset.definition.SqlDataSetDefinition" id="10" uuid="d56ad9f5-43b1-4960-aab5-5d5b3b9bb482"/>
        <parameterMappings id="11">
          <entry>
            <string>endDate</string>
            <string>${endDate}</string>
          </entry>
          <entry>
            <string>startDate</string>
            <string>${startDate}</string>
          </entry>
        </parameterMappings>
      </org.openmrs.module.reporting.evaluation.parameter.Mapped>
    </entry>
  </dataSetDefinitions>
</org.openmrs.module.reporting.report.definition.ReportDefinition>','2024-11-05 21:22:01',2,'2024-11-05 21:22:33',2,0,NULL,NULL,NULL,'13b59ac6-0b70-4ee5-bc4c-30dd99ae087f'),
	 (37,'List of drugs for under 5 years old','','org.openmrs.module.reporting.report.definition.ReportDefinition','org.openmrs.module.reporting.report.definition.ReportDefinition','org.openmrs.module.reporting.serializer.ReportingSerializer','<org.openmrs.module.reporting.report.definition.ReportDefinition id="1" uuid="91924472-60c3-4d7d-aad1-cc6d40c5a2a6" retired="false">
  <name>List of drugs for under 5 years old</name>
  <description></description>
  <creator id="2" uuid="de6f3485-9c4b-4542-80a8-b30a301c6ad8"/>
  <dateCreated id="3">2024-11-05 21:23:57 UTC</dateCreated>
  <changedBy reference="2"/>
  <dateChanged id="4">2024-11-05 21:24:35 UTC</dateChanged>
  <parameters id="5">
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="6">
      <name>startDate</name>
      <label>Start Date</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="7">
      <name>endDate</name>
      <label>End Date</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
  </parameters>
  <id>37</id>
  <dataSetDefinitions class="linked-hash-map" id="8">
    <entry>
      <string>List-of-drugs-for-under-5yo</string>
      <org.openmrs.module.reporting.evaluation.parameter.Mapped id="9">
        <parameterizable class="org.openmrs.module.reporting.dataset.definition.SqlDataSetDefinition" id="10" uuid="d5c03bc7-9617-462a-940d-c6073d6bbf98"/>
        <parameterMappings id="11">
          <entry>
            <string>endDate</string>
            <string>${endDate}</string>
          </entry>
          <entry>
            <string>startDate</string>
            <string>${startDate}</string>
          </entry>
        </parameterMappings>
      </org.openmrs.module.reporting.evaluation.parameter.Mapped>
    </entry>
  </dataSetDefinitions>
</org.openmrs.module.reporting.report.definition.ReportDefinition>','2024-11-05 21:23:57',2,'2024-11-05 21:24:35',2,0,NULL,NULL,NULL,'91924472-60c3-4d7d-aad1-cc6d40c5a2a6'),
	 (38,'Total income','','org.openmrs.module.reporting.report.definition.ReportDefinition','org.openmrs.module.reporting.report.definition.ReportDefinition','org.openmrs.module.reporting.serializer.ReportingSerializer','<org.openmrs.module.reporting.report.definition.ReportDefinition id="1" uuid="7d761237-45a4-45d3-bfaf-867272c03470" retired="false">
  <name>Total income</name>
  <description></description>
  <creator id="2" uuid="de6f3485-9c4b-4542-80a8-b30a301c6ad8"/>
  <dateCreated id="3">2024-11-05 21:25:14 UTC</dateCreated>
  <changedBy reference="2"/>
  <dateChanged id="4">2024-11-05 21:25:36 UTC</dateChanged>
  <parameters id="5">
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="6">
      <name>startDate</name>
      <label>Start Date</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="7">
      <name>endDate</name>
      <label>End Date</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
  </parameters>
  <id>38</id>
  <dataSetDefinitions class="linked-hash-map" id="8">
    <entry>
      <string>Total-income</string>
      <org.openmrs.module.reporting.evaluation.parameter.Mapped id="9">
        <parameterizable class="org.openmrs.module.reporting.dataset.definition.SqlDataSetDefinition" id="10" uuid="b4f34fa7-9b58-4596-9d59-ed278858fd48"/>
        <parameterMappings id="11">
          <entry>
            <string>endDate</string>
            <string>${endDate}</string>
          </entry>
          <entry>
            <string>startDate</string>
            <string>${startDate}</string>
          </entry>
        </parameterMappings>
      </org.openmrs.module.reporting.evaluation.parameter.Mapped>
    </entry>
  </dataSetDefinitions>
</org.openmrs.module.reporting.report.definition.ReportDefinition>','2024-11-05 21:25:14',2,'2024-11-05 21:25:36',2,0,NULL,NULL,NULL,'7d761237-45a4-45d3-bfaf-867272c03470'),
	 (39,'Total income for under 5 years old','','org.openmrs.module.reporting.report.definition.ReportDefinition','org.openmrs.module.reporting.report.definition.ReportDefinition','org.openmrs.module.reporting.serializer.ReportingSerializer','<org.openmrs.module.reporting.report.definition.ReportDefinition id="1" uuid="2b5247e7-a8f7-43c9-b0b6-edf26ed91bd8" retired="false">
  <name>Total income for under 5 years old</name>
  <description></description>
  <creator id="2" uuid="de6f3485-9c4b-4542-80a8-b30a301c6ad8"/>
  <dateCreated id="3">2024-11-05 21:26:29 UTC</dateCreated>
  <changedBy reference="2"/>
  <dateChanged id="4">2024-11-05 21:26:56 UTC</dateChanged>
  <parameters id="5">
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="6">
      <name>startDate</name>
      <label>Start Date</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="7">
      <name>endDate</name>
      <label>End Date</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
  </parameters>
  <id>39</id>
  <dataSetDefinitions class="linked-hash-map" id="8">
    <entry>
      <string>Total-income-under-5-yo</string>
      <org.openmrs.module.reporting.evaluation.parameter.Mapped id="9">
        <parameterizable class="org.openmrs.module.reporting.dataset.definition.SqlDataSetDefinition" id="10" uuid="b3c65762-1f2c-4c51-a2b8-041c42a20b50"/>
        <parameterMappings id="11">
          <entry>
            <string>endDate</string>
            <string>${endDate}</string>
          </entry>
          <entry>
            <string>startDate</string>
            <string>${startDate}</string>
          </entry>
        </parameterMappings>
      </org.openmrs.module.reporting.evaluation.parameter.Mapped>
    </entry>
  </dataSetDefinitions>
</org.openmrs.module.reporting.report.definition.ReportDefinition>','2024-11-05 21:26:29',2,'2024-11-05 21:26:56',2,0,NULL,NULL,NULL,'2b5247e7-a8f7-43c9-b0b6-edf26ed91bd8'),
	 (40,'Number of encounter','','org.openmrs.module.reporting.dataset.definition.DataSetDefinition','org.openmrs.module.reporting.dataset.definition.SqlDataSetDefinition','org.openmrs.module.reporting.serializer.ReportingSerializer','<org.openmrs.module.reporting.dataset.definition.SqlDataSetDefinition id="1" uuid="5f83e39c-4a23-4e81-a1ea-81aaedbd1180" retired="false">
  <name>Number of encounter</name>
  <description></description>
  <creator id="2" uuid="82f18b44-6814-11e8-923f-e9a88dcb533f"/>
  <dateCreated id="3">2024-11-07 13:32:25 UTC</dateCreated>
  <changedBy reference="2"/>
  <dateChanged id="4">2024-11-07 13:37:45 UTC</dateChanged>
  <parameters id="5">
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="6">
      <name>startDate</name>
      <label>startDate</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="7">
      <name>endDate</name>
      <label>endDate</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
  </parameters>
  <id>40</id>
  <sqlQuery>SELECT et.name, COUNT(patient_id) as num_of_encounters&#xd;
FROM encounter e &#xd;
LEFT JOIN encounter_type et ON et.encounter_type_id = e.encounter_type&#xd;
WHERE e.encounter_datetime &gt;= :startDate &#xd;
    AND e.encounter_datetime &lt;= :endDate&#xd;
GROUP BY e.encounter_type</sqlQuery>
</org.openmrs.module.reporting.dataset.definition.SqlDataSetDefinition>','2024-11-07 13:32:25',2,'2024-11-07 13:37:45',2,0,NULL,NULL,NULL,'5f83e39c-4a23-4e81-a1ea-81aaedbd1180'),
	 (41,'Number of encounter under 5 yo','','org.openmrs.module.reporting.dataset.definition.DataSetDefinition','org.openmrs.module.reporting.dataset.definition.SqlDataSetDefinition','org.openmrs.module.reporting.serializer.ReportingSerializer','<org.openmrs.module.reporting.dataset.definition.SqlDataSetDefinition id="1" uuid="2294ff61-a11c-48e0-ae55-1be5d03cdb17" retired="false">
  <name>Number of encounter under 5 yo</name>
  <description></description>
  <creator id="2" uuid="82f18b44-6814-11e8-923f-e9a88dcb533f"/>
  <dateCreated id="3">2024-11-07 13:36:16 UTC</dateCreated>
  <changedBy reference="2"/>
  <dateChanged id="4">2024-11-07 13:37:19 UTC</dateChanged>
  <parameters id="5">
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="6">
      <name>startDate</name>
      <label>startDate</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="7">
      <name>endDate</name>
      <label>endDate</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
  </parameters>
  <id>41</id>
  <sqlQuery>SELECT et.name, COUNT(patient_id) as num_of_encounters&#xd;
FROM encounter e &#xd;
LEFT JOIN encounter_type et ON et.encounter_type_id = e.encounter_type&#xd;
LEFT JOIN person p ON p.person_id = e.patient_id &#xd;
WHERE e.encounter_datetime &gt;= :startDate &#xd;
    AND e.encounter_datetime &lt;= :endDate&#xd;
    AND (DATEDIFF(e.encounter_datetime , p.birthdate) / 365.2425) &lt; 5&#xd;
GROUP BY e.encounter_type</sqlQuery>
</org.openmrs.module.reporting.dataset.definition.SqlDataSetDefinition>','2024-11-07 13:36:16',2,'2024-11-07 13:37:19',2,0,NULL,NULL,NULL,'2294ff61-a11c-48e0-ae55-1be5d03cdb17'),
	 (42,'List of diagnose','','org.openmrs.module.reporting.dataset.definition.DataSetDefinition','org.openmrs.module.reporting.dataset.definition.SqlDataSetDefinition','org.openmrs.module.reporting.serializer.ReportingSerializer','<org.openmrs.module.reporting.dataset.definition.SqlDataSetDefinition id="1" uuid="688d240b-d589-42ca-96cf-09f752d10393" retired="false">
  <name>List of diagnose</name>
  <description></description>
  <creator id="2" uuid="82f18b44-6814-11e8-923f-e9a88dcb533f"/>
  <dateCreated id="3">2024-11-07 13:44:08 UTC</dateCreated>
  <changedBy id="4" uuid="de6f3485-9c4b-4542-80a8-b30a301c6ad8"/>
  <dateChanged id="5">2024-11-07 15:42:08 UTC</dateChanged>
  <parameters id="6">
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="7">
      <name>startDate</name>
      <label>startDate</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="8">
      <name>endDate</name>
      <label>endDate</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="9">
      <name>language</name>
      <label>language</label>
      <type>java.lang.String</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
  </parameters>
  <id>42</id>
  <sqlQuery>SELECT cn.name, COUNT(DISTINCT c.patient_id) as num_patients&#xd;
FROM conditions c &#xd;
LEFT JOIN concept_name cn ON cn.concept_id = c.condition_coded &#xd;
WHERE c.date_created &gt;= :startDate &#xd;
    AND c.date_created &lt;= :endDate&#xd;
    AND (cn.locale = :language OR NOT EXISTS (&#xd;
        SELECT 1 FROM concept_name cn2 &#xd;
        WHERE cn2.concept_id = cn.concept_id AND cn2.locale = :language&#xd;
    ))&#xd;
GROUP BY c.condition_coded </sqlQuery>
</org.openmrs.module.reporting.dataset.definition.SqlDataSetDefinition>','2024-11-07 13:44:08',2,'2024-11-07 15:42:08',2,0,NULL,NULL,NULL,'688d240b-d589-42ca-96cf-09f752d10393'),
	 (43,'List of diagnose under 5yo','','org.openmrs.module.reporting.dataset.definition.DataSetDefinition','org.openmrs.module.reporting.dataset.definition.SqlDataSetDefinition','org.openmrs.module.reporting.serializer.ReportingSerializer','<org.openmrs.module.reporting.dataset.definition.SqlDataSetDefinition id="1" uuid="d2ed8fd2-5ba6-4586-9096-aded46459bd2" retired="false">
  <name>List of diagnose under 5yo</name>
  <description></description>
  <creator id="2" uuid="82f18b44-6814-11e8-923f-e9a88dcb533f"/>
  <dateCreated id="3">2024-11-07 14:02:07 UTC</dateCreated>
  <changedBy id="4" uuid="de6f3485-9c4b-4542-80a8-b30a301c6ad8"/>
  <dateChanged id="5">2024-11-07 15:42:32 UTC</dateChanged>
  <parameters id="6">
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="7">
      <name>startDate</name>
      <label>startDate</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="8">
      <name>endDate</name>
      <label>endDate</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="9">
      <name>language</name>
      <label>language</label>
      <type>java.lang.String</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
  </parameters>
  <id>43</id>
  <sqlQuery>SELECT cn.name, COUNT(DISTINCT c.patient_id) as num_patients&#xd;
FROM conditions c &#xd;
LEFT JOIN concept_name cn ON cn.concept_id = c.condition_coded&#xd;
LEFT JOIN person p ON c.patient_id = p.person_id &#xd;
WHERE c.date_created &gt;= :startDate &#xd;
    AND c.date_created &lt;= :endDate&#xd;
    AND (DATEDIFF(c.date_created , p.birthdate) / 365.2425) &lt; 5&#xd;
    AND (cn.locale = :language OR NOT EXISTS (&#xd;
        SELECT 1 FROM concept_name cn2 &#xd;
        WHERE cn2.concept_id = cn.concept_id AND cn2.locale = :language&#xd;
    ))&#xd;
GROUP BY c.condition_coded </sqlQuery>
</org.openmrs.module.reporting.dataset.definition.SqlDataSetDefinition>','2024-11-07 14:02:07',2,'2024-11-07 15:42:32',2,0,NULL,NULL,NULL,'d2ed8fd2-5ba6-4586-9096-aded46459bd2'),
	 (44,'Number of encounters','','org.openmrs.module.reporting.report.definition.ReportDefinition','org.openmrs.module.reporting.report.definition.ReportDefinition','org.openmrs.module.reporting.serializer.ReportingSerializer','<org.openmrs.module.reporting.report.definition.ReportDefinition id="1" uuid="915c428c-071f-4779-8c27-eb9d1a839b82" retired="false">
  <name>Number of encounters</name>
  <description></description>
  <creator id="2" uuid="de6f3485-9c4b-4542-80a8-b30a301c6ad8"/>
  <dateCreated id="3">2024-11-07 15:07:18 UTC</dateCreated>
  <changedBy reference="2"/>
  <dateChanged id="4">2024-11-07 15:08:27 UTC</dateChanged>
  <parameters id="5">
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="6">
      <name>startDate</name>
      <label>Start Date</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="7">
      <name>endDate</name>
      <label>End Date</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
  </parameters>
  <id>44</id>
  <dataSetDefinitions class="linked-hash-map" id="8">
    <entry>
      <string>Number-of-encounter</string>
      <org.openmrs.module.reporting.evaluation.parameter.Mapped id="9">
        <parameterizable class="org.openmrs.module.reporting.dataset.definition.SqlDataSetDefinition" id="10" uuid="5f83e39c-4a23-4e81-a1ea-81aaedbd1180"/>
        <parameterMappings id="11">
          <entry>
            <string>endDate</string>
            <string>${endDate}</string>
          </entry>
          <entry>
            <string>startDate</string>
            <string>${startDate}</string>
          </entry>
        </parameterMappings>
      </org.openmrs.module.reporting.evaluation.parameter.Mapped>
    </entry>
  </dataSetDefinitions>
</org.openmrs.module.reporting.report.definition.ReportDefinition>','2024-11-07 15:07:18',2,'2024-11-07 15:08:27',2,0,NULL,NULL,NULL,'915c428c-071f-4779-8c27-eb9d1a839b82'),
	 (45,'Number of encounters under 5 years old','','org.openmrs.module.reporting.report.definition.ReportDefinition','org.openmrs.module.reporting.report.definition.ReportDefinition','org.openmrs.module.reporting.serializer.ReportingSerializer','<org.openmrs.module.reporting.report.definition.ReportDefinition id="1" uuid="bbf1dd49-1ad5-4102-a778-5da9bf2823d1" retired="false">
  <name>Number of encounters under 5 years old</name>
  <description></description>
  <creator id="2" uuid="de6f3485-9c4b-4542-80a8-b30a301c6ad8"/>
  <dateCreated id="3">2024-11-07 15:09:21 UTC</dateCreated>
  <changedBy reference="2"/>
  <dateChanged id="4">2024-11-07 15:10:14 UTC</dateChanged>
  <parameters id="5">
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="6">
      <name>startDate</name>
      <label>Start Date</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="7">
      <name>endDate</name>
      <label>End Date</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
  </parameters>
  <id>45</id>
  <dataSetDefinitions class="linked-hash-map" id="8">
    <entry>
      <string>Number-of-encounter-under-5-yo</string>
      <org.openmrs.module.reporting.evaluation.parameter.Mapped id="9">
        <parameterizable class="org.openmrs.module.reporting.dataset.definition.SqlDataSetDefinition" id="10" uuid="2294ff61-a11c-48e0-ae55-1be5d03cdb17"/>
        <parameterMappings id="11">
          <entry>
            <string>endDate</string>
            <date id="12">2024-11-30 00:00:00 UTC</date>
          </entry>
          <entry>
            <string>startDate</string>
            <date id="13">2024-11-01 00:00:00 UTC</date>
          </entry>
        </parameterMappings>
      </org.openmrs.module.reporting.evaluation.parameter.Mapped>
    </entry>
  </dataSetDefinitions>
</org.openmrs.module.reporting.report.definition.ReportDefinition>','2024-11-07 15:09:21',2,'2024-11-07 15:10:14',2,0,NULL,NULL,NULL,'bbf1dd49-1ad5-4102-a778-5da9bf2823d1'),
	 (46,'List of diagnose','','org.openmrs.module.reporting.report.definition.ReportDefinition','org.openmrs.module.reporting.report.definition.ReportDefinition','org.openmrs.module.reporting.serializer.ReportingSerializer','<org.openmrs.module.reporting.report.definition.ReportDefinition id="1" uuid="51b76b52-a8f9-448c-8d7f-1951557e2d50" retired="false">
  <name>List of diagnose</name>
  <description></description>
  <creator id="2" uuid="de6f3485-9c4b-4542-80a8-b30a301c6ad8"/>
  <dateCreated id="3">2024-11-07 15:11:00 UTC</dateCreated>
  <changedBy reference="2"/>
  <dateChanged id="4">2024-11-07 15:54:54 UTC</dateChanged>
  <parameters id="5">
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="6">
      <name>startDate</name>
      <label>Start Date</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="7">
      <name>endDate</name>
      <label>End Date</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="8">
      <name>preferred language</name>
      <label>language</label>
      <type>java.lang.String</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
  </parameters>
  <id>46</id>
  <dataSetDefinitions class="linked-hash-map" id="9">
    <entry>
      <string>List-of-lab-tests</string>
      <org.openmrs.module.reporting.evaluation.parameter.Mapped id="10">
        <parameterizable class="org.openmrs.module.reporting.dataset.definition.SqlDataSetDefinition" id="11" uuid="2650fe2d-df08-4738-b63b-0c732f116ab6"/>
        <parameterMappings id="12">
          <entry>
            <string>endDate</string>
            <string>${endDate}</string>
          </entry>
          <entry>
            <string>language</string>
            <string>${preferred language}</string>
          </entry>
          <entry>
            <string>startDate</string>
            <string>${startDate}</string>
          </entry>
        </parameterMappings>
      </org.openmrs.module.reporting.evaluation.parameter.Mapped>
    </entry>
  </dataSetDefinitions>
</org.openmrs.module.reporting.report.definition.ReportDefinition>','2024-11-07 15:11:00',2,'2024-11-07 15:54:54',2,0,NULL,NULL,NULL,'51b76b52-a8f9-448c-8d7f-1951557e2d50'),
	 (47,'List of diagnoses under 5 years old','','org.openmrs.module.reporting.report.definition.ReportDefinition','org.openmrs.module.reporting.report.definition.ReportDefinition','org.openmrs.module.reporting.serializer.ReportingSerializer','<org.openmrs.module.reporting.report.definition.ReportDefinition id="1" uuid="a44d59d0-2569-40dd-8bc1-4a5663c03bb8" retired="false">
  <name>List of diagnoses under 5 years old</name>
  <description></description>
  <creator id="2" uuid="de6f3485-9c4b-4542-80a8-b30a301c6ad8"/>
  <dateCreated id="3">2024-11-07 15:57:00 UTC</dateCreated>
  <changedBy reference="2"/>
  <dateChanged id="4">2024-11-07 15:58:08 UTC</dateChanged>
  <parameters id="5">
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="6">
      <name>startDate</name>
      <label>Start Date</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="7">
      <name>endDate</name>
      <label>End Date</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="8">
      <name>preferred language</name>
      <label>language</label>
      <type>java.lang.String</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
  </parameters>
  <id>47</id>
  <dataSetDefinitions class="linked-hash-map" id="9">
    <entry>
      <string>List-of-diagnose-under-5yo</string>
      <org.openmrs.module.reporting.evaluation.parameter.Mapped id="10">
        <parameterizable class="org.openmrs.module.reporting.dataset.definition.SqlDataSetDefinition" id="11" uuid="d2ed8fd2-5ba6-4586-9096-aded46459bd2"/>
        <parameterMappings id="12">
          <entry>
            <string>endDate</string>
            <string>${endDate}</string>
          </entry>
          <entry>
            <string>language</string>
            <string>${preferred language}</string>
          </entry>
          <entry>
            <string>startDate</string>
            <string>${startDate}</string>
          </entry>
        </parameterMappings>
      </org.openmrs.module.reporting.evaluation.parameter.Mapped>
    </entry>
  </dataSetDefinitions>
</org.openmrs.module.reporting.report.definition.ReportDefinition>','2024-11-07 15:57:00',2,'2024-11-07 15:58:08',2,0,NULL,NULL,NULL,'a44d59d0-2569-40dd-8bc1-4a5663c03bb8'),
	 (48,'List of lab tests under 5 years old','','org.openmrs.module.reporting.report.definition.ReportDefinition','org.openmrs.module.reporting.report.definition.ReportDefinition','org.openmrs.module.reporting.serializer.ReportingSerializer','<org.openmrs.module.reporting.report.definition.ReportDefinition id="1" uuid="6c3272f3-7d6b-4a09-90ca-0b47b48cb700" retired="false">
  <name>List of lab tests under 5 years old</name>
  <description></description>
  <creator id="2" uuid="de6f3485-9c4b-4542-80a8-b30a301c6ad8"/>
  <dateCreated id="3">2024-11-07 16:03:51 UTC</dateCreated>
  <changedBy reference="2"/>
  <dateChanged id="4">2024-11-07 16:04:57 UTC</dateChanged>
  <parameters id="5">
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="6">
      <name>startDate</name>
      <label>Start Date</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="7">
      <name>endDate</name>
      <label>End Date</label>
      <type>java.util.Date</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
    <org.openmrs.module.reporting.evaluation.parameter.Parameter id="8">
      <name>preferred language</name>
      <label>language</label>
      <type>java.lang.String</type>
      <required>true</required>
    </org.openmrs.module.reporting.evaluation.parameter.Parameter>
  </parameters>
  <id>48</id>
  <dataSetDefinitions class="linked-hash-map" id="9">
    <entry>
      <string>List-of-lab-tests-for-under-5-yo</string>
      <org.openmrs.module.reporting.evaluation.parameter.Mapped id="10">
        <parameterizable class="org.openmrs.module.reporting.dataset.definition.SqlDataSetDefinition" id="11" uuid="30aa32db-dde1-4b2f-bce5-db835b23e736"/>
        <parameterMappings id="12">
          <entry>
            <string>endDate</string>
            <string>${endDate}</string>
          </entry>
          <entry>
            <string>language</string>
            <string>${preferred language}</string>
          </entry>
          <entry>
            <string>startDate</string>
            <string>${startDate}</string>
          </entry>
        </parameterMappings>
      </org.openmrs.module.reporting.evaluation.parameter.Mapped>
    </entry>
  </dataSetDefinitions>
</org.openmrs.module.reporting.report.definition.ReportDefinition>','2024-11-07 16:03:51',2,'2024-11-07 16:04:57',2,0,NULL,NULL,NULL,'6c3272f3-7d6b-4a09-90ca-0b47b48cb700');
