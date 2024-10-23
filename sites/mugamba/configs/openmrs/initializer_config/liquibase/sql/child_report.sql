INSERT INTO serialized_object (name,description,`type`,subtype,serialization_class,serialized_data,date_created,creator,date_changed,changed_by,retired,date_retired,retired_by,retire_reason,`uuid`) VALUES
	 ('under 5 years old','','org.openmrs.module.reporting.cohort.definition.CohortDefinition','org.openmrs.module.reporting.cohort.definition.AgeCohortDefinition','org.openmrs.module.reporting.serializer.ReportingSerializer','<org.openmrs.module.reporting.cohort.definition.AgeCohortDefinition id="1" uuid="7931b1bf-3fba-45f6-b895-60ff2de5515c" retired="false">
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
</org.openmrs.module.reporting.cohort.definition.AgeCohortDefinition>','2024-10-18 14:59:17',3,'2024-10-18 15:30:04',3,0,NULL,NULL,NULL,'7931b1bf-3fba-45f6-b895-60ff2de5515c'),
	 ('amount of under 5 years old','','org.openmrs.module.reporting.indicator.Indicator','org.openmrs.module.reporting.indicator.CohortIndicator','org.openmrs.module.reporting.serializer.ReportingSerializer','<org.openmrs.module.reporting.indicator.CohortIndicator id="1" uuid="ec6ef910-65ee-4deb-b707-85402dd0708e" retired="false">
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
</org.openmrs.module.reporting.indicator.CohortIndicator>','2024-10-18 15:00:22',3,'2024-10-21 15:11:18',3,0,NULL,NULL,NULL,'ec6ef910-65ee-4deb-b707-85402dd0708e'),
	 ('(Main query)Child under 5 years old seen between dates','','org.openmrs.module.reporting.cohort.definition.CohortDefinition','org.openmrs.module.reporting.cohort.definition.CompositionCohortDefinition','org.openmrs.module.reporting.serializer.ReportingSerializer','<org.openmrs.module.reporting.cohort.definition.CompositionCohortDefinition id="1" uuid="1ae29e13-abf9-4528-8007-ed6e8968e7a3" retired="false">
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
</org.openmrs.module.reporting.cohort.definition.CompositionCohortDefinition>','2024-10-18 15:10:18',3,'2024-10-21 21:28:25',3,0,NULL,NULL,NULL,'1ae29e13-abf9-4528-8007-ed6e8968e7a3'),
	 ('seen','','org.openmrs.module.reporting.cohort.definition.CohortDefinition','org.openmrs.module.reporting.cohort.definition.VisitCohortDefinition','org.openmrs.module.reporting.serializer.ReportingSerializer','<org.openmrs.module.reporting.cohort.definition.VisitCohortDefinition id="1" uuid="dc5fdc24-8655-4d2a-a31d-d48c20b5bcc2" retired="false">
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
</org.openmrs.module.reporting.cohort.definition.VisitCohortDefinition>','2024-10-18 15:27:55',3,'2024-10-18 15:39:51',3,0,NULL,NULL,NULL,'dc5fdc24-8655-4d2a-a31d-d48c20b5bcc2'),
	 ('Report of under 5 years Data Set',NULL,'org.openmrs.module.reporting.dataset.definition.DataSetDefinition','org.openmrs.module.reporting.dataset.definition.CohortIndicatorDataSetDefinition','org.openmrs.module.reporting.serializer.ReportingSerializer','<org.openmrs.module.reporting.dataset.definition.CohortIndicatorDataSetDefinition id="1" uuid="3c4146c2-3891-42c6-940b-c1e39e98199d" retired="false">
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
</org.openmrs.module.reporting.dataset.definition.CohortIndicatorDataSetDefinition>','2024-10-18 15:45:14',3,NULL,NULL,0,NULL,NULL,NULL,'3c4146c2-3891-42c6-940b-c1e39e98199d'),
	 ('Report of child under 5 years old Data Set',NULL,'org.openmrs.module.reporting.dataset.definition.DataSetDefinition','org.openmrs.module.reporting.dataset.definition.CohortIndicatorDataSetDefinition','org.openmrs.module.reporting.serializer.ReportingSerializer','<org.openmrs.module.reporting.dataset.definition.CohortIndicatorDataSetDefinition id="1" uuid="191a310e-85d5-4cfb-86eb-bf8b93819407" retired="false">
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
</org.openmrs.module.reporting.dataset.definition.CohortIndicatorDataSetDefinition>','2024-10-21 14:48:04',3,NULL,NULL,0,NULL,NULL,NULL,'191a310e-85d5-4cfb-86eb-bf8b93819407'),
	 ('Child Report','Report of children under 5 years old','org.openmrs.module.reporting.report.definition.ReportDefinition','org.openmrs.module.reporting.report.definition.ReportDefinition','org.openmrs.module.reporting.serializer.ReportingSerializer','<org.openmrs.module.reporting.report.definition.ReportDefinition id="1" uuid="aa636aa4-fd96-415b-b569-f40cab389473" retired="false">
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
</org.openmrs.module.reporting.report.definition.ReportDefinition>','2024-10-21 15:25:21',3,'2024-10-21 18:06:34',3,0,NULL,NULL,NULL,'aa636aa4-fd96-415b-b569-f40cab389473'),
	 ('Small info','','org.openmrs.module.reporting.dataset.definition.DataSetDefinition','org.openmrs.module.reporting.dataset.definition.SimplePatientDataSetDefinition','org.openmrs.module.reporting.serializer.ReportingSerializer','<org.openmrs.module.reporting.dataset.definition.SimplePatientDataSetDefinition id="1" uuid="4f7a4803-eff0-4ad9-b21c-f6349cbb2e49" retired="false">
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
</org.openmrs.module.reporting.dataset.definition.SimplePatientDataSetDefinition>','2024-10-21 17:59:18',3,'2024-10-21 21:29:52',3,0,NULL,NULL,NULL,'4f7a4803-eff0-4ad9-b21c-f6349cbb2e49');
