CREATE TABLE `stockmgmt_stock_operation_item` (
  `stock_operation_item_id` int,
  `stock_operation_id` int,
  `stock_item_id` int,
  `stock_item_packaging_uom_id` int,
  `quantity` DOUBLE,
  `purchase_price` DOUBLE,
  `stock_batch_id` int,
  `quantity_received` DOUBLE,
  `quantity_requested` DOUBLE,
  `voided` BOOLEAN,
  `uuid` VARCHAR,
  PRIMARY KEY (`stock_operation_item_id`) NOT ENFORCED
)
