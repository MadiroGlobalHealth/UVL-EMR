SELECT
    j.id AS journal_id,
    j.code AS code,
    COALESCE(JSON_VALUE(j.name, '$.fr_FR'), JSON_VALUE(j.name, '$.en_US'), j.name) AS name,
    j.`type` AS `type`
FROM
    account_journal j
