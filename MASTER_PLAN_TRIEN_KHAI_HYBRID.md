# 🚀 MASTER PLAN: TRIỂN KHAI HYBRID APPROACH TỐI ƯU

**Project:** Ứng dụng Tử Vi + AI (Khôi)  
**Decision Date:** 2026-05-22  
**Approval:** ✅ Khôi agreed  
**Status:** Ready to Code

---

## 📋 PHẦN 1: OVERVIEW TỔNG QUÁT

### Mục tiêu cuối cùng:

```
User nhập ngày sinh
        ↓
[Hybrid: iztro + lasotuvi + lunar-vn]
        ↓
Bản đồ sao 100% chính xác (Việt Nam)
        ↓
[Claude AI]
        ↓
Luận giải bay bổng, có chiều sâu
        ↓
[Verify: MingLi-Bench 160 test cases]
        ↓
✅ Production-ready
```

### Deliverables:

| Giai đoạn | Deliverable | Timeline | Status |
|-----------|-------------|----------|--------|
| **Giai đoạn 1** (DONE) | Thẩm định 3 repos | ✅ Hoàn thành | ✅ |
| **Giai đoạn 2** | Lunar converter (lunar-vn.ts) | Tuần 1 | 🔜 |
| **Giai đoạn 3** | Algorithm + Normalize | Tuần 2-3 | 🔜 |
| **Giai đoạn 4** | Unit tests + Integration | Tuần 4-5 | 🔜 |
| **Giai đoạn 5** | MingLi-Bench verification | Tuần 5-6 | 🔜 |
| **Giai đoạn 6** | Deployment + QA | Tuần 6-7 | 🔜 |

---

## 🔧 GIAI ĐOẠN 2: PORT LUNAR CONVERTER (Tuần 1 — 40 giờ)

### 2.1 Task Breakdown

#### **Task 2.1.1: Nghiên cứu lasotuvi/Lich_HND.py** (8 giờ)
**Owner:** Khôi (hoặc lập trình viên chỉ định)  
**Deadline:** Ngày 24/05 (T2)

- [ ] Đọc kỹ `lasotuvi/Lich_HND.py` (250 dòng)
  - [ ] Hiểu `jdFromDate()` — công thức Julian Day
  - [ ] Hiểu `jdToDate()` — hàm ngược
  - [ ] Hiểu `NewMoon()` — tính sóc (ngày trăng mới)
  - [ ] Hiểu `SunLongitude()` — vị trí mặt trời

- [ ] Xem `lasotuvi/Lich_EPHEM.py` (83 dòng) — thư viện ephem
  - [ ] Xem cách gọi `ephem` library

- [ ] Xem `lasotuvi/tests/test_lich.py` (62 dòng)
  - [ ] Hiểu test case: `1991-10-24` → `1991-09-17` (Hồ Chí Minh)
  - [ ] Hiểu test case: `1987-08-29` → tháng nhuận

**Output:** Document "LUNAR_VN_ALGORITHM_NOTES.md" (ghi chú hiểu biết)

---

#### **Task 2.1.2: Viết `lib/lunar/lunar-vn.ts` phần 1** (12 giờ)
**Owner:** Lập trình viên (JS/TS)  
**Deadline:** Ngày 25/05 (T3)

**Phần 1.1: Julian Day Calculation (jdFromDate + jdToDate)**

```typescript
// lib/lunar/lunar-vn.ts — PHẦN 1

/**
 * Julian Day Number từ ngày Gregorian
 * Công thức Jean Meeus (Astronomical Algorithms, 1998)
 */
export function jdFromDate(day: number, month: number, year: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  
  let jd = day + Math.floor((153 * m + 2) / 5) +
           365 * y + Math.floor(y / 4) -
           Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  
  if (jd < 2299161) {
    jd = day + Math.floor((153 * m + 2) / 5) +
         365 * y + Math.floor(y / 4) - 32083;
  }
  
  return jd;
}

/**
 * Từ Julian Day Number → ngày Gregorian
 */
export function jdToDate(jd: number): [number, number, number] {
  // ... (implement từ lasotuvi)
  return [day, month, year];
}
```

**Checklist:**
- [ ] Implement `jdFromDate()` hoàn toàn
- [ ] Implement `jdToDate()` hoàn toàn
- [ ] Test: `jdFromDate(1, 1, 2000)` should be 2451545
- [ ] Test: `jdToDate(2451545)` should be [1, 1, 2000]

---

#### **Task 2.1.3: Viết `lib/lunar/lunar-vn.ts` phần 2** (12 giờ)
**Owner:** Lập trình viên  
**Deadline:** Ngày 26/05 (T4)

**Phần 2: Moon Phase (NewMoon)**

```typescript
// lib/lunar/lunar-vn.ts — PHẦN 2

/**
 * Tính thời điểm sóc (New Moon)
 * Từ Jean Meeus algorithm
 */
export function NewMoon(k: number): number {
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  const dr = Math.PI / 180;
  
  let jd = 2415020.75933 + 29.53058868 * k +
           0.0001178 * T2 - 0.000000155 * T3;
  
  // ... (30+ dòng hiệu chỉnh từ Jean Meeus)
  // Chi tiết: Copy từ lasotuvi/Lich_HND.py dòng 58-110
  
  return jd;
}

/**
 * Tính vị trí Mặt Trời (ecliptic longitude)
 * Dùng để xác định tiết khí (optional)
 */
export function SunLongitude(jd: number): number {
  // ... (tính toán chi tiết)
  return longitude;
}
```

**Checklist:**
- [ ] Implement `NewMoon()` với tất cả hiệu chỉnh
- [ ] Test: `NewMoon(2)` nằm trong khoảng hợp lý
- [ ] Copy chính xác từ lasotuvi (byte-by-byte nếu cần)

---

#### **Task 2.1.4: Viết `lib/lunar/lunar-vn.ts` phần 3** (8 giờ)
**Owner:** Lập trình viên  
**Deadline:** Ngày 27/05 (T5)

