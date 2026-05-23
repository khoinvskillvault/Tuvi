import { describe, it, expect } from 'vitest';
import { generateChartVN } from '../../lib/ziwei/algorithm-vn';
import { normalizeChartVN } from '../../lib/ziwei/normalize-vn';

describe('normalizeChartVN', () => {
  const base = { year: 1991, month: 10, day: 24, hour: 8, gender: 'male' as const, name: 'Test' };

  it('returns ngaySinhDuong in YYYY-MM-DD format', () => {
    const n = normalizeChartVN(generateChartVN(base));
    expect(n.ngaySinhDuong).toBe('1991-10-24');
  });

  it('returns ngaySinhAm in Vietnamese', () => {
    const n = normalizeChartVN(generateChartVN(base));
    expect(n.ngaySinhAm).toContain('Năm');
  });

  it('returns correct gioiTinh', () => {
    const n = normalizeChartVN(generateChartVN(base));
    expect(n.gioiTinh).toBe('Nam');
  });

  it('returns tuHoa with all 4 fields', () => {
    const n = normalizeChartVN(generateChartVN(base));
    expect(n.tuHoa.hóaLộc).toBeTruthy();
    expect(n.tuHoa.hóaQuyền).toBeTruthy();
    expect(n.tuHoa.hóaKhoa).toBeTruthy();
    expect(n.tuHoa.hóaKỵ).toBeTruthy();
  });

  it('returns 12 cung entries', () => {
    const n = normalizeChartVN(generateChartVN(base));
    expect(Object.keys(n.cung)).toHaveLength(12);
  });

  it('includes menhCung', () => {
    const n = normalizeChartVN(generateChartVN(base));
    expect(n.menhCung.ten).toContain('Cung');
  });

  it('sets hoTen from birthInfo.name', () => {
    const n = normalizeChartVN(generateChartVN(base));
    expect(n.hoTen).toBe('Test');
  });
});
