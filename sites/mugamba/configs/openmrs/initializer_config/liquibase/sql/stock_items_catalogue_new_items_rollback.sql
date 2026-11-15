-- #455: rollback of sql/stock_items_catalogue_new_items.sql (changeset add_stock_items_catalogue_new_items-20261023).
--
-- Removes the stock items that file created, by their fixed uuids, with their packaging units.
-- An item the pharmacy has already used (any batch or transaction) is left in place.

CREATE TEMPORARY TABLE uvl_stock_item_rollback (stock_item_id INT NOT NULL);

INSERT INTO uvl_stock_item_rollback (stock_item_id)
SELECT si.stock_item_id
  FROM stockmgmt_stock_item si
 WHERE si.uuid IN (
    'e2683842-ee30-5dc2-963c-c69e7bf1dc5e',
    '2a24da27-404c-5f04-b4b7-71312c91b250',
    'f785c228-f019-500c-a15e-92974e8868af',
    'b358ca05-e4f0-595d-9dcd-9e19f74e00e4',
    'ee0abcc3-8a66-5289-836e-b276990d7f34',
    '0029c9fa-5df0-5c89-aebc-203fbd4833b8',
    '47e622d9-a197-5b96-9001-8861df1be003',
    '522ba888-4df5-59ff-a0af-d74873e4f2e6',
    '8b40318b-e568-5727-b01c-b761a5e940ed',
    '22333aa9-e4ac-5897-b1f2-e93079872ce0',
    '282ab042-5dc1-515e-ae34-957509debe5c',
    '49b4b490-ba61-5063-a311-c91c9138e52a',
    '9bc20fef-f541-5f9e-a506-dff549c005ec',
    '0f49a3ef-0ddc-516d-a470-ff8554e747ff',
    '2608d24e-1987-502f-9ae0-3dfa2a542e04')
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
