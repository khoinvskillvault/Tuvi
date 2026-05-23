// lib/api/chart-generate.ts
// REST API endpoint: POST /api/chart/generate

import { generateChartVN, type BirthInfo } from '../ziwei/algorithm-vn';
import { normalizeChartVN } from '../ziwei/normalize-vn';

export interface ChartRequest {
  year: number;
  month: number;
  day: number;
  hour: number;
  gender: 'male' | 'female';
  name?: string;
  timeZone?: number;
}

export interface ChartResponse {
  success: boolean;
  data?: ReturnType<typeof normalizeChartVN>;
  error?: string;
  processingTimeMs?: number;
}

function validateRequest(body: Partial<ChartRequest>): string | null {
  if (!body.year || body.year < 1800 || body.year > 2100) return 'year phải từ 1800-2100';
  if (!body.month || body.month < 1 || body.month > 12) return 'month phải từ 1-12';
  if (!body.day || body.day < 1 || body.day > 31) return 'day phải từ 1-31';
  if (body.hour === undefined || body.hour < 0 || body.hour > 23) return 'hour phải từ 0-23';
  if (!body.gender || !['male','female'].includes(body.gender)) return 'gender phải là male hoặc female';
  return null;
}

export async function handleChartGenerate(body: Partial<ChartRequest>): Promise<ChartResponse> {
  const start = Date.now();

  const validationError = validateRequest(body);
  if (validationError) {
    return { success: false, error: validationError };
  }

  try {
    const birthInfo: BirthInfo = {
      year: body.year!,
      month: body.month!,
      day: body.day!,
      hour: body.hour!,
      gender: body.gender!,
      name: body.name,
      timeZone: body.timeZone ?? 7,
    };

    const chart = generateChartVN(birthInfo);
    const normalized = normalizeChartVN(chart);

    return {
      success: true,
      data: normalized,
      processingTimeMs: Date.now() - start,
    };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

// Next.js App Router handler
export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json() as Partial<ChartRequest>;
    const result = await handleChartGenerate(body);
    return new Response(JSON.stringify(result, null, 2), {
      status: result.success ? 200 : 400,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  } catch {
    return new Response(JSON.stringify({ success: false, error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function GET(): Promise<Response> {
  const docs = {
    endpoint: 'POST /api/chart/generate',
    description: 'Tạo bản đồ Tử Vi Đẩu Số với AI (Hybrid: iztro + lunar-vn GMT+7)',
    request: { year: 'number (1800-2100)', month: 'number (1-12)', day: 'number (1-31)', hour: 'number (0-23)', gender: 'male|female', name: 'string (optional)', timeZone: 'number (default: 7)' },
    example: { year: 1991, month: 10, day: 24, hour: 8, gender: 'male', name: 'Nguyễn Văn A' },
  };
  return new Response(JSON.stringify(docs, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
