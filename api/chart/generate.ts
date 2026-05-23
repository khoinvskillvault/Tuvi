import type { VercelRequest, VercelResponse } from '@vercel/node';
import { generateChartVN } from '../../lib/ziwei/algorithm-vn';
import { normalizeChartVN } from '../../lib/ziwei/normalize-vn';

function validate(body: Record<string, unknown>): string | null {
  const { year, month, day, hour, gender } = body;
  if (!year || Number(year) < 1800 || Number(year) > 2100) return 'year phải từ 1800-2100';
  if (!month || Number(month) < 1 || Number(month) > 12) return 'month phải từ 1-12';
  if (!day || Number(day) < 1 || Number(day) > 31) return 'day phải từ 1-31';
  if (hour === undefined || Number(hour) < 0 || Number(hour) > 23) return 'hour phải từ 0-23';
  if (!gender || !['male', 'female'].includes(String(gender))) return 'gender phải là male hoặc female';
  return null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    return res.status(200).json({
      endpoint: 'POST /api/chart/generate',
      description: 'Tạo bản đồ Tử Vi Đẩu Số (Hybrid: iztro + lunar-vn GMT+7)',
      fields: {
        year: 'number (1800-2100)',
        month: 'number (1-12)',
        day: 'number (1-31)',
        hour: 'number (0-23)',
        gender: 'male | female',
        name: 'string (tuỳ chọn)',
        timeZone: 'number (mặc định: 7)',
      },
      example: { year: 1991, month: 10, day: 24, hour: 8, gender: 'male' },
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body as Record<string, unknown>;
  const error = validate(body);
  if (error) return res.status(400).json({ success: false, error });

  try {
    const t0 = Date.now();
    const chart = generateChartVN({
      year: Number(body.year),
      month: Number(body.month),
      day: Number(body.day),
      hour: Number(body.hour),
      gender: body.gender as 'male' | 'female',
      name: body.name ? String(body.name) : undefined,
      timeZone: body.timeZone ? Number(body.timeZone) : 7,
    });
    const data = normalizeChartVN(chart);
    return res.status(200).json({ success: true, data, processingTimeMs: Date.now() - t0 });
  } catch (err) {
    return res.status(500).json({ success: false, error: (err as Error).message });
  }
}