**Phần 3: Lunar Date Conversion (getLunarDate với GMT+7)**

```typescript
// lib/lunar/lunar-vn.ts — PHẦN 3

export interface LunarDateVN {
  year: number;           // Năm âm lịch
  month: number;          // Tháng (1-12, hoặc -1 to -12 nếu nhuận)
  day: number;            // Ngày (1-30)
  isLeapMonth: boolean;   // Có phải tháng nhuận?
  yearStem: number;       // Thiên can (0-9)
  yearBranch: number;     // Địa chi (0-11)
}

/**
 * Chuyển dương lịch → âm lịch (HỖ TRỢ GMT+7)
 * 
 * @param year, month, day - Dương lịch
 * @param timeZone - Múi giờ (mặc định 7 = GMT+7 Việt Nam)
 * @returns LunarDateVN
 * 
 * Ví dụ:
 *   getLunarDate(1991, 10, 24, 7) 
 *   → { year: 1991, month: 9, day: 17, isLeapMonth: false, ... }
 */
export function getLunarDate(
  year: number,
  month: number,
  day: number,
  timeZone: number = 7
): LunarDateVN {
  // Bước 1: Tính Julian Day của dương lịch
  let jd = jdFromDate(day, month, year);
  
  // Bước 2: Điều chỉnh cho múi giờ (GMT+7 vs GMT+8)
  jd = jd + (timeZone - 8) / 24;
  
  // Bước 3: Tìm sóc gần nhất
  let k = Math.floor((jd - 2451550.1) / 29.530588861);
  let newmoon = NewMoon(k);
  if (newmoon > jd) {
    k--;
    newmoon = NewMoon(k);
  }
  
  // Bước 4: Tính thông tin âm lịch từ sóc
  const newmoonDate = jdToDate(Math.floor(newmoon + 0.5));
  const lunarYear = newmoonDate[2];
  
  // ... (logic chi tiết xem lasotuvi/Lich_HND.py dòng 150-220)
  
  return {
    year: lunarYear,
    month: month,  // TODO: tính từ số sóc
    day: day,      // TODO: tính từ số sóc
    isLeapMonth: false,
    yearStem: (year - 4) % 10,
    yearBranch: (year - 4) % 12,
  };
}
```

**Checklist:**
- [ ] Implement `getLunarDate()` với GMT+7 handling
- [ ] Test case: `getLunarDate(1991, 10, 24, 7)` → month=9, day=17
- [ ] Test case: `getLunarDate(1987, 8, 29, 7)` → isLeapMonth=true
- [ ] Test GMT+7 vs GMT+8 → Kết quả có thể khác nhau

---

### 2.2 Unit Tests cho Giai đoạn 2

#### **Task 2.2.1: Viết `tests/unit/lunar-vn.test.ts`** (8 giờ)
**Owner:** Lập trình viên  
**Deadline:** Ngày 28/05 (T6)

```typescript
// tests/unit/lunar-vn.test.ts

import { describe, it, expect } from 'vitest';
import { jdFromDate, jdToDate, getLunarDate, NewMoon } from '@/lib/lunar/lunar-vn';

describe('Lunar Converter (Vietnam)', () => {
  
  describe('jdFromDate', () => {
    it('should calculate Julian Day correctly (J2000.0)', () => {
      const jd = jdFromDate(1, 1, 2000);
      expect(jd).toBe(2451545);
    });
    
    it('should handle pre-Gregorian dates', () => {
      const jd = jdFromDate(4, 10, 1582);
      expect(jd).toBeLessThan(2299161);
    });
  });
  
  describe('jdToDate', () => {
    it('should reverse jdFromDate correctly', () => {
      const [day, month, year] = jdToDate(2451545);
      expect(day).toBe(1);
      expect(month).toBe(1);
      expect(year).toBe(2000);
    });
  });
  
  describe('getLunarDate', () => {
    it('should convert 1991-10-24 to lunar correctly (GMT+7)', () => {
      const lunar = getLunarDate(1991, 10, 24, 7);
      
      expect(lunar.year).toBe(1991);
      expect(lunar.month).toBe(9);
      expect(lunar.day).toBe(17);
      expect(lunar.isLeapMonth).toBe(false);
    });
    
    it('should handle leap months correctly', () => {
      const lunar = getLunarDate(1987, 8, 29, 7);
      
      expect(lunar.year).toBe(1987);
      expect(lunar.isLeapMonth).toBe(true);
    });
    
    it('should handle GMT+7 vs GMT+8 correctly', () => {
      const lunarGMT7 = getLunarDate(2000, 5, 15, 7);
      const lunarGMT8 = getLunarDate(2000, 5, 15, 8);
      
      // Có thể khác nhau 1 ngày tùy vào giờ chính xác
      expect(lunarGMT7.day).toBeGreaterThanOrEqual(lunarGMT8.day - 1);
    });
  });
  
  describe('NewMoon', () => {
    it('should calculate new moon date', () => {
      const jd = NewMoon(2);
      expect(jd).toBeGreaterThan(2415000);
      expect(jd).toBeLessThan(2416000);
    });
  });
});
```

**Checklist:**
- [ ] Viết 8-10 test cases cho jdFromDate
- [ ] Viết 5-6 test cases cho jdToDate
- [ ] Viết 6-8 test cases cho getLunarDate
- [ ] Viết 3-4 test cases cho NewMoon
- [ ] Chạy `npm test -- lunar-vn.test.ts`
- [ ] **Tất cả 20+ test cases đều PASS** ✅

---

### 2.3 Milestone: End of Week 1

**Yêu cầu:**
- ✅ `lib/lunar/lunar-vn.ts` hoàn thành & tested
- ✅ 20+ unit tests PASS
- ✅ Verified vs lasotuvi test cases
- ✅ Document: LUNAR_VN_ALGORITHM_NOTES.md
- ✅ Git commit & push

**Definition of Done:**
```bash
$ npm test -- lunar-vn.test.ts
# PASS ✓ Lunar Converter (Vietnam) [20+ tests]
```

---

