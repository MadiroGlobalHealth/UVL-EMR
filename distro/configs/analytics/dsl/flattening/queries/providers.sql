SELECT
    p.provider_id AS provider_id,
    p.uuid AS provider_uuid,
    COALESCE(NULLIF(TRIM(p.name), ''),
             NULLIF(TRIM(CONCAT(COALESCE(pn.given_name, ''), ' ', COALESCE(pn.family_name, ''))), '')) AS name,
    p.identifier AS identifier,
    pe.uuid AS person_uuid,
    p.retired AS retired
FROM
    provider p
    LEFT JOIN person pe ON pe.person_id = p.person_id
    LEFT JOIN person_name pn ON pn.person_id = p.person_id
                            AND pn.voided = false
