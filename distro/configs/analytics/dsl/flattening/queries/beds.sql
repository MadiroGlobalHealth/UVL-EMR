SELECT
    b.bed_id AS bed_id,
    b.uuid AS bed_uuid,
    b.bed_number AS bed_number,
    b.status AS status,
    bt.name AS bed_type,
    l.location_id AS location_id,
    l.uuid AS location_uuid,
    l.name AS location,
    b.voided AS voided
FROM
    bed b
    LEFT JOIN bed_location_map blm ON blm.bed_id = b.bed_id
    LEFT JOIN location l ON l.location_id = blm.location_id
    LEFT JOIN bed_type bt ON bt.bed_type_id = b.bed_type_id
