SELECT
    m.bed_patient_assignment_map_id AS bed_assignment_id,
    m.uuid AS bed_assignment_uuid,
    m.bed_id AS bed_id,
    pe.uuid AS patient_uuid,
    e.uuid AS encounter_uuid,
    m.date_started AS date_started,
    m.date_stopped AS date_stopped,
    m.voided AS voided
FROM
    bed_patient_assignment_map m
    LEFT JOIN person pe ON pe.person_id = m.patient_id
    LEFT JOIN encounter e ON e.encounter_id = m.encounter_id
