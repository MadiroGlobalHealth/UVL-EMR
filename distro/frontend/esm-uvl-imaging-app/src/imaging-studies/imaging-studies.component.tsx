import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  DataTable,
  DataTableSkeleton,
  Layer,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  Tile,
} from '@carbon/react';
import { Launch } from '@carbon/react/icons';
import {
  CardHeader,
  EmptyCardIllustration,
  ErrorState,
  formatDate,
  parseDate,
  useAttachments,
  useLayoutType,
} from '@openmrs/esm-framework';
import { getImagingStudies, openDicomViewer } from '../orthanc-viewer';
import styles from './imaging-studies.scss';

interface ImagingStudiesProps {
  patientUuid: string;
}

/**
 * The patient's radiology studies, one row per study, each opening in the Orthanc viewer.
 *
 * The studies are the preview attachments the Orthanc bridge saves, so this reads the same
 * attachment list (and SWR cache entry) as the attachments card beside it.
 */
const ImagingStudies: React.FC<ImagingStudiesProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const isTablet = useLayoutType() === 'tablet';
  const { data: attachments, isLoading, error } = useAttachments(patientUuid, true);
  const headerTitle = t('imaging', 'Imaging');

  const studies = useMemo(() => getImagingStudies(attachments), [attachments]);

  const headers = [
    { key: 'date', header: t('date', 'Date') },
    { key: 'description', header: t('description', 'Description') },
    { key: 'action', header: '' },
  ];

  const rows = studies.map((study) => ({
    id: study.uuid,
    date: study.dateTime ? formatDate(parseDate(study.dateTime)) : '--',
    description: t('radiologyStudy', 'Radiology study'),
  }));

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" columnCount={3} rowCount={2} zebra />;
  }

  if (error) {
    return <ErrorState error={error} headerTitle={headerTitle} />;
  }

  if (!studies.length) {
    return (
      <Layer>
        <Tile className={styles.emptyState}>
          <div className={isTablet ? styles.tabletHeading : styles.desktopHeading}>
            <h4>{headerTitle}</h4>
          </div>
          <EmptyCardIllustration />
          <p className={styles.emptyStateContent}>
            {t('noImagingStudies', 'There are no radiology studies for this patient')}
          </p>
        </Tile>
      </Layer>
    );
  }

  return (
    <div className={styles.widgetCard}>
      <CardHeader title={headerTitle}>
        <span />
      </CardHeader>
      <DataTable rows={rows} headers={headers} size={isTablet ? 'lg' : 'sm'} useZebraStyles>
        {({ rows: tableRows, headers: tableHeaders, getHeaderProps, getTableProps }) => (
          <TableContainer>
            <Table {...getTableProps()} aria-label={headerTitle}>
              <TableHead>
                <TableRow>
                  {tableHeaders.map((header) => (
                    <TableHeader key={header.key} {...getHeaderProps({ header })}>
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableRows.map((row) => {
                  const caption = studies.find((study) => study.uuid === row.id)?.comment;
                  return (
                    <TableRow key={row.id}>
                      <TableCell>{row.cells[0].value}</TableCell>
                      <TableCell>{row.cells[1].value}</TableCell>
                      <TableCell className={styles.actionCell}>
                        <Button
                          kind="ghost"
                          size={isTablet ? 'md' : 'sm'}
                          renderIcon={(props) => <Launch size={16} {...props} />}
                          onClick={() => openDicomViewer(caption, t)}
                        >
                          {t('openInViewer', 'Open in viewer')}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>
    </div>
  );
};

export default ImagingStudies;
