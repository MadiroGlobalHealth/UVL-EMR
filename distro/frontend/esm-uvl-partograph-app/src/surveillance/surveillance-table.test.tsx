import React from 'react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { useConfig, useOpenmrsFetchAll } from '@openmrs/esm-framework';
import i18next from 'i18next';
import en from '../../translations/en.json';
import type { SurveillanceConfig } from '../config-schema';
import SurveillanceTable from './surveillance-table.component';
import { surveillanceUrl, toSurveillanceTable, type SurveillanceEncounter } from './surveillance.resource';

// A real i18next with the module's strings, so the newborn headings are interpolated.
const i18n = vi.hoisted(() => ({ instance: undefined as any }));
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (...args: Array<any>) => i18n.instance.t(...args) }),
}));

beforeAll(async () => {
  i18n.instance = i18next.createInstance();
  await i18n.instance.init({ lng: 'en', resources: { en: { translation: en } } });
});

const mockUseConfig = vi.mocked(useConfig);
const mockUseOpenmrsFetchAll = vi.mocked(useOpenmrsFetchAll);

// Synthetic configuration and values: no real concept, patient or staff data.
const surveillance: SurveillanceConfig = {
  encounterTypeUuid: 'surveillance-type',
  timePointConcept: 'time-point',
  newbornGroupConcept: 'newborn-group',
  motherConcepts: ['blood-loss', 'pulse', 'systolic'],
  newbornConcepts: ['status', 'pulse', 'apgar'],
  gapHours: 48,
};

const obs = (concept: string, display: string, value: unknown, formFieldPath?: string) => ({
  concept: { uuid: concept, display },
  value,
  formFieldPath,
});

const newborn = (formFieldPath: string, members: Array<ReturnType<typeof obs>>) => ({
  ...obs('newborn-group', 'Newborn monitoring', null, formFieldPath),
  groupMembers: members,
});

const encounters: Array<SurveillanceEncounter> = [
  {
    uuid: 'at-1h',
    encounterDatetime: '2026-11-05T09:00:00.000+0000',
    encounterType: { uuid: 'surveillance-type' },
    obs: [
      obs('time-point', 'Time point', { uuid: 'one-hour', display: '1 h' }),
      obs('pulse', 'Pulse', 90),
      obs('systolic', 'Systolic', 115),
      // Newborn 2 first: the REST API does not keep the form's order.
      newborn('rfe-forms-newbornMonitoring_1', [obs('pulse', 'Pulse', 150)]),
      newborn('rfe-forms-newbornMonitoring', [
        obs('status', 'Status', { uuid: 'alive', display: 'Born alive' }),
        obs('pulse', 'Pulse', 140),
      ]),
    ],
  },
  {
    uuid: 'at-30min',
    encounterDatetime: '2026-11-05T08:30:00.000+0000',
    encounterType: { uuid: 'surveillance-type' },
    obs: [
      obs('time-point', 'Time point', { uuid: 'thirty-min', display: '30 min' }),
      obs('blood-loss', 'Blood loss', 300),
      obs('pulse', 'Pulse', 96),
      newborn('rfe-forms-newbornMonitoring', [obs('pulse', 'Pulse', 138), obs('apgar', 'APGAR', 9)]),
    ],
  },
];

