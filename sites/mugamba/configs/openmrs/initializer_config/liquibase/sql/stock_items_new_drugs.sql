-- #455: stock items for the drugs created by #455 ("Nouveau" in sheet 1 of 22 Oct 2026).
--
-- Run by the changeset add_stock_items_new_drugs-20261023 in ../liquibase.xml, which waits until
-- the drugs domain has created them (drugs/uvl-drugs-issue455.csv, and Neuroba in uvl-drugs.csv,
-- whose concept is now Gabapentin). Same shape and idempotence as
-- stock_items_catalogue_alignment.sql.

CREATE TEMPORARY TABLE uvl_stock_item_seed (
    drug_uuid CHAR(38) NOT NULL,
    dispensing_unit_uuid CHAR(38) NOT NULL,
    has_expiration TINYINT(1) NOT NULL,
    stock_item_uuid CHAR(38) NOT NULL,
    packaging_uom_uuid CHAR(38) NOT NULL
);

INSERT INTO uvl_stock_item_seed (drug_uuid, dispensing_unit_uuid, has_expiration, stock_item_uuid, packaging_uom_uuid) VALUES
    ('fc4a6e17-91fd-5022-a605-f1a144bc3899', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, '0cf79b0f-db7e-50f8-9ecc-10359b40866e', '1c1b267a-2984-550b-9419-134f83513f9e'), -- Febrilex Junior Sirop | Flacon
    ('ec2ec644-fd9f-5de9-99c3-12d2fee69208', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '13e9aa02-2775-54e6-9e96-01b3af26da30', 'b8c4a15e-ea57-527f-8ea7-17a507184a90'), -- Ibuprofène Comprimé 200mg | Comprimé
    ('d675376d-b35f-48d3-aa21-dd5250106f8a', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, 'f30d05b8-1e32-50a7-80f1-9fdd32d3c176', '2ca53c86-c834-5b41-8f62-b3feefd314e5'), -- Neuroba Comprimé 300mg | Comprimé
    ('d848cbec-c583-5ef2-8b3d-bf1c4fb33ee2', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '6a4727b6-1a89-572e-aac4-be432f3f17cd', '73596a3f-7f67-53e7-ad69-a830f2a05453'), -- Nystatine Comprimé 500 000UI | Comprimé
    ('e024b3ce-1c66-541a-8a8e-48042147d645', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, '58e79754-2ad9-5cc9-bf47-f5cc274e7e5a', '53a63cc0-4b81-5215-96ec-2dd0bee98b29'), -- Pénicilline G Injectable 1MUI | Flacon
    ('f9f45782-4f27-5a12-9601-02a64e010848', 'd81e10fe-0f6a-4b75-b9c0-a5e72d56f3b2', 1, 'ed30ad13-0e2f-5b75-b37e-22c4bba85471', 'd87ccd88-605a-5f69-b1c4-e9cb73f4c6bf'), -- Phénobarbital Injectable 40mg/2ml | Ampoule
    ('b8ad6a27-762b-511a-9754-3bd31756261d', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '2501707f-c22a-512c-a76f-1cd382ef10f4', 'd87aa42b-37a2-529d-8e9b-1b75cb4b1565'); -- Presept Comprimé | Comprimé

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
