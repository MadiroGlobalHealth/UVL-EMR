import { parseDate, restBaseUrl, useOpenmrsFetchAll } from '@openmrs/esm-framework';
import { useEffect, useMemo } from 'react';
import type { AnaesthesiaConcepts, AnaesthesiaConfig } from '../config-schema';
import type { CodedValue } from '../partograph/partograph-math';

interface RawObs {
  uuid?: string;
  concept: { uuid: string };
  value: unknown;
  groupMembers?: Array<RawObs> | null;
}

export interface AnaesthesiaEncounter {
  uuid: string;
  encounterDatetime: string;
  encounterType?: { uuid: string };
  obs: Array<RawObs>;
}

/** One reading: its time and the value of each configured concept. */
export interface AnaesthesiaReading {
  /** Unique per reading; an old record holds up to twelve readings in one encounter. */
  key: string;
  encounterUuid: string;
  time: Date;
  values: Partial<Record<keyof AnaesthesiaConcepts, number | string | CodedValue>>;
}

const member = 'uuid,concept:(uuid),value';
const representation = `custom:(uuid,encounterDatetime,encounterType:(uuid),obs:(${member},groupMembers:(${member})))`;

export function anaesthesiaUrl(patientUuid: string, encounterTypeUuid: string): string | null {
  if (!patientUuid || !encounterTypeUuid) {
    return null;
  }
  return `${restBaseUrl}/encounter?patient=${patientUuid}&encounterType=${encounterTypeUuid}&v=${representation}&limit=100`;
}

/**
 * Turns encounters into readings, oldest first. A one-reading form saves one group per encounter,
 * timed by the encounter; the older twelve-reading form saves up to twelve groups in one
 * encounter, each timed by its own "date of the reading" (the encounter time is only the
 * operation's). Both are read the same way. A reading with no configured value is dropped, and so
 * is an encounter of another type (OpenMRS ignores a search filter it does not support).
 */
export function toAnaesthesiaReadings(
  encounters: Array<AnaesthesiaEncounter>,
  config: Pick<AnaesthesiaConfig, 'encounterTypeUuid' | 'readingGroupConcept' | 'readingTimeConcept' | 'concepts'>,
): Array<AnaesthesiaReading> {
  const keyByConcept = new Map<string, keyof AnaesthesiaConcepts>();
  (Object.keys(config.concepts) as Array<keyof AnaesthesiaConcepts>).forEach((key) => {
    if (config.concepts[key]) {
      keyByConcept.set(config.concepts[key], key);
    }
  });

  const readings: Array<AnaesthesiaReading> = [];
  for (const encounter of encounters) {
    if (encounter.encounterType && encounter.encounterType.uuid !== config.encounterTypeUuid) {
      continue;
    }
    const groups = (encounter.obs ?? []).filter(
      (obs) => config.readingGroupConcept && obs.concept?.uuid === config.readingGroupConcept,
    );
    groups.forEach((group, index) => {
      const values: AnaesthesiaReading['values'] = {};
      let time: Date | undefined;
      for (const obs of group.groupMembers ?? []) {
        if (obs.value === null || obs.value === undefined) {
          continue;
        }
        if (obs.concept?.uuid === config.readingTimeConcept) {
          time = parseDate(String(obs.value));
          continue;
        }
        const key = keyByConcept.get(obs.concept?.uuid);
        if (key) {
          values[key] = obs.value as number | string | CodedValue;
        }
      }
      if (Object.keys(values).length) {
        readings.push({
          key: `${encounter.uuid}-${index}`,
          encounterUuid: encounter.uuid,
          time: time ?? parseDate(encounter.encounterDatetime),
          values,
        });
      }
    });
  }
  return readings.sort((a, b) => a.time.getTime() - b.time.getTime());
}

/**
 * Sent when the side-panel button's form saves a reading, so the chart reloads: the form engine only
 * revalidates SWR keys that are plain strings, and `useOpenmrsFetchAll` keys are not (see the
 * partograph's event of the same kind, #825).
 */
export const anaesthesiaSavedEvent = 'uvl-anaesthesia-reading-saved';

export function notifyAnaesthesiaSaved(patientUuid: string) {
  window.dispatchEvent(new CustomEvent(anaesthesiaSavedEvent, { detail: { patientUuid } }));
}

export function useAnaesthesiaReadings(patientUuid: string, config: AnaesthesiaConfig) {
  const { data, error, isLoading, mutate } = useOpenmrsFetchAll<AnaesthesiaEncounter>(
    anaesthesiaUrl(patientUuid, config.encounterTypeUuid),
  );

  useEffect(() => {
    const refresh = (event: Event) => {
      if ((event as CustomEvent<{ patientUuid: string }>).detail?.patientUuid === patientUuid) {
        mutate();
      }
    };
    window.addEventListener(anaesthesiaSavedEvent, refresh);
    return () => window.removeEventListener(anaesthesiaSavedEvent, refresh);
  }, [patientUuid, mutate]);

  const readings = useMemo(() => (data ? toAnaesthesiaReadings(data, config) : undefined), [data, config]);
  return { readings, error, isLoading };
}
