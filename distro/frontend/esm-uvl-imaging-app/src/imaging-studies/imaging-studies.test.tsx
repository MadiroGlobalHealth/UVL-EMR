import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useAttachments } from '@openmrs/esm-framework';
import { openDicomViewer } from '../orthanc-viewer';
import ImagingStudies from './imaging-studies.component';

vi.mock('../orthanc-viewer', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../orthanc-viewer')>()),
  openDicomViewer: vi.fn(),
}));

const mockUseAttachments = vi.mocked(useAttachments);
const caption =
  'https://pacs.example.org/pacs/stone-webviewer/index.html?study=1.2.3&amp;amp;orthancId=aaaaaaaa-bbbbbbbb-cccccccc-dddddddd-eeeeeeee';

function withAttachments(data: Array<any>) {
  mockUseAttachments.mockReturnValue({ data, isLoading: false, error: undefined, mutate: vi.fn(), isValidating: false });
}

describe('ImagingStudies', () => {
  it('shows an empty state when the patient has no radiology study', () => {
    withAttachments([
      { uuid: 'referral', comment: 'scanned referral letter', dateTime: '2026-10-30T09:00:00.000+0000' },
    ]);

    render(<ImagingStudies patientUuid="patient-uuid" />);

    expect(screen.getByText('Imaging')).toBeInTheDocument();
    expect(screen.getByText('There are no radiology studies for this patient')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /open in viewer/i })).not.toBeInTheDocument();
  });

  it('dates each study in the standard format, not the wide one with dashes', () => {
    withAttachments([
      { uuid: 'study-preview', comment: caption, dateTime: '2026-10-30T09:00:00.000+0000', filename: 'radiology-image.png' },
    ]);

    render(<ImagingStudies patientUuid="patient-uuid" />);

    expect(screen.getByText('30-Oct-2026')).toBeInTheDocument();
    expect(screen.queryByText(/—/)).not.toBeInTheDocument();
  });

  it('lists each study and opens it in the viewer', async () => {
    withAttachments([
      { uuid: 'study-preview', comment: caption, dateTime: '2026-10-30T09:00:00.000+0000', filename: 'radiology-image.png' },
    ]);

    render(<ImagingStudies patientUuid="patient-uuid" />);

    expect(mockUseAttachments).toHaveBeenCalledWith('patient-uuid', true);
    expect(screen.getByText('Radiology study')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /open in viewer/i }));
    expect(openDicomViewer).toHaveBeenCalledWith(caption, expect.any(Function));
  });
});
