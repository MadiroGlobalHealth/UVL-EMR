CREATE TABLE account_partial_reconcile (
    `id` INT,
    `debit_move_id` INT,
    `credit_move_id` INT,
    `amount` DOUBLE,
    `max_date` DATE,
    PRIMARY KEY (`id`) NOT ENFORCED
)
