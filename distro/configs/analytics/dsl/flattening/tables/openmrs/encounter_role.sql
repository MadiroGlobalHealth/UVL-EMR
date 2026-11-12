CREATE TABLE `encounter_role` (
  `encounter_role_id` int,
  `name` VARCHAR,
  `description` VARCHAR,
  `creator` int,
  `date_created` TIMESTAMP,
  `changed_by` int,
  `date_changed` TIMESTAMP,
  `retired` BOOLEAN,
  `retired_by` int,
  `date_retired` TIMESTAMP,
  `retire_reason` VARCHAR,
  `uuid` VARCHAR,
  PRIMARY KEY (`encounter_role_id`) NOT ENFORCED
)
