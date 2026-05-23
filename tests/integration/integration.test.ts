import { describe, it, expect } from 'vitest';
import { generateChartVN } from '../../lib/ziwei/algorithm-vn';
import { normalizeChartVN } from '../../lib/ziwei/normalize-vn';
import { handleChartGenerate } from '../../lib/api/chart-generate';

describe('Full Integration Flow', () => {
  it('1991-10-24 male — complete pipeline', () => {
    const chart = generateChartVN({ year: 1991, month: 10, day: 24, hour: 8, gender: 'male' });
    const normalized = normalizeChartVN(chart);
    expect(normalized.ngaySinhDuong).toBe('1991-10-24');
    expect(normalized.ngaySinhAm).toContain('Tân Mùi');
    expect(normalized.gioiTinh).toBe('Nam');
    expect(Object.keys(normalized.cung)).toHaveLength(12);
  });

  it('1990-01-01 female — complete pipeline', () => {
    const chart = generateChartVN({ year: 1990, month: 1, day: 1, hour: 0, gender: 'female' });
    const normalized = normalizeChartVN(chart);
    expect(normalized.gioiTinh).toBe('Nữ');
    expect(normalized.ngaySinhDuong).toBe('1990-01-01');
  });

  it('API returns success', async () => {
    const r = await handleChartGenerate({ year: 2000, month: 6, day: 15, hour: 12, gender: 'male' });
    expect(r.success).toBe(true);
    expect(r.data).toBeDefined();
  });

  it('output is JSON-serializable', () => {
    const chart = generateChartVN({ year: 1991, month: 10, day: 24, hour: 8, gender: 'male' });
    const normalized = normalizeChartVN(chart);
    expect(() => JSON.stringify(normalized)).not.toThrow();
  });

  it('performance: chart generation < 200ms', () => {
    const t0 = Date.now();
    for (let i = 0; i < 10; i++) {
      generateChartVN({ year: 1991, month: 10, day: 24, hour: 8, gender: 'male' });
    }
    expect(Date.now() - t0).toBeLessThan(200);
  });
});
