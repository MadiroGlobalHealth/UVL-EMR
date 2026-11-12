# Product tags (Odoo `product.product`, `product_tag_ids`)

Loaded by the `product_tags` entry of `../initializer_config.json`, after the products
(`../product_variant/`). Only `.csv` files here are read. Each row names a product by its
external id and the tags it carries; the tags replace whatever tags the product had.
The tags themselves come from UVL-Odoo-Addons.

## `theatre-acts-issue627.csv`: anaesthesia priced from the surgical act (#627)

The hospital price list bills an anaesthesia act at 50% of the surgical act
(« TARIFICATION UVL », « Actes d'anesthésie : 50% de l'acte de chirurgie »). The
`uvl_anaesthesia_pricing` addon applies it on the quotation, to the products tagged:

| Tag (external id) | Products |
|---|---|
| `uvl_anaesthesia_pricing.product_tag_anaesthesia_act` « Acte d'anesthésie » | ANE401–ANE406 |
| `uvl_anaesthesia_pricing.product_tag_surgical_act` « Acte chirurgical » | the major, intermediate and minor surgery of `procedures.csv`: codes 1xx, 2xx and 3xx of DEN, DIG, END, GO, MED, OPH, ORL, ORT and URG |

Left out: the 4xx « acts » (consultations, endoscopies, extractions, deliveries…),
ANE499 and the ANE1xx–3xx catch-alls, and every procedure without a code.

The file has no name column on purpose: the importer would write it back over the
product's name. To review it, join on `id` with `../product_variant/procedures.csv`.

The surgical acts of #596 (`procedures-issue596.csv`) are not in this file yet: a row
whose product does not exist makes the importer try to create one, which fails and
drops the whole file. Add them once #596 is merged.

The file loads once (the initializer keeps its checksum). After that the team retags a
product in Odoo, on the product form, field **Étiquettes de modèle de produit** (« Product Template Tags »); a later change to this file
reloads it and puts its rows' tags back.
