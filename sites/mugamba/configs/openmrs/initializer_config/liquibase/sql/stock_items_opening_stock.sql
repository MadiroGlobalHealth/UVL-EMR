-- #457: stock items for seven products the central pharmacy counted in its opening stock
-- (file of 16 Nov 2026) whose drug exists in OpenMRS but had no stock item:
--   Dynamogen Ampoule 3mg/1g   the drug #478 kept for "Dynamogen Ampoule 10 ml";
--   Halothane Flacon           the generic, a line of its own next to Fluothane;
--   Aiguille G19/G21/G22/G23 (Prélèvement) and Tissu Jersey 1m, consumables from #212.
--
-- Run by the changeset add_stock_items_opening_stock-20261116 in ../liquibase.xml, which waits
-- until the seven drugs and the three units exist. The matching of the pharmacy's lines to
-- stock items is sites/mugamba/requirements/opening-stock-matching.csv. Same shape and
-- idempotence as stock_items_catalogue_new_items.sql (#455); expiry is tracked, as for every
-- item since #454. The common name is written here because the runAlways changeset of #463
-- that copies it from the drug runs before this one.

CREATE TEMPORARY TABLE uvl_stock_item_seed (
    drug_uuid CHAR(38) NOT NULL,
    dispensing_unit_uuid CHAR(38) NOT NULL,
    has_expiration TINYINT(1) NOT NULL,
    stock_item_uuid CHAR(38) NOT NULL,
    packaging_uom_uuid CHAR(38) NOT NULL,
    common_name VARCHAR(255) NOT NULL
);

INSERT INTO uvl_stock_item_seed (drug_uuid, dispensing_unit_uuid, has_expiration, stock_item_uuid, packaging_uom_uuid, common_name) VALUES
    ('d9fb690b-f0ba-4832-bb1e-db8386eba6cb', 'd81e10fe-0f6a-4b75-b9c0-a5e72d56f3b2', 1, 'b745ce94-b5be-520d-bb8e-ed8fc720b9c6', '7597fb4c-4612-5e2f-a95c-ab613f8b4afc', 'Dynamogen Ampoule 3mg/1g'),   -- Ampoule
    ('f26cf0e0-cb97-4227-a7dd-dffaf72d9b8d', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, '69fbfdc3-685b-5987-bdd3-6ada8d02ef1d', '222b79ad-3aa8-5bbe-b741-8335217f754e', 'Halothane Flacon'),           -- Flacon
    ('c76c5115-afe7-425f-9e97-d2c8bb6c32dd', 'c4b6c7b7-4906-4f76-af51-60ec9a34932e', 1, 'e5b76523-0ce7-5b5a-b352-7f96eb82c399', '913cba23-6c51-51b1-8720-c18d93da5ae1', 'Aiguille G19 (Prélèvement)'), -- Pièce
    ('1a22d90c-8bf4-45ad-b141-a68cfe976496', 'c4b6c7b7-4906-4f76-af51-60ec9a34932e', 1, '0bf404d0-fcb8-5da6-80c4-2bc14645d5ef', '2a04fbf3-a2ab-50b0-81db-ef912655d8a7', 'Aiguille G21 (Prélèvement)'), -- Pièce
    ('cfef94fa-ba16-4c1f-b564-30f56d4cddb8', 'c4b6c7b7-4906-4f76-af51-60ec9a34932e', 1, '85497076-eabc-5277-aae8-c41da94f0bde', 'a47c58a3-4285-543c-9e8e-957f45eec93a', 'Aiguille G22 (Prélèvement)'), -- Pièce
    ('29260dcc-9dcd-4315-b5ed-bdfe6792706f', 'c4b6c7b7-4906-4f76-af51-60ec9a34932e', 1, 'b6d809f5-54eb-535c-a334-e42f6015554a', '685be583-5cce-5b48-b38c-24be06b76c34', 'Aiguille G23 (Prélèvement)'), -- Pièce
    ('df543826-8385-49a6-ac61-25a258f12100', 'c4b6c7b7-4906-4f76-af51-60ec9a34932e', 1, 'dcedfeed-cef5-533b-bd50-c774148e764e', 'a1c7bc97-31df-5b41-b2c9-5c49f01d1bdf', 'Tissu Jersey 1m');           -- Pièce (1 m)

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
