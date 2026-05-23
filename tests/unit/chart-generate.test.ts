import { describe, it, expect } from 'vitest';
import { handleChartGenerate } from '../../lib/api/chart-generate';

describe('handleChartGenerate', () => {
  const valid = { year: 1991, month: 10, day: 24, hour: 8, gender: 'male' as const };

  it('returns success for valid input', async () => {
    const r = await handleChartGenerate(valid);
    expect(r.success).toBe(true);
    expect(r.data).toBeDefined();
  });

  it('returns error for missing year', async () => {
    const r = await handleChartGenerate({ ...valid, year: undefined as any });
    expect(r.success).toBe(false);
  });

  it('returns error for invalid month', async () => {
    const r = await handleChartGenerate({ ...valid, month: 13 });
    expect(r.success).toBe(false);
  });

  it('returns error for invalid gender', async () => {
    const r = await handleChartGenerate({ ...valid, gender: 'unknown' as any });
    expect(r.success).toBe(false);
  });

  it('includes processingTimeMs', async () => {
    const r = await handleChartGenerate(valid);
    expect(r.processingTimeMs).toBeGreaterThanOrEqual(0);
  });

  it('returns Vietnamese output', async () => {
    const r = await handleChartGenerate(valid);
    expect(r.data?.ngaySinhAm).toContain('Năm');
  });

  it('handles optional timeZone', async () => {
    const r = await handleChartGenerate({ ...valid, timeZone: 7 });
    expect(r.success).toBe(true);
  });
});
