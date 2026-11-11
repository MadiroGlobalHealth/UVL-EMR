import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ActionMenuButton2, useConfig } from '@openmrs/esm-framework';
import { useActionMenuButtonLaunchProps } from '@openmrs/esm-patient-common-lib';
import PartographActionButton, { partographReadingWorkspace } from './partograph-action-button.component';
import { partographSavedEvent } from './partograph.resource';

vi.mock('@openmrs/esm-patient-common-lib', () => ({
  useActionMenuButtonLaunchProps: vi.fn(),
}));

const mockUseConfig = vi.mocked(useConfig);
const mockLaunchProps = vi.mocked(useActionMenuButtonLaunchProps);

// Synthetic ids: no real form, patient or visit.
const groupProps = {
  patient: { id: 'patient-uuid', gender: 'female' } as fhir.Patient,
  patientUuid: 'patient-uuid',
  visitContext: null,
  mutateVisitContext: () => {},
  showPatientBanner: 'tabletOnly' as const,
};

function renderButton(readingFormUuid: string) {
  mockUseConfig.mockReturnValue({ readingFormUuid });
  mockLaunchProps.mockImplementation((_, workspaceName, workspaceProps) => ({
    workspaceToLaunch: { workspaceName, workspaceProps, windowProps: null },
    onBeforeWorkspaceLaunch: vi.fn(),
  }));
  render(<PartographActionButton groupProps={groupProps} />);
}

describe('PartographActionButton', () => {
  it('opens the configured Partograph Reading form in the form entry workspace', () => {
    renderButton('reading-form');

    expect(screen.getByRole('button', { name: /partograph/i })).toBeInTheDocument();
    expect(mockLaunchProps).toHaveBeenCalledWith(
      groupProps,
      partographReadingWorkspace,
      expect.objectContaining({ form: expect.objectContaining({ uuid: 'reading-form' }) }),
    );
    expect(partographReadingWorkspace).toBe('uvl-partograph-reading-workspace');
    expect(vi.mocked(ActionMenuButton2).mock.calls[0][0]).toMatchObject({
      label: 'Partograph',
      workspaceToLaunch: { workspaceName: partographReadingWorkspace },
    });
  });

  it('is not shown without a form configured', () => {
    renderButton('');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('tells the chart to reload once the form is saved, for this patient', () => {
    renderButton('reading-form');
    const listener = vi.fn();
    window.addEventListener(partographSavedEvent, listener);

    const workspaceProps = mockLaunchProps.mock.lastCall[2] as { handlePostResponse: (encounter: object) => void };
    workspaceProps.handlePostResponse({ uuid: 'saved-encounter' });

    window.removeEventListener(partographSavedEvent, listener);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener.mock.calls[0][0].detail).toEqual({ patientUuid: 'patient-uuid' });
  });
});
