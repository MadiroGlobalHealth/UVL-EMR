import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { act, render, screen, within } from '@testing-library/react';
import { useConfig, useOpenmrsFetchAll } from '@openmrs/esm-framework';
import type { PartographConfig } from '../config-schema';
import PartographChart from './partograph-chart.component';
import { notifyPartographSaved, partographUrl, toReadings, type PartographEncounter } from './partograph.resource';

const mockUseConfig = vi.mocked(useConfig);
const mockUseOpenmrsFetchAll = vi.mocked(useOpenmrsFetchAll);

// Synthetic configuration and readings: no real concept, patient or staff data.
const config: PartographConfig = {
  encounterTypeUuid: 'partograph-type',
  labourGapHours: 24,
  minimumHours: 12,
  showWhenEmpty: false,
  concepts: {
    fetalHeartRate: 'fhr',
    cervicalDilatation: 'dilatation',
    headDescent: 'descent',
    contractionsPer10Min: 'contractions',
    contractionDuration: 'duration',
    oxytocinConcentration: 'oxytocin-units',
    oxytocinDrops: 'oxytocin-drops',
    pulse: 'pulse',
    systolicBp: 'systolic',
    diastolicBp: 'diastolic',
    temperature: 'temperature',
    amnioticFluid: 'liquor',
    headMoulding: 'moulding',
    medicationsGiven: 'medications',
  },
  liquorCodes: [
    { concept: 'liquor-clear', code: 'C' },
    { concept: 'liquor-meconium', code: 'M' },
  ],
  mouldingCodes: [
    { concept: 'moulding-none', code: '0' },
    { concept: 'moulding-reducible', code: '++' },
  ],
  readingFormUuid: '',
  surveillance: {
    encounterTypeUuid: '',
    timePointConcept: '',
    newbornGroupConcept: '',
    motherConcepts: [],
    newbornConcepts: [],
    gapHours: 48,
  },
};

const obs = (concept: string, value: unknown) => ({ concept: { uuid: concept }, value });

const encounters: Array<PartographEncounter> = [
  {
    uuid: 'reading-3',
    encounterDatetime: '2026-11-04T12:00:00.000+0000',
    encounterType: { uuid: 'partograph-type' },
    obs: [
      obs('fhr', 150),
      obs('dilatation', 7),
      obs('descent', 2),
      obs('contractions', 4),
      obs('duration', 45),
      obs('liquor', { uuid: 'liquor-meconium', display: 'Coloration meconium' }),
      obs('moulding', { uuid: 'moulding-reducible', display: 'Chevauchement réductible' }),
      obs('medications', 'Ab'),
    ],
  },
  {
    uuid: 'reading-1',
    encounterDatetime: '2026-11-04T08:00:00.000+0000',
    encounterType: { uuid: 'partograph-type' },
    obs: [
      obs('fhr', 140),
      obs('dilatation', 4),
      obs('descent', 4),
      obs('contractions', 2),
      obs('duration', 15),
      obs('pulse', 88),
      obs('systolic', 120),
      obs('diastolic', 80),
      obs('temperature', 37.2),
      obs('liquor', { uuid: 'liquor-clear', display: 'Normale' }),
      obs('moulding', { uuid: 'moulding-none', display: 'Aucun' }),
    ],
  },
  {
    uuid: 'reading-2',
    encounterDatetime: '2026-11-04T10:00:00.000+0000',
    encounterType: { uuid: 'partograph-type' },
    obs: [obs('fhr', 145), obs('dilatation', 5), obs('oxytocin-units', 5), obs('oxytocin-drops', 15)],
  },
  {
    uuid: 'other-form',
    encounterDatetime: '2026-11-04T09:00:00.000+0000',
    encounterType: { uuid: 'another-type' },
    obs: [obs('fhr', 60)],
  },
];

function withReadings(data: Array<PartographEncounter> | undefined, overrides: Partial<PartographConfig> = {}) {
  mockUseConfig.mockReturnValue({ ...config, ...overrides });
  mockUseOpenmrsFetchAll.mockReturnValue({ data, error: undefined, isLoading: false } as any);
}

describe('partograph resource', () => {
  it('asks for the patient’s readings of the configured encounter type, and nothing when unconfigured', () => {
    expect(partographUrl('patient-uuid', 'partograph-type')).toContain(
      '/encounter?patient=patient-uuid&encounterType=partograph-type&v=custom:',
    );
    expect(partographUrl('patient-uuid', '')).toBeNull();
  });

  it('keeps the configured encounter type only, oldest first', () => {
    const readings = toReadings(encounters, config);

    expect(readings.map((r) => r.uuid)).toEqual(['reading-1', 'reading-2', 'reading-3']);
    expect(readings[0].values).toMatchObject({ fetalHeartRate: 140, cervicalDilatation: 4, temperature: 37.2 });
  });
});

