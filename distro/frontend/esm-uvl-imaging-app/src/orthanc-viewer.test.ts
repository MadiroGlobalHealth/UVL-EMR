import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { showSnackbar, type AttachmentResponse } from '@openmrs/esm-framework';
import { getImagingStudies, getStudyId, isOrthancViewerUrl, normaliseCaption, openDicomViewer } from './orthanc-viewer';

const studyUid = '1.2.840.113619.2.55.3.0000000001';
const orthancId = 'aaaaaaaa-bbbbbbbb-cccccccc-dddddddd-eeeeeeee';
const viewerLink = `https://pacs.example.org/pacs/stone-webviewer/index.html?study=${studyUid}&orthancId=${orthancId}`;
// What OpenMRS actually hands back for the bridge's caption: the ampersand escaped twice.
const storedCaption = viewerLink.replace('&', '&amp;amp;');

const t = ((key: string, defaultValue: string) => defaultValue) as any;

function attachment(overrides: Partial<AttachmentResponse>): AttachmentResponse {
  return {
    uuid: 'attachment-1',
    comment: storedCaption,
    dateTime: '2026-10-30T09:00:00.000+0000',
    bytesMimeType: 'image/png',
    bytesContentFamily: 'IMAGE',
    filename: 'radiology-image.png',
    ...overrides,
  };
}

describe('normaliseCaption', () => {
  it('undoes a caption escaped twice, not just once', () => {
    expect(normaliseCaption(storedCaption)).toBe(viewerLink);
  });

  it('leaves an unescaped link alone', () => {
    expect(normaliseCaption(viewerLink)).toBe(viewerLink);
  });
});

describe('getStudyId', () => {
  it('reads the plain Orthanc study id from a doubly escaped caption', () => {
    // A single &amp; pass leaves `&amp;orthancId=`, which would fall back to the DICOM UID.
    expect(getStudyId(storedCaption)).toBe(orthancId);
  });

  it('falls back to the DICOM UID only when there is no Orthanc id', () => {
    expect(getStudyId(`https://pacs.example.org/pacs/stone-webviewer/index.html?study=${studyUid}`)).toBe(studyUid);
  });

  it('returns nothing for a caption without a study', () => {
    expect(getStudyId('a chest X-ray')).toBeUndefined();
  });
});

describe('isOrthancViewerUrl', () => {
  it('recognises the viewer link whatever host it is on', () => {
    expect(isOrthancViewerUrl(storedCaption)).toBe(true);
    expect(isOrthancViewerUrl('scanned referral letter')).toBe(false);
    expect(isOrthancViewerUrl(undefined)).toBe(false);
  });
});

describe('getImagingStudies', () => {
  it('keeps only radiology previews, one per study, newest first', () => {
    const otherStudy = viewerLink.replace(orthancId, 'ffffffff-00000000-11111111-22222222-33333333');
    const studies = getImagingStudies([
      attachment({ uuid: 'older-copy', dateTime: '2026-10-29T09:00:00.000+0000' }),
      attachment({ uuid: 'newer-copy', dateTime: '2026-10-30T09:00:00.000+0000' }),
      attachment({ uuid: 'other-study', comment: otherStudy, dateTime: '2026-10-31T09:00:00.000+0000' }),
      attachment({ uuid: 'referral', comment: 'scanned referral letter', bytesMimeType: 'application/pdf' }),
    ]);

    expect(studies.map((study) => study.uuid)).toEqual(['other-study', 'newer-copy']);
  });
});

describe('openDicomViewer', () => {
  const fetchMock = vi.fn();
  const openMock = vi.fn();

  beforeEach(() => {
    window.openmrsBase = '/openmrs';
    vi.stubGlobal('fetch', fetchMock);
    window.open = openMock;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('trades the plain Orthanc id for a token and opens the URL the server returns', async () => {
    const tokenisedUrl = `https://pacs.example.org/pacs/stone-webviewer/index.html?study=${studyUid}&token=abc`;
    fetchMock.mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve({ url: tokenisedUrl }) });

    await openDicomViewer(storedCaption, t);

    expect(fetchMock).toHaveBeenCalledWith(
      `/openmrs/ws/rest/v1/orthanc/token?studyId=${orthancId}`,
      expect.objectContaining({ credentials: 'include' }),
    );
    expect(openMock).toHaveBeenCalledWith(tokenisedUrl, '_blank', 'noopener,noreferrer');
    expect(showSnackbar).not.toHaveBeenCalled();
  });

  it('shows an error and opens nothing when the token request fails', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 403 });

    await openDicomViewer(storedCaption, t);

    expect(openMock).not.toHaveBeenCalled();
    expect(showSnackbar).toHaveBeenCalledWith(
      expect.objectContaining({ kind: 'error', title: 'DICOM Viewer Error' }),
    );
  });

  it('does not call the token endpoint for a caption without a study id', async () => {
    await openDicomViewer('scanned referral letter', t);

    expect(fetchMock).not.toHaveBeenCalled();
    expect(showSnackbar).toHaveBeenCalledWith(
      expect.objectContaining({ subtitle: 'Could not extract the study id from this attachment.' }),
    );
  });
});
