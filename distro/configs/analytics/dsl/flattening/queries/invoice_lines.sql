SELECT
    l.id AS invoice_line_id,
    l.move_id AS invoice_id,
    m.name AS invoice_number,
    m.move_type AS move_type,
    m.`state` AS `state`,
    m.payment_state AS payment_state,
    m.invoice_date AS invoice_date,
    m.insurance_payer_role AS insurance_payer_role,
    l.product_id AS product_id,
    pt.name AS product_name,
    pp.default_code AS product_code,
    pc.complete_name AS product_category,
    l.account_id AS account_id,
    a.code AS account_code,
    l.quantity AS quantity,
    l.price_unit AS unit_price,
    l.discount AS discount,
    l.price_subtotal AS subtotal,
    l.price_total AS total,
    l.insurance_base_amount AS insurance_base_amount,
    l.insurance_complementary_amount AS insurance_complementary_amount,
    l.insurance_patient_amount AS insurance_patient_amount,
    l.insurance_copay_amount AS insurance_copay_amount,
    COALESCE(JSON_VALUE(a.name, '$.fr_FR'), JSON_VALUE(a.name, '$.en_US'), a.name) AS account_name
FROM
    account_move_line l
    INNER JOIN account_move m ON m.id = l.move_id
    LEFT JOIN account_account a ON a.id = l.account_id
    LEFT JOIN product_product pp ON pp.id = l.product_id
    LEFT JOIN product_template pt ON pt.id = pp.product_tmpl_id
    LEFT JOIN product_category pc ON pc.id = pt.categ_id
WHERE
    m.move_type IN ('out_invoice', 'out_refund', 'in_invoice', 'in_refund')
    AND l.display_type = 'product'
