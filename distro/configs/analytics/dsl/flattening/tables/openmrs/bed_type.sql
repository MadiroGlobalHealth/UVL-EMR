CREATE TABLE `bed_type` (
  `bed_type_id` int,
  `name` VARCHAR,
  `display_name` VARCHAR,
  `description` VARCHAR,
  `uuid` VARCHAR,
  `creator` int,
  `date_created` TIMESTAMP,
  `changed_by` int,
  `date_changed` TIMESTAMP,
  `retired` BOOLEAN,
  `retire_reason` VARCHAR,
  `retired_by` int,
  `date_retired` TIMESTAMP,
  PRIMARY KEY (`bed_type_id`) NOT ENFORCED
)
