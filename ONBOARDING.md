# Onboarding: volunteering on UVL-EMR

Welcome. UVL-EMR is the OpenMRS 3 distribution used every day at Ubuntu Medical Clinic in
Mugamba, Burundi, to register patients, record consultations, order and report tests, dispense
medicines and bill for care. It is built on **Ozone**, which bundles OpenMRS with Odoo, Keycloak,
Orthanc and Superset and connects them.

Work through the steps below **in order**. Each one gives you the words and the mental model the
next one assumes. Budget roughly a week of part-time effort before your first pull request; that
is normal, and asking questions along the way is expected.

| Step | What | Time |
|---|---|---|
| 1 | Take the OpenMRS 3 course | a few evenings |
| 2 | Read the Ozone introduction and architecture | an hour or two |
| 3 | Run UVL-EMR on your machine | half a day, the first time |
| 4 | Learn how UVL is put together | an hour |
| 5 | Pick up your first issue | — |

---

## Step 1: Take the OpenMRS 3 course

**[Intro to OpenMRS 3: For Developers and Technical Teams](https://openmrs.org/courses/intro-to-openmrs-3-2/)**
(OpenMRS Academy; free, with a certificate at the end).

It covers what OpenMRS 3 ("O3") is, how its frontend is built from microfrontends, the O3 design
system, how to configure an O3 instance, and how to build a feature on it. Almost everything in
this repository is O3 configuration, so this is the foundation for everything else.

You'll need to register a free OpenMRS Academy account to enrol.

## Step 2: Read the Ozone introduction and architecture

UVL-EMR is an Ozone *distribution*: Ozone's apps and integrations, with our own configuration on
top. Read these pages to understand what Ozone is and how its parts talk to each other:

1. **[Functional overview](https://docs.ozone-his.com/users/)**: the apps in Ozone and what each
   one is for. The "Flows" pages in its menu explain what moves between apps. Read at least
   [Odoo–OpenMRS](https://docs.ozone-his.com/users/odoo-openmrs/),
   [OpenMRS–Orthanc](https://docs.ozone-his.com/users/openmrs-orthanc/) and
   [SSO & Auth](https://docs.ozone-his.com/users/auth/); those are the ones UVL uses.
2. **[Implementers' introduction](https://docs.ozone-his.com/implementers/intro/)**: how a
   distribution like ours is evaluated, adopted and deployed. Skim
   [Create Your Own Distribution](https://docs.ozone-his.com/implementers/create-distro/) and
   [Configure Apps](https://docs.ozone-his.com/implementers/configure-apps/) too: they describe
   the structure you'll find in this repository.
3. **[Architecture overview](https://docs.ozone-his.com/devs/)**: the integration layer. Every
   pair of apps is joined by a small service built on Ozone's **EIP Client** (Apache Camel routes
   exchanging FHIR resources). Two of these, `eip-odoo-openmrs` and `eip-openmrs-orthanc`, carry
   orders to billing and to the imaging worklist at UVL.

**You don't need to run the Ozone demo.** Ozone's
[Run Locally](https://docs.ozone-his.com/getting-started/run-locally/) page starts Ozone's own
generic demo; you'll run UVL-EMR instead in step 3, which gives you the same apps with UVL's
configuration. That page's system requirements do apply to UVL-EMR as well: at least **12 GB of
free RAM, 8 CPU cores and 25 GB of free disk**.

## Step 3: Run UVL-EMR on your machine

Follow **[Quick start on localhost](README.md#quick-start-on-localhost)** in the README: install
Git, a JDK and Docker Compose, add a GitHub token to `~/.m2/settings.xml`, build with
`./scripts/mvnw clean package`, then start the Mugamba site. If you can't run it locally, the
README's GitPod button runs it in your browser.

You're done with this step when you can:

- sign in to OpenMRS at `http://localhost/` and open a patient chart;
- register a test patient and start a visit;
- open Odoo at `http://localhost:8069` and find that patient as a customer.

The first build and start take a while. If something fails, open an issue with the error, or ask
(see "Getting help" below); a setup problem you hit is one the next volunteer will hit too.

## Step 4: Learn how UVL is put together

**The apps**

| App | What it does at the clinic |
|---|---|
| OpenMRS 3 | Registration, visits, consultations, lab and imaging orders and results, dispensing |
| Odoo 17 | Billing: quotations, invoices, payments, and the product and price catalogue |
| Keycloak | Single sign-on and the roles each member of staff holds |
| Orthanc + OHIF | Imaging: the modality worklist and the image viewer |
| Superset | Dashboards and the monthly FBP / DHIS2 reporting |

A doctor's order in OpenMRS becomes a quotation line in Odoo through `eip-odoo-openmrs`, and an
imaging order reaches the Orthanc worklist once it is paid, through `eip-openmrs-orthanc`.

**The repositories**

| Repository | What's in it |
|---|---|
| [UVL-EMR](https://github.com/MadiroGlobalHealth/UVL-EMR) (this one) | The distribution: configuration, forms, roles, concepts, frontend config, and the bridge jars |
| UVL-Odoo-Addons (private; ask for access if your issue needs it) | UVL's own Odoo modules, shipped inside the Odoo image |
| [Ozone](https://github.com/ozone-his) | The upstream platform and the EIP bridges we build on |

**The configuration** lives under `sites/mugamba/configs/`. [CONTRIBUTING.md](CONTRIBUTING.md)
explains the layout and the traps that have cost us time; read its "Where configuration lives"
section now.

**What changed recently** is in the [CHANGELOG](CHANGELOG.md). Its "Known issues" list is a
good map of where help is needed.

## Step 5: Pick up your first issue

1. Browse the [issues](https://github.com/MadiroGlobalHealth/UVL-EMR/issues) or the
   [project board](https://github.com/orgs/MadiroGlobalHealth/projects/9). Configuration work such
   as forms, translations and roles is a good first contribution.
2. Comment on the issue to say you're taking it, so two people don't build the same thing.
3. Follow [CONTRIBUTING.md](CONTRIBUTING.md) for branch names, commits and pull requests.
4. Test your change on your local stack, signed in as a user with the role the change affects,
   not as `admin`. Most of the faults we've shipped were invisible to an administrator.

**This is a live clinical system holding real patient records.** Never put patient data in an
issue, a pull request, a screenshot or a test fixture; use your local test patients. Access to
the shared test environment is given separately, once a dataset without real patient data is in
place (#263).

## Getting help

- Ask on the issue you're working on, and tag **@jnsereko**. No question is too small, and asking
  early is much cheaper than a rewrite later.
- The [OpenMRS community](https://talk.openmrs.org/) and [OpenMRS Slack](https://slack.openmrs.org/)
  are the place for general OpenMRS 3 questions.