## 🔗 GIAI ĐOẠN 3: MODIFY ALGORITHM + NORMALIZE (Tuần 2-3 — 40 giờ)

### 3.1 Task Breakdown

#### **Task 3.1.1: Viết `lib/ziwei/algorithm-vn.ts`** (8 giờ)
**Owner:** Lập trình viên  
**Deadline:** Ngày 31/05 (T3 tuần 2)

**Wrapper của iztro + lunar-vn**

```typescript
// lib/ziwei/algorithm-vn.ts

import { astro } from 'iztro';
import { getLunarDate } from '../lunar/lunar-vn';
import type { BirthInfo, ZiweiChart } from './types';
import { BRANCHES, STEMS } from './constants';

/**
 * Hàm chính: Tạo bản đồ Tử Vi (VIETNAM VERSION)
 * 
 * Khác điểm từ algorithm.ts gốc:
 * 1. Dùng getLunarDate() thay vì Solar.fromYmd()
 * 2. Hỗ trợ BirthInfo.timeZone (mặc định 7)
 */
export function generateChartVN(
  birthInfo: BirthInfo & { timeZone?: number }
): ZiweiChart {
  const { year, month, day, hour, gender, timeZone = 7 } = birthInfo;
  
  // ========== KHÁC ĐIỂM: Dùng lunar-vn thay lunar-javascript ==========
  const lunarInfo = getLunarDate(year, month, day, timeZone);
  
  // ========== PHẦN CÒN LẠI: 100% GIỐNG iztro gốc ==========
  const solarDate = `${year}-${month}-${day}`;
  const iztroGender = gender === 'male' ? '男' : '女';
  
  const astrolabe = astro.bySolar(solarDate, hour, iztroGender, true, 'zh-CN');
  
  // ... (Zếp xếp sao như algorithm.ts gốc, không thay đổi)
  const palaces = astrolabe.palaces.map(p => {
    // ... code giống gốc từ algorithm.ts dòng 74-97
  });
  
  // ... (còn lại giống gốc từ algorithm.ts dòng 112-181)
  
  return {
    birthInfo,
    lunarInfo,  // ✨ Dùng lunarInfo từ lunar-vn (chứ không phải iztro)
    mingGongBranch: 0,
    // ... các field khác từ iztro
  };
}
```

**Checklist:**
- [ ] Copy toàn bộ algorithm.ts từ iztro
- [ ] Replace `getLunarInfo()` bằng gọi `getLunarDate()`
- [ ] Replace `import { Solar } from 'lunar-javascript'` bằng `import { getLunarDate }`
- [ ] Test: `generateChartVN()` cho 1 người
- [ ] Verify: Chart giống với iztro pure (ngoại trừ lunarInfo)

---

#### **Task 3.1.2: Viết `lib/ziwei/normalize-vn.ts`** (16 giờ)
**Owner:** Lập trình viên  
**Deadline:** Ngày 02/06 (T2 tuần 3)

**Output normalization: ZiweiChart (Trung) → ZiweiChartVN (Việt)**

```typescript
// lib/ziwei/normalize-vn.ts

import type { ZiweiChart } from './types';
import { STAR_NAMES_VN, PALACE_NAMES_VN, SIHUA_NAMES_VN } from './constants-vn';

export interface ZiweiChartVN {
  // Thông tin cơ bản
  ngaySinhDuong: string;              // "1991-10-24"
  ngaySinhAm: string;                 // "Năm Tân Mùi, Tháng Chín, Mùi"
  gioiTinh: 'nam' | 'nữ';
  tuoi: number;
  
  // Các cung và sao
  cung: {
    [cungName: string]: {
      tenCung: string;               // "Mệnh Cung"
      ganCanChi: string;             // "Giáp Tý"
      saoChinhTinh: string[];        // ["Tử Vi", "Thiên Tương"]
      saoPhuTinh: string[];
      saoDacBiet: string[];
      dacTinh: string;               // "Vượng", "Miếu", "Đắc", "Bình", "Hãm"
    }
  };
  
  // Tứ Hóa
  tuHoa: {
    loc: string;
    quyen: string;
    khoa: string;
    ky: string;
  };
  
  // Các mẫu hình
  cauTruc: string[];
  
  // Vòng Tràng Sinh
  daiHan: {
    age: number;
    cung: string;
    tuoi: string;
  }[];
  
  // Metadata
  tongHop: {
    tenCuc: string;
    menhChu: string;
    sanKhac: string;
  };
}

/**
 * Hàm chính: Normalize ZiweiChart → ZiweiChartVN
 */
export function normalizeChartVN(chart: ZiweiChart): ZiweiChartVN {
  const { birthInfo, lunarInfo, palaces, daXians, wuxingJuName } = chart;
  
  // ========== THÔNG TIN CƠ BẢN ==========
  const ngaySinhDuong = `${birthInfo.year}-${String(birthInfo.month).padStart(2, '0')}-${String(birthInfo.day).padStart(2, '0')}`;
  const ngaySinhAm = `Năm ${getCanChiNameVN(lunarInfo.yearStem, lunarInfo.yearBranch)}, Tháng ${lunarInfo.lunarMonth}, Ngày ${lunarInfo.lunarDay}`;
  const gioiTinh = birthInfo.gender === 'male' ? 'nam' : 'nữ';
  
  // ========== CÁC CUNG VÀ SÃO ==========
  const cung: any = {};
  palaces.forEach(palace => {
    // ... logic tương tự như TECHNICAL_SPECIFICATION_HYBRID.md
  });
  
  // ========== TỨ HÓA ==========
  const yearStemIndex = lunarInfo.yearStem;
  const sihuaMap = getSihuaMap(yearStemIndex);
  
  // ========== CẤU TRÚC / MẪUÌNH ==========
  // Lấy từ patterns.ts, tạo bản Việt
  
  // ========== RETURN ==========
  return {
    ngaySinhDuong,
    ngaySinhAm,
    gioiTinh,
    tuoi: chart.currentAge,
    cung,
    tuHoa: {
      loc: sihuaMap['禄'],
      quyen: sihuaMap['权'],
      khoa: sihuaMap['科'],
      ky: sihuaMap['忌'],
    },
    cauTruc: [],  // TODO: từ patterns
    daiHan: [],   // TODO: từ daXians
    tongHop: {
      tenCuc: wuxingJuName,
      menhChu: getMenhChu(lunarInfo.yearStem, lunarInfo.yearBranch),
      sanKhac: getSanKhacVN(chart),
    },
  };
}

// Helper functions
function getCanChiNameVN(stem: number, branch: number): string {
  const cans = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
  const chis = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
  return `${cans[stem]} ${chis[branch]}`;
}

function getSihuaMap(stemIndex: number): Record<string, string> {
  // ... từ constants-vn.ts
}

// ... (các helper khác)
```

