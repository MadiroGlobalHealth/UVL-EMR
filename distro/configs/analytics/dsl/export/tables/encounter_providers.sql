CREATE TABLE encounter_providers (
    encounter_provider_id BIGINT,
    encounter_uuid VARCHAR,
    provider_id BIGINT,
    provider_uuid VARCHAR,
    provider_name VARCHAR,
    encounter_role VARCHAR,
    encounter_provider_voided BOOLEAN
)
