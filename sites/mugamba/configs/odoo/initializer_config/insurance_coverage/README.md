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
| MFP | non-sterile gloves, sterile gloves, taking vital signs, the ophthalmology consultation (done by an ophthalmic technician, 18 Nov 2026), and four consumables MFP does not reimburse (19 Nov 2026: the 90 cm gauze roll, ultrasound gel, the packaging sachets, « Seringue bilatérale »): not covered, the patient pays the clinic price | `mfp-issue184.csv`, rows at 0 |
| MSU category B | 70%, patient 30% | plan « MSU catégorie B (70 %) », Payer answer « MSU 70% » |
| MSU category C | 60%, patient 40% | plan « MSU catégorie C (60 %) », Payer answer « MSU 60% » |
| Santé Assuré | 80%, patient 20% | plan default |
| DGAC | 100% (private insurer, 13 Nov 2026) | plan default |
| CAM | State 80%, patient 20% | plan default |
| MFP | medicines: 80% of at most MFP's reference price per unit; the patient pays the rest | `mfp-medicines-ceiling-issue184.csv`, `amount` rows |
| MFP | acts, consultations, bed-days, certificates: 80% of at most MFP's price | `mfp-acts-ceiling-issue184.csv`, `amount` rows |
| MFP | consumables: 70% (bandages and compresses 80%) of at most MFP's 2011 price per item | `mfp-issue184.csv`, rows in `amount` mode |
| MFP | laboratory tests: 80% of at most the nomenclature's price, coefficient B × 300 BIF (19 Nov 2026); the price of MFP's laboratory list (PRIX 2011) only for a test the nomenclature does not have | `mfp-acts-ceiling-issue184.csv`, `amount` rows |
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
compresses, catheters, sutures, intubation tube, ...). The three kinds of gloves, and the four
consumables MFP does not reimburse, are rows at 0 instead. « Propofol Injection » has a row too:
it is a medicine, but MFP prices it in its device list, at 70% (19 Nov 2026). A new consumable
product needs a row here, or MFP pays it at 80%.

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
  width). A bandage or compress with no line in the list stays at 70%.
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
  urinaire », which the clinic does not sell: see below).
- `yes, value open`: the line is right but the value is not settled (none today; « Ruban adhésif » was one until G11 was answered on 23 Nov 2026).
- `yes, nomenclature` (19 Nov 2026): a laboratory test both sources price differently; the
  nomenclature's coefficient is the price, and it is loaded.
- `yes, per unit` (19 Nov 2026): the product is sold as the very unit MFP prices (« 5/Tampon »):
  the ceiling is the printed price of one unit.

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
- « Consultation ophtalmologique » is **not covered by MFP**: it is done by an ophthalmic
  technician, whom MFP does not cover at present. It has a row at 0% in `mfp-issue184.csv`,
  like the gloves: the MFP patient pays the clinic price (3,000, unchanged), or PNB for a
  police officer. The other plans are untouched. When MFP covers the technician, or a
  specialist does the consultation, remove the row (and delete the coverage line in Odoo).
- « Soins locaux » is replaced, for MFP, by MFP's own two acts, which are in the catalogue
  since the fourth part: « Pansement simple » (nomenclature 1.7, K 2 = 2,000) and « Pansement
  complexe ou multiple » (1.8, K 3 = 3,000), each at 80% of at most that price. They are
  procedure concepts of OCL `uvl-custom` (7959334 and 7959335, members of « All procedures »,
  export `openmrs/initializer_config/ocl/UVL_procedures_20261119-184.zip`) with their products in
  `product_variant/procedures-issue184.csv`. A new product is created at 1 BIF, a placeholder,
  until Finance enters its price in Odoo. « Soins locaux » therefore stays as it was,
  orderable, at the plan's 80% without a ceiling: it is to be retired once the two acts have
  their prices.
- « Cathéter urinaire » is retired from the catalogue: the clinic's urinary catheters are the
  three Foley « Sonde urinaire » (N° 14, 16, 18). The drug is retired
  (`openmrs/initializer_config/drugs/uvl-drugs-issue184-retired.csv`) and its Odoo product
  archived (`product/uvl-drugs-issue184-archived.csv`), as the duplicates of #478: past
  documents keep it, it can no longer be prescribed or sold. Its row in `mfp-issue184.csv`
  (70%, no ceiling) stays, so the file still describes what Odoo holds.

**Anaesthesia is not loaded.** MFP pays the anaesthesia at 25% of the surgical act that
required it (nomenclature 2.2, confirmed). That is a share of another line of the same
invoice, and our anaesthesia products (ANE401 to ANE499) are the same whatever the operation;
`covered_base_amount` is one fixed price per product, so the rule cannot be written here. Until
it can, MFP pays 80% of the clinic price of the anaesthesia.

