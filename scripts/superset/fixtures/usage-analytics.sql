-- Fixture for scripts/superset/test-usage-sql.sh (UVL-EMR#285).
-- The four flattened analytics tables the usage datasets read, reduced to the
-- columns they use, with records chosen to hit each exclusion rule.
-- Reporting window under test: 2026-09-16 00:00 to 2026-09-23 00:00 (exclusive).
-- ISO weeks: 2026-09-14 (Mon) and 2026-09-21 (Mon).

CREATE TABLE encounters (
    encounter_id BIGINT PRIMARY KEY,
    encounter_voided BOOLEAN,
    location VARCHAR,
    encounter_datetime TIMESTAMP,
    encounter_type VARCHAR,
    encounter_uuid VARCHAR,
    patient_uuid VARCHAR,
    creator_uuid VARCHAR
);

CREATE TABLE orders (
    order_id BIGINT PRIMARY KEY,
    patient_uuid VARCHAR,
    order_type_name VARCHAR,
    encounter_datetime TIMESTAMP,
    date_activated TIMESTAMP,
    date_created TIMESTAMP,
    creator_uuid VARCHAR,
    uuid VARCHAR,
    order_action VARCHAR,
    voided BOOLEAN
);

CREATE TABLE visits (
    visit_id BIGINT PRIMARY KEY,
    visit_voided BOOLEAN,
    location VARCHAR,
    date_started TIMESTAMP,
    type VARCHAR,
    visit_uuid VARCHAR,
    patient_uuid VARCHAR,
    creator_uuid VARCHAR
);

CREATE TABLE patients (
    patient_id BIGINT PRIMARY KEY,
    patient_uuid VARCHAR,
    creator BIGINT,
    date_created TIMESTAMP,
    person_voided BOOLEAN
);

INSERT INTO encounters VALUES
    (1, false, 'OPD', '2026-09-16 08:00', 'Outpatient Consultation', 'e1', 'p1', 'u1'),
    (2, false, 'OPD', '2026-09-17 09:00', 'Outpatient Consultation', 'e2', 'p2', 'u2'),
    (3, false, 'OPD', '2026-09-18 10:00', 'Vitals',                  'e3', 'p1', 'u1'),
    (4, false, 'IPD', '2026-09-22 23:59', 'Admission',               'e4', 'p3', 'u3'),
    -- voided: excluded everywhere
    (5, true,  'OPD', '2026-09-19 10:00', 'Outpatient Consultation', 'e5', 'p4', 'u5'),
    -- window end is exclusive
    (6, false, 'OPD', '2026-09-23 00:00', 'Outpatient Consultation', 'e6', 'p5', 'u3'),
    -- the day before the window
    (7, false, 'OPD', '2026-09-15 23:59', 'Outpatient Consultation', 'e7', 'p2', 'u2'),
    -- NULL voided counts as not voided; NULL creator counts no user
    (8, NULL,  'OPD', '2026-09-20 11:00', 'Vitals',                  'e8', 'p2', NULL);

INSERT INTO orders VALUES
    (1, 'p1', 'Test Order', '2026-09-16 08:10', '2026-09-16 08:10', '2026-09-16 08:10', 'u2', 'o1', 'NEW', false),
    -- a revision is not a new order
    (2, 'p1', 'Test Order', '2026-09-16 08:10', '2026-09-17 08:00', '2026-09-17 08:00', 'u2', 'o2', 'REVISE', false),
    -- voided
    (3, 'p2', 'Drug Order', '2026-09-18 09:00', '2026-09-18 09:00', '2026-09-18 09:00', 'u1', 'o3', 'NEW', false),
    -- no date_activated: falls back to date_created; u4 is active only through orders
    (4, 'p2', 'Drug Order', NULL,               NULL,               '2026-09-19 09:00', 'u4', 'o4', 'NEW', false),
    (5, 'p2', 'Drug Order', '2026-09-19 09:00', '2026-09-19 12:00', '2026-09-19 12:00', 'u4', 'o5', 'DISCONTINUE', false);
UPDATE orders SET voided = true WHERE order_id = 3;

INSERT INTO visits VALUES
    (1, false, 'OPD', '2026-09-16 07:50', 'Outpatient', 'v1', 'p1', 'u1'),
    -- p6 is seen only through a visit
    (2, false, 'OPD', '2026-09-21 08:00', 'Outpatient', 'v2', 'p6', 'u2'),
    (3, true,  'OPD', '2026-09-21 09:00', 'Outpatient', 'v3', 'p7', 'u5');

INSERT INTO patients VALUES
    (1, 'p1', 10, '2026-09-16 07:45', false),
    (2, 'p2', 10, '2026-09-10 10:00', false),
    (6, 'p6', 11, '2026-09-21 07:55', false),
    -- voided registration
    (7, 'p7', 11, '2026-09-22 10:00', true);
