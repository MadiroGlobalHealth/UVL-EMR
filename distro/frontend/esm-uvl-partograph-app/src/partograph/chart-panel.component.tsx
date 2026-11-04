import React, { useId } from 'react';
import { hourLabel, type Point, type TimeTick } from './partograph-math';
import styles from './partograph-chart.scss';

export const WIDTH = 760;
export const MARGIN = { left: 80, right: 16, top: 10 };
const AXIS_HEIGHT = 46;
/** Inner space left and right of the time axis, so a mark at 0 h or at the end is drawn whole. */
const X_PADDING = 14;
/** Room above the plot for a mark or label at the top of the range. */
const CLIP_HEADROOM = 14;

/** Width of one hour on the time axis, in SVG units. */
export function hourWidthFor(axis: { start: number; end: number }): number {
  return (WIDTH - MARGIN.left - MARGIN.right - 2 * X_PADDING) / (axis.end - axis.start);
}

export type LegendKind = 'line' | 'dashed' | 'band' | 'bar' | 'range';

export interface LegendItem {
  label: string;
  color: string;
  kind: LegendKind;
  marker?: Marker;
}

export type Marker = 'circle' | 'cross' | 'square' | 'none';

export interface Scales {
  x: (hour: number) => number;
  y: (value: number) => number;
  hourWidth: number;
  top: number;
  bottom: number;
}

interface ChartPanelProps {
  title: string;
  legend: Array<LegendItem>;
  ticks: Array<TimeTick>;
  /** Whole hours from hour 00; `start` is below 0 when there are readings before it. */
  axis: { start: number; end: number };
  /** Absent for a panel of text rows (liquor, moulding). */
  yDomain?: [number, number];
  yTicks?: Array<number>;
  /** Labels in the left margin instead of y ticks, for rows of text. */
  rowLabels?: Array<string>;
  /** Height of each text row, top to bottom; equal rows when absent. */
  rowHeights?: Array<number>;
  plotHeight?: number;
  /** A line of explanation under the title (codes, WHO lines). */
  note?: string;
  emptyText?: string;
  children: (scales: Scales) => React.ReactNode;
}

/** One partograph panel: its own legend, y axis, and time axis (hour 00–12, clock time, date). */
export const ChartPanel: React.FC<ChartPanelProps> = ({
  title,
  legend,
  ticks,
  axis,
  yDomain = [0, 1],
  yTicks = [],
  rowLabels,
  rowHeights,
  plotHeight = 130,
  note,
  emptyText,
  children,
}) => {
  const clipId = useId().replace(/:/g, '');
  const plotWidth = WIDTH - MARGIN.left - MARGIN.right;
  const top = MARGIN.top + CLIP_HEADROOM;
  const bottom = top + plotHeight;
  const hourWidth = hourWidthFor(axis);
  const [yMin, yMax] = yDomain;
  const scales: Scales = {
    x: (hour) => MARGIN.left + X_PADDING + (hour - axis.start) * hourWidth,
    y: (value) => bottom - ((value - yMin) / (yMax - yMin || 1)) * plotHeight,
    hourWidth,
    top,
    bottom,
  };
  const height = bottom + AXIS_HEIGHT;

  return (
    <section className={styles.panel} aria-label={title}>
      <div className={styles.panelHeader}>
        <h5 className={styles.panelTitle}>{title}</h5>
        {legend.length ? <Legend items={legend} /> : null}
      </div>
      {note ? <p className={styles.note}>{note}</p> : null}
      <svg
        className={styles.chart}
        viewBox={`0 0 ${WIDTH} ${height}`}
        role="img"
        aria-label={title}
        preserveAspectRatio="xMinYMin meet"
      >
        <defs>
          <clipPath id={clipId}>
            <rect x={MARGIN.left} y={top - CLIP_HEADROOM} width={plotWidth} height={plotHeight + CLIP_HEADROOM} />
          </clipPath>
        </defs>
        <rect className={styles.plotArea} x={MARGIN.left} y={top} width={plotWidth} height={plotHeight} />
        {Array.from({ length: axis.end - axis.start + 1 }, (_, index) => axis.start + index).map((hour) => (
          <line key={`h${hour}`} className={styles.gridLine} x1={scales.x(hour)} x2={scales.x(hour)} y1={top} y2={bottom} />
        ))}
        {yTicks.map((value) => (
          <g key={`y${value}`}>
            <line className={styles.gridLine} x1={MARGIN.left} x2={MARGIN.left + plotWidth} y1={scales.y(value)} y2={scales.y(value)} />
            <text className={styles.axisLabel} x={MARGIN.left - 6} y={scales.y(value)} textAnchor="end" dominantBaseline="middle">
              {value}
            </text>
          </g>
        ))}
        {rowLabels?.map((label, index) => {
          const heights = rowHeights ?? rowLabels.map(() => plotHeight / rowLabels.length);
          const rowTop = top + heights.slice(0, index).reduce((sum, height) => sum + height, 0);
          return (
            <g key={label}>
              {index > 0 ? (
                <line className={styles.gridLine} x1={MARGIN.left} x2={MARGIN.left + plotWidth} y1={rowTop} y2={rowTop} />
              ) : null}
              <text
                className={styles.axisLabel}
                x={MARGIN.left - 6}
                y={rowTop + heights[index] / 2}
                textAnchor="end"
                dominantBaseline="middle"
              >
                {label}
              </text>
            </g>
          );
        })}
        <g clipPath={`url(#${clipId})`}>{children(scales)}</g>
        {emptyText ? (
          <text className={styles.emptyText} x={MARGIN.left + plotWidth / 2} y={(top + bottom) / 2} textAnchor="middle">
            {emptyText}
          </text>
        ) : null}
        {ticks.map((tick) => (
          <g key={`t${tick.hour}`} className={styles.timeTick}>
            <line className={styles.axisLine} x1={scales.x(tick.hour)} x2={scales.x(tick.hour)} y1={bottom} y2={bottom + 4} />
            <text className={styles.axisHour} data-hour={tick.hour} x={scales.x(tick.hour)} y={bottom + 15} textAnchor="middle">
              {hourLabel(tick.hour)}
            </text>
            <text className={styles.axisLabel} x={scales.x(tick.hour)} y={bottom + 28} textAnchor="middle">
              {tick.clock}
            </text>
            {tick.date ? (
              <text className={styles.axisDate} x={scales.x(tick.hour)} y={bottom + 41} textAnchor="middle">
                {tick.date}
              </text>
            ) : null}
          </g>
        ))}
      </svg>
    </section>
  );
};

