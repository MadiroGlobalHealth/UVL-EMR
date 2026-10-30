-- #478: a stock item for Aceclofenac Comprimé 100mg, the drug kept for aceclofenac 100 mg.
--
-- Run by the changeset add_stock_item_aceclofenac-20261028 in ../liquibase.xml, which waits
-- until the drug and the unit exist. The stock item the pharmacy had for this medicine belonged
-- to Acefen Comprimé 100mg, retired as its duplicate; stock_items_void_duplicates.sql voids it.
-- Same unit as that item (Comprimé), batch and expiry tracked.
--
-- Same shape and idempotence as stock_items_new_drugs.sql (#455). The uuids are uuid5 (URL
-- namespace) of https://github.com/MadiroGlobalHealth/UVL-EMR/issues/478/stock-item/<drug uuid>
-- and .../stock-item-packaging-uom/<drug uuid>.

CREATE TEMPORARY TABLE uvl_stock_item_seed (
    drug_uuid CHAR(38) NOT NULL,
    dispensing_unit_uuid CHAR(38) NOT NULL,
    has_expiration TINYINT(1) NOT NULL,
    stock_item_uuid CHAR(38) NOT NULL,
    packaging_uom_uuid CHAR(38) NOT NULL
);

INSERT INTO uvl_stock_item_seed (drug_uuid, dispensing_unit_uuid, has_expiration, stock_item_uuid, packaging_uom_uuid) VALUES
    ('7fca28e6-2e0c-4a6d-8843-c2649b62e506', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '5a7f1865-e258-5a2d-ba0c-d92b7614543e', 'b5b4080e-c92d-5149-bd11-9b3164e2df2a'); -- Aceclofenac Comprimé 100mg | Comprimé

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
