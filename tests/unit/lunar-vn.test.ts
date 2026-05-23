import { describe, it, expect } from 'vitest';
import { jdFromDate, jdToDate, NewMoon, getLunarDate, isValidLunarDate } from '../../lib/lunar/lunar-vn';

describe('jdFromDate', () => {
  it('calculates J2000.0 correctly', () => {
    expect(jdFromDate(1, 1, 2000)).toBe(2451545);
  });
  it('round-trips with jdToDate', () => {
    const jd = jdFromDate(24, 10, 1991);
    const [d, m, y] = jdToDate(jd);
    expect(d).toBe(24); expect(m).toBe(10); expect(y).toBe(1991);
  });
  it('handles Gregorian reform boundary', () => {
    const before = jdFromDate(4, 10, 1582);
    const after = jdFromDate(15, 10, 1582);
    expect(after - before).toBeGreaterThan(0);
  });
});

describe('jdToDate', () => {
  it('converts J2000.0 back to 1/1/2000', () => {
    const [d, m, y] = jdToDate(2451545);
    expect(d).toBe(1); expect(m).toBe(1); expect(y).toBe(2000);
  });
});

describe('NewMoon', () => {
  it('returns valid JD for k=0', () => {
    const jd = NewMoon(0);
    expect(jd).toBeGreaterThan(2415000);
    expect(jd).toBeLessThan(2416000);
  });
  it('each new moon is ~29.5 days apart', () => {
    const jd0 = NewMoon(100);
    const jd1 = NewMoon(101);
    expect(jd1 - jd0).toBeGreaterThan(29);
    expect(jd1 - jd0).toBeLessThan(30);
  });
});

describe('getLunarDate', () => {
  it('converts 1991-10-24 GMT+7 to lunar month 9 day 17', () => {
    const r = getLunarDate(1991, 10, 24, 7);
    expect(r.month).toBe(9);
    expect(r.day).toBe(17);
    expect(r.isLeapMonth).toBe(false);
  });
  it('returns correct year stem/branch for 1991 (Tân Mùi)', () => {
    const r = getLunarDate(1991, 10, 24, 7);
    expect(r.yearName).toBe('Tân Mùi');
  });
  it('defaults to GMT+7 when timeZone omitted', () => {
    const a = getLunarDate(2000, 1, 1, 7);
    const b = getLunarDate(2000, 1, 1);
    expect(a.year).toBe(b.year);
    expect(a.month).toBe(b.month);
  });
  it('returns year 2000 as Canh Thìn', () => {
    const r = getLunarDate(2000, 6, 15, 7);
    expect(r.yearName).toBe('Canh Thìn');
  });
});

describe('isValidLunarDate', () => {
  it('validates correct date', () => {
    const r = getLunarDate(1991, 10, 24, 7);
    expect(isValidLunarDate(r)).toBe(true);
  });
  it('rejects day 0', () => {
    expect(isValidLunarDate({ year: 2000, month: 1, day: 0, isLeapMonth: false, yearStem: 0, yearBranch: 0 })).toBe(false);
  });
});
