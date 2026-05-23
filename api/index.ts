import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.status(200).json({
    name: 'Tử Vi Đẩu Số AI Hybrid API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      'POST /api/chart/generate': 'Tạo bản đồ Tử Vi từ ngày sinh',
      'GET  /api/chart/generate': 'Xem tài liệu API',
    },
    example: {
      method: 'POST',
      url: '/api/chart/generate',
      body: {
        year: 1991,
        month: 10,
        day: 24,
        hour: 8,
        gender: 'male',
        timeZone: 7,
      },
    },
  });
}
