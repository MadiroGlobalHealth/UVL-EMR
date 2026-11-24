CREATE TABLE `stockmgmt_stock_item` (
  `stock_item_id` int,
  `drug_id` int,
  `concept_id` int,
  `has_expiration` BOOLEAN,
  `purchase_price` DOUBLE,
  `dispensing_unit_id` int,
  `common_name` VARCHAR,
  `acronym` VARCHAR,
  `is_drug` BOOLEAN,
  `reorder_level` DOUBLE,
  `voided` BOOLEAN,
  `uuid` VARCHAR,
  `category_id` int,
  `expiry_notice` int,
  `level_of_use` VARCHAR,
  PRIMARY KEY (`stock_item_id`) NOT ENFORCED
)
