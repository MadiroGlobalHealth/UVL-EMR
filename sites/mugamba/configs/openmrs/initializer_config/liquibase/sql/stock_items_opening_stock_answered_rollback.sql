-- #776: rollback of sql/stock_items_opening_stock_answered.sql (changeset add_stock_items_opening_stock_answered-20261118).
--
-- Removes the stock items that file created, by their fixed uuids, with their packaging units.
-- An item the pharmacy has already used (any batch or transaction) is left in place.

CREATE TEMPORARY TABLE uvl_stock_item_rollback (stock_item_id INT NOT NULL);

INSERT INTO uvl_stock_item_rollback (stock_item_id)
SELECT si.stock_item_id
  FROM stockmgmt_stock_item si
 WHERE si.uuid IN (
    '52771744-0938-581c-8eec-d0c282ac42d2',
    '5dc5f1d7-6916-52d6-8d31-4b99633ee356')
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
