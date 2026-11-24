CREATE TABLE `stockmgmt_party` (
  `party_id` int,
  `location_id` int,
  `stock_source_id` int,
  `voided` BOOLEAN,
  PRIMARY KEY (`party_id`) NOT ENFORCED
)
