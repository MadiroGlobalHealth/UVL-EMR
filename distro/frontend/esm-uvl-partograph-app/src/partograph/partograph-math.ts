import dayjs from 'dayjs';

export const HOUR_MS = 60 * 60 * 1000;

/** WHO partograph: the active phase, and so the alert line, starts at 4 cm. */
export const ACTIVE_PHASE_CM = 4;
/** WHO partograph: the alert line rises 1 cm per hour. */
export const ALERT_LINE_CM_PER_HOUR = 1;
/** WHO partograph: the action line is the alert line 4 hours to the right. */
export const ACTION_LINE_OFFSET_HOURS = 4;
export const FULL_DILATATION_CM = 10;

export interface Point {
  hour: number;
  value: number;
}

export interface Segment {
  from: Point;
  to: Point;
}

export interface TimeTick {
  hour: number;
  /** Clock time of the tick, HH:mm. */
  clock: string;
  /** DD/MM, on the first tick and on each tick whose date differs from the previous one. */
  date?: string;
}

export interface CodedValue {
  uuid: string;
  display?: string;
}

export interface CodeMapping {
  concept: string;
  code: string;
}

/** Hours from `start` to `time`; fractional, so a reading sits at its real time. */
export function hoursSince(start: Date, time: Date): number {
  return (time.getTime() - start.getTime()) / HOUR_MS;
}

/**
 * The readings of the current labour: the latest reading and every earlier one up to the first
 * gap longer than `gapHours`. A patient's previous labour (months or years before) would
 * otherwise stretch the time axis over the whole interval.
 */
export function currentLabour<T extends { time: Date }>(
  readings: Array<T>,
  gapHours: number,
): { readings: Array<T>; earlierCount: number } {
  const sorted = [...readings].sort((a, b) => a.time.getTime() - b.time.getTime());
  let start = 0;
  for (let i = sorted.length - 1; i > 0; i--) {
    if (hoursSince(sorted[i - 1].time, sorted[i].time) > gapHours) {
      start = i;
      break;
    }
  }
  return { readings: sorted.slice(start), earlierCount: start };
}

/**
 * Hour 00 of the partograph, as on the MSPLS sheet: where the alert line is at 4 cm.
 *
 * That is the time of the first reading with a dilatation of 4 cm or more, moved back one hour per
 * centimetre above 4, so that reading lies on the alert line (WHO: a woman admitted in the active
 * phase is plotted on the alert line). Without such a reading, hour 00 is the first reading.
 * `readings` must be in time order.
 */
export function partographOrigin(readings: Array<{ time: Date; dilatation?: number }>): Date {
  const active = readings.find((reading) => reading.dilatation !== undefined && reading.dilatation >= ACTIVE_PHASE_CM);
  if (!active) {
    return readings[0].time;
  }
  const hoursOnAlertLine = (active.dilatation - ACTIVE_PHASE_CM) / ALERT_LINE_CM_PER_HOUR;
  return new Date(active.time.getTime() - hoursOnAlertLine * HOUR_MS);
}

/**
 * The time axis, in whole hours from hour 00: the 12 hours of the sheet (`minimumHours`),
 * widened to the left for readings before hour 00 (latent phase), and to the right to one hour
 * past the last reading.
 */
export function timeAxis(firstHour: number, lastHour: number, minimumHours: number): { start: number; end: number } {
  // A reading a few minutes before a whole hour (-1 h 00 min 10 s) belongs to that hour's
  // column, not to an empty column further left; it is drawn just left of the tick.
  const start = -Math.ceil(-firstHour - AXIS_START_TOLERANCE_HOURS);
  // `|| 0` turns -0 into 0.
  return { start: Math.min(0, start) || 0, end: Math.max(minimumHours, Math.ceil(lastHour) + 1) };
}

/** How far before a whole hour a reading may sit and still open the axis at that hour (5 min). */
export const AXIS_START_TOLERANCE_HOURS = 5 / 60;

/** The half-hour cells of the paper partogram's code rows. */
export const CELL_HOURS = 0.5;

/**
 * The width, in hours, of the cells of the code rows: half an hour as on the paper sheet, or
 * 1, 2, 4… hours when a long axis would make a half-hour cell narrower than `minimumPixels`.
 */
export function cellHours(hourWidthPixels: number, minimumPixels: number): number {
  let hours = CELL_HOURS;
  while (hours * hourWidthPixels < minimumPixels) {
    hours *= 2;
  }
  return hours;
}

export interface Cell<T> {
  /** Start of the cell, in hours from hour 00. */
  start: number;
  /** The entries in the cell, oldest first; two or more are stacked, one line each. */
  entries: Array<T>;
}

/**
 * Puts each entry in the cell of the grid its time falls in, so two readings close together
 * (25 min apart) are stacked in one cell instead of drawn over each other.
 * `entries` must be in time order.
 */
export function toCells<T extends { hour: number }>(entries: Array<T>, size: number): Array<Cell<T>> {
  const cells = new Map<number, Cell<T>>();
  for (const entry of entries) {
    // Rounded first, so a reading on a cell boundary is not pushed into the previous cell by
    // floating-point error.
    const start = Math.floor(Math.round((entry.hour / size) * 1e6) / 1e6) * size;
    if (!cells.has(start)) {
      cells.set(start, { start, entries: [] });
    }
    cells.get(start).entries.push(entry);
  }
  return [...cells.values()];
}

