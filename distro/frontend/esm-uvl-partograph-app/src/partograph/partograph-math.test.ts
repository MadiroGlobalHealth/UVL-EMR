import { describe, expect, it } from 'vitest';
import {
  alertAndActionLines,
  cellHours,
  currentLabour,
  durationCategory,
  formatElapsed,
  hourLabel,
  hoursSince,
  partographCode,
  partographOrigin,
  tickStep,
  timeAxis,
  timeTicks,
  toCells,
  valueDomain,
  valueTicks,
} from './partograph-math';

// Tests run with TZ=UTC (package.json), so clock times below are UTC.
const at = (iso: string) => new Date(iso);

describe('time axis', () => {
  it('places a reading at its real time, in hours since the first reading', () => {
    expect(hoursSince(at('2026-11-04T08:00:00Z'), at('2026-11-04T10:30:00Z'))).toBe(2.5);
    expect(hoursSince(at('2026-11-04T08:00:00Z'), at('2026-11-04T08:20:00Z'))).toBeCloseTo(1 / 3);
  });

  it('spans the 12 hours of the MSPLS sheet, widened for latent-phase readings and long labours', () => {
    expect(timeAxis(0, 3.2, 12)).toEqual({ start: 0, end: 12 });
    expect(timeAxis(0, 11, 12)).toEqual({ start: 0, end: 12 });
    expect(timeAxis(0, 11.5, 12)).toEqual({ start: 0, end: 13 });
    expect(timeAxis(-2.5, 6, 12)).toEqual({ start: -3, end: 12 });
  });

  it('opens the axis at -01 for a reading at -1 h 00 min 10 s, not at an empty -02', () => {
    expect(timeAxis(-(1 + 10 / 3600), 6, 12).start).toBe(-1);
    expect(timeAxis(-(1 + 4 / 60), 6, 12).start).toBe(-1);
    expect(timeAxis(-1.2, 6, 12).start).toBe(-2);
    expect(timeAxis(-0.05, 6, 12).start).toBe(0);
    expect(Object.is(timeAxis(0, 6, 12).start, 0)).toBe(true);
  });

  it('labels every hour up to 16 hours, then spaces the labels out', () => {
    expect(tickStep(12)).toBe(1);
    expect(tickStep(16)).toBe(1);
    expect(tickStep(17)).toBe(2);
    expect(tickStep(40)).toBe(3);
  });

  it('marks the hours 00 to 12 as on the sheet', () => {
    expect(hourLabel(0)).toBe('00');
    expect(hourLabel(6)).toBe('06');
    expect(hourLabel(12)).toBe('12');
    expect(hourLabel(-2)).toBe('-02');
  });

  it('labels each tick with the clock time, and the date where it changes', () => {
    const ticks = timeTicks(at('2026-11-04T22:30:00Z'), { start: 0, end: 12 });

    expect(ticks).toHaveLength(13);
    expect(ticks[0]).toEqual({ hour: 0, clock: '22:30', date: '04/11' });
    expect(ticks[1]).toEqual({ hour: 1, clock: '23:30', date: undefined });
    expect(ticks[2]).toEqual({ hour: 2, clock: '00:30', date: '05/11' });
    expect(ticks[3]).toEqual({ hour: 3, clock: '01:30', date: undefined });
    expect(ticks[12]).toEqual({ hour: 12, clock: '10:30', date: undefined });
  });

  it('starts the ticks before hour 00 when there are latent-phase readings', () => {
    const ticks = timeTicks(at('2026-11-04T10:00:00Z'), { start: -2, end: 12 });

    expect(ticks[0]).toEqual({ hour: -2, clock: '08:00', date: '04/11' });
    expect(ticks[2]).toEqual({ hour: 0, clock: '10:00', date: undefined });
  });

  it('formats the time since the first reading', () => {
    expect(formatElapsed(0)).toBe('+0 h 00');
    expect(formatElapsed(2.5)).toBe('+2 h 30');
    expect(formatElapsed(1 / 3)).toBe('+0 h 20');
    expect(formatElapsed(-1.5)).toBe('-1 h 30');
  });
});

