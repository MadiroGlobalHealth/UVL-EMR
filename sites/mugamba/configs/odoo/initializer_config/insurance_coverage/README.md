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
| MFP | bandages, compresses and the umbilical band 80%, as MFP's device list shows (18 Nov 2026) | `mfp-issue184.csv`, rows at 80 |
| MFP | non-sterile gloves, sterile gloves, taking vital signs: not covered, the patient pays the clinic price | `mfp-issue184.csv`, rows at 0 |
| MSU category B | 70%, patient 30% | plan « MSU catégorie B (70 %) », Payer answer « MSU 70% » |
| MSU category C | 60%, patient 40% | plan « MSU catégorie C (60 %) », Payer answer « MSU 60% » |
| Santé Assuré | 80%, patient 20% | plan default |
| DGAC | 100% (private insurer, 13 Nov 2026) | plan default |
| CAM | State 80%, patient 20% | plan default |
| MFP | medicines: 80% of at most MFP's reference price per unit; the patient pays the rest | `mfp-medicines-ceiling-issue184.csv`, `amount` rows |
| MFP | acts, consultations, bed-days, certificates: 80% of at most MFP's price | `mfp-acts-ceiling-issue184.csv`, `amount` rows |
| MFP | consumables: 70% (bandages and compresses 80%) of at most MFP's 2011 price per item | `mfp-issue184.csv`, rows in `amount` mode |
| MFP | laboratory tests: 80% of at most the price of MFP's laboratory list (PRIX 2011) | `mfp-acts-ceiling-issue184.csv`, `amount` rows |
| PNB (police officers) | everything the base plan leaves: the co-payment, what MFP does not cover, the difference above MFP's price | complementary plan, 100% *of what the base plan leaves* |
| CMU (MSU members, 13 Nov 2026) | the MSU patient share: 30% in category B, 40% in category C | complementary plan, 100% *of what the base plan leaves* |

The MSU category is chosen per visit: it is the visit's Payer answer, which the bridge
maps to the plan with that `insurance_payer_code`. PNB and CMU are answers of the visit's
« Assurance complémentaire » question (concept « Payeur complémentaire »). Nothing in
Odoo stops CMU being picked with another payer than MSU: it then pays what that payer
leaves, like PNB.

### « Assurance privée » and the old « Assurance complémentaire » Payer answers (#581)

The product owner's answer of 11 Nov 2026: « Assurance privée » is a partnership with a
private insurer and « Assurance complémentaire » one with a supplementary insurer; both
bill the insurer. On 13 Nov he named them: the private insurers are DGAC, MSU (B and C)
and Santé Assuré, each already a Payer answer with its plan; the supplementary insurers
are PNB (with MFP) and CMU (with MSU), answers of the « Assurance complémentaire » question.
The two generic answers therefore have no plan of their own and are **removed from the
Payer list** (OCL `uvl-registration` 20261115-581, their Q-AND-A mappings retired). The
concepts themselves stay active, so a visit recorded with one of them still shows it,
and its quotation is still billed to the patient with the bridge's note. To bring an answer
back, unretire its mapping in OCL `uvl-custom` (1732 « Assurance privée », 1733
« Assurance complémentaire ») and release the collection again.

`mfp-issue184.csv` lists, as MFP's medical supplies and consumables (70%, or 80% for the
bandages and compresses MFP's device list gives at 80%), the 42 consumables of
the stock catalogue (product owner, 5 Oct 2026, #437 and #455) and 19 other products that
are plainly supplies (blood-collection needles and tubes, sample bottles, plain and abdominal
compresses, catheters, sutures, intubation tube, ...). The three kinds of gloves are rows at 0
instead. A new consumable product needs a row here, or MFP pays it at 80%.

## MFP price ceiling, medicines (`mfp-medicines-ceiling-issue184.csv`)

MFP sets its own price per item; when the clinic price is higher, the patient pays the
difference on top of the co-payment (PNB pays it for a police officer). This is the
`amount` covered base: MFP pays its percentage of at most `covered_base_amount` per unit,
and whatever the line costs above that is a co-payment the base plan never pays. So MFP
pays 80% × min(clinic unit price, MFP unit price) × quantity.

Source: MFP's « Liste des médicaments remboursables » 2026–2027 (1,798 items, product
owner, 13 Nov 2026), column « PRIX DE RÉFÉRENCE POUR LE REMBOURSEMENT », a price **per
pack**. Our drug products are sold per unit: a tablet, capsule, ampoule, suppository or
sachet; a bottle, tube or eye-drop vial. The unit price is the pack price divided by the
units in the PRESENTATION (« BTE 30 CES » → 30, « BTE 5 AMP 2ML » → 5, « FL 100ML » → 1),
rounded to the franc (BIF has no decimals in Odoo).

