import { describe, it, expect } from 'vitest';
import { generateChartVN } from '../../lib/ziwei/algorithm-vn';

describe('generateChartVN', () => {
  const base = { year: 1991, month: 10, day: 24, hour: 8, gender: 'male' as const };

  it('returns 12 palaces', () => {
    const chart = generateChartVN(base);
    expect(chart.palaces).toHaveLength(12);
  });

  it('returns correct lunar info for 1991-10-24', () => {
    const chart = generateChartVN(base);
    expect(chart.lunarInfo.month).toBe(9);
    expect(chart.lunarInfo.day).toBe(17);
  });

  it('uses GMT+7 by default', () => {
    const chart = generateChartVN(base);
    expect(chart.birthInfo.timeZone ?? 7).toBe(7);
  });

  it('includes sihua', () => {
    const chart = generateChartVN(base);
    expect(chart.sihua.loc).toBeTruthy();
    expect(chart.sihua.quyen).toBeTruthy();
    expect(chart.sihua.khoa).toBeTruthy();
    expect(chart.sihua.ky).toBeTruthy();
  });

  it('handles female gender', () => {
    const chart = generateChartVN({ ...base, gender: 'female' });
    expect(chart.birthInfo.gender).toBe('female');
  });

  it('palaces have Vietnamese names', () => {
    const chart = generateChartVN(base);
    const menhCung = chart.palaces[0];
    expect(menhCung.name).toContain('Cung');
  });

  it('lunarDateStr is Vietnamese', () => {
    const chart = generateChartVN(base);
    expect(chart.lunarDateStr).toContain('Năm');
    expect(chart.lunarDateStr).toContain('Tháng');
  });
});
