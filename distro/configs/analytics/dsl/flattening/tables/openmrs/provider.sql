CREATE TABLE `provider` (
  `provider_id` int,
  `person_id` int,
  `name` VARCHAR,
  `identifier` VARCHAR,
  `creator` int,
  `date_created` TIMESTAMP,
  `changed_by` int,
  `date_changed` TIMESTAMP,
  `retired` BOOLEAN,
  `retired_by` int,
  `date_retired` TIMESTAMP,
  `retire_reason` VARCHAR,
  `uuid` VARCHAR,
  PRIMARY KEY (`provider_id`) NOT ENFORCED
)
