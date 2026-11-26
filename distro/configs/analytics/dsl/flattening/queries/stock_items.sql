SELECT
    i.stock_item_id AS stock_item_id,
    i.uuid AS stock_item_uuid,
    i.drug_id AS drug_id,
    d.uuid AS drug_uuid,
    d.name AS drug_name,
    i.concept_id AS concept_id,
    i.common_name AS common_name,
    i.acronym AS acronym,
    i.is_drug AS is_drug,
    i.has_expiration AS has_expiration,
    i.expiry_notice AS expiry_notice_days,
    i.reorder_level AS reorder_level,
    i.purchase_price AS purchase_price,
    i.dispensing_unit_id AS dispensing_unit_concept_id,
    COALESCE(ufr.name, uen.name) AS dispensing_unit,
    i.category_id AS category_concept_id,
    i.level_of_use AS level_of_use,
    i.voided AS voided
FROM
    stockmgmt_stock_item i
    LEFT JOIN drug d ON d.drug_id = i.drug_id
    LEFT JOIN concept_name ufr ON ufr.concept_id = i.dispensing_unit_id
                              AND ufr.locale = 'fr' AND ufr.concept_name_type = 'FULLY_SPECIFIED' AND ufr.voided = false
    LEFT JOIN concept_name uen ON uen.concept_id = i.dispensing_unit_id
                              AND uen.locale = 'en' AND uen.concept_name_type = 'FULLY_SPECIFIED' AND uen.voided = false
