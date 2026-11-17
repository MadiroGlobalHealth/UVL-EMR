CREATE TABLE `bed_patient_assignment_map` (
  `bed_patient_assignment_map_id` int,
  `patient_id` int,
  `bed_id` int,
  `date_started` TIMESTAMP,
  `date_stopped` TIMESTAMP,
  `encounter_id` int,
  `uuid` VARCHAR,
  `creator` int,
  `date_created` TIMESTAMP,
  `changed_by` int,
  `date_changed` TIMESTAMP,
  `voided` BOOLEAN,
  `voided_by` int,
  `date_voided` TIMESTAMP,
  `void_reason` VARCHAR,
  PRIMARY KEY (`bed_patient_assignment_map_id`) NOT ENFORCED
)