### The complete device list (19 Nov 2026)

The first scan of the device list lacked N° 73 to 150 and everything after 520. On 19 Nov 2026
the product owner sent a legible scan of all of it, « Tarifs des dispositifs médicaux
remboursables par la mutuelle, à partir du 1er juin 2011 » (18 pages of lines, N° 1 to 668; the
page itself jumps from 103 to 108). It is transcribed by hand in
`sites/mugamba/requirements/mfp-device-list-20261119.csv` (no, name, price, rate, page, reading,
note); the scan stays off the repository. `reading` is `low` for a cell read with any doubt
(a digit, a price written by hand over the printed one, the cut foot of a page): such a line is
never loaded. A line of it is referenced as « N:95 » in the matching file's `mfp_ref`.

- **Read again:** every line the workbook already had (N° 1 to 72 and 151 to 520) gives the same
  price and the same rate on the new scan, wherever both show a price. No ceiling or rate loaded
  before changes. `scripts/mfp-ceiling.py` keeps comparing: a workbook line (« D:… ») whose N° has
  another price or rate in the new list is not loaded (« two sources disagree »).
- **Rates:** the list's own rate is 80% on the bandages (N° 37 to 64), « COMPRESSE SIMPLE »,
  « COMPOSITE AUTOPOLYMERISANT », the two alcohols, « INJECTIONS INTRA-TUBULURE », « INCISION
  D'ABCES CHAUD » and the permanganate; 70% on every other line.
- **Loaded from it (7 consumables, at 70%):** « Cathéter G18 », « G22 » and « G24 » (2,230 each),
  « Tube à EDTA » and « Tube sec » (500: every collection tube of the list is 500), « Tube
  d'intubation » (10,150: every intubation tube of the list), « Jeu de perfusion » (« TROUSSE DE
  PERFUSION », 500).
- **Not loaded, asked:** a product that could be several lines. « Cathéter Pédiatrique », the Pogal sutures N° 1 and 2
  (Etylon as for 2/0 and 3/0, or Vicryl), « Pansement Ombilical », « Compresses Abdominales »,
  « Coton hydrophile 500g », « Tampon d'ouate » (MFP prices one tampon, « 5/Tampon »), and the two
  suture products that name no thread and no size.
- **No line at all** in the complete list: « Tulle Gras », « Gel Echographique », « Seringue
  bilatérale », « Rouleau de gaze 90 cm x 91 m », the packaging sachets, and the gloves (which
  MFP does not cover anyway). They keep 70% of the clinic price. The list adds no line for any
  act that had none.

### The product owner's answers of 19 Nov 2026 (tab G, G72 to G117)

The questions the complete device list and the laboratory list left open came back answered.
They were read by hand into the matching file (`answer_ref`, `answer`, `confirmed`, and the
reading in `reason`); 29 more products get a ceiling, 288 in all.

- **Loaded:** « Cathéter Pédiatrique » as « CATHETER G24 » (2,230 at 70%); the Pogal sutures
  N° 1 and N° 2 at 3,500 like the other « ETYLON SERTI » lines (the list has no « ETYLON SERTI
  2 »: the nearest size is referenced), at 70% as the Pogal 2/0 and 3/0; « Pansement Ombilical »
  as « BANDE OMBILICALE » (1,360 at MFP's own 80%); « Tampon d'ouate », sold per swab, at the
  5 BIF MFP gives for one (`yes, per unit`); « Propofol Injection » as « DIPRIVAN 200MG »
  (11,030) at the device list's **70%**, not the medicines' 80%: it is the one medicine with a
  row in `mfp-issue184.csv`.
- **Not this line:** « Compresses Abdominales » are not capped as « COMPRESSE SIMPLE » (« non »):
  no ceiling, 70% of the clinic price.
- **Not reimbursed by MFP (0%):** « Rouleau de gaze 90 cm x 91 m », « Gel Echographique »,
  « Sachets pour le conditionnement des MEG » and « Seringue bilatérale ». The question was
  « MFP le rembourse-t-il, et à quel prix ? » and the answer « non »: their rows of
  `mfp-issue184.csv` are at 0, set by hand, like the ophthalmology consultation. The MFP patient
  pays the clinic price, or PNB for a police officer.
- **Still open, nothing loaded and nothing changed:** « Coton hydrophile 500g » (« oui » to a
  100 BIF ceiling on a 500 g pack, against the proposed « non »), « Solution de Povidone 100ml »
  (« par ml à 85bif », where the list prints 15 per ml), « Dettol Solution 1L » (« non », which
  could mean no ceiling or not reimbursed), « Tulle Gras » (« oui, » with no price), « Suture
  Non-Absorbable » (« NYLON », no size: 3,700 for most sizes, 5,600 or 1,450 for two), « Fils de
  Suture Chirurgicaux » (« NON » to « which thread and which size? »: not read as « not
  reimbursed », so it keeps 70%) and « Naloxone Injection » (no answer on the rate).
  Each keeps its answer in the matching file and a follow-up question in `question`.

### Two MFP sources for one laboratory test

The nomenclature prices a laboratory test as a coefficient B × 300 BIF; MFP's laboratory list
gives a price in francs. For a product both sources price, the matching file keeps the
nomenclature line in `mfp_ref` and the laboratory-list line in `other_ref` (« L:2.1.1 »). When
they agree (sedimentation rate, Emmel test: 1,500) the ceiling is loaded. When the two prices
differ, the script loads neither on its own.

**The rule since 19 Nov 2026 (answer G89, « non, le coefficient », and « consider the prices
for 2021 »): the nomenclature's coefficient is MFP's price for a laboratory test, not the 2011
laboratory list.** The 23 tests the two sources priced differently were each answered
« considérer actes médicaux » and are loaded at the coefficient's price (`confirmed` is
`yes, nomenclature`): stool examination 1,500 (the list said 1,750), malaria smear 2,250
(1,750), pregnancy test 7,500 (3,000), Widal 4,500 (4,350), CD4 count 7,500 (30,000), urine
culture 3,000 (4,800), « Prélèvement » 1,500 (500)... The price is higher than the list's for
14 of them and lower for 8; the urine examination (3,000) was three bracketed lines in the list.
Three things the rule does not settle are left as they were and asked:

