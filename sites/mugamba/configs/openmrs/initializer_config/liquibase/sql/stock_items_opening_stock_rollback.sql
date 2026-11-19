-- #457: rollback of sql/stock_items_opening_stock.sql (changeset add_stock_items_opening_stock-20261116).
--
-- Removes the stock items that file created, by their fixed uuids, with their packaging units.
-- An item the pharmacy has already used (any batch or transaction) is left in place.

CREATE TEMPORARY TABLE uvl_stock_item_rollback (stock_item_id INT NOT NULL);

INSERT INTO uvl_stock_item_rollback (stock_item_id)
SELECT si.stock_item_id
  FROM stockmgmt_stock_item si
 WHERE si.uuid IN (
    'b745ce94-b5be-520d-bb8e-ed8fc720b9c6',
    '69fbfdc3-685b-5987-bdd3-6ada8d02ef1d',
    'e5b76523-0ce7-5b5a-b352-7f96eb82c399',
    '0bf404d0-fcb8-5da6-80c4-2bc14645d5ef',
    '85497076-eabc-5277-aae8-c41da94f0bde',
    'b6d809f5-54eb-535c-a334-e42f6015554a',
    'dcedfeed-cef5-533b-bd50-c774148e764e')
   AND NOT EXISTS (SELECT 1 FROM stockmgmt_stock_batch b WHERE b.stock_item_id = si.stock_item_id)
   AND NOT EXISTS (SELECT 1 FROM stockmgmt_stock_item_transaction t WHERE t.stock_item_id = si.stock_item_id);

UPDATE stockmgmt_stock_item si
  JOIN uvl_stock_item_rollback r ON r.stock_item_id = si.stock_item_id
   SET si.dispensing_unit_packaging_uom_id = NULL, si.default_stock_operations_uom_id = NULL;

DELETE p FROM stockmgmt_stock_item_packaging_uom p
  JOIN uvl_stock_item_rollback r ON r.stock_item_id = p.stock_item_id;

DELETE si FROM stockmgmt_stock_item si
  JOIN uvl_stock_item_rollback r ON r.stock_item_id = si.stock_item_id;

DROP TEMPORARY TABLE uvl_stock_item_rollback;