**Checklist:**
- [ ] Viết `normalizeChartVN()` hoàn toàn
- [ ] Viết 10+ helper functions
- [ ] Test: Input ZiweiChart → Output ZiweiChartVN
- [ ] Verify: Tên sao, tên cung đều là tiếng Việt
- [ ] Verify: JSON output sạch, dễ đọc

---

#### **Task 3.1.3: Viết `lib/ziwei/constants-vn.ts`** (8 giờ)
**Owner:** Lập trình viên  
**Deadline:** Ngày 02/06 (T2 tuần 3)

**Bảng ánh xạ Trung → Việt**

```typescript
// lib/ziwei/constants-vn.ts

export const STAR_NAMES_VN: Record<string, string> = {
  // 14 Chính tinh
  '紫微': 'Tử Vi',
  '天机': 'Thiên Cơ',
  '太阳': 'Thái Dương',
  '武曲': 'Võ Khúc',
  '天同': 'Thiên Đồng',
  '廉贞': 'Liêm Trinh',
  '天府': 'Thiên Phủ',
  '太阴': 'Thái Âm',
  '贪狼': 'Tham Lang',
  '巨门': 'Cự Môn',
  '天相': 'Thiên Tương',
  '天梁': 'Thiên Lương',
  '七杀': 'Thất Sát',
  '破军': 'Phá Quân',
  
  // Phụ tinh chính (+ 30+ khác)
  '左辅': 'Tả Phụ',
  '右弼': 'Hữu Bật',
  // ... (tất cả)
};

export const PALACE_NAMES_VN: Record<string, string> = {
  '命宫': 'Mệnh Cung',
  '兄弟宫': 'Huynh Đệ Cung',
  '夫妻宫': 'Phu Thê Cung',
  '子女宫': 'Tử Nữ Cung',
  '财帛宫': 'Tài Bạc Cung',
  '疾厄宫': 'Tật Ách Cung',
  '迁移宫': 'Thiên Di Cung',
  '交友宫': 'Giao Hữu Cung',
  '官禄宫': 'Quan Lộc Cung',
  '田宅宫': 'Điền Trạch Cung',
  '福德宫': 'Phúc Đức Cung',
  '父母宫': 'Phụ Mẫu Cung',
};

export const SIHUA_NAMES_VN: Record<string, string> = {
  '禄': 'Lục',
  '权': 'Quyền',
  '科': 'Khoa',
  '忌': 'Kỵ',
};

// ... (10+ bảng ánh xạ khác)
```

**Checklist:**
- [ ] Viết STAR_NAMES_VN (14 chính + 40+ phụ)
- [ ] Viết PALACE_NAMES_VN (12 cung)
- [ ] Viết SIHUA_NAMES_VN (4 loại năng lượng)
- [ ] Viết CHI_NAMES_VN (12 địa chi)
- [ ] Viết CAN_NAMES_VN (10 thiên can)
- [ ] Viết NGOHANH_NAMES_VN (5 ngũ hành)
- [ ] Viết PATTERNS_NAMES_VN (60+ mẫu hình)
- [ ] Verify: Tất cả đều dùng tiếng Việt chuẩn

---

#### **Task 3.1.4: Viết `lib/api/chart-generate.ts`** (8 giờ)
**Owner:** Lập trình viên  
**Deadline:** Ngày 03/06 (T3 tuần 3)

**API endpoint: POST /api/chart/generate**

```typescript
// lib/api/chart-generate.ts (hoặc app/api/chart/generate/route.ts cho Next.js 14)

import { generateChartVN } from '@/lib/ziwei/algorithm-vn';
import { normalizeChartVN } from '@/lib/ziwei/normalize-vn';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const {
      year,
      month,
      day,
      hour,
      gender,
      name,
      timeZone = 7,
    } = body;
    
    // Validate input
    if (!year || !month || !day || hour === undefined || !gender) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400 }
      );
    }
    
    // Generate chart (với GMT+7 handling)
    const chart = generateChartVN({
      year,
      month,
      day,
      hour,
      gender,
      name,
      timeZone,
    });
    
    // Normalize to Vietnamese output
    const chartVN = normalizeChartVN(chart);
    
    return new Response(
      JSON.stringify(chartVN, null, 2),
      { status: 200, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
    
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500 }
    );
  }
}
```

**Checklist:**
- [ ] Implement POST handler
- [ ] Validate input
- [ ] Call generateChartVN()
- [ ] Call normalizeChartVN()
- [ ] Return JSON Việt
- [ ] Error handling tốt

---

### 3.2 Unit Tests cho Giai đoạn 3

#### **Task 3.2.1: Viết `tests/unit/algorithm-vn.test.ts`** (4 giờ)
**Owner:** Lập trình viên  
**Deadline:** Ngày 04/06 (T4 tuần 3)

```typescript
describe('Algorithm VN', () => {
  it('should generate chart with GMT+7 handling', () => {
    const chart = generateChartVN({
      year: 1991,
      month: 10,
      day: 24,
      hour: 8,
      gender: 'male',
      timeZone: 7,
    });
    
    expect(chart.lunarInfo.year).toBe(1991);
    expect(chart.lunarInfo.month).toBe(9);
    expect(chart.lunarInfo.day).toBe(17);
  });
});
```

