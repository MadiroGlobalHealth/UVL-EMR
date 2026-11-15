import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@carbon/react';
import { CardHeader, ErrorState, useConfig } from '@openmrs/esm-framework';
import dayjs from 'dayjs';
import { configNamespace, type PartographConfig } from '../config-schema';
import { type SurveillanceRow, type SurveillanceTableData, useSurveillance } from './surveillance.resource';
import styles from './surveillance-table.scss';

interface SurveillanceTableProps {
  patientUuid: string;
}

/** i18next escapes interpolated values for HTML by default; React escapes them already. */
const unescaped = { interpolation: { escapeValue: false } };

/**
 * The 24-Hour Surveillance of the patient's current delivery: one column per saved form, headed by
 * its time point (30 min … 24 h), with the mother's values and then each newborn's. Renders nothing
 * for a patient without one, and nothing while they load, so the summary dashboard does not show an
 * empty card on every chart.
 */
const SurveillanceTable: React.FC<SurveillanceTableProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  // Read from its own namespace, not the module's: see configNamespace.
  const { surveillance } = useConfig<PartographConfig>({ externalModuleName: configNamespace });
  const { table, error, isLoading } = useSurveillance(patientUuid, surveillance);
  const title = t('surveillance24h', '24-hour surveillance');

  if (!surveillance?.encounterTypeUuid || isLoading) {
    return null;
  }
  if (error) {
    return <ErrorState error={error} headerTitle={title} />;
  }
  if (!table?.columns.length) {
    return null;
  }
  return <SurveillanceCard title={title} table={table} />;
};

const SurveillanceCard: React.FC<{ title: string; table: SurveillanceTableData }> = ({ title, table }) => {
  const { t } = useTranslation();
  const { columns, motherRows, newbornRows, earlierCount } = table;

  const valueRows = (rows: Array<SurveillanceRow>, valuesOf: (index: number) => Record<string, string>) =>
    rows.map((row) => (
      <TableRow key={row.concept}>
        <TableCell className={styles.rowLabel}>{row.label}</TableCell>
        {columns.map((column, index) => (
          <TableCell key={column.uuid}>{valuesOf(index)[row.concept] ?? '--'}</TableCell>
        ))}
      </TableRow>
    ));

  const sectionRow = (label: string) => (
    <TableRow className={styles.sectionRow}>
      <TableCell colSpan={columns.length + 1}>{label}</TableCell>
    </TableRow>
  );

  return (
    <div className={styles.widgetCard}>
      <CardHeader title={title}>
        <span />
      </CardHeader>
      <div className={styles.content}>
        {earlierCount > 0 ? (
          <p className={styles.note}>
            {t('earlierSurveillance', '{{count}} earlier forms (previous delivery) are not shown', {
              count: earlierCount,
              ...unescaped,
            })}
          </p>
        ) : null}
        <div className={styles.tableWrapper}>
          <Table size="sm" useZebraStyles={false} aria-label={title}>
            <TableHead>
              <TableRow>
                <TableHeader>{t('timePoint', 'Time point')}</TableHeader>
                {columns.map((column) => (
                  <TableHeader key={column.uuid}>
                    <span className={styles.timePoint}>{column.timePoint ?? '--'}</span>
                    <span className={styles.time}>{dayjs(column.time).format('DD/MM HH:mm')}</span>
                  </TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {motherRows.length ? (
                <>
                  {sectionRow(t('mother', 'Mother'))}
                  {valueRows(motherRows, (index) => columns[index].mother)}
                </>
              ) : null}
              {newbornRows.map((rows, newborn) =>
                rows.length ? (
                  <Fragment key={`newborn-${newborn}`}>
                    {sectionRow(t('newbornNumber', 'Newborn {{number}}', { number: newborn + 1, ...unescaped }))}
                    {valueRows(rows, (index) => columns[index].newborns[newborn] ?? {})}
                  </Fragment>
                ) : null,
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default SurveillanceTable;
