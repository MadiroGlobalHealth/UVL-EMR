-- #776: the stock and dispensing unit of two items, from the product owner's answers of 18 Nov 2026
-- on the central pharmacy's opening-stock count (file of 16 Nov 2026), which counts them per pack:
--   Anamol Sirop                    per 100 ml bottle (Flacon), no longer per millilitre;
--   Cimetidine Injection 200mg/2ml  per ampoule (Ampoule), no longer per millilitre.
--
-- Run by the changeset stock_item_units_opening_stock-20261118 in ../liquibase.xml, which only
-- runs while neither item has any batch or transaction (nothing was counted in millilitres), and
-- once both items and units exist. Same statements as stock_item_units_sheet3.sql (#455): a
-- packaging unit nothing refers to is changed in place; one already used keeps its history and the
-- item gets a second packaging unit instead. The names do not change (« Anamol Sirop », as
-- « Ambrosal Sirop » kept its name when it moved from Millilitre to Flacon). Idempotent.
-- Rollback: stock_item_units_opening_stock_rollback.sql.

CREATE TEMPORARY TABLE uvl_stock_unit_seed (
    stock_item_uuid CHAR(38) NOT NULL,
    packaging_uom_uuid CHAR(38) NOT NULL,
    unit_uuid CHAR(38) NOT NULL,
    previous_unit_uuid CHAR(38) NOT NULL,
    new_packaging_uom_uuid CHAR(38) NOT NULL
);

INSERT INTO uvl_stock_unit_seed (stock_item_uuid, packaging_uom_uuid, unit_uuid, previous_unit_uuid, new_packaging_uom_uuid) VALUES
    ('d9738e95-bc17-5ff5-8353-d1394ea6895e', 'b6803ded-87dc-5d53-8743-2dd70cc62001', '04144d11-cfed-4930-8ffc-f1b8be92440b', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', 'eca821b6-9d96-5762-894d-de393969fb74'), -- Anamol Sirop | Millilitre -> Flacon (100 ml)
    ('c8b8d121-716e-5652-adf7-c5a56d6ec6eb', '63d00d82-5c5f-554f-8c86-1d4240ca0652', 'd81e10fe-0f6a-4b75-b9c0-a5e72d56f3b2', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', 'be4c25be-26ee-57c5-b38a-209e347c5c51'); -- Cimetidine Injection 200mg/2ml | Millilitre -> Ampoule

UPDATE stockmgmt_stock_item_packaging_uom p
  JOIN uvl_stock_unit_seed s ON s.packaging_uom_uuid = p.uuid
  JOIN concept u ON u.uuid = s.unit_uuid
   SET p.packaging_uom_id = u.concept_id
 WHERE p.packaging_uom_id <> u.concept_id
   AND p.factor = 1
   AND NOT EXISTS (SELECT 1 FROM stockmgmt_stock_item_transaction x WHERE x.stock_item_packaging_uom_id = p.stock_item_packaging_uom_id)
   AND NOT EXISTS (SELECT 1 FROM stockmgmt_reservation_transaction x WHERE x.stock_item_packaging_uom_id = p.stock_item_packaging_uom_id)
   AND NOT EXISTS (SELECT 1 FROM stockmgmt_stock_operation_item x
                    WHERE p.stock_item_packaging_uom_id IN (x.stock_item_packaging_uom_id, x.qty_rcvd_packaging_uom_id, x.qty_req_packaging_uom_id))
   AND NOT EXISTS (SELECT 1 FROM stockmgmt_stock_rule x WHERE x.stock_item_packaging_uom_id = p.stock_item_packaging_uom_id)
   AND NOT EXISTS (SELECT 1 FROM stockmgmt_order_item x WHERE x.stock_item_packaging_uom_id = p.stock_item_packaging_uom_id);

INSERT INTO stockmgmt_stock_item_packaging_uom (stock_item_id, packaging_uom_id, factor, creator, date_created, voided, uuid)
SELECT si.stock_item_id, u.concept_id, 1, 1, NOW(), 0, s.new_packaging_uom_uuid
  FROM uvl_stock_unit_seed s
  JOIN stockmgmt_stock_item si ON si.uuid = s.stock_item_uuid
  JOIN concept u ON u.uuid = s.unit_uuid
 WHERE NOT EXISTS (SELECT 1 FROM stockmgmt_stock_item_packaging_uom p
                    WHERE p.stock_item_id = si.stock_item_id AND p.packaging_uom_id = u.concept_id AND p.voided = 0)
   AND NOT EXISTS (SELECT 1 FROM stockmgmt_stock_item_packaging_uom p WHERE p.uuid = s.new_packaging_uom_uuid);

UPDATE stockmgmt_stock_item si
  JOIN uvl_stock_unit_seed s ON s.stock_item_uuid = si.uuid
  JOIN concept u ON u.uuid = s.unit_uuid
  JOIN stockmgmt_stock_item_packaging_uom p
    ON p.stock_item_id = si.stock_item_id AND p.packaging_uom_id = u.concept_id AND p.voided = 0 AND p.factor = 1
   SET si.dispensing_unit_id = u.concept_id,
       si.dispensing_unit_packaging_uom_id = p.stock_item_packaging_uom_id,
       si.default_stock_operations_uom_id = p.stock_item_packaging_uom_id
 WHERE si.dispensing_unit_id <> u.concept_id
    OR si.dispensing_unit_packaging_uom_id IS NULL
    OR si.dispensing_unit_packaging_uom_id <> p.stock_item_packaging_uom_id;

DROP TEMPORARY TABLE uvl_stock_unit_seed;