**Checklist:**
- [ ] 5-8 test cases cho generateChartVN()
- [ ] Tất cả PASS ✅

---

#### **Task 3.2.2: Viết `tests/unit/normalize-vn.test.ts`** (4 giờ)

```typescript
describe('Normalization', () => {
  it('should normalize chart to Vietnamese output', () => {
    // Generate chart
    const chart = generateChartVN({...});
    
    // Normalize
    const chartVN = normalizeChartVN(chart);
    
    // Verify: Tiếng Việt
    expect(chartVN.ngaySinhAm).toContain('Năm');
    expect(chartVN.ngaySinhAm).toContain('Tháng');
    expect(chartVN.gioiTinh).toMatch(/nam|nữ/);
    
    // Verify: JSON structure
    expect(chartVN.cung).toBeDefined();
    expect(chartVN.tuHoa).toBeDefined();
    expect(chartVN.cauTruc).toBeInstanceOf(Array);
  });
});
```

**Checklist:**
- [ ] 5-8 test cases cho normalizeChartVN()
- [ ] Tất cả PASS ✅

---

### 3.3 Milestone: End of Week 3

**Yêu cầu:**
- ✅ `lib/ziwei/algorithm-vn.ts` hoàn thành
- ✅ `lib/ziwei/normalize-vn.ts` hoàn thành
- ✅ `lib/ziwei/constants-vn.ts` hoàn thành
- ✅ `lib/api/chart-generate.ts` hoàn thành
- ✅ 10+ unit tests PASS
- ✅ Git commit & push

**Definition of Done:**
```bash
$ npm test -- "algorithm-vn|normalize-vn"
# PASS ✓ Algorithm VN [5+ tests]
# PASS ✓ Normalization [5+ tests]
```

---

## 🧪 GIAI ĐOẠN 4: UNIT TESTS + INTEGRATION (Tuần 4-5 — 40 giờ)

### 4.1 Integration Tests

#### **Task 4.1.1: Full Flow Test** (8 giờ)
**Owner:** Lập trình viên  
**Deadline:** Ngày 07/06 (T2 tuần 4)

```typescript
// tests/integration/full-flow.test.ts

describe('Full Flow: Input → Chart → JSON', () => {
  it('should handle complete flow from birth date to normalized chart', () => {
    // Input
    const birthInfo = {
      year: 1991,
      month: 10,
      day: 24,
      hour: 8,
      gender: 'male' as const,
      timeZone: 7,
    };
    
    // Process
    const chart = generateChartVN(birthInfo);
    const chartVN = normalizeChartVN(chart);
    
    // Verify
    expect(chartVN.ngaySinhDuong).toBe('1991-10-24');
    expect(chartVN.ngaySinhAm).toContain('Tân Mùi');
    expect(chartVN.gioiTinh).toBe('nam');
    expect(chartVN.tuoi).toBeGreaterThan(0);
    expect(chartVN.cung).toBeDefined();
    expect(chartVN.tuHoa).toBeDefined();
    expect(chartVN.cauTruc).toBeInstanceOf(Array);
  });
});
```

**Checklist:**
- [ ] 3-5 integration test cases
- [ ] Test với 3-5 người nổi tiếng khác nhau
- [ ] Tất cả PASS ✅

---

#### **Task 4.1.2: Comparison: Hybrid vs iztro Pure** (8 giờ)
**Owner:** Lập trình viên  
**Deadline:** Ngày 08/06 (T3 tuần 4)

```typescript
// tests/integration/hybrid-vs-pure.test.ts

describe('Hybrid vs iztro Pure', () => {
  it('hybrid chart should match iztro pure (except lunar info)', () => {
    // Chart từ Hybrid (iztro + lasotuvi + lunar-vn)
    const hybridChart = generateChartVN({...});
    
    // Chart từ iztro pure (lunar-javascript)
    const pureChart = generateChartPure({...});
    
    // So sánh: palaces, sihua, patterns nên giống
    expect(hybridChart.palaces.length).toBe(pureChart.palaces.length);
    
    hybridChart.palaces.forEach((palace, idx) => {
      expect(palace.stars.length).toBe(pureChart.palaces[idx].stars.length);
      expect(palace.name).toBe(pureChart.palaces[idx].name);
    });
    
    // Lunar info sẽ khác (lunar-vn vs lunar-js)
    // Nhưng nên rất gần
  });
});
```

**Checklist:**
- [ ] 5-10 comparison test cases
- [ ] Verify: Hybrid ≈ iztro pure
- [ ] Tất cả PASS ✅

---

#### **Task 4.1.3: Celebrity Test Cases** (12 giờ)
**Owner:** Lập trình viên + Khôi (verify kết quả)  
**Deadline:** Ngày 09/06 (T4 tuần 4)

```typescript
// tests/integration/celebrity-data.ts

export const TEST_CASES = [
  {
    name: 'Hồ Chí Minh',
    birthInfo: {
      year: 1890,
      month: 5,
      day: 19,
      hour: 8,
      gender: 'male',
      timeZone: 7,
    },
    expected: {
      lunarMonth: 4,  // Âm lịch tháng 4
      lunarDay: 6,
      // ... expect khác
    },
  },
  {
    name: 'Nguyễn Ánh',
    birthInfo: { /* ... */ },
    expected: { /* ... */ },
  },
  // ... (10-15 celebrities khác)
];

// tests/integration/celebrity.test.ts
describe('Celebrity Test Cases', () => {
  TEST_CASES.forEach(testCase => {
    it(`should correctly generate chart for ${testCase.name}`, () => {
      const chart = generateChartVN(testCase.birthInfo);
      const chartVN = normalizeChartVN(chart);
      
      // Verify lunar info
      expect(chart.lunarInfo.month).toBe(testCase.expected.lunarMonth);
      expect(chart.lunarInfo.day).toBe(testCase.expected.lunarDay);
      
      // Verify output format
      expect(chartVN.ngaySinhAm).toBeTruthy();
      expect(chartVN.cung).toBeDefined();
    });
  });
});
```

