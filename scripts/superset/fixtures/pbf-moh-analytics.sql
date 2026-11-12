-- Fixture for scripts/superset/test-pbf-moh-sql.sh (UVL-EMR#240, #241, #242).
-- Synthetic records only (no patient data). Months under test: Aug and Sep 2026.
CREATE TABLE visits (
    visit_id BIGINT PRIMARY KEY, visit_voided BOOLEAN, location VARCHAR, date_started TIMESTAMP,
    date_stopped TIMESTAMP, visit_attributes VARCHAR, patient_gender VARCHAR, patient_birthdate DATE,
    visit_uuid VARCHAR, patient_uuid VARCHAR
);
CREATE TABLE patients (
    patient_id BIGINT PRIMARY KEY, identifiers VARCHAR, gender VARCHAR, birthdate DATE,
    patient_uuid VARCHAR, person_voided BOOLEAN
);
CREATE TABLE encounters (
    encounter_id BIGINT PRIMARY KEY, encounter_voided BOOLEAN, location VARCHAR,
    encounter_datetime TIMESTAMP, encounter_type VARCHAR, encounter_uuid VARCHAR, visit_uuid VARCHAR
);
CREATE TABLE orders (
    order_id BIGINT PRIMARY KEY, order_type_name VARCHAR, order_name VARCHAR, drug_name VARCHAR,
    encounter_uuid VARCHAR, order_action VARCHAR, voided BOOLEAN, date_activated TIMESTAMP, date_created TIMESTAMP
);
CREATE TABLE encounter_diagnoses (
    diagnosis_id BIGINT PRIMARY KEY, diagnosis_coded BIGINT, diagnosis_non_coded VARCHAR,
    encounter_id BIGINT, certainty VARCHAR, voided BOOLEAN
);
CREATE TABLE concepts (concept_id BIGINT, name VARCHAR, locale VARCHAR);

INSERT INTO patients VALUES
 (1, 'UVL ID: UVL2001', 'F', '2026-03-01', 'p-1', false),   -- infant
 (2, 'UVL ID: UVL2002', 'M', '2023-01-01', 'p-2', false),   -- 3 years
 (3, 'UVL ID: UVL2003', 'F', '2016-01-01', 'p-3', false),   -- 10 years
 (4, 'UVL ID: UVL2004', 'M', '1980-01-01', 'p-4', false),   -- adult
 (5, 'UVL ID: UVL2005', 'F', NULL,         'p-5', false),   -- unknown age
 (6, 'UVL ID: UVL2006', 'F', '1980-01-01', 'p-6', true);    -- voided person

INSERT INTO visits VALUES
 (1, false, 'Accueil-Triage (REG-TRI)', '2026-08-20 08:00', '2026-08-20 17:00', 'Case Type: New case / Origin: Referred from health centre', 'F', '2026-03-01', 'v-1', 'p-1'),
 (2, false, 'Accueil-Triage (REG-TRI)', '2026-09-02 08:00', '2026-09-02 17:00', 'Case Type: Old case', 'M', '2023-01-01', 'v-2', 'p-2'),
 (3, false, 'Accueil-Triage (REG-TRI)', '2026-09-03 08:00', '2026-09-03 17:00', NULL, 'F', '2016-01-01', 'v-3', 'p-3'),
 (4, false, 'Hospitalisation (IPD)',    '2026-09-05 08:00', '2026-09-09 10:00', 'Case Type: New case', 'M', '1980-01-01', 'v-4', 'p-4'),
 (5, false, 'Accueil-Triage (REG-TRI)', '2026-09-06 08:00', NULL, NULL, 'F', NULL, 'v-5', 'p-5'),
 (6, false, 'Accueil-Triage (REG-TRI)', '2026-09-06 08:00', NULL, 'Case Type: New case', 'F', '1980-01-01', 'v-6', 'p-6'),
 (7, true,  'Accueil-Triage (REG-TRI)', '2026-09-07 08:00', NULL, 'Case Type: New case', 'F', NULL, 'v-7', 'p-5');

INSERT INTO encounters VALUES
 (11, false, 'Bureau médical (MedCo)', '2026-08-20 09:00', 'Outpatient Consultation', 'e-11', 'v-1'),
 (21, false, 'Bureau médical (MedCo)', '2026-09-02 09:00', 'Outpatient Consultation', 'e-21', 'v-2'),
 (22, false, 'Consultation externe (OPD)', '2026-09-02 11:00', 'Outpatient Consultation', 'e-22', 'v-2'),
 (31, false, 'Consultation externe (OPD)', '2026-09-03 09:00', 'Outpatient Consultation', 'e-31', 'v-3'),
 (41, false, 'Salle d''urgence (ER)', '2026-09-05 08:30', 'Outpatient Consultation', 'e-41', 'v-4'),
 (42, false, 'Hospitalisation (IPD)', '2026-09-05 10:00', 'Admission', 'e-42', 'v-4'),
 (43, false, 'Hospitalisation (IPD)', '2026-09-08 10:00', 'Discharge', 'e-43', 'v-4'),
 (51, false, 'Bureau médical (MedCo)', '2026-09-06 09:00', 'Outpatient Consultation', 'e-51', 'v-5'),
 (52, true,  'Bureau médical (MedCo)', '2026-09-06 10:00', 'Outpatient Consultation', 'e-52', 'v-5'),
 (61, false, 'Bureau médical (MedCo)', '2026-09-06 09:00', 'Outpatient Consultation', 'e-61', 'v-6'),
 (71, false, 'Bureau médical (MedCo)', '2026-09-07 09:00', 'Outpatient Consultation', 'e-71', 'v-7');

INSERT INTO orders VALUES
 (1, 'Test Order', 'Malaria RDT', NULL, 'e-21', 'NEW', false, '2026-09-02 09:10', NULL),
 (2, 'Test Order', 'Hemoglobin',  NULL, 'e-31', 'NEW', false, '2026-09-03 09:10', NULL),
 (3, 'Test Order', 'Hemoglobin',  NULL, 'e-31', 'REVISE', false, '2026-09-03 09:20', NULL),
 (4, 'Test Order', 'Hemoglobin',  NULL, 'e-31', 'NEW', true, '2026-09-03 09:30', NULL),
 (5, 'Radiology Order', 'Chest X-ray', NULL, 'e-41', 'NEW', false, '2026-09-05 08:40', NULL),
 (6, 'Radiology Order', 'Échographie abdominale', NULL, 'e-41', 'NEW', false, '2026-09-05 08:45', NULL),
 (7, 'Procedure Order', 'Césarienne', NULL, 'e-42', 'NEW', false, '2026-09-05 11:00', NULL),
 (8, 'Test Order', 'Malaria RDT', NULL, 'e-61', 'NEW', false, '2026-09-06 09:10', NULL);

INSERT INTO concepts VALUES (900, 'Severe acute malnutrition', 'en'), (901, 'Malaria', 'en');
INSERT INTO encounter_diagnoses VALUES
 (1, 900, NULL, 11, 'CONFIRMED', false),
 (2, 901, NULL, 21, 'CONFIRMED', false),
 (3, 901, NULL, 22, 'CONFIRMED', false),   -- same diagnosis twice in one visit: counted once
 (4, 901, NULL, 31, 'PRESUMED', false),    -- presumed: excluded
 (5, 901, NULL, 41, 'CONFIRMED', false),
 (6, 900, NULL, 51, 'CONFIRMED', true);    -- voided: excluded
