SELECT
    o.stock_operation_id AS stock_operation_id,
    o.uuid AS stock_operation_uuid,
    o.operation_number AS operation_number,
    ot.name AS operation_type,
    ot.operation_type AS operation_type_code,
    o.status AS status,
    o.operation_date AS operation_date,
    o.at_location_id AS location_id,
    l.name AS location,
    COALESCE(sl.name, ss.name) AS `source`,
    COALESCE(dl.name, ds.name) AS `destination`,
    o.reason_id AS reason_concept_id,
    o.completed_date AS completed_date,
    o.cancelled_date AS cancelled_date,
    o.date_created AS date_created,
    o.voided AS voided
FROM
    stockmgmt_stock_operation o
    LEFT JOIN stockmgmt_stock_operation_type ot ON ot.stock_operation_type_id = o.operation_type_id
    LEFT JOIN location l ON l.location_id = o.at_location_id
    LEFT JOIN stockmgmt_party sp ON sp.party_id = o.source_id
    LEFT JOIN location sl ON sl.location_id = sp.location_id
    LEFT JOIN stockmgmt_stock_source ss ON ss.stock_source_id = sp.stock_source_id
    LEFT JOIN stockmgmt_party dp ON dp.party_id = o.destination_id
    LEFT JOIN location dl ON dl.location_id = dp.location_id
    LEFT JOIN stockmgmt_stock_source ds ON ds.stock_source_id = dp.stock_source_id