Only matches we are sure of are loaded (137 products): the same brand (or the generic
row for a generic product), the same form, the same strength and, for a bottle, the same
volume, with one unit price. The other drug products have no ceiling yet: MFP still pays
80% of the clinic price for them. The full matching sheet, with each product's candidates
and why it was not loaded, was handed to Joshua with the change (#184, 15 Nov 2026).

To add or change a ceiling, add or edit the product's row here (`covered_base_mode`
`amount`, the unit price in `covered_base_amount`). A product that is also in
`mfp-issue184.csv` must have a single row: Odoo rejects the whole file on a second
(plan, product) pair. A product whose MFP row is at 70% or 0% keeps that percentage.

## MFP price ceiling, acts and consumables (`mfp-acts-ceiling-issue184.csv`)

Same rule as for medicines: MFP pays its percentage of at most its own price; the patient
(or PNB for a police officer) pays the rest. Source: the product owner's file of 18 Nov 2026,
« TARIFS DES ACTES ET CONSOMMABLES MFP », transcribed from scans (not in the repository):

- **Acts:** the national nomenclature of the 2021 ordinance (Ordonnance conjointe
  N°630/540/207 du 01/03/2021). A coefficient such as « K 3 » is not a price: the price is
  the coefficient times its key letter's value (Article 4: K 1,000, R 1,000, N 800, B 300 BIF).
  « K 3 » is 3,000 BIF.
- **Consultations, bed-days, certificates:** the ordinance's own amounts (Articles 2, 5, 7).
  Beds use the district-hospital rates, the same as the national hospitals': a shared ward bed
  2,000 a day, a private room 10,000.
- **Consumables:** MFP's device list of 2011, « PRIX 2011 » per item, at the agreed 70%.
  MFP's list gives 80% for bandages, compresses and the umbilical band, and the product owner's
  answer of 18 Nov 2026 is to follow the list: a product matched with certainty to a line at
  80% is paid at 80%, with the ceiling when it is known and without it otherwise (« Ruban
  adhésif » is a « BANDE ADHESIVE », 6 or 8 cm: the rate is set, the ceiling waits for the
  width). A bandage or compress with no line in the pages received stays at 70%.
- **Laboratory tests:** MFP's « Examens de laboratoire remboursables par la mutuelle »
  (PRIX 2011, 80% on every line), six photographed pages received on 18 Nov 2026 and
  transcribed by hand in `sites/mugamba/requirements/mfp-lab-list-20261118.csv` (code, name,
  price, rate, page, reading, note). The pages were photographed at an angle: a price read
  with any doubt on its digits or on its row is marked `low` and is never loaded (all of
  page 1, and the faded foot of each page).

Which MFP line each product is, and how sure we are, is in
`sites/mugamba/requirements/mfp-acts-devices-matching-issue184.csv`. A product is loaded only
when the match is « exact » or « reviewed » and MFP's name and value were read clearly (the
transcriber marked doubtful readings in yellow), or when the product owner confirmed them
(below). The others, with a question for the product owner, are listed by
`scripts/mfp-ceiling.py --confirm`. Without a ceiling a product keeps its percentage of the
clinic price.

### The product owner's answers (18 Nov 2026)

The questions of the first round (119 uncertain matches, 60 doubtful readings, the general
rules) came back answered. Each answer is kept next to its product in the matching file:
`answer_ref` (its line in the sheet, « F9 », « G13 », with a follow-up « F11, G7 »), `answer`
(the text as given) and `confirmed`:

- `yes`: the match and the value are the product owner's; the ceiling is loaded.
- `no`: not this line, and no other; the product keeps its percentage of the clinic price
  (venous access placement, the incubator night, two of the abscess incisions, « Cathéter
  urinaire », which the clinic does not sell and is to be retired).
- `yes, value open`: the line is right but the value is not settled (« Ruban adhésif »).

