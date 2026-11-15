-- #478: rollback of sql/stock_items_one_name_per_medicine.sql (changeset add_stock_item_aceclofenac-20261028).
--
-- Removes the stock item that file created, by its fixed uuid, with its packaging unit. An item
-- the pharmacy has already used (any batch or transaction) is left in place.

CREATE TEMPORARY TABLE uvl_stock_item_rollback (stock_item_id INT NOT NULL);

INSERT INTO uvl_stock_item_rollback (stock_item_id)
SELECT si.stock_item_id
  FROM stockmgmt_stock_item si
 WHERE si.uuid IN ('5a7f1865-e258-5a2d-ba0c-d92b7614543e')
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
