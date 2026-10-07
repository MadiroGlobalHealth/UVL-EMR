-- Fixture for scripts/superset/test-service-activity-sql.sh (UVL-EMR#243). Synthetic records only.
CREATE TABLE encounters (
    encounter_id BIGINT PRIMARY KEY, encounter_voided BOOLEAN, location VARCHAR,
    encounter_datetime TIMESTAMP, encounter_type VARCHAR, form_name VARCHAR,
    patient_uuid VARCHAR, visit_uuid VARCHAR
);
INSERT INTO encounters VALUES
 (1, false, 'Hospitalisation (IPD)', '2026-09-01 08:00', 'Admission', NULL, 'p-1', 'v-1'),
 (2, false, 'Hospitalisation (IPD)', '2026-09-02 08:00', 'Inpatient Consultation', 'Inpatient form', 'p-1', 'v-1'),
 (3, false, 'Salle de césarienne', '2026-09-03 08:00', 'Admission', NULL, 'p-2', 'v-2'),
 (4, false, 'Soins maternels (accouchement normal)', '2026-09-03 09:00', 'Visit Note', 'Dossier accouchement', 'p-2', 'v-2'),
 (5, false, 'Bloc opératoire (OR)', '2026-10-01 08:00', 'Visit Note', NULL, 'p-3', 'v-3'),
 (6, false, 'Salle d''urgence (ER)', '2026-10-01 09:00', 'Outpatient Consultation', NULL, 'p-4', 'v-4'),
 (7, false, 'Bureau médical (MedCo)', '2026-10-01 10:00', 'Outpatient Consultation', NULL, 'p-5', 'v-5'),
 (8, true,  'Hospitalisation (IPD)', '2026-10-02 08:00', 'Admission', NULL, 'p-6', 'v-6'),
 (9, false, 'Bureau médical (MedCo)', '2026-10-02 08:00', 'Visit Note', 'Fiche nutrition', 'p-7', 'v-7'),
 (10, false, 'Salle néonatale', '2026-10-03 08:00', 'Admission', NULL, 'p-8', 'v-8');