const Legend: React.FC<{ items: Array<LegendItem> }> = ({ items }) => (
  <ul className={styles.legend}>
    {items.map((item) => (
      <li key={item.label} className={styles.legendItem}>
        <svg width="28" height="14" aria-hidden="true" focusable="false">
          <LegendSwatch item={item} />
        </svg>
        <span>{item.label}</span>
      </li>
    ))}
  </ul>
);

const LegendSwatch: React.FC<{ item: LegendItem }> = ({ item }) => {
  switch (item.kind) {
    case 'band':
      return <rect x="0" y="2" width="28" height="10" fill={item.color} opacity={0.25} />;
    case 'bar':
      return <rect x="8" y="1" width="12" height="12" fill={item.color} stroke="#525252" strokeWidth={0.5} />;
    case 'range':
      return (
        <g stroke={item.color} strokeWidth={2}>
          <line x1="14" x2="14" y1="1" y2="13" />
          <line x1="10" x2="18" y1="1" y2="1" />
          <line x1="10" x2="18" y1="13" y2="13" />
        </g>
      );
    default:
      return (
        <g>
          <line
            x1="0"
            x2="28"
            y1="7"
            y2="7"
            stroke={item.color}
            strokeWidth={2}
            strokeDasharray={item.kind === 'dashed' ? '5 3' : undefined}
          />
          {item.marker ? <PointMarker x={14} y={7} marker={item.marker} color={item.color} /> : null}
        </g>
      );
  }
};

export const PointMarker: React.FC<{ x: number; y: number; marker: Marker; color: string; children?: React.ReactNode }> = ({
  x,
  y,
  marker,
  color,
  children,
}) => {
  switch (marker) {
    case 'cross':
      return (
        <g stroke={color} strokeWidth={2}>
          {children}
          <line x1={x - 4} x2={x + 4} y1={y - 4} y2={y + 4} />
          <line x1={x - 4} x2={x + 4} y1={y + 4} y2={y - 4} />
        </g>
      );
    case 'square':
      return (
        <rect x={x - 3.5} y={y - 3.5} width={7} height={7} fill={color}>
          {children}
        </rect>
      );
    case 'none':
      return null;
    default:
      return (
        <circle cx={x} cy={y} r={4} fill="#ffffff" stroke={color} strokeWidth={2}>
          {children}
        </circle>
      );
  }
};

interface SeriesProps {
  points: Array<Point & { tooltip: string }>;
  scales: Scales;
  color: string;
  marker: Marker;
  dashed?: boolean;
}

/** A measured series: a line through the readings, and a marker (with a tooltip) at each one. */
export const Series: React.FC<SeriesProps> = ({ points, scales, color, marker, dashed }) => (
  <g>
    {points.length > 1 ? (
      <polyline
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeDasharray={dashed ? '6 4' : undefined}
        points={points.map((point) => `${scales.x(point.hour)},${scales.y(point.value)}`).join(' ')}
      />
    ) : null}
    {points.map((point, index) => (
      <PointMarker key={index} x={scales.x(point.hour)} y={scales.y(point.value)} marker={marker} color={color}>
        <title>{point.tooltip}</title>
      </PointMarker>
    ))}
  </g>
);
