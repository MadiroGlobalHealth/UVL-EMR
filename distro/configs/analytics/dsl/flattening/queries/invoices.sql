SELECT
    m.id AS invoice_id,
    m.name AS invoice_number,
    m.move_type AS move_type,
    m.`state` AS `state`,
    m.payment_state AS payment_state,
    m.invoice_date AS invoice_date,
    m.`date` AS accounting_date,
    m.invoice_date_due AS due_date,
    m.invoice_origin AS invoice_origin,
    j.code AS journal_code,
    m.partner_id AS partner_id,
    rp.`ref` AS partner_ref,
    CASE WHEN rp.is_company = true AND m.move_type IN ('out_invoice', 'out_refund') THEN rp.name END AS payer_name,
    m.amount_untaxed AS amount_untaxed,
    m.amount_total AS amount_total,
    m.amount_residual AS amount_residual,
    m.amount_total - m.amount_residual AS amount_paid,
    m.insurance_payer_role AS insurance_payer_role,
    m.insurance_source_move_id AS insurance_source_invoice_id,
    m.create_date AS create_date,
    m.write_date AS write_date,
    CASE WHEN m.move_type IN ('in_invoice', 'in_refund') THEN rp.name END AS supplier_name
FROM
    account_move m
    LEFT JOIN account_journal j ON j.id = m.journal_id
    LEFT JOIN res_partner rp ON rp.id = m.partner_id
WHERE
    m.move_type IN ('out_invoice', 'out_refund', 'in_invoice', 'in_refund')
