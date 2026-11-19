# Odoo default values (`ir.default`)

Loaded by the `defaults` entry of `../initializer_config.json`. Only `.csv` files here are read.
The configurable entries run after the built-in loaders, so French (`../language`, from the
distro) is already active when these rows load. The folder is not `default_value`: the
built-in loader of that name still targets `ir.values`, a model Odoo 17 no longer has.

## `partner-lang-issue809.csv` (#809)

A new customer (`res.partner`) takes its language from, in this order: the value sent, the
default stored in `ir.default`, the parent contact, the language of the request. When the
database is created Odoo stores a default for all companies, « en_US » unless `load_language`
says otherwise, so every customer the eip-odoo-openmrs bridge creates was in English although
the bridge works in French (#740) and all staff use French.

This file adds a default for the hospital's company (`base.main_company`): « fr_FR ». Odoo
reads a company's default before the one for all companies, so new customers are created in
French, whether by the bridge or in the screens. The « en_US » row is left in place and is
no longer read for this company.

- `json_value` is JSON: the value is `"fr_FR"` with its quotes, written `"""fr_FR"""` in CSV.
- Customers that already exist keep their language; this only applies at creation.
- A second company would need its own row.

Odoo applies the file once (by checksum); to apply it again, delete its checksum under
`/mnt/checksums/` and restart `odoo`.
