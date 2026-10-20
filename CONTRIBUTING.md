# Contributing to UVL-EMR

This is the OpenMRS 3 distribution running at Ubuntu Medical Clinic in Mugamba,
Burundi. It is a live clinical system: people use it to register patients, order
tests, dispense medicines and bill for care. That shapes everything below.

Contributions are very welcome. If anything here is unclear or wrong, say so —
opening an issue about the contributing guide is a perfectly good first
contribution.

## Getting set up

The [README](README.md) covers prerequisites, cloning, building and running the
stack locally, either through GitPod or on your own machine. Start there and come
back here for how we work.

## Where the work lives

| | |
|---|---|
| [Issues](https://github.com/MadiroGlobalHealth/UVL-EMR/issues) | everything open right now |
| [Project board](https://github.com/orgs/MadiroGlobalHealth/projects/9) | the same work grouped by milestone |

Milestones (M1, M2, M3 …) group issues by what they deliver to the hospital
rather than by date alone. An issue without a milestone has not been scheduled
yet.

## Opening an issue

**Please feel free to open an issue whenever you need one** — a bug, something
confusing, a question, an idea, or work you would like to pick up. You do not
need permission, and you do not need to be sure it is a real problem. An issue
that turns out to be a misunderstanding still tells us the system is confusing.

Pick a template when you open it: **Bug**, **Form request** or **Requirement**.
Each asks for exactly what we need to act, and none of it is hard to fill in. A
blank issue is fine for anything else.

A good issue says what you expected, what happened instead, and how to see it
again. Screenshots help enormously, especially for anything on screen. If it
touches patient data, describe it rather than pasting it — see Privacy below.

Discussion belongs on the issue rather than in DMs or chat, so that the reasoning
stays attached to the work and whoever picks it up in six months can follow it.

## Picking something up

Comment on the issue to say you are working on it, so two people do not build the
same thing. If you stall or change your mind, say so on the issue — that is
completely fine and far better than silence.

### Starter issues: forms

Volunteers are currently working on **clinical forms only**. Every other area
(billing, roles, bridges, deployment) touches the live hospital in ways that are
hard to test locally, and stays with the maintainers for now.

Open starter work carries both labels
[`Forms` and `Help wanted`](https://github.com/MadiroGlobalHealth/UVL-EMR/issues?q=is%3Aopen+label%3AForms+label%3A%22Help+wanted%22).
Each issue links the hospital's paper form, lists its sections and fields, and
gives a difficulty:

- **easy**: a short, flat form. Start here. The contact record (#376) is the
  intended first form.
- **medium**: several sections, or fields that reuse existing patient or visit
  attributes.
- **hard**: a large form, or one that needs a design decision first (for example
  the partograph, #382, which is plotted over time). Agree the approach on the
  issue before you build.

One form per person at a time. When your first form is merged, take the next.

## Branches

Branch off `main`. If you do not have write access to this repository, fork it,
push the branch to your fork, and open the pull request from there; that is the
normal route for a first contribution.

```
<type>/<issue-number>-<short-description>
```

Real examples from this repo:

```
fix/208-lab-results-allow-decimals
feat/issue-212-new-products
perf/256-patient-search-cap
docs/259-contributing-guide
```

`<type>` is `fix`, `feat`, `perf`, `docs`, `build` or `chore`.

## Commits

We use [conventional commits](https://www.conventionalcommits.org/) with a scope:

```
fix(roles): grant Help Nurse 'Get Concept Attribute Types'
perf(search): cap person.searchMaxResults at 100
```

**Explain why in the body, not just what.** The diff already shows what changed;
it cannot show what you tried first, what broke, or what you measured. A future
contributor debugging the same area will thank you. If a change fixes something
subtle, include the evidence — the error message, the before and after numbers,
the log line that gave it away.

## Pull requests

Open the PR against `main` and fill in the
[template](.github/pull_request_template.md). It asks for a conventional-commit
title, a summary, and a screenshot or video for anything visual — please do
include those, they make review much faster.

Link the issue the PR closes. Say what you tested and how. If you could not test
something, say that too; an honest gap is much easier to work with than a silent
one.

Tag **@jnsereko** when it is ready for review, or earlier if you want a second
opinion before going further.

## Where configuration lives

Most work in this repo is configuration rather than code:

```
sites/mugamba/configs/
├── openmrs/
│   ├── initializer_config/   concepts, forms, roles, privileges, identifiers
│   └── frontend_config/      O3 frontend configuration
├── odoo/                     billing and inventory
└── keycloak/                 realm, clients, roles
```

Three things that are not obvious and have each cost us time:

- **OpenMRS configuration is copied from the image into the running container on
  every start.** Change a file here, rebuild, redeploy, and it applies.
- **The Keycloak realm file is only read when the realm does not yet exist.** On
  any environment that already has it, editing `ozone-realm.json` changes nothing
  and nothing warns you. Roles have to be applied to a running environment
  separately.

- **Config you delete from the repo is removed at the next start, but only since
  #341.** The OpenMRS 2.8.x entrypoint means to clear `configuration/` and
  `modules/` before refilling them from the image. It never did, because the glob
  is inside the quotes: `rm -fR "${OMRS_CONFIG_DIR:?}/*"` deletes a file literally
  named `*`. We patch that line when the image is built
  (`scripts/bundled-docker/openmrs/patch-startup-init.sh`, #341). The flip side is
  that anything added to an environment's volume by hand, rather than through this
  repo, disappears on the next start. `P6` in the pre-flight suite below checks the
  volume against the image.

## Building images

`./scripts/mvnw clean package -Pbundled-docker` builds for **your** machine's
architecture. On an Apple Silicon Mac that means `arm64`, and these servers are
`amd64` — deploying one gives `exec /usr/bin/tini: exec format error` and a crash
loop. The pom declares both platforms, but fabric8 0.46.0 ignores that block and
warns `Parameter 'buildx' is unknown`.

Build with `docker buildx build --platform linux/amd64` against the generated
Dockerfile, or build on an amd64 host. Check before you deploy:

```
docker manifest inspect --verbose <image> | grep architecture
```

## Concepts and forms

Form questions reference concepts by UUID. If a form references a concept that
does not exist, or one whose datatype does not match how the question is
rendered, the form fails at runtime for every user — not at build time. Check
both sides when you touch either.

This is not hypothetical. In September 2026 the outpatient consultation form
failed for every user, but only when its optional `Antecedents` field was filled:
the field pointed at a concept the server did not have. Left empty, the form
saved fine, so nobody noticed for four days.

## Building a form

The order matters: the concept mapping comes first, because it is what breaks
forms.

1. **Claim the issue** (comment on it) and have UVL-EMR running locally (see
   [ONBOARDING.md](ONBOARDING.md), step 3).
2. **Map every field to a concept, and post the table on the issue** before you
   build anything:

   ```
   field | concept name | CIEL id or existing UVL concept | datatype | answers
   ```

   - Look for what exists, in this order: a concept UVL already has (your local
     stack: System Administration → Concept dictionary), then
     [CIEL](https://app.openconceptlab.org/#/orgs/CIEL/sources/CIEL/), then a new
     UVL concept.
   - Reuse what other forms use, such as vitals and diagnoses. A second
     "temperature" concept splits the data and breaks reports.
   - Datatype decides the rendering: `radio`, `select` and `multiCheckbox` need
     a **Coded** concept with those answers; `number` (or `numeric`) needs
     **Numeric**; `text` and `textarea` need **Text**; `date`/`datetime` need
     **Date**/**Datetime**.
   - **Do not create concepts yourself.** A maintainer adds the missing ones to
     the UVL collection in OCL and into the build. Your table is the input; wait
     until it is agreed.
3. **Build the form** as O3 (AMPATH) JSON, with the Form Builder on your local
   stack (`http://localhost/openmrs/spa/form-builder`) or by hand, using the
   concept UUIDs from step 2. Copy the shape of an existing form.

   | file | path under `sites/mugamba/configs/openmrs/initializer_config/` |
   |---|---|
   | schema | `ampathforms/<Form-Name>.json` |
   | French labels | `ampathformstranslations/<Form-Name>_translations_fr.json` |
   | English labels | `ampathformstranslations/<Form-Name>_translations_en.json` |

   **French is the main language** of the hospital. Build one form with both
   translation files, never two forms.
4. **Encounter type.** Use an existing one from
   `encountertypes/mugamba_encountertypes.csv` when it fits. If the form needs
   its own, add a row with a new UUID and say why in the pull request. If you
   give it a view or edit privilege, that privilege must exist and the roles that
   use the form must hold it, or the form is invisible or unsavable for them.
5. **Test it locally, as a clinical user, not as `admin`.** Fill **every field,
   including the optional ones**, save, and check the patient chart: one
   encounter of the right type, one observation per filled field. Switch the
   language and check both translations.
6. **Open the pull request** from `feat/<issue-number>-<form-name>`, with
   `Closes #<issue-number>` in the body, screenshots of the rendered form in
   French and English (with a test patient, never a real one), and the saved
   encounter.

A maintainer then deploys it to the test environment, where the product owner
checks it against the paper form. Expect a round of changes from that review;
it is part of the work, not a sign something went wrong.

## Before you promote a change

There is a pre-flight suite that catches exactly the faults that have taken this
system down before — missing concepts, datatype mismatches, roles missing
privileges, Keycloak roles that vanished, configuration drift, and modules that
quietly failed to start.

It lives in the deploy tooling rather than here, because it reads a *deployed*
environment over ssh and its site mapping names hosts:

```
# in a LIME-EMR-Tooling checkout
./e2e/preflight.py --domain <site-domain>
```

Run it, and sign in as a user holding the role your change affects, not as an
administrator. Every fault this catches is invisible to a privileged session.

## Privacy

This system holds real patient records.

- **Never** put patient data in an issue, a PR, a screenshot, a log paste or a
  test fixture. Not names, identifiers, dates of birth, diagnoses or photographs.
- Describe the shape of a problem instead: "a patient with two identifiers of the
  same type" rather than the patient.
- Screenshots are the easy place to slip — check the patient banner before
  attaching one, and use demo data where you can.
- Credentials, tokens, hostnames and connection strings do not belong in this
  repository either.

This repository is public.

## Getting help

Ask. Tag **@jnsereko** on an issue or a PR at any point — including before you
start, if you are unsure whether an approach is right. A question early is much
cheaper than a rewrite later, and no question here is too small.
