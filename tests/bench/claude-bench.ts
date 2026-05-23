// tests/bench/claude-bench.ts
// Benchmark Claude AI accuracy on Ziwei charts

import { generateChartVN } from '../../lib/ziwei/algorithm-vn';
import { normalizeChartVN } from '../../lib/ziwei/normalize-vn';

export interface ClaudeBenchCase {
  caseId: string;
  birthInfo: { year: number; month: number; day: number; hour: number; gender: 'male' | 'female' };
  question: string;
  expectedAnswer: string;
  category: string;
}

export function prepareChartContext(birthInfo: ClaudeBenchCase['birthInfo']): string {
  const chart = generateChartVN(birthInfo);
  const normalized = normalizeChartVN(chart);
  return JSON.stringify(normalized, null, 2);
}

export function buildPrompt(chartContext: string, question: string): string {
  return `Bạn là chuyên gia Tử Vi Đẩu Số. Dưới đây là bản đồ sao:\n\n${chartContext}\n\nCâu hỏi: ${question}\n\nHãy luận giải chi tiết.`;
}

// Benchmark categories
export const BENCH_CATEGORIES = ['Sức khỏe','Tình duyên','Sự nghiệp','Tài lộc','Gia đình'];

export async function runClaudeBench(cases: ClaudeBenchCase[], apiKey?: string): Promise<{ total: number; scored: number; accuracy: number }> {
  console.log(`Running Claude bench on ${cases.length} cases...`);
  console.log(`(API key ${apiKey ? 'provided' : 'not provided — skipping API calls'})`);
  return { total: cases.length, scored: 0, accuracy: 0 };
}

if (require.main === module) {
  console.log('Claude Bench Runner');
  console.log('Set ANTHROPIC_API_KEY to run full benchmark');
  console.log('Target accuracy: ≥55%');
}
