import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CardHeader, ErrorState, useConfig } from '@openmrs/esm-framework';
import dayjs from 'dayjs';
import { type AnaesthesiaConcepts, configNamespace, type PartographConfig } from '../config-schema';
import { ChartPanel, PointMarker, Series } from '../partograph/chart-panel.component';
import {
  currentLabour,
  type CodedValue,
  formatElapsed,
  hoursSince,
  timeAxis,
  timeTicks,
  valueDomain,
  valueTicks,
} from '../partograph/partograph-math';
import { type AnaesthesiaReading, useAnaesthesiaReadings } from './anaesthesia.resource';
import styles from '../partograph/partograph-chart.scss';

// Carbon palette.
const COLORS = { red: '#da1e28', blue: '#0f62fe', teal: '#007d79', purple: '#8a3ffc' };

type Plotted = { hour: number; value: number; tooltip: string };

function numberValue(reading: AnaesthesiaReading, key: keyof AnaesthesiaConcepts): number | undefined {
  const value = reading.values[key];
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value))) {
    return Number(value);
  }
  return undefined;
}

/** i18next escapes interpolated values for HTML by default; React escapes them already. */
const unescaped = { interpolation: { escapeValue: false } };

interface AnaesthesiaChartProps {
  patientUuid: string;
}

/**
 * The anaesthesia monitoring chart of the patient's latest operation, drawn from the saved
 * Anaesthesia Monitoring encounters: one reading per encounter from the one-reading form, or up to
 * twelve per encounter from the older form. It redraws when a reading is saved from the side
 * panel's button. Renders nothing without readings, and nothing while they load.
 */
const AnaesthesiaChart: React.FC<AnaesthesiaChartProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  // Read from its own namespace, not the module's: see configNamespace.
  const { anaesthesia: config } = useConfig<PartographConfig>({ externalModuleName: configNamespace });
  const { readings, error, isLoading } = useAnaesthesiaReadings(patientUuid, config);
  const title = t('anaesthesiaMonitoring', 'Anaesthesia monitoring');

  if (!config?.encounterTypeUuid || isLoading) {
    return null;
  }
  if (error) {
    return <ErrorState error={error} headerTitle={title} />;
  }
  if (!readings?.length) {
    return null;
  }
  return <AnaesthesiaCard title={title} readings={readings} config={config} />;
};