describe('PartographChart', () => {
  it('renders nothing for a patient without readings', () => {
    withReadings([]);

    const { container } = render(<PartographChart patientUuid="patient-uuid" />);

    expect(container).toBeEmptyDOMElement();
  });

  it('shows a short empty state instead when configured to', () => {
    withReadings([], { showWhenEmpty: true });

    render(<PartographChart patientUuid="patient-uuid" />);

    expect(screen.getByText('No partograph readings for this patient')).toBeInTheDocument();
  });

  it('renders nothing while the encounter type is not configured', () => {
    withReadings(encounters, { encounterTypeUuid: '' });

    const { container } = render(<PartographChart patientUuid="patient-uuid" />);

    expect(container).toBeEmptyDOMElement();
  });

  it('draws the MSPLS panels in order, each with a time axis 00–12 and its clock time', () => {
    withReadings(encounters);

    render(<PartographChart patientUuid="patient-uuid" />);

    expect(mockUseOpenmrsFetchAll).toHaveBeenCalledWith(expect.stringContaining('patient=patient-uuid'));
    const panels = [
      'Fetal heart rate',
      'Amniotic fluid and moulding',
      'Medications given',
      'Cervical dilatation and descent',
      'Contractions per 10 minutes',
      'Oxytocin',
      'Pulse',
      'Blood pressure',
      'Temperature',
    ];
    expect(screen.getAllByRole('img').map((chart) => chart.getAttribute('aria-label'))).toEqual(panels);
    for (const panel of panels) {
      const chart = screen.getByRole('img', { name: panel });
      // Hour 00 is the first reading at 4 cm (08:00); hour 04 is 12:00.
      expect(within(chart).getByText('00')).toBeInTheDocument();
      expect(within(chart).getByText('08:00')).toBeInTheDocument();
      expect(within(chart).getByText('04/11')).toBeInTheDocument();
      expect(within(chart).getByText('04')).toBeInTheDocument();
      expect(within(chart).getByText('12:00')).toBeInTheDocument();
      expect(within(chart).getByText('12')).toBeInTheDocument();
    }
  });

  it('draws the fetal heart rate reference lines at 100 and 180 /min', () => {
    withReadings(encounters);

    render(<PartographChart patientUuid="patient-uuid" />);

    const section = screen.getByRole('region', { name: 'Fetal heart rate' });
    expect(within(section).getByText('Reference lines 100 and 180 /min')).toBeInTheDocument();
    expect(screen.getByTestId('fhr-reference-100')).toBeInTheDocument();
    expect(screen.getByTestId('fhr-reference-180')).toBeInTheDocument();
  });

  it('draws the alert line from 4 cm at 00 to 10 cm at 06 and the action line from 04 to 10, with a legend', () => {
    withReadings(encounters);

    render(<PartographChart patientUuid="patient-uuid" />);

    const section = screen.getByRole('region', { name: 'Cervical dilatation and descent' });
    expect(within(section).getByText('Alert line')).toBeInTheDocument();
    expect(within(section).getByText('Action line')).toBeInTheDocument();
    expect(within(section).getByText('Cervical dilatation (cm)')).toBeInTheDocument();
    expect(within(section).getByText('Descent of the head (fifths)')).toBeInTheDocument();

    // Tick positions on the same chart: the hour lines are the x of each hour.
    const chart = within(section).getByRole('img');
    const hourX = (hour: number) => Number(chart.querySelector(`[data-hour="${hour}"]`).getAttribute('x'));
    const alert = screen.getByTestId('alert-line');
    const action = screen.getByTestId('action-line');
    const n = (el: Element, attr: string) => Number(el.getAttribute(attr));
    expect(n(alert, 'x1')).toBeCloseTo(hourX(0));
    expect(n(alert, 'x2')).toBeCloseTo(hourX(6));
    expect(n(action, 'x1')).toBeCloseTo(hourX(4));
    expect(n(action, 'x2')).toBeCloseTo(hourX(10));
    expect(alert.getAttribute('y1')).toBe(action.getAttribute('y1'));
    expect(alert.getAttribute('y2')).toBe(action.getAttribute('y2'));
  });

  it('reads its settings from its own config namespace', () => {
    withReadings(encounters);

    render(<PartographChart patientUuid="patient-uuid" />);

    expect(mockUseConfig).toHaveBeenCalledWith({ externalModuleName: '@madiro/uvl-partograph' });
  });

  it('keeps the codes of two readings 25 min apart separate and readable', () => {
    const close: Array<PartographEncounter> = [
      {
        uuid: 'at-1100',
        encounterDatetime: '2026-11-04T11:00:00.000+0000',
        encounterType: { uuid: 'partograph-type' },
        obs: [obs('dilatation', 4), obs('moulding', { uuid: 'moulding-none' })],
      },
      {
        uuid: 'at-1400',
        encounterDatetime: '2026-11-04T14:00:00.000+0000',
        encounterType: { uuid: 'partograph-type' },
        obs: [
          obs('liquor', { uuid: 'liquor-meconium' }),
          obs('moulding', { uuid: 'moulding-reducible' }),
          obs('medications', 'Ab : ampicilline'),
        ],
      },
      {
        uuid: 'at-1425',
        encounterDatetime: '2026-11-04T14:25:00.000+0000',
        encounterType: { uuid: 'partograph-type' },
        obs: [
          obs('liquor', { uuid: 'liquor-blood' }),
          obs('moulding', { uuid: 'moulding-irreducible' }),
          obs('medications', 'Ocytocine 5 UI'),
        ],
      },
    ];
    withReadings(close, {
      liquorCodes: [...config.liquorCodes, { concept: 'liquor-blood', code: 'B' }],
      mouldingCodes: [...config.mouldingCodes, { concept: 'moulding-irreducible', code: '+++' }],
    });

    render(<PartographChart patientUuid="patient-uuid" />);

    const codes = screen.getByRole('img', { name: 'Amniotic fluid and moulding' });
    const reducible = within(codes).getByText('++');
    const irreducible = within(codes).getByText('+++');
    expect(within(codes).queryByText('+++++')).not.toBeInTheDocument();
    // Same half-hour cell (14:00–14:30): same column, one line each.
    expect(reducible.getAttribute('x')).toBe(irreducible.getAttribute('x'));
    expect(Number(irreducible.getAttribute('y'))).toBeGreaterThan(Number(reducible.getAttribute('y')));
    expect(within(codes).getByText('M').getAttribute('y')).not.toBe(within(codes).getByText('B').getAttribute('y'));

    const medications = screen.getByRole('img', { name: 'Medications given' });
    const first = within(medications).getByText('1');
    const second = within(medications).getByText('2');
    expect(first.getAttribute('x')).toBe(second.getAttribute('x'));
    expect(first.getAttribute('y')).not.toBe(second.getAttribute('y'));
    const list = screen.getByRole('region', { name: 'Medications given, in full' });
    expect(within(list).getByText('Ab : ampicilline')).toBeInTheDocument();
    expect(within(list).getByText('Ocytocine 5 UI')).toBeInTheDocument();
  });

  it('keeps the code of a reading a few seconds before the axis start inside the first cell', () => {
    withReadings([
      {
        uuid: 'latent',
        encounterDatetime: '2026-11-04T09:59:50.000+0000',
        encounterType: { uuid: 'partograph-type' },
        obs: [obs('dilatation', 3), obs('liquor', { uuid: 'liquor-clear' })],
      },
      {
        uuid: 'active',
        encounterDatetime: '2026-11-04T11:00:00.000+0000',
        encounterType: { uuid: 'partograph-type' },
        obs: [obs('dilatation', 4)],
      },
    ]);

    render(<PartographChart patientUuid="patient-uuid" />);

    const chart = screen.getByRole('img', { name: 'Amniotic fluid and moulding' });
    const firstTick = chart.querySelector('[data-hour="-1"]');
    expect(firstTick).not.toBeNull();
    expect(chart.querySelector('[data-hour="-2"]')).toBeNull();
    // Centred in the -01 to -00:30 cell, right of the -01 tick.
    expect(Number(within(chart).getByText('C').getAttribute('x'))).toBeGreaterThan(Number(firstTick.getAttribute('x')));
  });

  it('shows liquor and moulding as partograph codes, not concept names', () => {
    withReadings(encounters);

    render(<PartographChart patientUuid="patient-uuid" />);

    const section = screen.getByRole('region', { name: 'Amniotic fluid and moulding' });
    for (const code of ['C', 'M', '0', '++']) {
      expect(within(section).getByText(code)).toBeInTheDocument();
    }
    expect(screen.queryByText('Coloration meconium')).not.toBeInTheDocument();
    expect(screen.queryByText('Normale')).not.toBeInTheDocument();
  });

  it('shows the medications on their row and in full with their time', () => {
    withReadings(encounters);

    render(<PartographChart patientUuid="patient-uuid" />);

    const row = screen.getByRole('img', { name: 'Medications given' });
    expect(within(row).getByText('1')).toBeInTheDocument();
    const list = screen.getByRole('region', { name: 'Medications given, in full' });
    expect(within(list).getByText('Ab')).toBeInTheDocument();
    expect(within(list).getByText('04/11 12:00 (+4 h 00)')).toBeInTheDocument();
  });

  it('shows the oxytocin doses on their own row', () => {
    withReadings(encounters);

    render(<PartographChart patientUuid="patient-uuid" />);

    const row = screen.getByRole('img', { name: 'Oxytocin' });
    expect(within(row).getByText('U/L')).toBeInTheDocument();
    expect(within(row).getByText('Drops/min')).toBeInTheDocument();
    expect(within(row).getByText('5')).toBeInTheDocument();
    expect(within(row).getByText('15')).toBeInTheDocument();
});
});

describe('PartographChart after a reading is saved from the side panel', () => {
  it('reloads the readings of this patient only', () => {
    const mutate = vi.fn();
    mockUseConfig.mockReturnValue(config);
    mockUseOpenmrsFetchAll.mockReturnValue({ data: encounters, error: undefined, isLoading: false, mutate } as any);

    render(<PartographChart patientUuid="patient-uuid" />);
    act(() => notifyPartographSaved('another-patient'));
    expect(mutate).not.toHaveBeenCalled();

    act(() => notifyPartographSaved('patient-uuid'));
    expect(mutate).toHaveBeenCalledTimes(1);
  });
});
