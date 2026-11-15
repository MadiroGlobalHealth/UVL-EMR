-- #455: stock items for the 15 catalogue items the product owner named on 22 Oct 2026 that did
-- not exist in OpenMRS (11 medicines, 4 consumables), created by #455 with their drug.
--
-- Run by the changeset add_stock_items_catalogue_new_items-20261023 in ../liquibase.xml, which
-- waits until the drugs domain has created the 15 drugs (drugs/uvl-drugs-issue455.csv) and the
-- units exist. The unit follows the catalogue line's form the way sheet 3 does; see the column
-- unit_source of catalogue_alignment.csv. Same shape and idempotence as
-- stock_items_catalogue_alignment.sql.

CREATE TEMPORARY TABLE uvl_stock_item_seed (
    drug_uuid CHAR(38) NOT NULL,
    dispensing_unit_uuid CHAR(38) NOT NULL,
    has_expiration TINYINT(1) NOT NULL,
    stock_item_uuid CHAR(38) NOT NULL,
    packaging_uom_uuid CHAR(38) NOT NULL
);

INSERT INTO uvl_stock_item_seed (drug_uuid, dispensing_unit_uuid, has_expiration, stock_item_uuid, packaging_uom_uuid) VALUES
    ('d91ba34d-7b16-5827-be4e-bf9abc2e89e4', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, 'e2683842-ee30-5dc2-963c-c69e7bf1dc5e', 'e720c65f-c2d9-557f-b589-2cdbdec3c1dd'), -- Alcool dénaturé 98% | Flacon
    ('8e6c7618-c278-57c3-9074-f6c84aae7dcf', 'bbe6f178-8adf-401c-89e4-ca8e0ccc378a', 1, '2a24da27-404c-5f04-b4b7-71312c91b250', '9f76da18-3756-5087-9508-5c22e4ae15e4'), -- Artésunate Suppositoire | Suppositoire
    ('480a8630-392b-5d05-a58d-bf1357b92927', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, 'f785c228-f019-500c-a15e-92974e8868af', '79cbcc21-122e-5620-b04e-85eb52e683e3'), -- Auropent Collyre | Flacon
    ('e3bdc9a1-1cfd-5c2a-808a-eee6556102c2', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, 'b358ca05-e4f0-595d-9dcd-9e19f74e00e4', 'd9c92293-8d93-57bb-8adf-cb18f488766d'), -- Aurozole Collyre | Flacon
    ('e6eedfd7-8f9b-5791-93ad-9bf2e192aabb', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, 'ee0abcc3-8a66-5289-836e-b276990d7f34', 'c7e66450-4a5c-5f8a-b6cb-5ef808abbc75'), -- Cefixime Sirop 100mg | Flacon
    ('876055fc-04a5-5999-921c-583bd2f8f3a8', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, '0029c9fa-5df0-5c89-aebc-203fbd4833b8', '2ad0eb23-969a-5e61-a80c-1a3a392e1841'), -- Clavox Injectable | Flacon
    ('48fceeae-7c8a-5314-8163-4273263775e9', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, '47e622d9-a197-5b96-9001-8861df1be003', 'd4ed2431-340c-5312-b3bc-ad8cae20c377'), -- Cloxacilline Injectable 500mg | Flacon
    ('db025a04-ac09-56be-89e6-57edaff547dc', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '522ba888-4df5-59ff-a0af-d74873e4f2e6', '201d84f8-7a4f-521d-8c2f-8ee51c418889'), -- Cotrimoxazole Comprimé 160/800mg | Comprimé
    ('2913f1b6-5a2a-5a82-910d-0153738bae7d', 'c4b6c7b7-4906-4f76-af51-60ec9a34932e', 1, '8b40318b-e568-5727-b01c-b761a5e940ed', '4dcbf7f4-a277-5929-acc2-d542afad6acf'), -- Gel Echographique | Pièce
    ('15c1c28f-b42c-5bc7-bf1a-7042f5282b79', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, '22333aa9-e4ac-5897-b1f2-e93079872ce0', 'bfdab676-2f9d-54ce-b55b-1a0c90bd2765'), -- Predimax Collyre | Flacon
    ('19c548d7-93e8-5640-894e-0af3340a8f77', 'c4b6c7b7-4906-4f76-af51-60ec9a34932e', 1, '282ab042-5dc1-515e-ae34-957509debe5c', 'da12f7c7-8bac-532f-b9b3-40fcc393f669'), -- Robinet à 3 voies | Pièce
    ('a20b85ad-0ea5-521f-a7fa-b1d3feae7bee', 'cb3566e8-0ba7-51a7-b468-719953d7bffa', 1, '49b4b490-ba61-5063-a311-c91c9138e52a', '5e803bdf-48d4-5aa3-90a9-2610c6c00191'), -- Rouleau de gaze 90 cm x 91 m | Rouleau
    ('5b0fcfb2-dc90-5004-9c96-c03a993283ae', 'c4b6c7b7-4906-4f76-af51-60ec9a34932e', 1, '9bc20fef-f541-5f9e-a506-dff549c005ec', 'c9cc6af8-34ee-5dba-9569-2aa80272b92c'), -- Sachets pour le conditionnement des MEG | Pièce
    ('62d3cb2f-2603-5db3-8b8c-5b3a25282ec1', 'd81e10fe-0f6a-4b75-b9c0-a5e72d56f3b2', 1, '0f49a3ef-0ddc-516d-a470-ff8554e747ff', '7dd516ed-785b-5605-902f-6e00539ece82'), -- Salbutamol Injectable 0,5mg | Ampoule
    ('b75a92eb-d373-5b2c-87f7-b1fe9ad5b635', 'd81e10fe-0f6a-4b75-b9c0-a5e72d56f3b2', 1, '2608d24e-1987-502f-9ae0-3dfa2a542e04', 'e0ceb686-7d2e-5035-9391-e9fdac64a103'); -- Vecuronium Injectable | Ampoule

INSERT INTO stockmgmt_stock_item (drug_id, concept_id, item_type, is_drug, has_expiration, dispensing_unit_id,
                                  creator, date_created, voided, uuid)
SELECT d.drug_id, d.concept_id, 1, 1, s.has_expiration, u.concept_id, 1, NOW(), 0, s.stock_item_uuid
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
