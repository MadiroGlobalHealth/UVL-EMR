import { parseDate, restBaseUrl, useOpenmrsFetchAll } from '@openmrs/esm-framework';
import { useMemo } from 'react';
import type { SurveillanceConfig } from '../config-schema';
import { currentLabour } from '../partograph/partograph-math';

export interface SurveillanceObs {
  uuid?: string;
  concept: { uuid: string; display?: string };
  value: unknown;
  formFieldPath?: string | null;
  groupMembers?: Array<SurveillanceObs> | null;
}

export interface SurveillanceEncounter {
  uuid: string;
  encounterDatetime: string;
  encounterType?: { uuid: string };
  /** Top-level obs only: the members of a group come under the group's `groupMembers`. */
  obs: Array<SurveillanceObs>;
}

/** One saved 24-Hour Surveillance form: one column of the table. */
export interface SurveillanceColumn {
  uuid: string;
  time: Date;
  /** The time point answer (30 min … 24 h), as the user's locale names it. */
  timePoint?: string;
  mother: Record<string, string>;
  /** One entry per newborn, in the form's order (Newborn 1, 2, 3). */
  newborns: Array<Record<string, string>>;
}

export interface SurveillanceRow {
  concept: string;
  label: string;
}

export interface SurveillanceTableData {
  columns: Array<SurveillanceColumn>;
  motherRows: Array<SurveillanceRow>;
  /** Rows of each newborn: only the values that newborn has at some time point. */
  newbornRows: Array<Array<SurveillanceRow>>;
  earlierCount: number;
}

const obsRepresentation = 'uuid,concept:(uuid,display),value,formFieldPath';
const representation = `custom:(uuid,encounterDatetime,encounterType:(uuid),obs:(${obsRepresentation},groupMembers:(${obsRepresentation})))`;

export function surveillanceUrl(patientUuid: string, encounterTypeUuid: string): string | null {
  if (!patientUuid || !encounterTypeUuid) {
    return null;
  }
  return `${restBaseUrl}/encounter?patient=${patientUuid}&encounterType=${encounterTypeUuid}&v=${representation}&limit=100`;
}

/** The text of a value as the REST API returns it: a coded answer is shown by its name. */
export function displayValue(value: unknown): string | undefined {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }
  if (typeof value === 'object') {
    const display = (value as { display?: string; name?: { display?: string } }).display;
    return display ?? undefined;
  }
  return String(value);
}

function rowsFor(
  configured: Array<string>,
  values: Array<Record<string, string>>,
  labels: Map<string, string>,
): Array<SurveillanceRow> {
  const order = configured.length ? configured : [...labels.keys()];
  return order
    .filter((concept) => values.some((column) => column[concept] !== undefined))
    .map((concept) => ({ concept, label: labels.get(concept) ?? concept }));
}

/**
 * Turns the saved 24-Hour Surveillance encounters into a table: one column per encounter, oldest
 * first, headed by its time point; the mother's values (the top-level obs) and each newborn's (the
 * members of one newborn group) as rows.
 *
 * A value is placed by where it sits in the encounter, never by its concept alone: forms saved
 * before #562 hold each newborn's pulse, breathing and temperature under the mother's concepts.
 * Since then the newborn has its own (newbornConcepts).
 *
 * Only the current delivery is kept: readings before a gap longer than `gapHours`. Encounters of
 * another type are dropped too, since OpenMRS ignores a search filter it does not support.
 */
export function toSurveillanceTable(
  encounters: Array<SurveillanceEncounter>,
  config: SurveillanceConfig,
): SurveillanceTableData {
  const labels = new Map<string, string>();
  const newbornLabels = new Map<string, string>();
  const remember = (map: Map<string, string>, obs: SurveillanceObs) => {
    if (obs.concept?.uuid && !map.has(obs.concept.uuid)) {
      map.set(obs.concept.uuid, obs.concept.display ?? obs.concept.uuid);
    }
  };

  const all = encounters
    .filter((encounter) => !encounter.encounterType || encounter.encounterType.uuid === config.encounterTypeUuid)
    .map((encounter): SurveillanceColumn => {
      const column: SurveillanceColumn = {
        uuid: encounter.uuid,
        time: parseDate(encounter.encounterDatetime),
        mother: {},
        newborns: [],
      };
      const groups: Array<SurveillanceObs> = [];
      for (const obs of encounter.obs ?? []) {
        const concept = obs.concept?.uuid;
        if (concept === config.timePointConcept) {
          column.timePoint = displayValue(obs.value);
        } else if (concept === config.newbornGroupConcept) {
          groups.push(obs);
        } else if (!obs.groupMembers?.length) {
          const text = displayValue(obs.value);
          if (text !== undefined) {
            column.mother[concept] = text;
            remember(labels, obs);
          }
        }
      }
      // Newborn 1's group is saved from field "…newbornMonitoring", newborn 2's from "…newbornMonitoring_1".
      groups.sort((a, b) => (a.formFieldPath ?? '').localeCompare(b.formFieldPath ?? ''));
      column.newborns = groups.map((group) => {
        const values: Record<string, string> = {};
        for (const member of group.groupMembers ?? []) {
          const text = displayValue(member.value);
          if (member.concept?.uuid && text !== undefined) {
            values[member.concept.uuid] = text;
            remember(newbornLabels, member);
          }
        }
        return values;
      });
      return column;
    });

  const { readings: columns, earlierCount } = currentLabour(all, config.gapHours);
  const newbornCount = Math.max(0, ...columns.map((column) => column.newborns.length));
  const newbornRows = Array.from({ length: newbornCount }, (_, index) =>
    rowsFor(
      config.newbornConcepts,
      columns.map((column) => column.newborns[index] ?? {}),
      newbornLabels,
    ),
  );

  return {
    columns,
    motherRows: rowsFor(
      config.motherConcepts,
      columns.map((column) => column.mother),
      labels,
    ),
    newbornRows,
    earlierCount,
  };
}

export function useSurveillance(patientUuid: string, config: SurveillanceConfig) {
  const { data, error, isLoading } = useOpenmrsFetchAll<SurveillanceEncounter>(
    surveillanceUrl(patientUuid, config.encounterTypeUuid),
  );
  const table = useMemo(() => (data ? toSurveillanceTable(data, config) : undefined), [data, config]);
  return { table, error, isLoading };
}