`scripts/mfp-ceiling.py --answers <answers.json> --questions <tab F csv> <tab G csv>` finds
each answer's product again from the two question files that were sent, prints every pair so
it can be checked by eye, and fills `confirmed` for a plain « oui », « non » or « oui, <the
price shown> ». Any other answer is only copied: `confirmed` is then set by hand, with the
reading written in `reason`. Read that way on 18 Nov 2026:

- Sterile compresses 10×10 are capped as « COMPRESSE SIMPLE » (185): « non » to the first
  question, then « considérer compresse simple dans UVL aussi » to the follow-up.
- « IR injection » is MFP 1.24, « Injection intramusculaire ID, S/C, IV » (K 1): the answer
  was « non, considérer IM, IV, ID, S/C », every route that line names.
- « Prélèvement » is the laboratory's « Prélèvement veineux », not the act « Ponction
  veineuse »; the Pogal sutures 2/0 and 3/0 are capped as « ETYLON SERTI »; the three urinary
  catheters are Foley; circumcision is K 10 for the act alone (the answer adds « + 25 % » for
  the anaesthesia, which is not loaded).
- « Consultation ophtalmologique » has no MFP ceiling: it is done by an ophthalmic technician,
  whom MFP does not cover. It still gets the plan's 80%; whether MFP should pay 0% is asked.
- « Soins locaux » has no ceiling: it is to be replaced by two acts, « Pansement simple »
  (K 2 = 2,000) and « Pansement complexe ou multiple » (K 3 = 3,000). They need two new
  procedure concepts in OCL (`uvl-custom`, a release, the export in `openmrs/initializer_config/ocl/`),
  their rows in `product_variant/`, prices entered by Finance, and the old product retired.

**Anaesthesia is not loaded.** MFP pays the anaesthesia at 25% of the surgical act that
required it (nomenclature 2.2, confirmed). That is a share of another line of the same
invoice, and our anaesthesia products (ANE401 to ANE499) are the same whatever the operation;
`covered_base_amount` is one fixed price per product, so the rule cannot be written here. Until
it can, MFP pays 80% of the clinic price of the anaesthesia.

### Two MFP sources for one laboratory test

The nomenclature prices a laboratory test as a coefficient B × 300 BIF; MFP's laboratory list
gives a price in francs. For a product both sources price, the matching file keeps the
nomenclature line in `mfp_ref` and the laboratory-list line in `other_ref` (« L:2.1.1 »). When
the two prices differ **neither is loaded**, even where the product owner confirmed the
nomenclature value before the list arrived (stool examination 1,500 against 1,750, pregnancy
test 7,500 against 3,000, CD4 count 7,500 against 30,000). When they agree (sedimentation
rate, Emmel test: 1,500) the ceiling is loaded. A test only the laboratory list prices
(all of biochemistry) is loaded from it when the match is certain and the reading `high`.
Lines MFP bracketed by hand (« NFS » around 1.2 to 1.9, « ECBU » around 5.2.1 to 5.2.3, the
ionogram's three ions) are referenced together (« L:6.25+6.26+6.27 ») and never added up
without the product owner. `scripts/mfp-ceiling.py --open-questions <csv>` writes what is
still open: one general question (does the laboratory list replace the coefficient?), each
conflict with both values, the uncertain laboratory matches and the open points above.

A medicine that appears in the device list at 70% (« Propofol », « Naloxone ») is not loaded
either: medicines are paid at 80%, and which rate applies is the product owner's to say. Nor
is a line priced per ml or per metre (« ALCOOL DENATURE » 7/ml, « ISOBETADINE » 15/ml,
« DETTOL DILUE » 0,5/ml, « JERSEY » 1000/m): the reading is confirmed, but the ceiling of a
bottle or a piece sold whole is that price times a content nobody has confirmed.

To change a match, edit the product's row of the matching file (`mfp_ref`, `other_ref`,
`confidence`, `confirmed`) and run `python3 scripts/mfp-ceiling.py '<workbook>.xlsx'`: it
rewrites the matching file's values from the workbook and the laboratory list,
`mfp-acts-ceiling-issue184.csv` (acts, radiology, laboratory tests), and the consumables'
rows of `mfp-issue184.csv`. The build (`scripts/check-insurance-coverage.groovy`) fails if the
coverage files and the matching file disagree, or if a coverage file has a row Odoo would
reject (an unknown product or plan, a second row for the same plan and product).

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
