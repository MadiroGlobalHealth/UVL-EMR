SELECT
    provider.provider_id AS provider_id,
    provider.uuid AS provider_uuid,
    person.uuid AS person_uuid,
    CASE
        WHEN person_name.person_name_id IS NULL THEN provider.name
        ELSE CONCAT_WS(' ', person_name.given_name, person_name.family_name)
    END AS provider_name,
    provider.identifier AS provider_identifier,
    provider.retired AS provider_retired
FROM
    provider
    LEFT JOIN person person ON provider.person_id = person.person_id
    LEFT JOIN person_name person_name ON provider.person_id = person_name.person_id AND person_name.voided = false AND person_name.preferred = true
