CREATE TABLE `sale_order` (
    `id` INT,
    `partner_id` INT,
    `pricelist_id` INT,
    `amount_total` DECIMAL(10),
    `invoice_status` VARCHAR,
    `name` VARCHAR,
    `note` VARCHAR,
    `state` VARCHAR,
    PRIMARY KEY (`id`) NOT ENFORCED
)