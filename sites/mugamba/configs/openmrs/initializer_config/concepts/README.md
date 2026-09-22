# Concept CSVs

## No comment lines

The Initializer concepts loader has **no comment syntax**. It reads the first
line of the file as the header, `#` included, and then fails every row with

```
'uuid' was not found in the index map: {# payer — who settles the bill ... =0}
```

A commented CSV therefore loads *nothing*, silently as far as the UI is
concerned — the module logs an ERROR and carries on. Keep the explanation in
this file, and keep the CSVs bare.

This bit once, adding `uvl_payer.csv`: the visit attribute type loaded (that
loader tolerates comments) while its concept did not, leaving a Payer field on
screen with no answers behind it — worse than not shipping it at all.

## uvl_payer.csv — who settles the bill (#327)

Before this, the deployment had five visit attribute types — Origin, Patient
location, Case Type, Consultation type, Disease Category — and none recorded who
pays. Step 2 of the patient journey could not be completed at all, and every
order priced at full tariff with no way to record that it should not have.

**The answer list is not complete.** Didier's 3 Sep 2026 document names **six**
payer schemes, and the fee schedule carrying the MFP and CAM terms is still
outstanding from him. The five answers here are only what this repository can
evidence today:

| Answer | Evidence |
|---|---|
| Cash / Espèces | a billing payment mode; the payer the e2e journey uses |
| Mobile Money | a billing payment mode |
| MFP | a real product, "Generalist consultation with MFP" |
| CAM | named in the project notes as a Mugamba payer term |
| Other insurance | deliberate catch-all, so nothing is unrecordable meanwhile |

When the six are confirmed, add them and retire the catch-all.

**Coverage rate is not recorded here.** That lives in the Odoo pricelists
(`Insurance 50/60/70/80/90%`). This attribute records *who* pays, not *how much*
— which is why a payer and a discount are not the same field.
