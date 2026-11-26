CREATE TABLE account_payment (
    `id` INT,
    `move_id` INT,
    `payment_type` VARCHAR,
    `partner_type` VARCHAR,
    `partner_id` INT,
    `amount` DOUBLE,
    `is_reconciled` BOOLEAN,
    PRIMARY KEY (`id`) NOT ENFORCED
)