const AnaesthesiaCard: React.FC<{
  title: string;
  readings: Array<AnaesthesiaReading>;
  config: PartographConfig['anaesthesia'];
}> = ({ title, readings: allReadings, config }) => {
  const { t } = useTranslation();

  const chart = useMemo(() => {
    const { readings, earlierCount } = currentLabour(allReadings, config.gapHours);
    const origin = readings[0].time;
    const last = readings[readings.length - 1].time;
    const axis = timeAxis(0, hoursSince(origin, last), config.minimumHours);
    const at = (reading: AnaesthesiaReading) => hoursSince(origin, reading.time);
    const when = (reading: AnaesthesiaReading) =>
      `${dayjs(reading.time).format('DD/MM HH:mm')} (${formatElapsed(at(reading))})`;
    const series = (key: keyof AnaesthesiaConcepts, label: string): Array<Plotted> =>
      readings.flatMap((reading) => {
        const value = numberValue(reading, key);
        return value === undefined ? [] : [{ hour: at(reading), value, tooltip: `${when(reading)}: ${label} ${value}` }];
      });
    return { readings, earlierCount, origin, last, axis, ticks: timeTicks(origin, axis), at, when, series };
  }, [allReadings, config.gapHours, config.minimumHours]);

  const { readings, earlierCount, origin, last, axis, ticks, at, when, series } = chart;
  const common = { ticks, axis };
  const noValue = t('noValue', 'No value recorded');

  const pulseLabel = t('pulseBpm', 'Pulse (/min)');
  const pulse = series('pulse', pulseLabel);
  const bpLabel = t('systolicDiastolic', 'Systolic / diastolic (mmHg)');
  const pressures = readings.flatMap((reading) => {
    const systolic = numberValue(reading, 'systolicBp');
    const diastolic = numberValue(reading, 'diastolicBp');
    return systolic === undefined && diastolic === undefined
      ? []
      : [{ key: reading.key, hour: at(reading), systolic, diastolic, when: when(reading) }];
  });
  const hemodynamicDomain = valueDomain(
    [...pulse.map((p) => p.value), ...pressures.flatMap((p) => [p.systolic, p.diastolic].filter((v) => v !== undefined))],
    40,
    200,
    10,
  );

  const spo2Label = t('spo2', 'SpO2 (%)');
  const spo2 = series('spo2', spo2Label);
  const spo2Domain = valueDomain(spo2.map((p) => p.value), 80, 100, 5);
  const respirationLabel = t('respirationPerMin', 'Respiration (/min)');
  const respiration = series('respiration', respirationLabel);
  const respirationDomain = valueDomain(respiration.map((p) => p.value), 0, 40, 5);

  const notes = readings.flatMap((reading) => {
    const stage = (reading.values.stage as CodedValue | undefined)?.display;
    const medication = typeof reading.values.medication === 'string' ? reading.values.medication.trim() : '';
    return stage || medication ? [{ key: reading.key, when: when(reading), stage, medication }] : [];
  });

  return (
    <div className={styles.widgetCard}>
      <CardHeader title={title}>
        <span />
      </CardHeader>
      <div className={styles.content}>
        <p className={styles.summary}>
          {t('anaesthesiaSummary', 'First reading {{start}} · {{count}} readings · last {{last}}', {
            start: dayjs(origin).format('DD/MM/YYYY HH:mm'),
            count: readings.length,
            last: dayjs(last).format('DD/MM HH:mm'),
            ...unescaped,
          })}
        </p>
        <p className={styles.note}>
          {t('anaesthesiaTimeAxisNote', 'Hour 00 ({{origin}}) is the first reading; each hour shows its clock time.', {
            origin: dayjs(origin).format('DD/MM HH:mm'),
            ...unescaped,
          })}
        </p>
        {earlierCount > 0 ? (
          <p className={styles.note}>
            {t('earlierAnaesthesiaReadings', '{{count}} earlier readings (previous operation) are not shown', {
              count: earlierCount,
              ...unescaped,
            })}
          </p>
        ) : null}

        <ChartPanel
          {...common}
          title={t('bloodPressureAndPulse', 'Blood pressure and pulse')}
          legend={[
            { label: bpLabel, color: COLORS.blue, kind: 'range' },
            { label: pulseLabel, color: COLORS.red, kind: 'line', marker: 'circle' },
          ]}
          yDomain={hemodynamicDomain}
          yTicks={valueTicks(hemodynamicDomain, 10)}
          plotHeight={180}
          emptyText={pulse.length || pressures.length ? undefined : noValue}
        >
          {(scales) => (
            <>
              {pressures.map((bp) => {
                const x = scales.x(bp.hour);
                const tooltip = `${bp.when}: ${bpLabel} ${bp.systolic ?? '?'}/${bp.diastolic ?? '?'}`;
                if (bp.systolic === undefined || bp.diastolic === undefined) {
                  return (
                    <PointMarker key={bp.key} x={x} y={scales.y(bp.systolic ?? bp.diastolic)} marker="square" color={COLORS.blue}>
                      <title>{tooltip}</title>
                    </PointMarker>
                  );
                }
                return (
                  <g key={bp.key} stroke={COLORS.blue} strokeWidth={2}>
                    <title>{tooltip}</title>
                    <line x1={x} x2={x} y1={scales.y(bp.systolic)} y2={scales.y(bp.diastolic)} />
                    <line x1={x - 5} x2={x + 5} y1={scales.y(bp.systolic)} y2={scales.y(bp.systolic)} />
                    <line x1={x - 5} x2={x + 5} y1={scales.y(bp.diastolic)} y2={scales.y(bp.diastolic)} />
                  </g>
                );
              })}
              <Series points={pulse} scales={scales} color={COLORS.red} marker="circle" />
            </>
          )}
        </ChartPanel>

        <ChartPanel
          {...common}
          title={t('spo2Title', 'Oxygen saturation')}
          legend={[{ label: spo2Label, color: COLORS.teal, kind: 'line', marker: 'circle' }]}
          yDomain={spo2Domain}
          yTicks={valueTicks(spo2Domain, 5)}
          plotHeight={110}
          emptyText={spo2.length ? undefined : noValue}
        >
          {(scales) => <Series points={spo2} scales={scales} color={COLORS.teal} marker="circle" />}
        </ChartPanel>

        <ChartPanel
          {...common}
          title={t('respirationTitle', 'Respiration')}
          legend={[{ label: respirationLabel, color: COLORS.purple, kind: 'line', marker: 'circle' }]}
          yDomain={respirationDomain}
          yTicks={valueTicks(respirationDomain, 5)}
          plotHeight={110}
          emptyText={respiration.length ? undefined : noValue}
        >
          {(scales) => <Series points={respiration} scales={scales} color={COLORS.purple} marker="circle" />}
        </ChartPanel>

        {notes.length ? (
          <section className={styles.panel} aria-label={t('stageAndMedication', 'Stage and medication')}>
            <h5 className={styles.panelTitle}>{t('stageAndMedication', 'Stage and medication')}</h5>
            <ul className={styles.medications}>
              {notes.map((note) => (
                <li key={note.key}>
                  <span className={styles.medicationTime}>{note.when}</span>
                  {[note.stage, note.medication].filter(Boolean).join(' · ')}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </div>
  );
};

export default AnaesthesiaChart;
