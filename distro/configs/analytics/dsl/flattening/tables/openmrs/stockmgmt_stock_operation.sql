CREATE TABLE `stockmgmt_stock_operation` (
  `stock_operation_id` int,
  `operation_type_id` int,
  `status` VARCHAR,
  `operation_date` TIMESTAMP,
  `operation_number` VARCHAR,
  `reason_id` int,
  `at_location_id` int,
  `source_id` int,
  `destination_id` int,
  `completed_date` TIMESTAMP,
  `cancelled_date` TIMESTAMP,
  `date_created` TIMESTAMP,
  `voided` BOOLEAN,
  `uuid` VARCHAR,
  PRIMARY KEY (`stock_operation_id`) NOT ENFORCED
)
