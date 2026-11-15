import { type TFunction } from 'i18next';
import { restBaseUrl, showSnackbar, type AttachmentResponse } from '@openmrs/esm-framework';

/*
  Carried over from the patched patient-attachments app (jnsereko/openmrs-esm-patient-chart,
  branch uvl-orthanc-attachment-token, 11897a0), which core 11 no longer ships (#490).

  The Orthanc bridge saves one preview attachment per study and puts the Stone viewer link
  in its caption:

    <orthanc public url>/stone-webviewer/index.html?study=<StudyInstanceUID>&orthancId=<Orthanc study id>

  That link carries no credentials, so opening it as is gets 403 from Orthanc. The orthanctoken
  module trades the Orthanc study id for a short-lived, study-scoped token and returns the
  finished viewer URL; nothing is assembled here.
*/

// Recognise the viewer link by what it IS, not by where it happens to be hosted. Testing for
// ':8889' (Orthanc's loopback debug port) only ever matches a local dev stack; on a real
// deployment the stored link is the public one, so such a guard is never true on its own.
export function isOrthancViewerUrl(description: string | undefined): boolean {
  const url = description ?? '';
  return url.includes('stone-webviewer') || url.includes('orthancId=') || url.includes(':8889');
}

// OpenMRS escapes the caption on the way in, and on UAT it is stored escaped twice
// (`&amp;amp;orthancId=`). Undo it until nothing changes: a single pass leaves `&amp;orthancId=`,
// which no longer matches `[?&]orthancId=`, and the study id silently falls back to the DICOM
// UID that the token endpoint cannot resolve.
export function normaliseCaption(description: string | undefined): string {
  let caption = description ?? '';
  let previous: string;
  do {
    previous = caption;
    caption = caption.replace(/&amp;/g, '&');
  } while (caption !== previous);
  return caption;
}

/**
 * The id to send to the token endpoint: the plain Orthanc study id. The endpoint resolves the
 * study in Orthanc by that id, so it must not be concatenated with the DICOM UID. The UID is only
 * a fallback for a caption that carries no Orthanc id, as in the patch this replaces.
 */
export function getStudyId(description: string | undefined): string | undefined {
  const normalized = normaliseCaption(description);
  const orthancId = normalized.match(/[?&]orthancId=([^&#]+)/)?.[1];
  const study = normalized.match(/[?&]study=([^&#]+)/)?.[1];
  return orthancId ?? study;
}

/** One entry per study: the bridge can save a study's preview more than once. Newest first. */
export function getImagingStudies(attachments: Array<AttachmentResponse>): Array<AttachmentResponse> {
  const byStudy = new Map<string, AttachmentResponse>();
  [...attachments]
    .filter((attachment) => isOrthancViewerUrl(attachment.comment))
    .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())
    .forEach((attachment) => {
      const key = getStudyId(attachment.comment) ?? attachment.uuid;
      if (!byStudy.has(key)) {
        byStudy.set(key, attachment);
      }
    });
  return [...byStudy.values()];
}

export async function openDicomViewer(description: string | undefined, t: TFunction): Promise<void> {
  const studyId = getStudyId(description);

  if (!studyId) {
    showSnackbar({
      title: t('dicomViewerError', 'DICOM Viewer Error'),
      subtitle: t('studyIdNotFound', 'Could not extract the study id from this attachment.'),
      kind: 'error',
    });
    return;
  }

  try {
    const response = await fetch(
      `${window.openmrsBase}${restBaseUrl}/orthanc/token?studyId=${encodeURIComponent(studyId)}`,
      {
        credentials: 'include',
        headers: { Accept: 'application/json' },
      },
    );

    if (response.status === 401) {
      // oauth2login, not the legacy login.htm: this deployment sits behind Keycloak, and the
      // legacy form would be redirected anyway, losing the return path.
      window.location.href = `${window.openmrsBase}/oauth2login?redirect=${encodeURIComponent(window.location.href)}`;
      return;
    }
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const { url } = await response.json();
    if (!url) {
      throw new Error('token endpoint returned no url');
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  } catch (err) {
    showSnackbar({
      title: t('dicomViewerError', 'DICOM Viewer Error'),
      subtitle: t('couldNotOpenViewer', 'Could not open the DICOM viewer: {{error}}', { error: String(err) }),
      kind: 'error',
    });
  }
}
