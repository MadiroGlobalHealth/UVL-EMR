import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useConfig, useOpenmrsFetchAll } from '@openmrs/esm-framework';
import en from '../../translations/en.json';
import fr from '../../translations/fr.json';
import AnaesthesiaChart from './anaesthesia-chart.component';
import { anaesthesiaUrl, toAnaesthesiaReadings, type AnaesthesiaEncounter } from './anaesthesia.resource';

// Synthetic configuration and readings: no real concept, patient or staff data.
const config = {
  encounterTypeUuid: 'monitoring-type',
  readingGroupConcept: 'group',
  readingTimeConcept: 'time',
  concepts: {
    systolicBp: 'systolic',
    diastolicBp: 'diastolic',
    pulse: 'pulse',
    respiration: 'respiration',
    spo2: 'spo2',
    stage: 'stage',
    medication: 'medication',
  },
  readingFormUuid: '',
  gapHours: 12,
  minimumHours: 2,
};

const obs = (concept: string, value: unknown) => ({ concept: { uuid: concept }, value });
const group = (...members: Array<ReturnType<typeof obs>>) => ({ concept: { uuid: 'group' }, value: null, groupMembers: members });

const encounters: Array<AnaesthesiaEncounter> = [
  // One-reading form: the encounter time is the reading time.
  {
    uuid: 'new-2',
    encounterDatetime: '2026-11-04T09:30:00.000+0000',
    encounterType: { uuid: 'monitoring-type' },
    obs: [group(obs('systolic', 110), obs('diastolic', 70), obs('pulse', 80), obs('spo2', 98), obs('stage', { uuid: 's', display: 'Induction' }))],
  },
  {
    uuid: 'new-1',
    encounterDatetime: '2026-11-04T09:00:00.000+0000',
    encounterType: { uuid: 'monitoring-type' },
    obs: [group(obs('systolic', 120), obs('pulse', 90), obs('medication', ' Ab '))],
  },
  // Twelve-reading form: each group has its own time; the encounter time is the operation's.
  {
    uuid: 'old',
    encounterDatetime: '2026-10-01T08:00:00.000+0000',
    encounterType: { uuid: 'monitoring-type' },
    obs: [
      group(obs('time', '2026-10-01T08:15:00.000+0000'), obs('pulse', 70)),
      group(obs('time', '2026-10-01T08:05:00.000+0000'), obs('pulse', 75)),
      group(obs('time', '2026-10-01T08:25:00.000+0000')),
    ],
  },
  { uuid: 'other', encounterDatetime: '2026-11-04T09:10:00.000+0000', encounterType: { uuid: 'x' }, obs: [group(obs('pulse', 1))] },
];

function withReadings(data: Array<AnaesthesiaEncounter> | undefined) {
  vi.mocked(useConfig).mockReturnValue({ anaesthesia: config });
  vi.mocked(useOpenmrsFetchAll).mockReturnValue({ data, error: undefined, isLoading: false } as any);
}

describe('anaesthesia resource', () => {
  it('asks for the patient’s readings of the configured encounter type, and nothing when unconfigured', () => {
    expect(anaesthesiaUrl('patient-uuid', 'monitoring-type')).toContain(
      '/encounter?patient=patient-uuid&encounterType=monitoring-type&v=custom:',
    );
    expect(anaesthesiaUrl('patient-uuid', '')).toBeNull();
  });

  it('reads one-reading and twelve-reading records alike, oldest first, dropping empty groups and other types', () => {
    const readings = toAnaesthesiaReadings(encounters, config);

    expect(readings.map((r) => r.key)).toEqual(['old-1', 'old-0', 'new-1-0', 'new-2-0']);
    expect(readings[1].time.toISOString()).toBe('2026-10-01T08:15:00.000Z');
    expect(readings[3].values).toMatchObject({ systolicBp: 110, spo2: 98 });
  });
});

describe('AnaesthesiaChart', () => {
  it('renders nothing for a patient without readings', () => {
    withReadings([]);
    const { container } = render(<AnaesthesiaChart patientUuid="p" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('charts the latest operation only, with its readings in time order', () => {
    withReadings(encounters);
    render(<AnaesthesiaChart patientUuid="p" />);

    // The i18n mock does not interpolate: the "earlier readings" note shows the older operation is left out,
    // and the pulse series holds the two readings of the latest operation only.
    expect(screen.getByText(/earlier readings \(previous operation\)/)).toBeInTheDocument();
    const pulseTitles = Array.from(document.querySelectorAll('title')).map((node) => node.textContent).filter((text) => text.includes('Pulse'));
    expect(pulseTitles).toHaveLength(2);
    expect(pulseTitles[0]).toContain('09:00');
    expect(screen.getByRole('img', { name: 'Blood pressure and pulse' })).toBeInTheDocument();
    expect(screen.getByText(/Induction/)).toBeInTheDocument();
    expect(screen.getByText(/Ab/)).toBeInTheDocument();
  });
});

describe('anaesthesia translations', () => {
  it('has every anaesthesia string in English and French', () => {
    const keys = Object.keys(en).filter((key) => /naesthesia|spo2|respiration|pulseBpm|stageAnd|bloodPressureAndPulse/i.test(key));
    expect(keys.length).toBeGreaterThan(8);
    keys.forEach((key) => expect(fr).toHaveProperty(key));
  });
});
