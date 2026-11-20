-- #795: stock items for Ataktan Comprimé 50mg and Contam Gélule 500mg, the two new items of #795
-- whose sibling has one (Ataktan Comprimé 100mg, Contam Suspension 250mg/ml 60ml). Ababacter 300ml
-- and the three pairs of glasses get none: Ababacter 125ml and the glasses of the same kind have
-- no stock item.
--
-- Run by the changeset add_stock_items_795-20261120b in ../liquibase.xml, which waits until the
-- drugs (drugs/uvl-drugs-issue795.csv, on the concepts of their siblings, already in the OCL
-- exports) and the units exist. Same shape and idempotence as stock_items_carbamazepine_200mg.sql
-- (#797): counted per Comprimé and per Gélule as the other tablets and capsules are (the
-- suspension is counted in millilitres, not a unit a capsule can follow), expiry tracked, no batch,
-- no quantity; the common name is written here for the reason given in stock_items_opening_stock.sql.
--
-- The uuids are uuid5 (URL namespace) of
-- https://github.com/MadiroGlobalHealth/UVL-EMR/issues/795/stock-item/<drug uuid> and
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
    ('e19e9f80-b35b-592f-9e93-d29f9771c04b', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '92731684-2c74-5f9a-a413-be8748ef6366', 'c3ce45b4-ef8d-50f4-9fcf-459e58523384', 'Ataktan Comprimé 50mg'),
    ('f9a6bad8-25ad-5156-871c-a5d789bc78c3', '94b2f0e7-0885-430f-8733-e2a93f03095d', 1, '78526bee-df0a-5d70-830e-1370c37055f9', 'ee183b00-8649-5260-96c2-c0e358e6676e', 'Contam Gélule 500mg');

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