describe('toSurveillanceTable', () => {
  it('places a shared concept by where it sits: the mother, or one newborn in the form order', () => {
    const table = toSurveillanceTable(encounters, surveillance);

    expect(table.columns.map((column) => column.timePoint)).toEqual(['30 min', '1 h']);
    expect(table.columns.map((column) => column.mother.pulse)).toEqual(['96', '90']);
    expect(table.columns.map((column) => column.newborns[0]?.pulse)).toEqual(['138', '140']);
    expect(table.columns.map((column) => column.newborns[1]?.pulse)).toEqual([undefined, '150']);
    expect(table.columns[1].newborns[0].status).toBe('Born alive');
  });

  it("reads each newborn's own concepts, and never puts them in the mother's rows (#562)", () => {
    const table = toSurveillanceTable(
      [
        {
          uuid: 'own-concepts',
          encounterDatetime: '2026-11-05T09:00:00.000+0000',
          encounterType: { uuid: 'surveillance-type' },
          obs: [
            obs('pulse', 'Pulse', 88),
            newborn('rfe-forms-newbornMonitoring', [obs('newborn-pulse', 'Newborn pulse', 140)]),
          ],
        },
      ],
      { ...surveillance, newbornConcepts: ['status', 'newborn-pulse', 'apgar'] },
    );

    expect(table.columns[0].mother).toEqual({ pulse: '88' });
    expect(table.columns[0].newborns).toEqual([{ 'newborn-pulse': '140' }]);
    expect(table.motherRows.map((row) => row.concept)).toEqual(['pulse']);
    expect(table.newbornRows).toEqual([[{ concept: 'newborn-pulse', label: 'Newborn pulse' }]]);
  });

  it('lists rows in the configured order, only for values recorded at some time point', () => {
    const table = toSurveillanceTable(encounters, surveillance);

    expect(table.motherRows).toEqual([
      { concept: 'blood-loss', label: 'Blood loss' },
      { concept: 'pulse', label: 'Pulse' },
      { concept: 'systolic', label: 'Systolic' },
    ]);
    expect(table.newbornRows.map((rows) => rows.map((row) => row.concept))).toEqual([
      ['status', 'pulse', 'apgar'],
      ['pulse'],
    ]);
  });

  it('keeps only the current delivery and drops encounters of another type', () => {
    const table = toSurveillanceTable(
      [
        ...encounters,
        {
          uuid: 'previous-delivery',
          encounterDatetime: '2025-03-01T08:00:00.000+0000',
          encounterType: { uuid: 'surveillance-type' },
          obs: [obs('pulse', 'Pulse', 80)],
        },
        {
          uuid: 'other-type',
          encounterDatetime: '2026-11-05T10:00:00.000+0000',
          encounterType: { uuid: 'another-type' },
          obs: [obs('pulse', 'Pulse', 70)],
        },
      ],
      surveillance,
    );

    expect(table.columns.map((column) => column.uuid)).toEqual(['at-30min', 'at-1h']);
    expect(table.earlierCount).toBe(1);
  });

  it('shows every value, in the order first seen, when no concepts are configured', () => {
    const table = toSurveillanceTable(encounters, { ...surveillance, motherConcepts: [], newbornConcepts: [] });

    expect(table.motherRows.map((row) => row.concept)).toEqual(['pulse', 'systolic', 'blood-loss']);
  });
});

describe('surveillanceUrl', () => {
  it('asks for the newborn groups with their members, and nothing without an encounter type', () => {
    expect(surveillanceUrl('patient-uuid', 'surveillance-type')).toContain(
      'groupMembers:(uuid,concept:(uuid,display),value,formFieldPath)',
    );
    expect(surveillanceUrl('patient-uuid', '')).toBeNull();
  });
});

describe('SurveillanceTable', () => {
  const withData = (data: Array<SurveillanceEncounter>, config: Partial<SurveillanceConfig> = {}) => {
    mockUseConfig.mockReturnValue({ surveillance: { ...surveillance, ...config } });
    mockUseOpenmrsFetchAll.mockReturnValue({ data, isLoading: false, error: undefined } as any);
  };

  it('renders nothing for a patient without a 24-hour surveillance form', () => {
    withData([]);
    const { container } = render(<SurveillanceTable patientUuid="patient-uuid" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing without an encounter type configured', () => {
    withData(encounters, { encounterTypeUuid: '' });
    const { container } = render(<SurveillanceTable patientUuid="patient-uuid" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows one column per time point, then the mother and each newborn', () => {
    withData(encounters);
    render(<SurveillanceTable patientUuid="patient-uuid" />);

    expect(screen.getByText('24-hour surveillance')).toBeInTheDocument();
    const headers = screen.getAllByRole('columnheader').map((header) => header.textContent);
    expect(headers).toEqual(['Time point', '30 min05/11 08:30', '1 h05/11 09:00']);

    const rows = screen.getAllByRole('row').map((row) =>
      within(row)
        .queryAllByRole('cell')
        .map((cell) => cell.textContent),
    );
    expect(rows.slice(1)).toEqual([
      ['Mother'],
      ['Blood loss', '300', '--'],
      ['Pulse', '96', '90'],
      ['Systolic', '--', '115'],
      ['Newborn 1'],
      ['Status', '--', 'Born alive'],
      ['Pulse', '138', '140'],
      ['APGAR', '9', '--'],
      ['Newborn 2'],
      ['Pulse', '--', '150'],
    ]);
  });
});
