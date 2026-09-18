# Cowork task — UVL EMR post-deploy check

Save this as a Cowork task. Run it after every deploy. It ends with a single verdict line
saying whether the environment is good.

## Parameters

| name | default | notes |
|---|---|---|
| `DOMAIN` | `uvl-emr-uat.madiro.org` | the site to check. Use `uvl-emr.madiro.org` for production — **pre-flight only**, stop before Step 1 |
| `USER` | — | a **nurse** login. Not an administrator, not a System Developer: every fault this task exists to catch is invisible to a privileged session |
| `PATIENT` | `Demo Patient UVL1` | the standing test patient |

---

## Step 0 — pre-flight. Gate. Do not open a browser until this passes.

Run on a machine with ssh access to the stack host, from a checkout of this branch:

```
./e2e/preflight.py --domain $DOMAIN
```

Add `--json` if you want to read the verdict programmatically; exit is `0` pass, `1` a check
failed, `2` could not run.

**If it exits non-zero, stop.** Report which checks failed and quote the offending lines
verbatim. Do not continue to the browser steps — a failed pre-flight means the environment is
already known-broken and browser results from it are noise.

Known gaps are printed as `known` and do not fail the run. Do not report them as failures, but
do repeat them in the final verdict so they stay visible.

---

## Step 1 — sign in as a nurse

Sign in to `https://$DOMAIN` as `$USER`.

- Does sign-in complete and land on the patient search?
- Open the browser console. Any `Unknown config key` lines? Quote them — that means a frontend
  config key does not exist in the ESM schema and is being silently ignored.

## Step 2 — R2, start a visit

Find `$PATIENT`, start a visit.

- Does the visit start?
- Specifically: any error mentioning **`Privileges required`**? Quote it in full if so.

> This reproduces the 2026-09-13 incident where nurses signed in carrying no OpenMRS roles at
> all and could not start a visit. The error then was
> `[attributes on class org.openmrs.Visit => Privileges required: Get Concept Attribute Types]`.

## Step 3 — vitals

Vitals: height, weight, temperature `36.6` — the decimal is deliberate.

- Does it save?
- Is a BMI observation stored, and against which concept? It should be
  `2316f309-8802-431d-92a0-fc7cfa4df5c8`, **not** `1342AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA`.
- Console still clean?

## Step 4 — R1, the consultation, every field filled

Open **UVL Outpatient Consultation Form** and fill in **every field on the form**, including the
optional ones. Do not skip a field because it looks unimportant. Then save.

- Does it save?
- Does the consultation appear in the patient history with today's date?

> This is the one that matters most. On 2026-09-13 this form failed for every user, but **only
> when the optional `Antecedents` field was filled** — left empty it saved fine. A run that skips
> optional fields would have reported green while the ward was blocked for four days. If you fill
> only some fields, this task has not done its job.
>
> The failure then was
> `[obs on class org.openmrs.Encounter => value on class org.openmrs.Obs]`.

## Step 5 — orders

From the consultation, place one lab order.

- Does it save?
- Any error mentioning `App: stockmanagement.stockItems`?

> Expected to fail today — see the known gaps. Report what you see rather than treating a failure
> here as a surprise, and say explicitly whether the error matches the known one or is something
> new.

## Step 6 — journeys A–F

Not yet written. They are waiting on Didier's description of the real workflow — see the
**Journeys** section of `FLOW.md`. When those tables are filled in, they belong here, and Steps
2–5 above become the regression cases underneath them.

---

## Report back in this shape

```
DOMAIN   <domain>            DEPLOY  <image tag or commit, if known>

VERDICT  PASS | FAIL

  pre-flight   PASS | FAIL      <failing check ids, or "P1-P5 clean">
  Step 1 login                  <what happened>
  Step 2 visit                  <what happened>
  Step 3 vitals                 <saved? which BMI concept?>
  Step 4 consultation           <saved with every field filled?>
  Step 5 order                  <saved? known error or new one?>

KNOWN GAPS STILL OPEN
  <repeat the `known` lines from pre-flight>

ANYTHING THAT LOOKED WRONG
  <console errors, slow screens, confusing messages, anything off —
   this is the part a scripted suite cannot give us, so say what you noticed
   even if every step above passed>
```

`VERDICT PASS` requires pre-flight clean **and** Steps 1–4 all passing. Step 5 failing with the
known `App: stockmanagement.stockItems` error does not fail the run; Step 5 failing any other way
does.

## Cleanup

Leave the test data in place — the evidence is more useful than the tidiness. Note the visit and
encounter identifiers in the report so they can be voided later.

Never run Steps 1–6 against `uvl-emr.madiro.org`. Production gets Step 0 only: Article 6 of the
FBP contract pays on monthly-verified volume, so a synthetic encounter there is not harmless.
