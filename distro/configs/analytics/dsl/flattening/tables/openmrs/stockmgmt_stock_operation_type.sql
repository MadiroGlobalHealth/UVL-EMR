CREATE TABLE `stockmgmt_stock_operation_type` (
  `stock_operation_type_id` int,
  `name` VARCHAR,
  `operation_type` VARCHAR,
  `acronym` VARCHAR,
  `voided` BOOLEAN,
  PRIMARY KEY (`stock_operation_type_id`) NOT ENFORCED
)
