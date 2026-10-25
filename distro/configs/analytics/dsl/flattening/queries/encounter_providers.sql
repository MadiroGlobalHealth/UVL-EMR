SELECT
    encounter_provider.encounter_provider_id AS encounter_provider_id,
    encounter.uuid AS encounter_uuid,
    encounter_provider.provider_id AS provider_id,
    provider.uuid AS provider_uuid,
    CASE
        WHEN person_name.person_name_id IS NULL THEN provider.name
        ELSE CONCAT_WS(' ', person_name.given_name, person_name.family_name)
    END AS provider_name,
    encounter_role.name AS encounter_role,
    encounter_provider.voided AS encounter_provider_voided
FROM
    encounter_provider
    LEFT JOIN encounter encounter ON encounter_provider.encounter_id = encounter.encounter_id
    LEFT JOIN provider provider ON encounter_provider.provider_id = provider.provider_id
    LEFT JOIN person_name person_name ON provider.person_id = person_name.person_id AND person_name.voided = false AND person_name.preferred = true
    LEFT JOIN encounter_role encounter_role ON encounter_provider.encounter_role_id = encounter_role.encounter_role_id
