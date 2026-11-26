-- Customer side (unchanged): the invoice is the DEBIT receivable line, the payment is the CREDIT line.
-- Vendor side (added 24 Nov 2026 for the expenses of Fiche 20): a vendor bill is the CREDIT payable line and the (outbound)
-- payment is the DEBIT line. Restricted to vendor bills, so no customer figure can change.
SELECT
    pr.id AS allocation_id,
    dl.move_id AS invoice_id,
    p.id AS payment_id,
    pr.amount AS amount,
    pr.max_date AS allocation_date
FROM
    account_partial_reconcile pr
    INNER JOIN account_move_line dl ON dl.id = pr.debit_move_id
    INNER JOIN account_move_line cl ON cl.id = pr.credit_move_id
    INNER JOIN account_payment p ON p.move_id = cl.move_id
UNION ALL
SELECT
    pr.id AS allocation_id,
    cl.move_id AS invoice_id,
    p.id AS payment_id,
    pr.amount AS amount,
    pr.max_date AS allocation_date
FROM
    account_partial_reconcile pr
    INNER JOIN account_move_line dl ON dl.id = pr.debit_move_id
    INNER JOIN account_move_line cl ON cl.id = pr.credit_move_id
    INNER JOIN account_move bm ON bm.id = cl.move_id AND bm.move_type IN ('in_invoice', 'in_refund')
    INNER JOIN account_payment p ON p.move_id = dl.move_id
