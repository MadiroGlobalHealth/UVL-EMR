import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CardHeader, ErrorState, useConfig, useLayoutType } from '@openmrs/esm-framework';
import dayjs from 'dayjs';
import { configNamespace, type PartographConcepts, type PartographConfig } from '../config-schema';
import { ChartPanel, hourWidthFor, type LegendItem, PointMarker, Series } from './chart-panel.component';
import {
  alertAndActionLines,
  cellHours,
  type CodedValue,
  currentLabour,
  type DurationCategory,
  durationCategory,
  formatElapsed,
  hoursSince,
  partographCode,
  partographOrigin,
  timeAxis,
  timeTicks,
  toCells,
  valueDomain,
  valueTicks,
} from './partograph-math';
import { type PartographReading, usePartographReadings } from './partograph.resource';
import styles from './partograph-chart.scss';

// Carbon palette.
const COLORS = {
  red: '#da1e28',
  blue: '#0f62fe',
  purple: '#8a3ffc',
  green: '#24a148',
  orange: '#ff832b',
  teal: '#007d79',
  magenta: '#d02670',
  reference: '#393939',
};

const DURATION_FILL: Record<DurationCategory, string> = {
  short: '#e0e0e0',
  medium: '#8d8d8d',
  long: '#393939',
  unknown: '#ffffff',
};

interface PartographChartProps {
  patientUuid: string;
}

/**
 * The partograph of the patient's current labour, drawn from the saved Partograph Reading
 * encounters. Renders nothing for a patient without readings (unless `showWhenEmpty`), and
 * nothing while they load, so the summary dashboard does not flash an empty card.
 */
const PartographChart: React.FC<PartographChartProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  // Read from its own namespace, not the module's: see configNamespace.
  const config = useConfig<PartographConfig>({ externalModuleName: configNamespace });
  const { readings, error, isLoading } = usePartographReadings(patientUuid, config);
  const title = t('partograph', 'Partograph');

  if (!config.encounterTypeUuid || isLoading) {
    return null;
  }
  if (error) {
    return <ErrorState error={error} headerTitle={title} />;
  }
  if (!readings?.length) {
    return config.showWhenEmpty ? <EmptyPartograph title={title} /> : null;
  }
  return <PartographCard title={title} readings={readings} config={config} />;
};

const EmptyPartograph: React.FC<{ title: string }> = ({ title }) => {
  const { t } = useTranslation();
  const isTablet = useLayoutType() === 'tablet';
  return (
    <div className={styles.emptyState}>
      <div className={isTablet ? styles.tabletHeading : styles.desktopHeading}>
        <h4>{title}</h4>
      </div>
      <p className={styles.emptyStateContent}>{t('noReadings', 'No partograph readings for this patient')}</p>
    </div>
  );
};

type Plotted = { hour: number; value: number; tooltip: string };

function numberValue(reading: PartographReading, key: keyof PartographConcepts): number | undefined {
  const value = reading.values[key];
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value))) {
    return Number(value);
  }
  return undefined;
}

interface TextRow {
  label: string;
  entries: Array<{ key: string; hour: number; text: string; tooltip?: string }>;
}

/** i18next escapes interpolated values for HTML by default; React escapes them already. */
const unescaped = { interpolation: { escapeValue: false } };

/** Narrowest cell of a code row, in SVG units: room for "+++" at 12 px. */
const MINIMUM_CELL_WIDTH = 24;
/** Height of one line of a code row; a cell holding two readings is two lines high. */
const LINE_HEIGHT = 16;

