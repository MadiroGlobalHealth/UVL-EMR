# Per-product insurance coverage (Odoo `insurance.product.coverage`)

Loaded by the `insurance_coverage` entry of `../initializer_config.json`, after the
products and the plans (`../partner/insurance_plans.csv`). Only `.csv` files here are read.
This folder holds no CSV yet: the per-product terms are part of the fee schedule Didier
still owes (#184, #246).

Until a product has a row, each plan pays its **default coverage** (the
`insurance_default_coverage` column of `insurance_plans.csv`) on the full line. A row
always wins over the default, so a product a plan excludes needs a row at 0%.

## Format

One row per plan and product (the pair is unique):

```csv
id,insurance_id/id,product_id/id,coverage_percentage,covered_base_mode,covered_base_amount
init.coverage_mfp_<product>,init.insurance_plan_mfp,init.<product uuid>,80,amount,15200
init.coverage_mfp_<glove product>,init.insurance_plan_mfp,init.<product uuid>,0,full,
```

- `product_id/id` is the product's external id from `../product_variant/*.csv`
  (`init.<OpenMRS concept or drug uuid>`).
- `covered_base_mode`: `full` = the percentage applies to the whole line; `amount` = it
  applies to at most `covered_base_amount` per unit, and the rest is a co-payment the base
  plan never pays (Didier's Case 1, 31 Jul 2026 on #184: Clavox 30,000 BIF, 15,200 covered
  at 80%).

Odoo's importer silently skips a file it cannot read and still records its checksum, so
check the rows in Odoo after a change, and clear the file's checksum if it was loaded before
the addon was installed.
