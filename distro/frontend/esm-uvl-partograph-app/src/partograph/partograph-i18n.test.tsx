import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useConfig, useOpenmrsFetchAll } from '@openmrs/esm-framework';
import i18next from 'i18next';
import fr from '../../translations/fr.json';
import PartographChart from './partograph-chart.component';

// A real i18next with the module's French strings and the default escapeValue: true, as in the
// app shell, instead of the key-echoing mock.
const i18n = vi.hoisted(() => ({ instance: undefined as any }));
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (...args: Array<any>) => i18n.instance.t(...args) }),
}));

const config = {
  encounterTypeUuid: 'partograph-type',
  labourGapHours: 24,
  minimumHours: 12,
  showWhenEmpty: false,
  concepts: { cervicalDilatation: 'dilatation' },
  liquorCodes: [],
  mouldingCodes: [],
};

function withEncounters(times: Array<string>) {
  vi.mocked(useConfig).mockReturnValue(config);
  vi.mocked(useOpenmrsFetchAll).mockReturnValue({
    data: times.map((time, index) => ({
      uuid: `reading-${index}`,
      encounterDatetime: time,
      encounterType: { uuid: 'partograph-type' },
      obs: [{ concept: { uuid: 'dilatation' }, value: 4 + index }],
    })),
    isLoading: false,
    error: undefined,
  } as any);
}

describe('PartographChart in French, with i18next', () => {
  it('shows dates with their slashes, not HTML-escaped, and one reading in the singular', async () => {
    i18n.instance = i18next.createInstance();
    await i18n.instance.init({ lng: 'fr', resources: { fr: { translation: fr } } });
    withEncounters(['2026-11-04T11:00:00.000+0000']);

    render(<PartographChart patientUuid="patient-uuid" />);

    expect(screen.getByText('Première lecture 04/11/2026 11:00 · 1 lecture · dernière 04/11 11:00')).toBeInTheDocument();
    expect(screen.getByText(/^L'heure 00 \(04\/11 11:00\)/)).toBeInTheDocument();
    expect(document.body.textContent).not.toContain('&#x2F;');
  });

  it('uses the plural for several readings', async () => {
    i18n.instance = i18next.createInstance();
    await i18n.instance.init({ lng: 'fr', resources: { fr: { translation: fr } } });
    withEncounters(['2026-11-04T11:00:00.000+0000', '2026-11-04T14:25:00.000+0000']);

    render(<PartographChart patientUuid="patient-uuid" />);

    expect(screen.getByText('Première lecture 04/11/2026 11:00 · 2 lectures · dernière 04/11 14:25')).toBeInTheDocument();
  });
});