describe('current labour', () => {
  it('keeps the readings after the last gap longer than the threshold', () => {
    const readings = [
      { time: at('2026-11-04T10:00:00Z') },
      { time: at('2025-06-01T08:00:00Z') },
      { time: at('2026-11-04T08:00:00Z') },
      { time: at('2025-06-01T12:00:00Z') },
      { time: at('2026-11-04T12:30:00Z') },
    ];

    const labour = currentLabour(readings, 24);

    expect(labour.earlierCount).toBe(2);
    expect(labour.readings.map((r) => r.time.toISOString())).toEqual([
      '2026-11-04T08:00:00.000Z',
      '2026-11-04T10:00:00.000Z',
      '2026-11-04T12:30:00.000Z',
    ]);
  });

  it('keeps every reading of a single labour, even one crossing midnight', () => {
    const readings = [{ time: at('2026-11-04T20:00:00Z') }, { time: at('2026-11-05T06:00:00Z') }];

    expect(currentLabour(readings, 24)).toEqual({ readings, earlierCount: 0 });
  });
});

describe('hour 00 (MSPLS sheet)', () => {
  it('is the first reading of 4 cm or more', () => {
    const origin = partographOrigin([
      { time: at('2026-11-04T06:00:00Z'), dilatation: 2 },
      { time: at('2026-11-04T08:00:00Z'), dilatation: 4 },
      { time: at('2026-11-04T10:00:00Z'), dilatation: 6 },
    ]);

    expect(origin.toISOString()).toBe('2026-11-04T08:00:00.000Z');
  });

  it('puts a first active reading above 4 cm on the alert line: 1 hour back per cm above 4', () => {
    const origin = partographOrigin([
      { time: at('2026-11-04T09:00:00Z') },
      { time: at('2026-11-04T10:00:00Z'), dilatation: 6 },
    ]);

    expect(origin.toISOString()).toBe('2026-11-04T08:00:00.000Z');
  });

  it('is the first reading when none has reached 4 cm', () => {
    const origin = partographOrigin([
      { time: at('2026-11-04T09:00:00Z'), dilatation: 2 },
      { time: at('2026-11-04T11:00:00Z'), dilatation: 3 },
    ]);

    expect(origin.toISOString()).toBe('2026-11-04T09:00:00.000Z');
  });
});

describe('alert and action lines', () => {
  it('runs the alert line from 4 cm at hour 00 to 10 cm at hour 06', () => {
    const lines = alertAndActionLines([
      { hour: -2, value: 2 },
      { hour: 0, value: 4 },
      { hour: 2, value: 7 },
    ]);

    expect(lines.alert).toEqual({ from: { hour: 0, value: 4 }, to: { hour: 6, value: 10 } });
  });

  it('runs the action line from 4 cm at hour 04 to 10 cm at hour 10', () => {
    const { alert, action } = alertAndActionLines([{ hour: 0, value: 4 }]);

    expect(action).toEqual({ from: { hour: 4, value: 4 }, to: { hour: 10, value: 10 } });
    expect(action.from.hour - alert.from.hour).toBe(4);
    expect(action.to.hour - alert.to.hour).toBe(4);
  });

  it('passes through a first active reading above 4 cm, at 1 cm per hour', () => {
    // 6 cm at hour 02: the reading lies on the alert line, which still starts at 4 cm.
    const lines = alertAndActionLines([
      { hour: 1, value: 3 },
      { hour: 2, value: 6 },
    ]);

    expect(lines.alert).toEqual({ from: { hour: 0, value: 4 }, to: { hour: 6, value: 10 } });
    expect(lines.action).toEqual({ from: { hour: 4, value: 4 }, to: { hour: 10, value: 10 } });
  });

  it('draws no line before a reading reaches 4 cm', () => {
    expect(alertAndActionLines([{ hour: 0, value: 3 }])).toBeUndefined();
    expect(alertAndActionLines([])).toBeUndefined();
  });
});

describe('contraction duration', () => {
  it('uses the WHO shading bands', () => {
    expect(durationCategory(15)).toBe('short');
    expect(durationCategory(19)).toBe('short');
    expect(durationCategory(20)).toBe('medium');
    expect(durationCategory(40)).toBe('medium');
    expect(durationCategory(41)).toBe('long');
    expect(durationCategory(undefined)).toBe('unknown');
  });
});

