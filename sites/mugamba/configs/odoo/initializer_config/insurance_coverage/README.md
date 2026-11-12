# Per-product insurance coverage (Odoo `insurance.product.coverage`)

Loaded by the `insurance_coverage` entry of `../initializer_config.json`, after the
products and the plans (`../partner/insurance_plans.csv`). Only `.csv` files here are read.

Until a product has a row, each plan pays its **default coverage** (the
`insurance_default_coverage` column of `insurance_plans.csv`) on the full line. A row
always wins over the default, so a product a plan excludes needs a row at 0%.

## The payer rules (product owner's answers, 11 Nov 2026, #184)

| Plan | Rule | Where it is set |
|---|---|---|
| MFP | 80%, patient 20% | plan default |
| MFP | medical supplies and consumables 70%, patient 30% | `mfp-issue184.csv`, rows at 70 |
| MFP | non-sterile gloves, sterile gloves, taking vital signs: not covered, the patient pays the clinic price | `mfp-issue184.csv`, rows at 0 |
| MSU category B | 70%, patient 30% | plan « MSU catégorie B (70 %) », Payer answer « MSU 70% » |
| MSU category C | 60%, patient 40% | plan « MSU catégorie C (60 %) », Payer answer « MSU 60% » |
| Santé Assuré | 80%, patient 20% | plan default |
| CAM | State 80%, patient 20% | plan default |
| PNB (police officers) | everything the base plan leaves: the co-payment, what MFP does not cover | complementary plan, 100% *of what the base plan leaves* |

The MSU category is chosen per visit: it is the visit's Payer answer, which the bridge
maps to the plan with that `insurance_payer_code`. PNB is the visit's « Assurance
complémentaire » answer.

`mfp-issue184.csv` lists, as MFP's medical supplies and consumables, the 42 consumables of
the stock catalogue (product owner, 5 Oct 2026, #437 and #455) and 19 other products that
are plainly supplies (blood-collection needles and tubes, sample bottles, plain and abdominal
compresses, catheters, sutures, intubation tube, ...). The three kinds of gloves are rows at 0
instead. A new consumable product needs a row here, or MFP pays it at 80%.

## MFP price ceiling (not loaded yet)

MFP sets its own price per item; when the clinic price is higher, the patient pays the
difference on top of the co-payment (PNB pays it for a police officer). This is the
`amount` covered base: MFP pays its percentage of at most `covered_base_amount` per unit,
and whatever the line costs above that is a co-payment the base plan never pays. When MFP's
price list arrives, each priced product gets `covered_base_mode=amount` and
`covered_base_amount=<MFP price>` on its MFP row, keeping that row's percentage (70 for a
consumable, 80 otherwise). A product already in `mfp-issue184.csv` is updated in place (same
`id`); any other product gets a new row at 80. Nothing in the addon changes.

## Format

One row per plan and product (the pair is unique):

```csv
id,insurance_id/id,product_id/id,coverage_percentage,covered_base_mode,covered_base_amount
init.coverage_mfp_<product uuid>,init.insurance_plan_mfp,init.<product uuid>,70,full,
init.coverage_mfp_<product uuid>,init.insurance_plan_mfp,init.<product uuid>,80,amount,15200
```

- `product_id/id` is the product's external id from `../product_variant/*.csv`
  (`init.<OpenMRS concept or drug uuid>`).
- `covered_base_mode`: `full` = the percentage applies to the whole line; `amount` = it
  applies to at most `covered_base_amount` per unit, and the rest is a co-payment the base
  plan never pays (Didier's Case 1, 31 Jul 2026 on #184: Clavox 30,000 BIF, 15,200 covered
  at 80%).

Odoo's importer silently skips a file it cannot read and still records its checksum. One
unknown product id rejects the whole file, so check the rows in Odoo after a change
(the plan's « Assurance » tab, « Barème de couverture »), and clear the file's checksum if it was
loaded before the addon was installed.
