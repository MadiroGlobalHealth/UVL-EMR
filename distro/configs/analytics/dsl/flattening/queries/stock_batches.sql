SELECT
    b.stock_batch_id AS stock_batch_id,
    b.uuid AS stock_batch_uuid,
    b.stock_item_id AS stock_item_id,
    b.batch_no AS batch_no,
    b.expiration AS expiration,
    b.voided AS voided
FROM
    stockmgmt_stock_batch b
