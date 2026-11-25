-- #953: stock items for Vaccinostyl and Tube à glycémie, two consumables counted per Unité as the
-- other consumables (Bande Velpeau, Sac collecteur à urines, Set de perfusion; sql/stock_items.sql).
--
-- Run by the changeset add_stock_items_953-20261125 in ../liquibase.xml, which waits until the
-- drugs (drugs/uvl-drugs.csv, on the concepts of concepts/consumables_953.csv) and the Unité unit
-- exist. Same shape and idempotence as stock_items_795.sql: no expiry tracked for a consumable
-- (has_expiration 0 as the other Unité items), no batch, no quantity; the common name is written
-- here for the reason given in stock_items_opening_stock.sql.
--
-- The uuids are uuid5 (URL namespace) of
-- https://github.com/MadiroGlobalHealth/UVL-EMR/issues/953/stock-item/<drug uuid> and
-- .../stock-item-packaging-uom/<drug uuid>; the drug's is that of .../drug/<French name>.

CREATE TEMPORARY TABLE uvl_stock_item_seed (
    drug_uuid CHAR(38) NOT NULL,
    dispensing_unit_uuid CHAR(38) NOT NULL,
    has_expiration TINYINT(1) NOT NULL,
    stock_item_uuid CHAR(38) NOT NULL,
    packaging_uom_uuid CHAR(38) NOT NULL,
    common_name VARCHAR(255) NOT NULL
);

INSERT INTO uvl_stock_item_seed (drug_uuid, dispensing_unit_uuid, has_expiration, stock_item_uuid, packaging_uom_uuid, common_name) VALUES
    ('c4dee2dd-0629-5c3c-9d65-f3d8eb246f60', 'c4b6c7b7-4906-4f76-af51-60ec9a34932e', 0, '6c08ead8-a956-52d4-9d35-932e977f3613', '967f987c-dcde-55df-848c-272f0a09f874', 'Vaccinostyl'),
    ('1e63368f-b03a-5b1a-bcaa-1e45d6bce7fb', 'c4b6c7b7-4906-4f76-af51-60ec9a34932e', 0, 'a46f503c-e541-5021-8e56-7dfcef2b7209', 'ff86c992-8a84-55c4-96c1-b20aebe5f93f', 'Tube à glycémie');

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
