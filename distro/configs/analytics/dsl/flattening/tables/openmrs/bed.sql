CREATE TABLE `bed` (
  `bed_id` int,
  `bed_number` VARCHAR,
  `status` VARCHAR,
  `bed_type_id` int,
  `uuid` VARCHAR,
  `creator` int,
  `date_created` TIMESTAMP,
  `changed_by` int,
  `date_changed` TIMESTAMP,
  `voided` BOOLEAN,
  `voided_by` int,
  `date_voided` TIMESTAMP,
  `void_reason` VARCHAR,
  PRIMARY KEY (`bed_id`) NOT ENFORCED
)
