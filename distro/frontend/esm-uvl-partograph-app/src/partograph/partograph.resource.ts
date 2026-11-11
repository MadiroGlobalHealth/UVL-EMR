import { parseDate, restBaseUrl, useOpenmrsFetchAll } from '@openmrs/esm-framework';
import { useEffect, useMemo } from 'react';
import type { PartographConcepts, PartographConfig } from '../config-schema';
import type { CodedValue } from './partograph-math';

export interface PartographEncounter {
  uuid: string;
  encounterDatetime: string;
  encounterType?: { uuid: string };
  obs: Array<{ uuid?: string; concept: { uuid: string }; value: unknown }>;
}

/** One saved Partograph Reading: its time and the value of each configured concept. */
export interface PartographReading {
  uuid: string;
  time: Date;
  values: Partial<Record<keyof PartographConcepts, number | string | CodedValue>>;
}

const representation =
  'custom:(uuid,encounterDatetime,encounterType:(uuid),obs:(uuid,concept:(uuid),value))';

export function partographUrl(patientUuid: string, encounterTypeUuid: string): string | null {
  if (!patientUuid || !encounterTypeUuid) {
    return null;
  }
  return `${restBaseUrl}/encounter?patient=${patientUuid}&encounterType=${encounterTypeUuid}&v=${representation}&limit=100`;
}

/**
 * Turns encounters into readings, oldest first. Encounters of another type are dropped here too:
 * OpenMRS ignores a search filter it does not support instead of failing.
 */
export function toReadings(
  encounters: Array<PartographEncounter>,
  config: Pick<PartographConfig, 'encounterTypeUuid' | 'concepts'>,
): Array<PartographReading> {
  const keyByConcept = new Map<string, keyof PartographConcepts>();
  (Object.keys(config.concepts) as Array<keyof PartographConcepts>).forEach((key) => {
    if (config.concepts[key]) {
      keyByConcept.set(config.concepts[key], key);
    }
  });

  return encounters
    .filter((encounter) => !encounter.encounterType || encounter.encounterType.uuid === config.encounterTypeUuid)
    .map((encounter) => {
      const values: PartographReading['values'] = {};
      for (const obs of encounter.obs ?? []) {
        const key = keyByConcept.get(obs.concept?.uuid);
        if (key && obs.value !== null && obs.value !== undefined) {
          values[key] = obs.value as number | string | CodedValue;
        }
      }
      return { uuid: encounter.uuid, time: parseDate(encounter.encounterDatetime), values };
    })
    .sort((a, b) => a.time.getTime() - b.time.getTime());
}

/**
 * Sent when the side-panel button's form saves a reading. The form engine only revalidates SWR keys
 * that are plain strings, and `useOpenmrsFetchAll` keys are `useSWRInfinite` keys, which SWR's
 * key filters skip: without this the chart kept its old readings until the page was reloaded.
 */
export const partographSavedEvent = 'uvl-partograph-reading-saved';

export function notifyPartographSaved(patientUuid: string) {
  window.dispatchEvent(new CustomEvent(partographSavedEvent, { detail: { patientUuid } }));
}

export function usePartographReadings(patientUuid: string, config: PartographConfig) {
  const { data, error, isLoading, mutate } = useOpenmrsFetchAll<PartographEncounter>(
    partographUrl(patientUuid, config.encounterTypeUuid),
  );

  useEffect(() => {
    const refresh = (event: Event) => {
      if ((event as CustomEvent<{ patientUuid: string }>).detail?.patientUuid === patientUuid) {
        mutate();
      }
    };
    window.addEventListener(partographSavedEvent, refresh);
    return () => window.removeEventListener(partographSavedEvent, refresh);
  }, [patientUuid, mutate]);

  const readings = useMemo(() => (data ? toReadings(data, config) : undefined), [data, config]);
  return { readings, error, isLoading };
}
