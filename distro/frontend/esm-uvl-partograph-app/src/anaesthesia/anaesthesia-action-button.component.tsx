import React, { type ComponentProps, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionMenuButton2, ChartLineIcon, useConfig } from '@openmrs/esm-framework';
import {
  type PatientChartWorkspaceActionButtonProps,
  useActionMenuButtonLaunchProps,
} from '@openmrs/esm-patient-common-lib';
import { configNamespace, type PartographConfig } from '../config-schema';
import { notifyAnaesthesiaSaved } from './anaesthesia.resource';

/** Registered in routes.json, in the window of the same name. */
export const anaesthesiaReadingWorkspace = 'uvl-anaesthesia-reading-workspace';

/**
 * The "Anaesthesia reading" button of the patient chart's side panel: opens the one-reading
 * Anaesthesia form (`anaesthesia.readingFormUuid`) in the patient forms app's form entry workspace,
 * as the partograph button does, and tells the chart to reload when the reading is saved.
 *
 * This button uses the patient chart store and must only be used within the patient chart.
 */
const AnaesthesiaActionButton: React.FC<PatientChartWorkspaceActionButtonProps> = ({ groupProps }) => {
  const { t } = useTranslation();
  const { anaesthesia } = useConfig<PartographConfig>({ externalModuleName: configNamespace });
  const readingFormUuid = anaesthesia?.readingFormUuid;
  const title = t('anaesthesiaReading', 'Anaesthesia reading');
  const patientUuid = groupProps?.patientUuid;

  const workspaceProps = useMemo(
    () => ({
      form: { uuid: readingFormUuid, name: title, display: title },
      handlePostResponse: () => notifyAnaesthesiaSaved(patientUuid),
    }),
    [readingFormUuid, title, patientUuid],
  );
  const launchProps = useActionMenuButtonLaunchProps(groupProps, anaesthesiaReadingWorkspace, workspaceProps);

  if (!readingFormUuid) {
    return null;
  }
  return (
    <ActionMenuButton2
      icon={(props: ComponentProps<typeof ChartLineIcon>) => <ChartLineIcon {...props} />}
      label={t('anaesthesia', 'Anaesthesia')}
      {...launchProps}
    />
  );
};

export default AnaesthesiaActionButton;
