-- Usage baseline for one reporting window (UVL-EMR#285).
-- Run in Superset SQL Lab against the Analytics database. Set the window in
-- `params`; the defaults are the baseline week agreed in the plan, 16-22 Sep
-- 2026 (window_end is exclusive). Times are as stored by OpenMRS (UTC).
-- The activity block is the same query as the usage_activity dataset, so the
-- numbers match the Usage and Adoption dashboard for the same date range.
WITH params (window_start, window_end) AS (
    VALUES (TIMESTAMP '2026-09-16 00:00:00', TIMESTAMP '2026-09-23 00:00:00')
),
activity AS (
    SELECT 'Encounter' AS activity_kind,
           e.encounter_datetime AS activity_datetime,
           COALESCE(e.encounter_type, '(unknown)') AS service,
           e.location AS location,
           e.creator_uuid AS user_key,
           e.patient_uuid AS patient_uuid,
           e.encounter_uuid AS record_uuid
    FROM encounters e
    WHERE COALESCE(e.encounter_voided, false) = false
    UNION ALL
    SELECT 'Order',
           COALESCE(o.date_activated, o.date_created, o.encounter_datetime),
           COALESCE(o.order_type_name, '(unknown)'),
           NULL,
           o.creator_uuid,
           o.patient_uuid,
           o.uuid
    FROM orders o
    WHERE COALESCE(o.voided, false) = false
      AND COALESCE(o.order_action, 'NEW') = 'NEW'
    UNION ALL
    SELECT 'Visit',
           v.date_started,
           COALESCE(v.type, '(unknown)'),
           v.location,
           v.creator_uuid,
           v.patient_uuid,
           v.visit_uuid
    FROM visits v
    WHERE COALESCE(v.visit_voided, false) = false
    UNION ALL
    SELECT 'Registration',
           p.date_created,
           'Patient registration',
           NULL,
           NULL,
           p.patient_uuid,
           p.patient_uuid
    FROM patients p
    WHERE COALESCE(p.person_voided, false) = false
),
in_window AS (
    SELECT a.*
    FROM activity a, params p
    WHERE a.activity_datetime >= p.window_start
      AND a.activity_datetime < p.window_end
)
SELECT 1 AS sort_order, 'Active users' AS metric, '(all)' AS service, COUNT(DISTINCT user_key) AS value FROM in_window
UNION ALL
SELECT 2, 'Patients registered', '(all)', COUNT(*) FROM in_window WHERE activity_kind = 'Registration'
UNION ALL
SELECT 3, 'Patients seen', '(all)', COUNT(DISTINCT patient_uuid) FROM in_window WHERE activity_kind IN ('Encounter', 'Visit')
UNION ALL
SELECT 4, 'Visits', '(all)', COUNT(*) FROM in_window WHERE activity_kind = 'Visit'
UNION ALL
SELECT 5, 'Encounters', '(all)', COUNT(*) FROM in_window WHERE activity_kind = 'Encounter'
UNION ALL
SELECT 6, 'Encounters', service, COUNT(*) FROM in_window WHERE activity_kind = 'Encounter' GROUP BY service
UNION ALL
SELECT 7, 'Orders', '(all)', COUNT(*) FROM in_window WHERE activity_kind = 'Order'
UNION ALL
SELECT 8, 'Orders', service, COUNT(*) FROM in_window WHERE activity_kind = 'Order' GROUP BY service
ORDER BY sort_order, value DESC, service
