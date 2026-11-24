CREATE TABLE `stockmgmt_stock_batch` (
  `stock_batch_id` int,
  `stock_item_id` int,
  `batch_no` VARCHAR,
  `expiration` DATE,
  `voided` BOOLEAN,
  `uuid` VARCHAR,
  PRIMARY KEY (`stock_batch_id`) NOT ENFORCED
)
