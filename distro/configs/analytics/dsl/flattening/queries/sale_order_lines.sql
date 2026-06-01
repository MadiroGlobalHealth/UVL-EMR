SELECT
    sol.id AS sale_order_line_id,
    so.name AS sale_order_name,
    sol.sequence,
    sol.product_id AS product_id,
    pt.name AS product_name,
    pp.default_code AS product_code,
    irp.name AS product_external_id,
    sol.product_uom_qty AS quantity,
    sol.price_unit AS unit_price,
    sol.price_subtotal AS subtotal,
    sol.price_total AS total,
    sol.create_date AS line_creation_date,
    sol.write_date AS line_last_modified_date,
    rp.name AS customer_name,
    `rp`.`ref` AS customer_uuid,
    rp.email AS customer_email,
    rp.phone AS customer_phone,
    so.invoice_status AS invoicing_status,
    ppt.name AS pricelist,
    so.`state` AS order_state
FROM
    sale_order_line sol
INNER JOIN
    sale_order so ON sol.order_id = so.id
LEFT JOIN
    product_product pp ON sol.product_id = pp.id
LEFT JOIN
    product_template pt ON pp.product_tmpl_id = pt.id
LEFT JOIN
    res_partner rp ON so.partner_id = rp.id
LEFT JOIN
    product_pricelist ppt ON so.pricelist_id = ppt.id
LEFT JOIN
    ir_model_data irp ON (irp.model = 'product.product' AND irp.res_id = pp.id)