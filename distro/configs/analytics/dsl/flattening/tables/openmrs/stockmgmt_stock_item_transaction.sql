CREATE TABLE `stockmgmt_stock_item_transaction` (
  `stock_item_transaction_id` int,
  `stock_operation_id` int,
  `stock_operation_item_id` int,
  `stock_item_id` int,
  `stock_item_packaging_uom_id` int,
  `quantity` DOUBLE,
  `stock_batch_id` int,
  `party_id` int,
  `patient_id` int,
  `order_id` int,
  `encounter_id` int,
  `date_created` TIMESTAMP,
  `uuid` VARCHAR,
  `unfulfillment_reason` VARCHAR,
  PRIMARY KEY (`stock_item_transaction_id`) NOT ENFORCED
)
