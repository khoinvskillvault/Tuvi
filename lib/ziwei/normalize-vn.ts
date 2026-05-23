// lib/ziwei/normalize-vn.ts
// Normalize ZiweiChartVN to clean JSON output for AI consumption

import type { ZiweiChartVN, StarInfo } from './algorithm-vn';
import { GENDER_VN } from './constants-vn';

export interface NormalizedChart {
  // Thông tin cơ bản
  hoTen: string;
  ngaySinhDuong: string;
  ngaySinhAm: string;
  gioiTinh: string;
  gioSinh: string;
  muiGio: number;

  // Tứ Hóa
  tuHoa: {
    hóaLộc: string;
    hóaQuyền: string;
    hóaKhoa: string;
    hóaKỵ: string;
  };

  // 12 Cung
  cung: {
    [cungName: string]: {
      canChi: string;
      saoChinhTinh: string[];
      saoPhuTinh: string[];
      sihua: string[];
    };
  };

  // Mệnh Cung
  menhCung: {
    ten: string;
    canChi: string;
    cucSo: string;
  };

  // Metadata
  thoiGianTao: string;
}

function formatStars(stars: StarInfo[]): string[] {
  return stars.map(s => {
    if (s.sihua) return `${s.name} (${s.sihuaVN ?? s.sihua})`;
    return s.name;
  });
}

function formatHour(hour: number): string {
  const shichen = ['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
  const idx = Math.floor(((hour + 1) % 24) / 2);
  return `Giờ ${shichen[idx]} (${hour}:00)`;
}

export function normalizeChartVN(chart: ZiweiChartVN): NormalizedChart {
  const { birthInfo, lunarDateStr, palaces, mingGong, sihua, wuxingJu } = chart;

  const cung: NormalizedChart['cung'] = {};
  for (const palace of palaces) {
    const saoChinhTinh = formatStars(palace.mainStars);
    const saoPhuTinh = formatStars(palace.minorStars);
    const sihuaList: string[] = [];
    cung[palace.name] = { canChi: palace.stemBranch, saoChinhTinh, saoPhuTinh, sihua: sihuaList };
  }

  return {
    hoTen: birthInfo.name ?? 'Không rõ',
    ngaySinhDuong: `${birthInfo.year}-${String(birthInfo.month).padStart(2,'0')}-${String(birthInfo.day).padStart(2,'0')}`,
    ngaySinhAm: lunarDateStr,
    gioiTinh: GENDER_VN[birthInfo.gender] ?? birthInfo.gender,
    gioSinh: formatHour(birthInfo.hour),
    muiGio: birthInfo.timeZone ?? 7,
    tuHoa: {
      hóaLộc: sihua.loc,
      hóaQuyền: sihua.quyen,
      hóaKhoa: sihua.khoa,
      hóaKỵ: sihua.ky,
    },
    cung,
    menhCung: {
      ten: mingGong?.name ?? 'Mệnh Cung',
      canChi: mingGong?.stemBranch ?? '',
      cucSo: wuxingJu,
    },
    thoiGianTao: chart.generatedAt,
  };
}

export default { normalizeChartVN };