const PartographCard: React.FC<{ title: string; readings: Array<PartographReading>; config: PartographConfig }> = ({
  title,
  readings: allReadings,
  config,
}) => {
  const { t } = useTranslation();

  const chart = useMemo(() => {
    const { readings, earlierCount } = currentLabour(allReadings, config.labourGapHours);
    const origin = partographOrigin(
      readings.map((reading) => ({ time: reading.time, dilatation: numberValue(reading, 'cervicalDilatation') })),
    );
    const first = readings[0].time;
    const last = readings[readings.length - 1].time;
    const axis = timeAxis(hoursSince(origin, first), hoursSince(origin, last), config.minimumHours);

    const at = (reading: PartographReading) => hoursSince(origin, reading.time);
    const when = (reading: PartographReading) =>
      `${dayjs(reading.time).format('DD/MM HH:mm')} (${formatElapsed(at(reading))})`;
    const series = (key: keyof PartographConcepts, label: string, unit = ''): Array<Plotted> =>
      readings.flatMap((reading) => {
        const value = numberValue(reading, key);
        if (value === undefined) {
          return [];
        }
        return [{ hour: at(reading), value, tooltip: `${when(reading)}: ${label} ${value}${unit ? ` ${unit}` : ''}` }];
      });

    return { readings, earlierCount, origin, first, last, axis, ticks: timeTicks(origin, axis), at, when, series };
  }, [allReadings, config.labourGapHours, config.minimumHours]);

  const { readings, earlierCount, origin, first, last, axis, ticks, at, when, series } = chart;
  const common = { ticks, axis };
  const noValue = t('noValue', 'No value recorded');

  // Code rows (liquor, moulding, medications, oxytocin) use the paper sheet's half-hour cells: a
  // reading's code is centred in its cell, and readings sharing a cell are stacked one per line.
  const cellSize = cellHours(hourWidthFor(axis), MINIMUM_CELL_WIDTH);
  const textRowsPanel = (panelTitle: string, rows: Array<TextRow>, note?: string) => {
    // A reading just before the axis start (within its 5-minute tolerance) counts in the first cell.
    const cellsByRow = rows.map((row) =>
      toCells(
        row.entries.map((entry) => ({ ...entry, hour: Math.max(entry.hour, axis.start) })),
        cellSize,
      ),
    );
    const lines = cellsByRow.map((cells) => Math.max(1, ...cells.map((cell) => cell.entries.length)));
    const heights = lines.map((count) => count * LINE_HEIGHT + 6);
    const plotHeight = heights.reduce((sum, height) => sum + height, 0);
    return (
      <ChartPanel
        {...common}
        title={panelTitle}
        legend={[]}
        note={note}
        rowLabels={rows.map((row) => row.label)}
        rowHeights={heights}
        plotHeight={plotHeight}
        emptyText={rows.some((row) => row.entries.length) ? undefined : noValue}
      >
        {(scales) => (
          <>
            {Array.from({ length: Math.round((axis.end - axis.start) / cellSize) + 1 }, (_, i) => axis.start + i * cellSize)
              .filter((hour) => !Number.isInteger(hour))
              .map((hour) => (
                <line
                  key={hour}
                  className={styles.cellLine}
                  x1={scales.x(hour)}
                  x2={scales.x(hour)}
                  y1={scales.top}
                  y2={scales.bottom}
                />
              ))}
            {cellsByRow.map((cells, rowIndex) => {
              const rowTop = scales.top + heights.slice(0, rowIndex).reduce((sum, height) => sum + height, 0) + 3;
              return (
                <g key={rows[rowIndex].label} className={styles.code} data-testid={`code-row-${rowIndex}`}>
                  {cells.map((cell) =>
                    cell.entries.map((entry, line) => (
                      <text
                        key={entry.key}
                        x={scales.x(cell.start + cellSize / 2)}
                        y={rowTop + (line + 0.5) * LINE_HEIGHT}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        {entry.tooltip ? <title>{entry.tooltip}</title> : null}
                        {entry.text}
                      </text>
                    )),
                  )}
                </g>
              );
            })}
          </>
        )}
      </ChartPanel>
    );
  };

  const codeCells = (key: 'amnioticFluid' | 'headMoulding', mapping: PartographConfig['liquorCodes']) =>
    readings.flatMap((reading) => {
      const code = partographCode(reading.values[key] as CodedValue, mapping);
      return code ? [{ key: reading.uuid, hour: at(reading), text: code, tooltip: `${when(reading)}: ${code}` }] : [];
    });
  const numberCells = (key: keyof PartographConcepts) =>
    readings.flatMap((reading) => {
      const value = numberValue(reading, key);
      return value !== undefined
        ? [{ key: reading.uuid, hour: at(reading), text: String(value), tooltip: `${when(reading)}: ${value}` }]
        : [];
    });

  // Fetal heart rate
  const fhrLabel = t('fetalHeartRateBpm', 'Fetal heart rate (bpm)');
  const fhr = series('fetalHeartRate', fhrLabel);
  const fhrDomain = valueDomain(fhr.map((p) => p.value), 80, 200, 10);

  // Medications
  const medications = readings.flatMap((reading) => {
    const text = reading.values.medicationsGiven;
    return typeof text === 'string' && text.trim()
      ? [{ uuid: reading.uuid, hour: at(reading), when: when(reading), text: text.trim() }]
      : [];
  }).map((medication, index) => ({ ...medication, marker: String(index + 1) }));

  // Dilatation and descent
  const dilatationLabel = t('dilatationCm', 'Cervical dilatation (cm)');
  const descentLabel = t('descentFifths', 'Descent of the head (fifths)');
  const dilatation = series('cervicalDilatation', dilatationLabel);
  const descent = series('headDescent', descentLabel);
  const whoLines = alertAndActionLines(dilatation);

  // Contractions
  const contractionsLabel = t('contractionsPer10Min', 'Contractions per 10 minutes');
  const contractions = readings.flatMap((reading) => {
    const count = numberValue(reading, 'contractionsPer10Min');
    if (count === undefined) {
      return [];
    }
    const duration = numberValue(reading, 'contractionDuration');
    return [{ uuid: reading.uuid, hour: at(reading), count, duration, category: durationCategory(duration) }];
  });
  const contractionsDomain = valueDomain(contractions.map((c) => c.count), 0, 5, 1);
  const contractionLegend: Array<LegendItem> = [
    { label: t('durationShort', 'Under 20 s'), color: DURATION_FILL.short, kind: 'bar' },
    { label: t('durationMedium', '20 to 40 s'), color: DURATION_FILL.medium, kind: 'bar' },
    { label: t('durationLong', 'Over 40 s'), color: DURATION_FILL.long, kind: 'bar' },
  ];
  if (contractions.some((c) => c.category === 'unknown')) {
    contractionLegend.push({ label: t('durationUnknown', 'Duration not recorded'), color: DURATION_FILL.unknown, kind: 'bar' });
  }

  // Pulse
  const pulseLabel = t('pulse', 'Pulse (/min)');
  const pulse = series('pulse', pulseLabel);
  const pulseDomain = valueDomain(pulse.map((p) => p.value), 40, 180, 10);

  // Blood pressure
  const bpLabel = t('systolicDiastolic', 'Systolic / diastolic (mmHg)');
  const pressures = readings.flatMap((reading) => {
    const systolic = numberValue(reading, 'systolicBp');
    const diastolic = numberValue(reading, 'diastolicBp');
    if (systolic === undefined && diastolic === undefined) {
      return [];
    }
    return [{ uuid: reading.uuid, hour: at(reading), systolic, diastolic, when: when(reading) }];
  });
  const bpDomain = valueDomain(
    pressures.flatMap((p) => [p.systolic, p.diastolic].filter((v) => v !== undefined)),
    40,
    200,
    10,
  );

  // Temperature
  const temperatureLabel = t('temperatureCelsius', 'Temperature (°C)');
  const temperature = series('temperature', temperatureLabel, '°C');
  const temperatureDomain = valueDomain(temperature.map((p) => p.value), 35, 43, 0.5);

  return (
    <div className={styles.widgetCard}>
      <CardHeader title={title}>
        <span />
      </CardHeader>
      <div className={styles.content}>
        <p className={styles.summary}>
          {t('summary', 'First reading {{start}} · {{count}} readings · last {{last}}', {
            start: dayjs(first).format('DD/MM/YYYY HH:mm'),
            count: readings.length,
            last: dayjs(last).format('DD/MM HH:mm'),
            ...unescaped,
          })}
        </p>
        <p className={styles.note}>
          {t('timeAxisNote', 'Hour 00 ({{origin}}) is where the alert line is at 4 cm; each hour shows its clock time.', {
            origin: dayjs(origin).format('DD/MM HH:mm'),
            ...unescaped,
          })}
        </p>
        {earlierCount > 0 ? (
          <p className={styles.note}>
            {t('earlierReadings', '{{count}} earlier readings (previous labour) are not shown', { count: earlierCount, ...unescaped })}
          </p>
        ) : null}

        <ChartPanel
          {...common}
          title={t('fetalHeartRate', 'Fetal heart rate')}
          legend={[
            { label: fhrLabel, color: COLORS.red, kind: 'line', marker: 'circle' },
            { label: t('fhrReferenceLines', 'Reference lines 100 and 180 /min'), color: COLORS.reference, kind: 'line' },
          ]}
          yDomain={fhrDomain}
          yTicks={valueTicks(fhrDomain, 10)}
          plotHeight={150}
          emptyText={fhr.length ? undefined : noValue}
        >
          {(scales) => (
            <>
              {[100, 180].map((value) => (
                <line
                  key={value}
                  data-testid={`fhr-reference-${value}`}
                  x1={scales.x(axis.start)}
                  x2={scales.x(axis.end)}
                  y1={scales.y(value)}
                  y2={scales.y(value)}
                  stroke={COLORS.reference}
                  strokeWidth={1.5}
                />
              ))}
              <Series points={fhr} scales={scales} color={COLORS.red} marker="circle" />
            </>
          )}
        </ChartPanel>

        {textRowsPanel(
          t('liquorAndMoulding', 'Amniotic fluid and moulding'),
          [
            { label: t('liquor', 'Liquor'), entries: codeCells('amnioticFluid', config.liquorCodes) },
            { label: t('moulding', 'Moulding'), entries: codeCells('headMoulding', config.mouldingCodes) },
          ],
          t(
            'codesNote',
            'Amniotic fluid: I intact membranes, C clear, M meconium-stained, B blood-stained. Moulding: 0 none, + bones touching, ++ overlapping reducible, +++ overlapping not reducible.',
          ),
        )}

        {textRowsPanel(
          t('medications', 'Medications given'),
          [
            {
              label: t('medicationsShort', 'Drugs'),
              entries: medications.map((m) => ({ key: m.uuid, hour: m.hour, text: m.marker, tooltip: `${m.when}: ${m.text}` })),
            },
          ],
          medications.length ? t('medicationsNote', 'Numbers refer to the list under the chart.') : undefined,
        )}

        <ChartPanel
          {...common}
          title={t('dilatationAndDescent', 'Cervical dilatation and descent')}
          legend={[
            { label: dilatationLabel, color: COLORS.blue, kind: 'line', marker: 'cross' },
            { label: descentLabel, color: COLORS.purple, kind: 'line', marker: 'circle' },
            { label: t('alertLine', 'Alert line'), color: COLORS.orange, kind: 'line' },
            { label: t('actionLine', 'Action line'), color: COLORS.red, kind: 'dashed' },
          ]}
          note={t(
            'whoLinesNote',
            'Alert line: 4 cm at hour 00 to 10 cm at hour 06 (1 cm per hour). Action line: 4 cm at hour 04 to 10 cm at hour 10.',
          )}
          yDomain={[0, 10]}
          yTicks={valueTicks([0, 10], 1)}
          plotHeight={180}
          emptyText={dilatation.length || descent.length ? undefined : noValue}
        >
          {(scales) => (
            <>
              {whoLines ? (
                <>
                  <line
                    data-testid="alert-line"
                    x1={scales.x(whoLines.alert.from.hour)}
                    y1={scales.y(whoLines.alert.from.value)}
                    x2={scales.x(whoLines.alert.to.hour)}
                    y2={scales.y(whoLines.alert.to.value)}
                    stroke={COLORS.orange}
                    strokeWidth={2}
                  />
                  <line
                    data-testid="action-line"
                    x1={scales.x(whoLines.action.from.hour)}
                    y1={scales.y(whoLines.action.from.value)}
                    x2={scales.x(whoLines.action.to.hour)}
                    y2={scales.y(whoLines.action.to.value)}
                    stroke={COLORS.red}
                    strokeWidth={2}
                    strokeDasharray="6 4"
                  />
                </>
              ) : null}
              <Series points={descent} scales={scales} color={COLORS.purple} marker="circle" />
              <Series points={dilatation} scales={scales} color={COLORS.blue} marker="cross" />
            </>
          )}
        </ChartPanel>

        <ChartPanel
          {...common}
          title={contractionsLabel}
          legend={contractionLegend}
          yDomain={contractionsDomain}
          yTicks={valueTicks(contractionsDomain, 1)}
          plotHeight={90}
          emptyText={contractions.length ? undefined : noValue}
        >
          {(scales) =>
            contractions.map((c) => {
              const width = Math.max(4, Math.min(scales.hourWidth * 0.35, 14));
              return (
                <g key={c.uuid}>
                  <rect
                    x={scales.x(c.hour) - width / 2}
                    width={width}
                    y={scales.y(c.count)}
                    height={scales.y(0) - scales.y(c.count)}
                    fill={DURATION_FILL[c.category]}
                    stroke="#525252"
                    strokeWidth={0.75}
                  >
                    <title>{`${contractionsLabel}: ${c.count}${c.duration !== undefined ? ` · ${c.duration} s` : ''}`}</title>
                  </rect>
                  {c.duration !== undefined ? (
                    <text className={styles.barLabel} x={scales.x(c.hour)} y={scales.y(c.count) - 3} textAnchor="middle">
                      {`${c.duration} s`}
                    </text>
                  ) : null}
                </g>
              );
            })
          }
        </ChartPanel>

        {textRowsPanel(t('oxytocin', 'Oxytocin'), [
          { label: t('oxytocinUnitsShort', 'U/L'), entries: numberCells('oxytocinConcentration') },
          { label: t('oxytocinDropsShort', 'Drops/min'), entries: numberCells('oxytocinDrops') },
        ])}

        <ChartPanel
          {...common}
          title={t('pulseTitle', 'Pulse')}
          legend={[{ label: pulseLabel, color: COLORS.red, kind: 'line', marker: 'circle' }]}
          yDomain={pulseDomain}
          yTicks={valueTicks(pulseDomain, 10)}
          plotHeight={140}
          emptyText={pulse.length ? undefined : noValue}
        >
          {(scales) => <Series points={pulse} scales={scales} color={COLORS.red} marker="circle" />}
        </ChartPanel>

        <ChartPanel
          {...common}
          title={t('bloodPressure', 'Blood pressure')}
          legend={[{ label: bpLabel, color: COLORS.blue, kind: 'range' }]}
          yDomain={bpDomain}
          yTicks={valueTicks(bpDomain, 10)}
          plotHeight={140}
          emptyText={pressures.length ? undefined : noValue}
        >
          {(scales) =>
            pressures.map((bp) => {
              const x = scales.x(bp.hour);
              const tooltip = `${bp.when}: ${bpLabel} ${bp.systolic ?? '?'}/${bp.diastolic ?? '?'}`;
              if (bp.systolic === undefined || bp.diastolic === undefined) {
                return (
                  <PointMarker key={bp.uuid} x={x} y={scales.y(bp.systolic ?? bp.diastolic)} marker="square" color={COLORS.blue}>
                    <title>{tooltip}</title>
                  </PointMarker>
                );
              }
              return (
                <g key={bp.uuid} stroke={COLORS.blue} strokeWidth={2}>
                  <title>{tooltip}</title>
                  <line x1={x} x2={x} y1={scales.y(bp.systolic)} y2={scales.y(bp.diastolic)} />
                  <line x1={x - 5} x2={x + 5} y1={scales.y(bp.systolic)} y2={scales.y(bp.systolic)} />
                  <line x1={x - 5} x2={x + 5} y1={scales.y(bp.diastolic)} y2={scales.y(bp.diastolic)} />
                </g>
              );
            })
          }
        </ChartPanel>

        <ChartPanel
          {...common}
          title={t('temperature', 'Temperature')}
          legend={[{ label: temperatureLabel, color: COLORS.orange, kind: 'line', marker: 'circle' }]}
          yDomain={temperatureDomain}
          yTicks={valueTicks(temperatureDomain, 0.5)}
          plotHeight={140}
          emptyText={temperature.length ? undefined : noValue}
        >
          {(scales) => <Series points={temperature} scales={scales} color={COLORS.orange} marker="circle" />}
        </ChartPanel>

        {medications.length ? (
          <section className={styles.panel} aria-label={t('medicationsList', 'Medications given, in full')}>
            <h5 className={styles.panelTitle}>{t('medicationsList', 'Medications given, in full')}</h5>
            <ul className={styles.medications}>
              {medications.map((medication) => (
                <li key={medication.uuid}>
                  <span className={styles.medicationMarker}>{medication.marker}</span>
                  <span className={styles.medicationTime}>{medication.when}</span>
                  {medication.text}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </div>
  );
};

export default PartographChart;
