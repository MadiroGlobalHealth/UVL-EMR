-- #797: a stock item for Carbamazepine Comprimé 200mg, which the central pharmacy counted in its
-- opening stock (file of 16 Nov 2026, line « CARBAMAZEPINE cp ») and which had no drug in
-- OpenMRS: the product owner read the box on 19 Nov 2026, « Carbamazepine Tablets BP 200mg ».
-- Counted per tablet (Comprimé), as the other tablets are.
--
-- Run by the changeset add_stock_item_carbamazepine_200mg-20261119 in ../liquibase.xml, which
-- waits until the drug (drugs/uvl-drugs-issue797.csv; its concept is the Carbamazepine of the
-- 400 mg drug, already in the OCL export of the uvl-drugs collection) and the unit exist. Same
-- shape and idempotence as stock_items_opening_stock_answered.sql (#776); expiry is tracked; the
-- common name is written here for the reason given in stock_items_opening_stock.sql.
--
-- The uuids are uuid5 (URL namespace) of
-- https://github.com/MadiroGlobalHealth/UVL-EMR/issues/797/stock-item/<drug uuid> and
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
    ('a4e0ea16-0744-5fb7-871a-e3674ab87895', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '2a3155b3-f014-5f3f-bc51-a5fb11755eb9', '510c09fd-10d8-5a22-bdc6-c31507db38c8', 'Carbamazepine Comprimé 200mg'); -- Comprimé

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
