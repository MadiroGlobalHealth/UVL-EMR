-- Fixture for scripts/superset/test-visits-sql.sh (UVL-EMR#205, #222, #239).
-- Synthetic records only (no patient data): the flattened analytics tables the
-- visits dataset reads, with the columns it uses, laid out as the flattening
-- job writes them (identifiers "type: value, ...", attributes "name: value / ...").

CREATE TABLE visits (
    visit_id BIGINT PRIMARY KEY, visit_voided BOOLEAN, location VARCHAR,
    date_started TIMESTAMP, type VARCHAR, visit_attributes VARCHAR,
    patient_gender VARCHAR, patient_birthdate DATE, patient_age_at_visit NUMERIC(24,0),
    visit_uuid VARCHAR, patient_uuid VARCHAR, creator_uuid VARCHAR
);
CREATE TABLE patients (
    patient_id BIGINT PRIMARY KEY, given_name VARCHAR, middle_name VARCHAR, family_name VARCHAR,
    identifiers VARCHAR, gender VARCHAR, birthdate DATE, patient_uuid VARCHAR,
    address_city VARCHAR, address_county_district VARCHAR, address_state_province VARCHAR,
    address_1 VARCHAR, attributes VARCHAR, date_created TIMESTAMP, person_voided BOOLEAN
);
CREATE TABLE encounters (
    encounter_id BIGINT PRIMARY KEY, encounter_voided BOOLEAN, location VARCHAR,
    encounter_datetime TIMESTAMP, encounter_type VARCHAR, encounter_uuid VARCHAR,
    visit_uuid VARCHAR, patient_uuid VARCHAR, creator_uuid VARCHAR
);
CREATE TABLE observations (
    obs_id BIGINT PRIMARY KEY, obs_voided BOOLEAN, question_label VARCHAR, question_mapping VARCHAR,
    answer_coded VARCHAR, answer_text VARCHAR, visit_uuid VARCHAR, patient_uuid VARCHAR
);
CREATE TABLE encounter_diagnoses (
    diagnosis_id BIGINT PRIMARY KEY, diagnosis_coded BIGINT, diagnosis_non_coded VARCHAR,
    encounter_id BIGINT, certainty VARCHAR, voided BOOLEAN
);
CREATE TABLE concepts (
    concept_id BIGINT, uuid VARCHAR, name VARCHAR, locale VARCHAR, retired BOOLEAN
);
CREATE TABLE orders (
    order_id BIGINT PRIMARY KEY, patient_uuid VARCHAR, order_type_name VARCHAR, order_name VARCHAR,
    concept_uuid VARCHAR, orderer INT, encounter_uuid VARCHAR, order_action VARCHAR,
    voided BOOLEAN, drug_name VARCHAR, drug_uuid VARCHAR
);
CREATE TABLE sale_order_lines (
    sale_order_line_id BIGINT PRIMARY KEY, product_external_id VARCHAR, subtotal NUMERIC,
    line_creation_date TIMESTAMP, customer_uuid VARCHAR, pricelist VARCHAR, order_state VARCHAR
);
-- As created by liquibase changelog 0005-encounter_providers_tbl.xml.
CREATE TABLE encounter_providers (
    encounter_provider_id BIGINT PRIMARY KEY, encounter_uuid VARCHAR, provider_id BIGINT,
    provider_uuid VARCHAR, provider_name VARCHAR, encounter_role VARCHAR,
    encounter_provider_voided BOOLEAN
);
CREATE TABLE providers (
    provider_id BIGINT PRIMARY KEY, provider_uuid VARCHAR, person_uuid VARCHAR,
    provider_name VARCHAR, provider_identifier VARCHAR, provider_retired BOOLEAN
);

INSERT INTO patients VALUES
 (1, 'Testa', NULL, 'Alpha', 'UVL ID: UVL1001, Burundi CNI: 12.345/678.901, Legacy ID: OLD-77',
  'F', '1990-01-01', 'pat-1', 'Zone A', 'Commune A', 'Province A', 'Colline A',
  'Chef de ménage: Testeur Chef / Insurance Coverage Tier: Insurance 80%', '2026-09-01', false),
 (2, 'Testb', 'Mid', 'Beta', 'UVL ID: UVL1002', 'M', '2020-05-05', 'pat-2',
  NULL, NULL, NULL, NULL, NULL, '2026-09-01', false),
 (3, 'Testc', NULL, 'Gamma', 'OpenMRS ID: 10003-X', 'F', '1985-03-03', 'pat-3',
  NULL, NULL, NULL, NULL, 'Occupation: Farmer', '2026-09-01', false);

INSERT INTO visits VALUES
 -- v1: opened at triage; OPD consultation at Bureau medical, later inpatient consultation.
 (1, false, 'Accueil-Triage (REG-TRI)', '2026-09-10 08:00', 'Facility Visit',
  'Case Type: New case / Consultation type: General consultation / Disease Category: Infectious / Payer: Supplementary insurance',
  'F', '1990-01-01', 36, 'v-1', 'pat-1', 'u-1'),
 -- v2: two outpatient consultations; the most recent (OPD) wins.
 (2, false, 'Accueil-Triage (REG-TRI)', '2026-09-11 08:00', 'Facility Visit',
  'Payer: CAM', 'M', '2020-05-05', 6, 'v-2', 'pat-2', 'u-1'),
 -- v3: no consultation encounter, no payer.
 (3, false, 'Salle d''urgence (ER)', '2026-09-12 08:00', 'Facility Visit', NULL,
  'F', '1985-03-03', 41, 'v-3', 'pat-3', 'u-1'),
 -- v4: voided visit, never reported.
 (4, true, 'Accueil-Triage (REG-TRI)', '2026-09-12 09:00', 'Facility Visit', NULL,
  'F', '1985-03-03', 41, 'v-4', 'pat-3', 'u-1'),
 -- v5: inpatient consultation only.
 (5, false, 'Hospitalisation (IPD)', '2026-09-13 08:00', 'Facility Visit', NULL,
  'F', '1985-03-03', 41, 'v-5', 'pat-3', 'u-1');

INSERT INTO encounters VALUES
 (11, false, 'Accueil-Triage (REG-TRI)', '2026-09-10 08:05', 'Vitals', 'e-11', 'v-1', 'pat-1', 'u-1'),
 (12, false, 'Bureau médical (MedCo)', '2026-09-10 09:00', 'Outpatient Consultation', 'e-12', 'v-1', 'pat-1', 'u-2'),
 (13, false, 'Hospitalisation (IPD)', '2026-09-10 15:00', 'Inpatient Consultation', 'e-13', 'v-1', 'pat-1', 'u-2'),
 (21, false, 'Bureau médical (MedCo)', '2026-09-11 09:00', 'Outpatient Consultation', 'e-21', 'v-2', 'pat-2', 'u-2'),
 (22, false, 'Consultation externe (OPD)', '2026-09-11 11:00', 'Outpatient Consultation', 'e-22', 'v-2', 'pat-2', 'u-3'),
 (23, true,  'Salle d''urgence (ER)', '2026-09-11 12:00', 'Outpatient Consultation', 'e-23', 'v-2', 'pat-2', 'u-3'),
 (31, false, 'Salle d''urgence (ER)', '2026-09-12 08:10', 'Vitals', 'e-31', 'v-3', 'pat-3', 'u-1'),
 (51, false, 'Hospitalisation (IPD)', '2026-09-13 09:00', 'Inpatient Consultation', 'e-51', 'v-5', 'pat-3', 'u-2');

INSERT INTO encounter_providers VALUES
 (101, 'e-12', 1, 'prov-1', 'Docteur Alpha', 'Clinician', false),
 (102, 'e-12', 9, 'prov-9', 'Ancien Provider', 'Clinician', true),   -- voided: excluded
 (103, 'e-13', 2, 'prov-2', 'Docteur Beta', 'Clinician', false),
 (104, 'e-21', 1, 'prov-1', 'Docteur Alpha', 'Clinician', false),
 (105, 'e-22', 2, 'prov-2', 'Docteur Beta', 'Clinician', false),
 (106, 'e-51', 2, 'prov-2', 'Docteur Beta', 'Clinician', false);

INSERT INTO providers VALUES
 (1, 'prov-1', 'per-1', 'Docteur Alpha', 'DR-1', false),
 (2, 'prov-2', 'per-2', 'Docteur Beta', 'DR-2', false);

INSERT INTO orders VALUES
 (1001, 'pat-1', 'Drug Order', 'Paracetamol', 'c-para', 1, 'e-12', 'NEW', false, 'Paracetamol 500mg', 'd-para'),
 (1002, 'pat-1', 'Drug Order', 'Amoxicillin', 'c-amox', 2, 'e-13', 'NEW', false, 'Amoxicillin 500mg', 'd-amox'),
 (1003, 'pat-1', 'Test Order', 'Malaria RDT', 'c-rdt', 1, 'e-12', 'NEW', false, NULL, NULL),
 (2001, 'pat-2', 'Drug Order', 'ORS', 'c-ors', 2, 'e-22', 'NEW', false, 'ORS sachet', 'd-ors');

INSERT INTO concepts VALUES (500, 'c-mal', 'Malaria', 'en', false);
INSERT INTO encounter_diagnoses VALUES (1, 500, NULL, 12, 'CONFIRMED', false);

INSERT INTO observations VALUES
 (1, false, 'Chief complaint (text)', NULL, NULL, 'Fever', 'v-1', 'pat-1');

INSERT INTO sale_order_lines VALUES
 (1, 'd-para', 1000, '2026-09-10 10:00', 'pat-1', 'Insurance 80%', 'sale'),
 (2, 'c-rdt',  2000, '2026-09-10 10:00', 'pat-1', 'Insurance 80%', 'sale'),
 (3, 'd-ors',   500, '2026-09-11 11:30', 'pat-2', 'Public Pricelist', 'sale');
