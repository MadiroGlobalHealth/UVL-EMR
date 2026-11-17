# Odoo users (`res.users`)

Loaded by the `users` entry of `../initializer_config.json`. Only `.csv` files here are read.
The configurable entries run after the built-in loaders, so French (`../language`, from the
distro) is already active when these rows load.

## `bridge-user-lang-issue740.csv` (#740)

The eip-odoo-openmrs bridge signs in to Odoo as `ODOO_USER`, which is `admin` (the
`base.user_admin` record). This file sets that user to `fr_FR`. Messages already written
stay as they are. Signing in to Odoo as `admin` also shows French screens.

Odoo builds the creation message as « %s created » from two parts:

- the verb, translated with `_()`. With no language in the request, `_()` falls back to the
  user's language, so this file makes it « créé »;
- the document name (`ir.model` name of `sale.order`). It is read in the request's
  language only, and with no language it is read in English (« Sales Order »).

So the bridge sends the user's language with its calls: after signing in, eip-odoo-openmrs
(`OdooClient`, #740) reads it once with `res.users` `context_get` and sends
`{"context": {"lang": "fr_FR"}}` on every create, write, unlink, search and search_read.
New quotes then read « Bon de commande créé ». If the language cannot be read, the bridge
calls without a context, as before, and the message is « Sales Order créé » again.

Because the bridge now works in French:

- customers (`res.partner`) it creates get French as their language, as if created in French
  screens;
- the country of a patient's address is found by its French name (`res.country`). « Burundi »
  is the same in both languages; a country whose French name differs (« Ouganda », not
  « Uganda ») is no longer found by its English name.

Only `id` and `lang` are set, so nothing else about the user changes. Odoo applies the file
once (by checksum); to apply it again, delete its checksum under `/mnt/checksums/` and
restart `odoo`.