/** Hours between labelled ticks, so a long labour keeps about a dozen labels. */
export function tickStep(span: number): number {
  return [1, 2, 3, 4, 6, 12, 24].find((step) => span / step <= 16) ?? 48;
}

/** "00", "01", … "12"; "-01" before hour 00. */
export function hourLabel(hour: number): string {
  return `${hour < 0 ? '-' : ''}${String(Math.abs(hour)).padStart(2, '0')}`;
}

/**
 * Ticks for the time axis: hours from hour 00, each with its clock time, and the date where it
 * changes. Clock times are in the browser's time zone.
 */
export function timeTicks(origin: Date, axis: { start: number; end: number }): Array<TimeTick> {
  const step = tickStep(axis.end - axis.start);
  const ticks: Array<TimeTick> = [];
  let previousDate: string | undefined;
  for (let hour = axis.start; hour <= axis.end; hour += step) {
    const time = dayjs(origin).add(hour, 'hour');
    const date = time.format('DD/MM');
    ticks.push({ hour, clock: time.format('HH:mm'), date: date !== previousDate ? date : undefined });
    previousDate = date;
  }
  return ticks;
}

/**
 * The alert and action lines for cervical dilatation (MSPLS partogram, WHO rule).
 *
 * The alert line rises 1 cm per hour from 4 cm to 10 cm, through the first reading with a
 * dilatation of 4 cm or more: with hour 00 from `partographOrigin`, from 4 cm at 00 to 10 cm at
 * 06. The action line is the same line 4 hours to the right: 4 cm at 04 to 10 cm at 10.
 * Undefined when no reading has reached 4 cm.
 *
 * `dilatation` must be in time order.
 */
export function alertAndActionLines(dilatation: Array<Point>): { alert: Segment; action: Segment } | undefined {
  const first = dilatation.find((point) => point.value >= ACTIVE_PHASE_CM);
  if (!first) {
    return undefined;
  }
  const startHour = first.hour - (first.value - ACTIVE_PHASE_CM) / ALERT_LINE_CM_PER_HOUR;
  const hoursToFull = (FULL_DILATATION_CM - ACTIVE_PHASE_CM) / ALERT_LINE_CM_PER_HOUR;
  const alert: Segment = {
    from: { hour: startHour, value: ACTIVE_PHASE_CM },
    to: { hour: startHour + hoursToFull, value: FULL_DILATATION_CM },
  };
  const action: Segment = {
    from: { hour: alert.from.hour + ACTION_LINE_OFFSET_HOURS, value: alert.from.value },
    to: { hour: alert.to.hour + ACTION_LINE_OFFSET_HOURS, value: alert.to.value },
  };
  return { alert, action };
}

export type DurationCategory = 'short' | 'medium' | 'long' | 'unknown';

/** WHO contraction shading: under 20 s, 20 to 40 s, over 40 s. */
export function durationCategory(seconds: number | undefined): DurationCategory {
  if (seconds === undefined || seconds === null || Number.isNaN(seconds)) {
    return 'unknown';
  }
  if (seconds < 20) {
    return 'short';
  }
  return seconds <= 40 ? 'medium' : 'long';
}

/**
 * The partograph code for a coded answer (liquor: I, C, M, B; moulding: 0, +, ++, +++), from the
 * answer-concept mapping in the configuration. An answer missing from the mapping falls back to
 * its concept name, so it is still shown.
 */
export function partographCode(answer: CodedValue | undefined, mapping: Array<CodeMapping>): string | undefined {
  if (!answer?.uuid) {
    return undefined;
  }
  return mapping.find((entry) => entry.concept === answer.uuid)?.code ?? answer.display;
}

/**
 * The y range of a panel: the usual range for the measure, widened to a multiple of `step` when
 * a value falls outside it.
 */
export function valueDomain(values: Array<number>, min: number, max: number, step: number): [number, number] {
  const lowest = Math.min(min, ...values);
  const highest = Math.max(max, ...values);
  return [Math.floor(lowest / step) * step, Math.ceil(highest / step) * step];
}

/** Labels for the y axis, every `step`, doubled until there are at most 10 intervals (0–10 cm). */
export function valueTicks([min, max]: [number, number], step: number): Array<number> {
  while ((max - min) / step > 10) {
    step *= 2;
  }
  const ticks: Array<number> = [];
  for (let value = min; value <= max + step / 1000; value += step) {
    ticks.push(Math.round(value * 1000) / 1000);
  }
  return ticks;
}

/** Time from hour 00, as "+2 h 30" (or "-1 h 00" in the latent phase). */
export function formatElapsed(hours: number): string {
  const minutes = Math.round(hours * 60);
  const sign = minutes < 0 ? '-' : '+';
  const whole = Math.floor(Math.abs(minutes) / 60);
  const rest = Math.abs(minutes) % 60;
  return `${sign}${whole} h ${String(rest).padStart(2, '0')}`;
}