- « BI07 - Hémoglobine »: its own answer is « LISTE DES EXAMENS », against the rule, and the
  list's 660 is an uncertain reading. Not loaded.
- The 22 tests **only the laboratory list prices** (the nomenclature received has no biochemistry,
  no rapid malaria test, no anti-HCV antibody) keep the ceiling loaded from that list on 18 Nov,
  when the match is certain and the reading `high`: removing a ceiling is the product owner's to
  say. `scripts/mfp-ceiling.py --confirm` lists them as one point to confirm.
- « NFS », bilirubin, the ionogram and « Test d'hémostase » were answered « considérer actes
  médicaux », but the nomenclature has no line for them as a whole (it prices the blood counts
  and « T.S », « T.C » apart, and has no biochemistry): no ceiling, and a follow-up question.

Lines MFP bracketed by hand (« NFS » around 1.2 to 1.9, « ECBU » around 5.2.1 to 5.2.3, the
ionogram's three ions) are referenced together (« L:6.25+6.26+6.27 ») and never added up
without the product owner. `scripts/mfp-ceiling.py --open-questions <csv>` writes what is
still open: one general question (does the laboratory list replace the coefficient?), each
conflict with both values, the uncertain laboratory matches and the open points above.

A medicine that appears in the device list at 70% is not loaded until the product owner says
which rate applies, medicines being paid at 80%: 70% for « Propofol » (19 Nov 2026, loaded);
« Naloxone » is still to be answered. Nor
is a line priced per ml or per metre (« ALCOOL DENATURE » 7/ml, « ISOBETADINE » 15/ml,
« DETTOL DILUE » 0,5/ml, « JERSEY » 1000/m): the reading is confirmed, but the ceiling of a
bottle or a piece sold whole is that price times a content nobody has confirmed. A product sold
as the unit itself is different: « Tampon d'ouate », per swab, is capped at « 5/Tampon ».

To change a match, edit the product's row of the matching file (`mfp_ref`, `other_ref`,
`confidence`, `confirmed`) and run `python3 scripts/mfp-ceiling.py '<workbook>.xlsx'`: it
rewrites the matching file's values from the workbook, the laboratory list and the device list,
`mfp-acts-ceiling-issue184.csv` (acts, radiology, laboratory tests), and the consumables'
rows of `mfp-issue184.csv`. The build (`scripts/check-insurance-coverage.groovy`) fails if the
coverage files and the matching file disagree (a ceiling, a rate, or a product the matching
says MFP does not cover whose row is not at 0), or if a coverage file has a row Odoo would
reject (an unknown product or plan, a second row for the same plan and product).

### « Ruban adhésif » (answer G11, 23 Nov 2026)

« Quelle largeur vend la pharmacie ? » was answered « (b) 8 cm : 2 740 »: « Ruban adhésif » is
MFP's « BANDE ADHESIVE 8CM » (N° 38 of the device list), 80% of at most 2,740 BIF. Its row in
`mfp-issue184.csv` was at 80% without a ceiling; it is now in `amount` mode. The price is not
changed. The other adhesive lines of the list (« SPARADRAP », « LEUCOPLASTE », « ELASTOPLASTE »)
were not retained by the answer.

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
