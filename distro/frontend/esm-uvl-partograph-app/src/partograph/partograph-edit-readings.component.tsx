import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@carbon/react';
import { Edit } from '@carbon/react/icons';
import { launchWorkspace2, useSession, userHasAccess } from '@openmrs/esm-framework';
import { getPatientChartWindowProps } from '@openmrs/esm-patient-common-lib';
import { partographReadingWorkspace } from './partograph-action-button.component';
import { notifyPartographSaved } from './partograph.resource';
import styles from './partograph-chart.scss';

/** The encounter type's edit privilege: the one the visit's encounter list asks for « Modifier ». */
export const editPrivilege = 'Edit Partograph Reading';

export interface EditableReading {
  uuid: string;
  /** Reading time, already formatted. */
  when: string;
}

/**
 * One « Modifier » button per saved reading, for holders of `Edit Partograph Reading`. It opens the
 * Partograph Reading form on that encounter (`encounterUuid`), exactly as the visit's encounter
 * list does, in the same workspace as the side-panel button; the chart reloads after the save
 * (#825). Needs no visit: the encounter already has one.
 */
const EditReadings: React.FC<{ patientUuid: string; readingFormUuid: string; readings: Array<EditableReading> }> = ({
  patientUuid,
  readingFormUuid,
  readings,
}) => {
  const { t } = useTranslation();
  const session = useSession();

  if (!readingFormUuid || !readings.length || !userHasAccess(editPrivilege, session?.user)) {
    return null;
  }
  const title = t('partographReading', 'Partograph reading');
  const edit = (encounterUuid: string) =>
    launchWorkspace2(
      partographReadingWorkspace,
      {
        form: { uuid: readingFormUuid, name: title, display: title },
        encounterUuid,
        handlePostResponse: () => notifyPartographSaved(patientUuid),
      },
      getPatientChartWindowProps(patientUuid),
    );

  return (
    <section className={styles.panel} aria-label={t('editReadings', 'Edit a reading')}>
      <h5 className={styles.panelTitle}>{t('editReadings', 'Edit a reading')}</h5>
      <ul className={styles.medications}>
        {readings.map((reading) => (
          <li key={reading.uuid} className={styles.editReading}>
            <span className={styles.medicationTime}>{reading.when}</span>
            <Button
              kind="ghost"
              size="sm"
              renderIcon={(props: React.ComponentProps<typeof Edit>) => <Edit size={16} {...props} />}
              onClick={() => edit(reading.uuid)}
            >
              {t('edit', 'Edit')}
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default EditReadings;
