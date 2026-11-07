CREATE TABLE `encounter_provider` (
  `encounter_provider_id` int,
  `encounter_id` int,
  `provider_id` int,
  `encounter_role_id` int,
  `creator` int,
  `date_created` TIMESTAMP,
  `changed_by` int,
  `date_changed` TIMESTAMP,
  `voided` BOOLEAN,
  `date_voided` TIMESTAMP,
  `voided_by` int,
  `void_reason` VARCHAR,
  `uuid` VARCHAR,
  PRIMARY KEY (`encounter_provider_id`) NOT ENFORCED
)
