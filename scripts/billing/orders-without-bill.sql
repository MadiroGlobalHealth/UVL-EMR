-- Orders with no OpenMRS bill line item, by day and order type (#840).
--
-- Until billing 2.4.0, orders signed at the same moment could draw the same receipt number: the
-- second bill hit the unique index cashier_bill_receipt_number_idx ("Duplicate entry ... for key
-- 'cashier_bill_receipt_number_idx'" in the log), the error was swallowed, and the order was saved
-- with no OpenMRS bill. Odoo billing is not affected. This lists what is missing, for the product
-- owner to decide what to do with it. It counts only; it changes nothing and names no patient.
--
-- Read only. Run it against the OpenMRS database, as a user that can only SELECT:
--
--   mysql --defaults-extra-file=<client.cnf> openmrs < scripts/billing/orders-without-bill.sql
--
-- Set @since to the first day to look at (the first duplicate-entry line in the log is a good
-- start). Orders signed before billing 2.4.0 reached the site are the ones at risk; later ones
-- should not appear because of this defect.
--
-- Columns:
--   day                    the day the order was signed (server time)
--   order_type             the order type (test, drug, procedure, ...)
--   orders_without_bill    orders with no bill line item at all
--   of_which_billable      those whose concept is a billable service: only these were expected
--                          to be billed. The others are not billed by design (for example
--                          medicines, which the pharmacy bills) and are not missing bills.
--
-- Not counted: voided orders, and stop or revise orders (the billing strategy bills new orders).
-- A bill line that was voided still counts as a bill (the order was billed then corrected).
-- An order whose bill failed for another reason (no price, say) also appears; the log tells the
-- two apart.

SET @since = '2026-09-01';

SELECT DATE(o.date_activated)                                  AS day,
       ot.name                                                 AS order_type,
       COUNT(*)                                                AS orders_without_bill,
       SUM(EXISTS (SELECT 1
                   FROM cashier_billable_service bs
                   WHERE bs.concept_id = o.concept_id
                     AND bs.voided = 0))                       AS of_which_billable
FROM orders o
         JOIN order_type ot ON ot.order_type_id = o.order_type_id
WHERE o.date_activated >= @since
  AND o.voided = 0
  AND o.order_action = 'NEW'
  AND NOT EXISTS (SELECT 1
                  FROM cashier_bill_line_item cbli
                  WHERE cbli.order_id = o.order_id)
GROUP BY DATE(o.date_activated), ot.name
ORDER BY day DESC, order_type;
