SELECT
    t.stock_item_transaction_id AS stock_transaction_id,
    t.uuid AS stock_transaction_uuid,
    t.stock_operation_id AS stock_operation_id,
    o.operation_number AS operation_number,
    ot.name AS operation_type,
    ot.operation_type AS operation_type_code,
    o.status AS operation_status,
    o.operation_date AS operation_date,
    t.date_created AS transaction_date,
    t.stock_operation_item_id AS stock_operation_item_id,
    t.stock_item_id AS stock_item_id,
    t.stock_batch_id AS stock_batch_id,
    t.party_id AS party_id,
    pl.location_id AS location_id,
    COALESCE(pl.name, ps.name) AS location,
    t.quantity AS quantity,
    u.factor AS packaging_factor,
    t.quantity * u.factor AS quantity_in_dispensing_unit,
    (t.patient_id IS NOT NULL) AS is_patient_dispense,
    pe.uuid AS patient_uuid,
    t.order_id AS order_id,
    e.uuid AS encounter_uuid,
    t.unfulfillment_reason AS unfulfillment_reason
FROM
    stockmgmt_stock_item_transaction t
    LEFT JOIN stockmgmt_stock_operation o ON o.stock_operation_id = t.stock_operation_id
    LEFT JOIN stockmgmt_stock_operation_type ot ON ot.stock_operation_type_id = o.operation_type_id
    LEFT JOIN stockmgmt_party p ON p.party_id = t.party_id
    LEFT JOIN location pl ON pl.location_id = p.location_id
    LEFT JOIN stockmgmt_stock_source ps ON ps.stock_source_id = p.stock_source_id
    LEFT JOIN stockmgmt_stock_item_packaging_uom u ON u.stock_item_packaging_uom_id = t.stock_item_packaging_uom_id
    LEFT JOIN person pe ON pe.person_id = t.patient_id
    LEFT JOIN encounter e ON e.encounter_id = t.encounter_id