**Checklist:**
- [ ] Tìm 10-15 celebrities Việt nổi tiếng
  - [ ] Hồ Chí Minh
  - [ ] Nguyễn Huệ
  - [ ] Hùng Vương
  - [ ] Trần Hưng Đạo
  - [ ] Phạm Văn Đồng
  - [ ] Võ Nguyên Giáp
  - [ ] Bác Hồ (khác tên)
  - [ ] Nông Đức Mạnh
  - [ ] Nguyễn Minh Triết
  - [ ] Trương Tấn Sang
  - [ ] Nguyễn Xuân Phúc
  - [ ] Phạm Minh Chính

- [ ] Verify mỗi celebrity
  - [ ] Ngày sinh (dương lịch)
  - [ ] Ngày sinh (âm lịch) — tra từ các nguồn
  - [ ] Bản đồ sao — compare với các app lý số
  
- [ ] Tất cả test cases PASS ✅

---

### 4.2 API Testing

#### **Task 4.2.1: API Integration Test** (8 giờ)
**Owner:** Lập trình viên  
**Deadline:** Ngày 10/06 (T5 tuần 4)

```typescript
// tests/api/chart-generate.test.ts

describe('POST /api/chart/generate', () => {
  it('should return normalized chart JSON', async () => {
    const response = await fetch('/api/chart/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        year: 1991,
        month: 10,
        day: 24,
        hour: 8,
        gender: 'male',
        timeZone: 7,
      }),
    });
    
    expect(response.status).toBe(200);
    
    const chartVN = await response.json();
    expect(chartVN.ngaySinhDuong).toBe('1991-10-24');
    expect(chartVN.cung).toBeDefined();
  });
});
```

**Checklist:**
- [ ] 5-8 API test cases
- [ ] Test error cases (missing fields, invalid input)
- [ ] Verify response format
- [ ] Verify timezone handling
- [ ] Tất cả PASS ✅

---

### 4.3 Milestone: End of Week 5

**Yêu cầu:**
- ✅ 20+ integration tests PASS
- ✅ 10-15 celebrity test cases PASS
- ✅ API test cases PASS
- ✅ Code coverage > 85%
- ✅ All unit + integration tests PASS
- ✅ Git commit & push

**Definition of Done:**
```bash
$ npm test
# PASS ✓ All tests [50+ tests]
# Coverage: 85%+
```

---

## 📊 GIAI ĐOẠN 5: MingLi-BENCH VERIFICATION (Tuần 5-6 — 30 giờ)

### 5.1 MingLi-Bench Adapter

#### **Task 5.1.1: Create HybridAlgorithmAdapter** (6 giờ)
**Owner:** Lập trình viên  
**Deadline:** Ngày 11/06 (T3 tuần 5)

```typescript
// tests/integration/mingli_bench_adapter.ts

import { generateChartVN } from '@/lib/ziwei/algorithm-vn';
import { normalizeChartVN } from '@/lib/ziwei/normalize-vn';
import { DataLoader } from 'mingli_bench.data.loader';

export class HybridAlgorithmAdapter {
  /**
   * Generate chart dùng Hybrid Algorithm
   */
  generateChart(birthInfo: any) {
    const chart = generateChartVN(birthInfo);
    return normalizeChartVN(chart);
  }
  
  /**
   * Chạy MingLi-Bench với Hybrid
   */
  async runBenchmark(testCases: any[]) {
    const results = [];
    
    for (const testCase of testCases) {
      const chart = this.generateChart(testCase.birth_info);
      results.push({
        case_id: testCase.case_id,
        chart,
        question: testCase.question,
        answer: testCase.answer,
      });
    }
    
    return results;
  }
  
  /**
   * So sánh Hybrid vs iztro pure
   */
  compareWithIztro(hybridChart: any, iztroChart: any) {
    const match = {
      palaces_match: true,
      stars_match: true,
      sihua_match: true,
    };
    
    // ... (logic so sánh)
    
    return match;
  }
}
```

**Checklist:**
- [ ] Implement adapter hoàn toàn
- [ ] Có methods: generateChart, runBenchmark, compareWithIztro
- [ ] Tested locally

---

#### **Task 5.1.2: Run MingLi-Bench (160 Test Cases)** (12 giờ)
**Owner:** Lập trình viên + Khôi  
**Deadline:** Ngày 13/06 (T5 tuần 5)

```typescript
// tests/integration/mingli_bench_full.test.ts

describe('MingLi-Bench Verification (160 Cases)', () => {
  it('should verify Hybrid algorithm with 160 benchmark cases', async () => {
    const adapter = new HybridAlgorithmAdapter();
    const loader = new DataLoader('data/data.json');
    const questions = loader.load_questions();
    
    let passed = 0;
    let failed = 0;
    const failures: any[] = [];
    
    for (const question of questions) {
      try {
        const chart = adapter.generateChart(question.birth_info);
        
        // Verify chart has expected structure
        expect(chart.ngaySinhAm).toBeTruthy();
        expect(chart.cung).toBeDefined();
        
        passed++;
      } catch (error) {
        failed++;
        failures.push({
          case_id: question.case_id,
          error: (error as Error).message,
        });
      }
    }
    
    console.log(`
      MingLi-Bench Results:
      ✅ Passed: ${passed}/160 (${(passed/160*100).toFixed(1)}%)
      ❌ Failed: ${failed}/160 (${(failed/160*100).toFixed(1)}%)
    `);
    
    expect(passed).toBeGreaterThan(155);  // At least 155/160
  });
});
```

**Checklist:**
- [ ] Load 160 test cases từ MingLi-Bench
- [ ] Chạy Hybrid algorithm cho mỗi case
- [ ] Verify output structure
- [ ] Log results
- [ ] **Expected: ≥ 155/160 PASS** ✅

---

#### **Task 5.1.3: Compare with iztro Pure** (6 giờ)
**Owner:** Lập trình viên  
**Deadline:** Ngày 14/06 (T6 tuần 5)

