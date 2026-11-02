-- #455: rollback of sql/stock_items_new_drugs.sql (changeset add_stock_items_new_drugs-20261023).
--
-- Removes the stock items that file created, by their fixed uuids, with their packaging units.
-- An item the pharmacy has already used (any batch or transaction) is left in place.

CREATE TEMPORARY TABLE uvl_stock_item_rollback (stock_item_id INT NOT NULL);

INSERT INTO uvl_stock_item_rollback (stock_item_id)
SELECT si.stock_item_id
  FROM stockmgmt_stock_item si
 WHERE si.uuid IN (
    '0cf79b0f-db7e-50f8-9ecc-10359b40866e',
    '13e9aa02-2775-54e6-9e96-01b3af26da30',
    'f30d05b8-1e32-50a7-80f1-9fdd32d3c176',
    '6a4727b6-1a89-572e-aac4-be432f3f17cd',
    '58e79754-2ad9-5cc9-bf47-f5cc274e7e5a',
    'ed30ad13-0e2f-5b75-b37e-22c4bba85471',
    '2501707f-c22a-512c-a76f-1cd382ef10f4')
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
