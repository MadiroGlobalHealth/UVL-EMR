-- #776: rollback of sql/stock_item_units_opening_stock.sql (changeset stock_item_units_opening_stock-20261118).
--
-- Puts Anamol Sirop and Cimetidine Injection 200mg/2ml back in Millilitre, as
-- stock_item_units_sheet3_rollback.sql does for the sheet-3 items: a packaging unit changed in place
-- gets its previous unit back if nothing refers to it yet; an item moved to a second packaging unit
-- goes back to its first one, and the second one is removed if nothing refers to it.

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
  JOIN concept o ON o.uuid = s.previous_unit_uuid
   SET p.packaging_uom_id = o.concept_id
 WHERE p.packaging_uom_id = u.concept_id
   AND NOT EXISTS (SELECT 1 FROM stockmgmt_stock_item_transaction x WHERE x.stock_item_packaging_uom_id = p.stock_item_packaging_uom_id)
   AND NOT EXISTS (SELECT 1 FROM stockmgmt_reservation_transaction x WHERE x.stock_item_packaging_uom_id = p.stock_item_packaging_uom_id)
   AND NOT EXISTS (SELECT 1 FROM stockmgmt_stock_operation_item x
                    WHERE p.stock_item_packaging_uom_id IN (x.stock_item_packaging_uom_id, x.qty_rcvd_packaging_uom_id, x.qty_req_packaging_uom_id))
   AND NOT EXISTS (SELECT 1 FROM stockmgmt_stock_rule x WHERE x.stock_item_packaging_uom_id = p.stock_item_packaging_uom_id)
   AND NOT EXISTS (SELECT 1 FROM stockmgmt_order_item x WHERE x.stock_item_packaging_uom_id = p.stock_item_packaging_uom_id);

UPDATE stockmgmt_stock_item si
  JOIN uvl_stock_unit_seed s ON s.stock_item_uuid = si.uuid
  JOIN concept o ON o.uuid = s.previous_unit_uuid
  JOIN stockmgmt_stock_item_packaging_uom p ON p.uuid = s.packaging_uom_uuid AND p.packaging_uom_id = o.concept_id
   SET si.dispensing_unit_id = o.concept_id,
       si.dispensing_unit_packaging_uom_id = p.stock_item_packaging_uom_id,
       si.default_stock_operations_uom_id = p.stock_item_packaging_uom_id;

DELETE p FROM stockmgmt_stock_item_packaging_uom p
  JOIN uvl_stock_unit_seed s ON s.new_packaging_uom_uuid = p.uuid
 WHERE NOT EXISTS (SELECT 1 FROM stockmgmt_stock_item si
                    WHERE p.stock_item_packaging_uom_id IN (si.dispensing_unit_packaging_uom_id, si.default_stock_operations_uom_id,
                                                            si.purchase_price_uom_id, si.reorder_level_uom_id))
   AND NOT EXISTS (SELECT 1 FROM stockmgmt_stock_item_transaction x WHERE x.stock_item_packaging_uom_id = p.stock_item_packaging_uom_id)
   AND NOT EXISTS (SELECT 1 FROM stockmgmt_reservation_transaction x WHERE x.stock_item_packaging_uom_id = p.stock_item_packaging_uom_id)
   AND NOT EXISTS (SELECT 1 FROM stockmgmt_stock_operation_item x
                    WHERE p.stock_item_packaging_uom_id IN (x.stock_item_packaging_uom_id, x.qty_rcvd_packaging_uom_id, x.qty_req_packaging_uom_id))
   AND NOT EXISTS (SELECT 1 FROM stockmgmt_stock_rule x WHERE x.stock_item_packaging_uom_id = p.stock_item_packaging_uom_id)
   AND NOT EXISTS (SELECT 1 FROM stockmgmt_order_item x WHERE x.stock_item_packaging_uom_id = p.stock_item_packaging_uom_id);

DROP TEMPORARY TABLE uvl_stock_unit_seed;
