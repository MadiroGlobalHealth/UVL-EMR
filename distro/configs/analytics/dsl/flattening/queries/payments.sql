SELECT
    p.id AS payment_id,
    p.move_id AS payment_move_id,
    m.name AS payment_number,
    m.`date` AS payment_date,
    m.`state` AS `state`,
    p.payment_type AS payment_type,
    p.partner_type AS partner_type,
    p.partner_id AS partner_id,
    rp.`ref` AS partner_ref,
    p.amount AS amount,
    j.code AS journal_code,
    j.`type` AS journal_type,
    p.is_reconciled AS is_reconciled
FROM
    account_payment p
    LEFT JOIN account_move m ON m.id = p.move_id
    LEFT JOIN account_journal j ON j.id = m.journal_id
    LEFT JOIN res_partner rp ON rp.id = p.partner_id
