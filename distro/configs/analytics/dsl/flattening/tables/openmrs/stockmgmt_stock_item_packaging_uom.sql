CREATE TABLE `stockmgmt_stock_item_packaging_uom` (
  `stock_item_packaging_uom_id` int,
  `stock_item_id` int,
  `packaging_uom_id` int,
  `factor` DOUBLE,
  `voided` BOOLEAN,
  PRIMARY KEY (`stock_item_packaging_uom_id`) NOT ENFORCED
)
