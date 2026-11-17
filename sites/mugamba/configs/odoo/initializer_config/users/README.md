# Odoo users (`res.users`)

Loaded by the `users` entry of `../initializer_config.json`. Only `.csv` files here are read.
The configurable entries run after the built-in loaders, so French (`../language`, from the
distro) is already active when these rows load.

## `bridge-user-lang-issue740.csv` (#740)

The eip-odoo-openmrs bridge signs in to Odoo as `ODOO_USER`, which is `admin` (the
`base.user_admin` record). Odoo writes chatter messages in the language of the user who
acts, so with `admin` in English every quote the bridge created read « Sales Order created ».
This file sets that user to `fr_FR`: new quotes read « Bon de commande créé ». Messages
already written stay as they are. It also makes the Odoo screens French when signing in as
`admin`, and patient contacts the bridge creates default to French.

Only `id` and `lang` are set, so nothing else about the user changes. Odoo applies the file
once (by checksum); to apply it again, delete its checksum under `/mnt/checksums/` and
restart `odoo`.
