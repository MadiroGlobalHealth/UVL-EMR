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

A good issue says what you expected, what happened instead, and how to see it
again. Screenshots help enormously, especially for anything on screen. If it
touches patient data, describe it rather than pasting it — see Privacy below.

Discussion belongs on the issue rather than in DMs or chat, so that the reasoning
stays attached to the work and whoever picks it up in six months can follow it.

## Picking something up

Comment on the issue to say you are working on it, so two people do not build the
same thing. If you stall or change your mind, say so on the issue — that is
completely fine and far better than silence.

## Branches

Branch off `main` and push to this repository:

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

Two things that are not obvious and have each cost us time:

- **OpenMRS configuration is copied from the image into the running container on
  every start.** Change a file here, rebuild, redeploy, and it applies. Config
  you delete from the repo may linger in an existing environment, so check rather
  than assume.
- **The Keycloak realm file is only read when the realm does not yet exist.** On
  any environment that already has it, editing `ozone-realm.json` changes nothing
  and nothing warns you. Roles have to be applied to a running environment
  separately.

- **Config you delete from the repo does not go away.** The OpenMRS entrypoint
  means to clear `configuration/` and `modules/` and refill them from the image on
  every start. It refills them; it does not clear them, because the glob is inside
  the quotes: `rm -fR "${OMRS_CONFIG_DIR:?}/*"` deletes a file literally named `*`.
  So a file you remove here keeps loading on every existing environment, with no
  source in the repo. Fixed on `openmrs-core` master but **not in any 2.8.x
  release**, so it is live for us. `P6` below detects it; LIME-EMR-Tooling's
  `openmrs-clear-stale-config.sh` clears it.

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

## Before you promote a change

There is a pre-flight suite that catches exactly the faults that have taken this
system down before — missing concepts, datatype mismatches, roles missing
privileges, Keycloak roles that vanished, configuration drift:

```
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
