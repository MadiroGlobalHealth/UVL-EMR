-- #796: stock items for the three medicines #787 made load again, which had no stock item, so
-- with stock dispensing on they could be prescribed but not dispensed (and, since #605, not billed):
--   Aerius Sirop 2.5mg/5ml 60ml   counted per bottle (Flacon), as Deslova Sirop 2.5mg/5ml 60ml;
--   Aerius Comprimé               counted per tablet (Comprimé), as Deslova Comprimé 5mg;
--   Desloratadine Comprimé 5mg    counted per tablet (Comprimé), as Deslova Comprimé 5mg.
--
-- Run by the changeset add_stock_items_aerius_desloratadine-20261119 in ../liquibase.xml, which
-- waits until the three drugs (drugs/uvl-drugs.csv) and the two units exist. Same shape and
-- idempotence as stock_items_opening_stock_answered.sql (#776); expiry is tracked; the common
-- name is written here for the reason given in stock_items_opening_stock.sql (#457). No batches
-- and no quantities: every item is at 0 until the pharmacy gives its count.

CREATE TEMPORARY TABLE uvl_stock_item_seed (
    drug_uuid CHAR(38) NOT NULL,
    dispensing_unit_uuid CHAR(38) NOT NULL,
    has_expiration TINYINT(1) NOT NULL,
    stock_item_uuid CHAR(38) NOT NULL,
    packaging_uom_uuid CHAR(38) NOT NULL,
    common_name VARCHAR(255) NOT NULL
);

INSERT INTO uvl_stock_item_seed (drug_uuid, dispensing_unit_uuid, has_expiration, stock_item_uuid, packaging_uom_uuid, common_name) VALUES
    ('aa2cc0d6-2c0e-401b-9d77-f68771061a3d', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, '977a55e6-305a-5055-a743-83200191755e', '43d1f9c7-3f49-5fcb-b638-6afddee407df', 'Aerius Sirop 2.5mg/5ml 60ml'), -- Flacon
    ('df92def0-857f-4b6e-ae3f-e20ab0cf5298', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '94d5158a-34f0-5927-8f86-87559c76d65e', 'eb3363fc-1745-5001-b083-d36c4e0a0641', 'Aerius Comprimé'),             -- Comprimé
    ('127fa80c-ff57-48d8-b643-869217524ced', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '86019059-2d9b-5c38-ad45-d10ac837f2b0', 'b73331c0-f35e-5873-accd-fb3c045c3518', 'Desloratadine Comprimé 5mg');  -- Comprimé

INSERT INTO stockmgmt_stock_item (drug_id, concept_id, item_type, is_drug, has_expiration, dispensing_unit_id, common_name,
                                  creator, date_created, voided, uuid)
SELECT d.drug_id, d.concept_id, 1, 1, s.has_expiration, u.concept_id, s.common_name, 1, NOW(), 0, s.stock_item_uuid
  FROM uvl_stock_item_seed s
  JOIN drug d ON d.uuid = s.drug_uuid
  JOIN concept u ON u.uuid = s.dispensing_unit_uuid
 WHERE NOT EXISTS (SELECT 1 FROM stockmgmt_stock_item si
                    WHERE si.drug_id = d.drug_id OR si.uuid = s.stock_item_uuid);

INSERT INTO stockmgmt_stock_item_packaging_uom (stock_item_id, packaging_uom_id, factor, creator, date_created, voided, uuid)
SELECT si.stock_item_id, si.dispensing_unit_id, 1, 1, NOW(), 0, s.packaging_uom_uuid
  FROM uvl_stock_item_seed s
  JOIN stockmgmt_stock_item si ON si.uuid = s.stock_item_uuid
 WHERE NOT EXISTS (SELECT 1 FROM stockmgmt_stock_item_packaging_uom p WHERE p.uuid = s.packaging_uom_uuid);

UPDATE stockmgmt_stock_item si
  JOIN uvl_stock_item_seed s ON s.stock_item_uuid = si.uuid
  JOIN stockmgmt_stock_item_packaging_uom p ON p.uuid = s.packaging_uom_uuid
   SET si.dispensing_unit_packaging_uom_id = p.stock_item_packaging_uom_id,
       si.default_stock_operations_uom_id = p.stock_item_packaging_uom_id
 WHERE si.dispensing_unit_packaging_uom_id IS NULL;

DROP TEMPORARY TABLE uvl_stock_item_seed;