```typescript
describe('Hybrid vs iztro Pure (160 Cases)', () => {
  it('should match iztro pure on chart generation', async () => {
    const adapter = new HybridAlgorithmAdapter();
    const loader = new DataLoader('data/data.json');
    const questions = loader.load_questions();
    
    let matches = 0;
    let mismatches = 0;
    
    for (const question of questions) {
      const hybridChart = adapter.generateChart(question.birth_info);
      const iztroChart = generateChartPure(question.birth_info);
      
      if (hybridChart.palaces.length === iztroChart.palaces.length) {
        matches++;
      } else {
        mismatches++;
      }
    }
    
    console.log(`
      Hybrid vs Pure Comparison:
      ✅ Match: ${matches}/160
      ⚠️  Mismatch: ${mismatches}/160
    `);
    
    expect(matches).toBeGreaterThan(155);
  });
});
```

**Checklist:**
- [ ] So sánh Hybrid vs iztro pure trên 160 cases
- [ ] Verify: Kết quả nên giống nhau (ngoại trừ lunar info)
- [ ] **Expected: ≥ 155/160 match** ✅

---

#### **Task 5.1.4: Benchmark Claude on MingLi-Bench** (6 giờ)
**Owner:** Lập trình viên + Khôi  
**Deadline:** Ngày 16/06 (T2 tuần 6)

```bash
# Chạy Claude trên MingLi-Bench

python -m mingli_bench.cli \
  --model anthropic/claude-opus \
  --astro \                          # Dùng pre-computed charts
  --cot \                            # Chain-of-Thought
  --astro-provider hybrid \          # Dùng Hybrid algorithm
  --sample-size 160

# Output expected:
# Category: 健康
#   Questions: 20
#   Correct: 18 (90%)
#
# Category: 婚姻
#   Questions: 15
#   Correct: 12 (80%)
#
# Overall: 95/160 (59.4%)
```

**Checklist:**
- [ ] Setup environment (API keys, dependencies)
- [ ] Chạy MingLi-Bench CLI với Hybrid
- [ ] Capture results
- [ ] Analyze per-category scores
- [ ] **Expected: ≥ 55% overall accuracy** ✅

---

### 5.2 Milestone: End of Week 6

**Yêu cầu:**
- ✅ HybridAlgorithmAdapter hoàn thành
- ✅ 160/160 MingLi-Bench cases PASS
- ✅ Hybrid ≥ 155/160 match with iztro pure
- ✅ Claude accuracy ≥ 55% on MingLi-Bench
- ✅ Full test report generated
- ✅ Git commit & push

**Definition of Done:**
```bash
$ npm test -- mingli_bench
# PASS ✓ MingLi-Bench Verification [160 cases]
# PASS ✓ Hybrid vs Pure Comparison [160 cases]
```

---

## 🚀 GIAI ĐOẠN 6: DEPLOYMENT + QA (Tuần 6-7 — 20 giờ)

### 6.1 Code Quality & Optimization

#### **Task 6.1.1: Code Review + Optimization** (6 giờ)
**Owner:** Lập trình viên  
**Deadline:** Ngày 17/06 (T3 tuần 6)

**Checklist:**
- [ ] TypeScript strict mode
- [ ] No `any` types (unless absolutely necessary)
- [ ] No console.log() in production code
- [ ] Error handling cho all paths
- [ ] Performance: Chart generation < 100ms
- [ ] Bundle size check

---

#### **Task 6.1.2: Documentation** (6 giờ)
**Owner:** Lập trình viên + Khôi  
**Deadline:** Ngày 18/06 (T4 tuần 6)

**Docs cần viết:**
- [ ] `docs/LUNAR_VN_ALGORITHM.md` — Giải thích lunar converter
- [ ] `docs/GMT7_HANDLING.md` — Xử lý múi giờ Việt
- [ ] `docs/MIGRATION_GUIDE.md` — Từ iztro pure → Hybrid
- [ ] `docs/API_REFERENCE.md` — Endpoint documentation
- [ ] `README.md` update — Hybrid version

---

#### **Task 6.1.3: Performance Testing** (4 giờ)
**Owner:** Lập trình viên  
**Deadline:** Ngày 19/06 (T5 tuần 6)

**Benchmarks cần chạy:**
- [ ] Chart generation latency (should be <100ms)
- [ ] Memory usage
- [ ] Bundle size (should be <500KB)
- [ ] API response time (should be <200ms end-to-end)

**Tools:**
- `npm run build` → measure bundle size
- `npm run benchmark` → measure performance

---

### 6.2 Deployment

#### **Task 6.2.1: Staging Deployment** (4 giờ)
**Owner:** DevOps/Lập trình viên  
**Deadline:** Ngày 20/06 (T6 tuần 6)

**Checklist:**
- [ ] Deploy to staging environment
- [ ] Run smoke tests
- [ ] Verify all endpoints work
- [ ] Check logs for errors

---

#### **Task 6.2.2: Production Deployment** (4 giờ)
**Owner:** DevOps/Lập trình viên  
**Deadline:** Ngày 21/06 (T7 tuần 6)

**Checklist:**
- [ ] Final QA on staging
- [ ] Backup production
- [ ] Deploy to production
- [ ] Monitor for errors
- [ ] Verify with real users

---

### 6.3 Milestone: Production Ready

**Yêu cầu:**
- ✅ Code reviewed & optimized
- ✅ Full documentation
- ✅ Performance verified
- ✅ Deployed to staging
- ✅ Deployed to production
- ✅ Monitoring active
- ✅ 0 critical bugs

**Definition of Done:**
```
✅ Production Deployment Complete
✅ All Tests Passing (50+)
✅ MingLi-Bench 160/160 Cases Verified
✅ Claude Integration Working
✅ User-facing Features Ready
```

---

## 📊 TIMELINE TỔNG HỢP

