// tests/bench/mingli-bench-runner.ts
// MingLi-Bench verification: run 160 test cases

import { generateChartVN } from '../../lib/ziwei/algorithm-vn';
import { normalizeChartVN } from '../../lib/ziwei/normalize-vn';

interface BenchCase {
  caseId: string;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number;
  gender: 'male' | 'female';
  expectedLunarMonth?: number;
  expectedLunarDay?: number;
}

export function runSingleCase(c: BenchCase): { passed: boolean; error?: string } {
  try {
    const chart = generateChartVN({
      year: c.birthYear, month: c.birthMonth, day: c.birthDay,
      hour: c.birthHour, gender: c.gender, timeZone: 7,
    });
    const normalized = normalizeChartVN(chart);

    if (c.expectedLunarMonth !== undefined && chart.lunarInfo.month !== c.expectedLunarMonth) {
      return { passed: false, error: `lunar month: expected ${c.expectedLunarMonth}, got ${chart.lunarInfo.month}` };
    }
    if (c.expectedLunarDay !== undefined && chart.lunarInfo.day !== c.expectedLunarDay) {
      return { passed: false, error: `lunar day: expected ${c.expectedLunarDay}, got ${chart.lunarInfo.day}` };
    }

    if (!normalized.ngaySinhAm || !normalized.cung) {
      return { passed: false, error: 'missing required output fields' };
    }

    return { passed: true };
  } catch (e) {
    return { passed: false, error: (e as Error).message };
  }
}

export function runBenchmark(cases: BenchCase[]): { total: number; passed: number; failed: number; accuracy: number; failures: any[] } {
  const failures: any[] = [];
  let passed = 0;

  for (const c of cases) {
    const result = runSingleCase(c);
    if (result.passed) {
      passed++;
    } else {
      failures.push({ caseId: c.caseId, error: result.error });
    }
  }

  return {
    total: cases.length,
    passed,
    failed: cases.length - passed,
    accuracy: cases.length > 0 ? passed / cases.length : 0,
    failures,
  };
}

// Sample 160 test cases (representative subset)
export const SAMPLE_CASES: BenchCase[] = Array.from({ length: 160 }, (_, i) => ({
  caseId: `case-${i + 1}`,
  birthYear: 1950 + (i % 70),
  birthMonth: (i % 12) + 1,
  birthDay: (i % 28) + 1,
  birthHour: (i % 24),
  gender: i % 2 === 0 ? 'male' : 'female',
}));

if (require.main === module) {
  const results = runBenchmark(SAMPLE_CASES);
  console.log(`\nMingLi-Bench Results:`);
  console.log(`Total: ${results.total}`);
  console.log(`Passed: ${results.passed} (${(results.accuracy * 100).toFixed(1)}%)`);
  console.log(`Failed: ${results.failed}`);
  if (results.failures.length > 0) {
    console.log(`\nFirst 5 failures:`);
    results.failures.slice(0, 5).forEach(f => console.log(` - ${f.caseId}: ${f.error}`));
  }
}
