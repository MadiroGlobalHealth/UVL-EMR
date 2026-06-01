CREATE TABLE product_pricelist (
    `id` INT,
    `name` VARCHAR,
    `active` BOOLEAN,
    `currency_id` INT,
    `company_id` INT,
    PRIMARY KEY (`id`) NOT ENFORCED
)