describe('liquor and moulding codes', () => {
  const liquor = [
    { concept: 'intact-uuid', code: 'I' },
    { concept: 'clear-uuid', code: 'C' },
    { concept: 'meconium-uuid', code: 'M' },
    { concept: 'blood-uuid', code: 'B' },
  ];
  const moulding = [
    { concept: 'none-uuid', code: '0' },
    { concept: 'touching-uuid', code: '+' },
    { concept: 'reducible-uuid', code: '++' },
    { concept: 'irreducible-uuid', code: '+++' },
  ];

  it('maps each answer concept to its partograph code', () => {
    expect(partographCode({ uuid: 'meconium-uuid', display: 'Coloration meconium' }, liquor)).toBe('M');
    expect(partographCode({ uuid: 'clear-uuid', display: 'Normale' }, liquor)).toBe('C');
    expect(partographCode({ uuid: 'none-uuid', display: 'Aucun' }, moulding)).toBe('0');
    expect(partographCode({ uuid: 'irreducible-uuid' }, moulding)).toBe('+++');
  });

  it('shows the concept name of an answer missing from the mapping, and nothing for no answer', () => {
    expect(partographCode({ uuid: 'other-uuid', display: 'Autre' }, liquor)).toBe('Autre');
    expect(partographCode(undefined, liquor)).toBeUndefined();
  });
});

describe('value axis', () => {
  it('keeps the usual range and widens it to include outliers', () => {
    expect(valueDomain([120, 150], 80, 200, 20)).toEqual([80, 200]);
    expect(valueDomain([70, 210], 80, 200, 20)).toEqual([60, 220]);
    expect(valueDomain([], 35, 40, 1)).toEqual([35, 40]);
    expect(valueDomain([38.3, 40.2], 35, 40, 1)).toEqual([35, 41]);
  });

  it('labels the axis with at most 10 intervals', () => {
    expect(valueTicks([0, 10], 1)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(valueTicks([35, 40], 1)).toEqual([35, 36, 37, 38, 39, 40]);
    expect(valueTicks([35, 43], 0.5)).toEqual([35, 36, 37, 38, 39, 40, 41, 42, 43]);
    expect(valueTicks([40, 180], 10)).toEqual([40, 60, 80, 100, 120, 140, 160, 180]);
    expect(valueTicks([0, 60], 5)).toEqual([0, 10, 20, 30, 40, 50, 60]);
    expect(valueTicks([80, 200], 20)).toEqual([80, 100, 120, 140, 160, 180, 200]);
  });
});

describe('code rows (half-hour cells)', () => {
  it('uses half-hour cells like the paper sheet, wider only when they would be too narrow', () => {
    expect(cellHours(53, 24)).toBe(0.5);
    expect(cellHours(30, 24)).toBe(1);
    expect(cellHours(10, 24)).toBe(4);
  });

  it('stacks two readings 25 min apart in one cell, oldest first, instead of drawing them over each other', () => {
    // 14:00 and 14:25 with hour 00 at 11:00.
    const moulding = [
      { hour: 3, text: '++' },
      { hour: 3 + 25 / 60, text: '+++' },
    ];

    expect(toCells(moulding, 0.5)).toEqual([{ start: 3, entries: moulding }]);
  });

  it('puts readings 35 min apart, or on a cell boundary, in their own cells', () => {
    const cells = toCells(
      [
        { hour: 3, text: 'M' },
        { hour: 3 + 35 / 60, text: 'B' },
        { hour: 4.5, text: 'C' },
      ],
      0.5,
    );

    expect(cells.map((cell) => [cell.start, cell.entries.map((e) => e.text)])).toEqual([
      [3, ['M']],
      [3.5, ['B']],
      [4.5, ['C']],
    ]);
  });

  it('keeps readings before hour 00 in their own cells', () => {
    expect(toCells([{ hour: -0.2 }, { hour: -1.6 }], 0.5).map((cell) => cell.start)).toEqual([-0.5, -2]);
  });
});
