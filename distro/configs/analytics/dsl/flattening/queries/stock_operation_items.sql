SELECT
    oi.stock_operation_item_id AS stock_operation_item_id,
    oi.stock_operation_id AS stock_operation_id,
    oi.stock_item_id AS stock_item_id,
    oi.stock_batch_id AS stock_batch_id,
    oi.quantity AS quantity,
    oi.quantity_received AS quantity_received,
    oi.quantity_requested AS quantity_requested,
    oi.purchase_price AS purchase_price,
    u.factor AS packaging_factor,
    COALESCE(pfr.name, pen.name) AS packaging_unit,
    oi.voided AS voided
FROM
    stockmgmt_stock_operation_item oi
    LEFT JOIN stockmgmt_stock_item_packaging_uom u ON u.stock_item_packaging_uom_id = oi.stock_item_packaging_uom_id
    LEFT JOIN concept_name pfr ON pfr.concept_id = u.packaging_uom_id
                              AND pfr.locale = 'fr' AND pfr.concept_name_type = 'FULLY_SPECIFIED' AND pfr.voided = false
    LEFT JOIN concept_name pen ON pen.concept_id = u.packaging_uom_id
                              AND pen.locale = 'en' AND pen.concept_name_type = 'FULLY_SPECIFIED' AND pen.voided = false
