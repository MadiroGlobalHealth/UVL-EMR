SELECT
    a.id AS account_id,
    a.code AS code,
    COALESCE(JSON_VALUE(a.name, '$.fr_FR'), JSON_VALUE(a.name, '$.en_US'), a.name) AS name,
    a.account_type AS account_type,
    a.reconcile AS reconcile
FROM
    account_account a
