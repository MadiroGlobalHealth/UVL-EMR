CREATE TABLE `stockmgmt_stock_source` (
  `stock_source_id` int,
  `name` VARCHAR,
  `acronym` VARCHAR,
  `voided` BOOLEAN,
  PRIMARY KEY (`stock_source_id`) NOT ENFORCED
)
