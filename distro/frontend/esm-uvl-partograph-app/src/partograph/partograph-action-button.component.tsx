import React, { type ComponentProps, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionMenuButton2, ChartLineIcon, useConfig } from '@openmrs/esm-framework';
import {
  type PatientChartWorkspaceActionButtonProps,
  useActionMenuButtonLaunchProps,
} from '@openmrs/esm-patient-common-lib';
import { configNamespace, type PartographConfig } from '../config-schema';
import { notifyPartographSaved } from './partograph.resource';

/** Registered in routes.json, in the window of the same name. */
export const partographReadingWorkspace = 'uvl-partograph-reading-workspace';

/**
 * The "Partograph" button of the patient chart's side panel, next to the Visit Note. It opens the
 * Partograph Reading form (`readingFormUuid`) in the patient forms app's form entry workspace, the
 * one the clinical forms list opens, so the form behaves as it did from the list. Like the clinical
 * forms button, it asks for a visit first when the patient has none.
 *
 * This button uses the patient chart store and must only be used within the patient chart.
 */
const PartographActionButton: React.FC<PatientChartWorkspaceActionButtonProps> = ({ groupProps }) => {
  const { t } = useTranslation();
  // Read from its own namespace, not the module's: see configNamespace.
  const { readingFormUuid } = useConfig<PartographConfig>({ externalModuleName: configNamespace });
  const title = t('partographReading', 'Partograph reading');
  const patientUuid = groupProps?.patientUuid;

  const workspaceProps = useMemo(
    () => ({
      form: { uuid: readingFormUuid, name: title, display: title },
      handlePostResponse: () => notifyPartographSaved(patientUuid),
    }),
    [readingFormUuid, title, patientUuid],
  );
  const launchProps = useActionMenuButtonLaunchProps(groupProps, partographReadingWorkspace, workspaceProps);

  if (!readingFormUuid) {
    return null;
  }
  return (
    <ActionMenuButton2
      icon={(props: ComponentProps<typeof ChartLineIcon>) => <ChartLineIcon {...props} />}
      label={t('partograph', 'Partograph')}
      {...launchProps}
    />
  );
};

export default PartographActionButton;