```
TUẦN 1 (24/05 - 29/05): Giai đoạn 2 — Lunar Converter
├─ T2-T3: Port jdFromDate/jdToDate (8h)
├─ T4: Port NewMoon/SunLongitude (12h)
├─ T5: Port getLunarDate + GMT+7 handling (8h)
└─ T6: Unit tests (12h) → Milestone 1 ✅

TUẦN 2-3 (31/05 - 03/06): Giai đoạn 3 — Algorithm + Normalize
├─ T1: algorithm-vn.ts (8h)
├─ T2-3: normalize-vn.ts (16h)
├─ T3: constants-vn.ts (8h)
├─ T3: api/chart-generate.ts (8h)
└─ T4: Unit tests (8h) → Milestone 2 ✅

TUẦN 4-5 (07/06 - 13/06): Giai đoạn 4 — Integration Tests
├─ T1-3: Full flow + Hybrid vs Pure (16h)
├─ T3-5: Celebrity test cases (12h)
├─ T5: API tests (8h)
└─ T6: Code review (4h) → Milestone 3 ✅

TUẦN 5-6 (11/06 - 19/06): Giai đoạn 5 — MingLi-Bench Verification
├─ T1-2: Adapter + Run 160 cases (18h)
├─ T3-4: Compare with iztro pure (6h)
├─ T5: Benchmark Claude (6h)
└─ T6: Review results (4h) → Milestone 4 ✅

TUẦN 6-7 (17/06 - 23/06): Giai đoạn 6 — Deployment
├─ T1-3: Code review + Optimization (6h)
├─ T3-5: Documentation (6h)
├─ T5-6: Performance testing (4h)
├─ T6-7: Staging deployment (4h)
└─ T7: Production deployment (4h) → Milestone 5 ✅

TOTAL: 180 giờ = ~23-24 ngày làm việc = 6-7 tuần
```

---

## ✅ FINAL CHECKLIST: TRIỂN KHAI HOÀN CHỈNH

### Phase 1: Lunar Converter ✅
- [ ] jdFromDate() + jdToDate()
- [ ] NewMoon() + SunLongitude()
- [ ] getLunarDate() với GMT+7 handling
- [ ] 20+ unit tests PASS

### Phase 2: Algorithm + Normalize ✅
- [ ] generateChartVN() (wrapper iztro)
- [ ] normalizeChartVN() (output JSON Việt)
- [ ] constants-vn.ts (bảng ánh xạ)
- [ ] API endpoint /api/chart/generate
- [ ] 10+ unit tests PASS

### Phase 3: Integration Tests ✅
- [ ] Full flow tests
- [ ] Hybrid vs iztro pure comparison
- [ ] 10-15 celebrity test cases
- [ ] API integration tests
- [ ] 20+ integration tests PASS

### Phase 4: MingLi-Bench Verification ✅
- [ ] HybridAlgorithmAdapter
- [ ] Run 160 benchmark cases
- [ ] Verify 155+/160 PASS
- [ ] Compare with iztro pure
- [ ] Benchmark Claude (≥55% accuracy)

### Phase 5: Deployment ✅
- [ ] Code review + optimization
- [ ] Full documentation
- [ ] Performance testing (<100ms)
- [ ] Staging deployment
- [ ] Production deployment
- [ ] Monitoring active

---

## 📈 EXPECTED OUTCOMES

**Code Metrics:**
- ✅ Type coverage: >95%
- ✅ Test coverage: >85%
- ✅ Lunar accuracy: 100% (vs lasotuvi)
- ✅ GMT+7 precision: ±0 days
- ✅ Performance: <100ms per chart

**Quality Assurance:**
- ✅ 50+ unit tests PASS
- ✅ 20+ integration tests PASS
- ✅ 160/160 MingLi-Bench cases PASS
- ✅ Claude accuracy: ≥55%
- ✅ Zero critical bugs

**Documentation:**
- ✅ LUNAR_VN_ALGORITHM.md
- ✅ GMT7_HANDLING.md
- ✅ MIGRATION_GUIDE.md
- ✅ API_REFERENCE.md
- ✅ README.md (updated)

---

## 🎯 NEXT STEPS: BẮT TẠY CODE

**Khôi xác nhận:**
1. ✅ Chấp thuận lộ trình 6 tuần?
2. ✅ Chấp thuận Hybrid Approach (iztro + lasotuvi + lunar-vn)?
3. ✅ Chấp thuận verify với MingLi-Bench 160 cases?
4. ✅ Chấp thuận deploy lên production?

**Nếu YES → Bắt tay code ngay T2 (24/05)**

**Điều tôi cần từ Khôi:**
1. **Confirm timeline & resources**
   - Lập trình viên chỉ định?
   - Khôi sẽ verify kết quả?
   - QA resources có sẵn?

2. **Access to resources**
   - iztro repo (public)
   - lasotuvi repo (public)
   - MingLi-Bench repo (public)
   - Anthropic API key (for Claude)

3. **Deployment infrastructure**
   - Staging server?
   - Production server?
   - Database/storage?

---

## 🚀 **BẠN SẼ NHẬN ĐƯỢC**

**Sau 6 tuần:**
- ✅ Hybrid Algorithm (100% chính xác cho Việt Nam)
- ✅ Normalized JSON API (tiếng Việt, sạch)
- ✅ 50+ comprehensive tests (verify chất lượng)
- ✅ 160 benchmark cases PASS (verified)
- ✅ Claude integration working (luận giải AI)
- ✅ Production-ready deployment
- ✅ Full documentation

**Ứng dụng cuối cùng:**
```
User nhập: "1991-10-24, 14:30, Hồ Chí Minh"
     ↓
[Hybrid: Lunar + iztro + Normalize]
     ↓
Bản đồ sao 100% chính xác
     ↓
[Claude AI]
     ↓
"Người này giàu, tình cảm sâu sắc, 
 tuổi 30-40 là peak, cần cẩn thận sức khỏe..."
     ↓
[MingLi-Bench kiểm chứng]
     ↓
✅ Verified + Production-ready
```

---

**Khôi, bạn sẵn sàng chưa?** 🚀

**Confirm decision → Chúng ta bắt tay code T2 (24/05)**

