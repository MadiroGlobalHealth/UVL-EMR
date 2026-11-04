import { Type } from '@openmrs/esm-framework';
import type { CodeMapping } from './partograph/partograph-math';

const concept = (description: string) => ({ _type: Type.ConceptUuid, _default: '', _description: description });

const codeMapping = (description: string) => ({
  _type: Type.Array,
  _default: [],
  _description: description,
  _elements: {
    concept: { _type: Type.ConceptUuid, _description: 'Answer concept saved by the form' },
    code: { _type: Type.String, _description: 'Code drawn on the partograph' },
  },
});

/**
 * The configuration lives under this name in the site config, not under the module name.
 *
 * Core 11 computes an extension's configuration as soon as its slot renders it, but only loads
 * the module, and so runs `startupApp()` and `defineConfigSchema`, once the component itself is
 * fetched. Keys under the module name were therefore first checked against the bare implicit
 * schema ("Display conditions", "Translation overrides"), and each logged "Unknown config key …
 * Ignoring." before the real schema arrived (UAT, #498). No extension belongs to this name, so
 * its values are only checked once `startupApp()` has defined the schema.
 */
export const configNamespace = '@madiro/uvl-partograph';

/**
 * Every UUID comes from the site configuration (the Partograph Reading form's concepts); the
 * module ships none. With no encounter type configured the chart renders nothing.
 */
export const configSchema = {
  encounterTypeUuid: {
    _type: Type.UUID,
    _default: '',
    _description: 'Encounter type of the partograph readings',
  },
  labourGapHours: {
    _type: Type.Number,
    _default: 24,
    _description:
      'Only the current labour is charted: readings before a gap longer than this many hours belong to an earlier labour',
  },
  minimumHours: {
    _type: Type.Number,
    _default: 12,
    _description: 'Shortest time axis, in hours from the first reading',
  },
  showWhenEmpty: {
    _type: Type.Boolean,
    _default: false,
    _description: 'Show the card with a "no readings" message for a patient without readings, instead of hiding it',
  },
  concepts: {
    fetalHeartRate: concept('Fetal heart rate (bpm)'),
    cervicalDilatation: concept('Cervical dilatation (cm)'),
    headDescent: concept('Descent of the head (fifths palpable)'),
    contractionsPer10Min: concept('Contractions per 10 minutes'),
    contractionDuration: concept('Duration of contractions (seconds)'),
    oxytocinConcentration: concept('Oxytocin (U/L)'),
    oxytocinDrops: concept('Oxytocin drip (drops/min)'),
    pulse: concept('Maternal pulse (/min)'),
    systolicBp: concept('Systolic blood pressure (mmHg)'),
    diastolicBp: concept('Diastolic blood pressure (mmHg)'),
    temperature: concept('Temperature (°C)'),
    amnioticFluid: concept('Amniotic fluid (coded)'),
    headMoulding: concept('Head moulding (coded)'),
    medicationsGiven: concept('Medications given (text)'),
  },
  liquorCodes: codeMapping('Amniotic fluid answers and their partograph codes (I, C, M, B)'),
  mouldingCodes: codeMapping('Head moulding answers and their partograph codes (0, +, ++, +++)'),
};

export type PartographConcepts = { [K in keyof (typeof configSchema)['concepts']]: string };

export interface PartographConfig {
  encounterTypeUuid: string;
  labourGapHours: number;
  minimumHours: number;
  showWhenEmpty: boolean;
  concepts: PartographConcepts;
  liquorCodes: Array<CodeMapping>;
  mouldingCodes: Array<CodeMapping>;
}
