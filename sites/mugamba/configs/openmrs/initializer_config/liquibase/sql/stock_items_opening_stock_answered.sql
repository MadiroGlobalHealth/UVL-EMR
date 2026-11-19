-- #776: stock items for two products the central pharmacy counted in its opening stock (file of
-- 16 Nov 2026) that had no drug in OpenMRS, which the product owner answered on 18 Nov 2026:
--   A-Cerumen Gouttes Auriculaires   ear drops, counted per bottle (Flacon);
--   Midazolam Injection 5mg/ml       counted per ampoule (Ampoule).
--
-- Run by the changeset add_stock_items_opening_stock_answered-20261118 in ../liquibase.xml, which
-- waits until the two drugs (drugs/uvl-drugs-issue776.csv, whose concepts come with the OCL
-- release of the uvl-drugs collection) and the two units exist. Same shape and idempotence as
-- stock_items_opening_stock.sql (#457); expiry is tracked; the common name is written here for
-- the reason given there.

CREATE TEMPORARY TABLE uvl_stock_item_seed (
    drug_uuid CHAR(38) NOT NULL,
    dispensing_unit_uuid CHAR(38) NOT NULL,
    has_expiration TINYINT(1) NOT NULL,
    stock_item_uuid CHAR(38) NOT NULL,
    packaging_uom_uuid CHAR(38) NOT NULL,
    common_name VARCHAR(255) NOT NULL
);

INSERT INTO uvl_stock_item_seed (drug_uuid, dispensing_unit_uuid, has_expiration, stock_item_uuid, packaging_uom_uuid, common_name) VALUES
    ('e9638191-c538-5b6e-9dbe-0d3d4bbf1721', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, '52771744-0938-581c-8eec-d0c282ac42d2', '714b35f5-cf1b-5b45-8d0c-0f8a09f045a1', 'A-Cerumen Gouttes Auriculaires'), -- Flacon
    ('76dfeba4-e78a-5c6d-9bac-4c2c2ade50a0', 'd81e10fe-0f6a-4b75-b9c0-a5e72d56f3b2', 1, '5dc5f1d7-6916-52d6-8d31-4b99633ee356', '49ce2551-0ac1-5f11-ae40-f73f8852c81f', 'Midazolam Injection 5mg/ml');      -- Ampoule

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
