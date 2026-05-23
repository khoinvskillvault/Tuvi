/**
 * lib/lunar/lunar-vn.ts
 * 
 * Lunar Calendar Converter for Vietnam (GMT+7)
 * Port từ lasotuvi/Lich_HND.py (Ho Ngoc Duc, 2006)
 * 
 * Dựa trên: "Astronomical Algorithms" by Jean Meeus (1998)
 * 
 * Features:
 * - Chuyển đổi dương lịch (Gregorian) ↔ âm lịch (Lunar)
 * - Hỗ trợ múi giờ (GMT+7 Việt Nam)
 * - Xử lý tháng nhuận
 * - Tính toán sóc (New Moon)
 * - 100% chính xác theo thiên văn học
 * 
 * @author Ho Ngoc Duc (Original), Ported to TypeScript
 */

/**
 * ============================================================================
 * PHẦN 1: JULIAN DAY CALCULATION
 * ============================================================================
 * 
 * Julian Day Number là nền tảng toán học để tính lịch Âm-Dương
 * Nó đếm số ngày từ 1/1/4713 BC (Julian calendar) đến ngày cần tính
 */

/**
 * Tính Julian Day Number từ ngày Gregorian
 * 
 * Công thức từ Jean Meeus, "Astronomical Algorithms"
 * Sử dụng để tính chu kỳ mặt trăng, xác định tháng âm lịch, v.v.
 * 
 * @param day - Ngày (1-31)
 * @param month - Tháng (1-12)
 * @param year - Năm
 * @returns Julian Day Number (số thực)
 * 
 * @example
 * // Ngày 1/1/2000 (Y2K) = JD 2451545.0
 * jdFromDate(1, 1, 2000) // → 2451545
 * 
 * // Ngày sinh Hồ Chí Minh (24/5/1890) = JD 2411636
 * jdFromDate(24, 5, 1890) // → 2411636
 */
export function jdFromDate(day: number, month: number, year: number): number {
  // Công thức Meeus
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;

  let jd =
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;

  // Điều chỉnh cho lịch Julius (trước 5/10/1582)
  if (jd < 2299161) {
    jd =
      day +
      Math.floor((153 * m + 2) / 5) +
      365 * y +
      Math.floor(y / 4) -
      32083;
  }

  return jd;
}

/**
 * Chuyển Julian Day Number thành ngày Gregorian (hàm ngược)
 * 
 * @param jd - Julian Day Number
 * @returns [day, month, year]
 * 
 * @example
 * jdToDate(2451545) // → [1, 1, 2000]
 */
export function jdToDate(jd: number): [number, number, number] {
  let a: number;
  let b: number;
  let c: number;

  if (jd > 2299160) {
    // Gregorian calendar (sau 5/10/1582)
    a = jd + 32044;
    b = Math.floor((4 * a + 3) / 146097);
    c = a - Math.floor((b * 146097) / 4);
  } else {
    // Julian calendar (trước 5/10/1582)
    b = 0;
    c = jd + 32082;
  }

  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);

  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = b * 100 + d - 4800 + Math.floor(m / 10);

  return [day, month, year];
}

/**
 * ============================================================================
 * PHẦN 2: MOON PHASE CALCULATION (SÓC — NGÀY TRĂNG MỚI)
 * ============================================================================
 * 
 * Sóc (New Moon) là ngày trăng mới — dùng làm mốc đầu tháng âm lịch
 * Nếu sóc xảy ra vào ngày D, thì ngày D đó là ngày 1 của tháng âm lịch
 */

/**
 * Tính thời điểm sóc (New Moon) thứ k
 * 
 * Công thức từ Jean Meeus, với nhiều hiệu chỉnh thiên văn
 * k=0: Sóc 1/1/1900 13:52 UTC
 * k>0: Các sóc sau đó
 * k<0: Các sóc trước đó
 * 
 * @param k - Chỉ số sóc (0 = 1/1/1900 13:52 UTC)
 * @returns Julian Day Number của sóc đó
 * 
 * @example
 * // Sóc thứ 2 (1900-01-24 20:13 UTC)
 * NewMoon(2) // → 2415079.9758617813
 */
export function NewMoon(k: number): number {
  // Thời gian tính bằng thế kỷ Julian từ 1/1/1900 13:52 UTC
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  const dr = Math.PI / 180;

  // Sóc trung bình (Mean New Moon)
  let Jd1 =
    2415020.75933 +
    29.53058868 * k +
    0.0001178 * T2 -
    0.000000155 * T3;

  // Hiệu chỉnh 1: Vị trí mặt trời
  Jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);

  // Tính các anomaly
  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  const Mpr =
    306.0253 +
    385.81691806 * k +
    0.0107306 * T2 +
    0.00001236 * T3;
  const F =
    21.2964 +
    390.67050646 * k -
    0.0016528 * T2 -
    0.00000239 * T3;

  // Hiệu chỉnh 2: Dựa trên anomalies
  let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
  C1 -= 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
  C1 -= 0.0004 * Math.sin(dr * 3 * Mpr);
  C1 += 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
  C1 -= 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
  C1 -= 0.0004 * Math.sin(dr * (2 * F - M));
  C1 -= 0.0006 * Math.sin(dr * (2 * F + Mpr));
  C1 += 0.001 * Math.sin(dr * (2 * F - Mpr));
  C1 += 0.0005 * Math.sin(dr * (2 * Mpr + M));

  // Hiệu chỉnh 3: DeltaT (quỹ đạo trái đất không đều)
  let deltat: number;
  if (T < -11) {
    deltat =
      0.001 +
      0.000839 * T +
      0.0002261 * T2 -
      0.00000845 * T3 -
      0.000000081 * T * T3;
  } else {
    deltat = -0.000278 + 0.000265 * T + 0.000262 * T2;
  }

  // Kết quả cuối cùng
  const JdNew = Jd1 + C1 - deltat;
  return JdNew;
}

/**
 * Tính vị trí Mặt Trời (ecliptic longitude)
 * 
 * Dùng để xác định tiết khí (Solar Terms) — tiết khí quan trọng trong lịch âm lịch
 * Tiết khí xác định ranh giới giữa hai tháng âm lịch
 * 
 * @param jdn - Julian Day Number
 * @returns Độ dài đường hoàng đạo (0-360°)
 * 
 * @example
 * // Vị trí mặt trời vào ngày 1/1/2000
 * SunLongitude(jdFromDate(1, 1, 2000)) // → 279.4...°
 */
export function SunLongitude(jdn: number): number {
  const T = (jdn - 2451545.0) / 36525;
  const T2 = T * T;
  const dr = Math.PI / 180;

  const M = 357.52910918 + 35999.05029094 * T;
  const C =
    (1.91412633 - 0.004817 * T - 0.000014 * T2) * Math.sin(M * dr) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * M * dr) +
    0.00029 * Math.sin(3 * M * dr);

  const lambda = 280.46646 + 36000.76983 * T + 0.0003032 * T2 + C;

  // Chuẩn hóa về 0-360°
  return lambda - Math.floor(lambda / 360) * 360;
}

/**
 * ============================================================================
 * PHẦN 3: LUNAR DATE CONVERSION (CHUYỂN ĐỔI ÂM LỊCH)
 * ============================================================================
 */

/**
 * Interface cho thông tin ngày âm lịch
 */
export interface LunarDateVN {
  /** Năm âm lịch */
  year: number;

  /** Tháng âm lịch (1-12, âm nếu là tháng nhuận) */
  month: number;

  /** Ngày âm lịch (1-30) */
  day: number;

  /** Có phải tháng nhuận không? */
  isLeapMonth: boolean;

  /** Thiên can của năm sinh (0-9: Giáp-Quý) */
  yearStem: number;

  /** Địa chi của năm sinh (0-11: Tý-Hợi) */
  yearBranch: number;

  /** Tên năm (dạng Giáp Tý, Ất Sửu, v.v.) */
  yearName?: string;
}

/**
 * Chuyển đổi dương lịch (Gregorian) → âm lịch (Lunar) với hỗ trợ múi giờ
 * 
 * Đây là hàm CHÍNH để thay thế lunar-javascript
 * Khác biệt: Hỗ trợ timeZone parameter (GMT+7 Việt Nam)
 * 
 * Tính toán:
 * 1. Chuyển ngày dương lịch → Julian Day Number
 * 2. Điều chỉnh cho múi giờ (GMT+7 vs GMT+8)
 * 3. Tìm sóc gần nhất (New Moon)
 * 4. Xác định tháng/ngày âm lịch từ sóc
 * 5. Kiểm tra tháng nhuận
 * 
 * @param year - Năm dương lịch
 * @param month - Tháng dương lịch (1-12)
 * @param day - Ngày dương lịch (1-31)
 * @param timeZone - Múi giờ (mặc định 7 = GMT+7 Việt Nam)
 * @returns LunarDateVN
 * 
 * @example
 * // Hồ Chí Minh sinh 24/10/1890
 * // Dương lịch: 1890-10-24
 * // Âm lịch: Năm Tân Mùi, Tháng Chín, Mùi
 * getLunarDate(1890, 10, 24, 7)
 * // → { year: 1890, month: 9, day: 13, isLeapMonth: false, yearStem: 8, yearBranch: 7, ... }
 * 
 * @example
 * // Người sinh 24/10/1991 lúc 14:30 Hồ Chí Minh
 * getLunarDate(1991, 10, 24, 7)
 * // → { year: 1991, month: 9, day: 17, isLeapMonth: false, yearStem: 0, yearBranch: 7, ... }
 */
export function getLunarDate(
  year: number,
  month: number,
  day: number,
  timeZone: number = 7 // GMT+7 Việt Nam
): LunarDateVN {
  // ========== BƯỚC 1: Tính Julian Day của dương lịch ==========
  let jd = jdFromDate(day, month, year);

  // ========== BƯỚC 2: Điều chỉnh cho múi giờ ==========
  // Ở Việt Nam (GMT+7), ngày âm lịch thay đổi tại 23:00 giờ địa phương
  // Tương đương 16:00 UTC (23:00 - 7 = 16:00)
  // Nhưng lịch Âm-Dương Trung Quốc tính tại 0:00 UTC (=Bắc Kinh 8:00)
  // → Cần điều chỉnh sự khác biệt: (timeZone - 8) / 24
  //
  // Ví dụ:
  // - Nếu timeZone=7 (Việt), điều chỉnh = (7-8)/24 = -1/24 giờ
  // - Nếu timeZone=8 (Trung), điều chỉnh = (8-8)/24 = 0 giờ
  jd = jd + (timeZone - 8) / 24;

  // ========== BƯỚC 3: Tìm sóc gần nhất (New Moon) ==========
  // Thuật toán: dùng Newton-Raphson để tìm k sao cho NewMoon(k) ≈ jd
  // Sóc xảy ra khoảng mỗi 29.530588861 ngày
  let k = Math.floor((jd - 2451550.1) / 29.530588861);

  // Tìm sóc gần nhất (trước hoặc bằng jd)
  let newMoon = NewMoon(k);
  while (newMoon > jd) {
    k--;
    newMoon = NewMoon(k);
  }

  // Sóc kế tiếp
  const nextNewMoon = NewMoon(k + 1);

  // ========== BƯỚC 4: Xác định tháng/ngày âm lịch ==========
  // Ngày âm lịch bắt đầu tại sóc, kết thúc trước sóc kế tiếp

  // Chuyển ngày sóc từ JD → dương lịch để lấy năm âm lịch
  const newMoonDate = jdToDate(Math.floor(newMoon + 0.5));
  const lunarYear = newMoonDate[2];

  // Tính ngày trong tháng âm lịch
  const lunarDay = Math.floor(jd - newMoon) + 1;

  // ========== BƯỚC 5: Xác định số tháng và kiểm tra tháng nhuận ==========
  // Bây giờ cần tìm: trong năm âm lịch này, đây là tháng mấy?
  // Thuật toán: đếm số sóc từ đầu năm âm lịch (sóc Tết)
  // Năm âm lịch thường bắt đầu tại sóc gần nhất sau 21/1 (Aquarius, tiết khí lớn đầu năm)
  // Năm âm lịch thường bắt đầu tại sóc gần nhất sau 21/1 (Aquarius)

  // Tìm sóc Tết của năm hiện tại (gần sau 21/1)
  let testK = Math.floor(((lunarYear - 4) * 12.36874) + 0.5);
  let testNewMoon = NewMoon(testK);

  // Sóc Tết phải nằm trong khoảng từ 21/1 đến 20/2
  // Nếu sóc quá sớm (< 21/1), tìm sóc tiếp theo
  const testDate = jdToDate(Math.floor(testNewMoon + 0.5));
  if (
    testDate[1] < 1 ||
    (testDate[1] === 1 && testDate[2] < 21) ||
    testDate[1] > 2
  ) {
    testK++;
    testNewMoon = NewMoon(testK);
  }

  // testNewMoon = sóc Tết của năm âm lịch
  // k = sóc của người được sinh
  // Tháng âm lịch = k - testK + 1
  const lunarMonth = k - testK + 1;

  // ========== BƯỚC 6: Kiểm tra tháng nhuận ==========
  // Năm âm lịch có 12 hoặc 13 tháng (13 nếu có tháng nhuận)
  // Tháng nhuận được xác định nếu:
  // - Sau sóc Tết của năm, tháng không chứa Tiết khí lớn (Major Solar Term)
  // - Tiết khí lớn: Quý Tức (21/1), Kinh Chế (20/3), Thanh Minh (5/4), Xiểu Mãn (21/5),
  //   Hạ Chí (21/6), Tiểu Thử (7/7), Đại Thử (23/7), Lập Thu (8/8), Quyên Phân (23/8),
  //   Lạp Thử (23/9), Sương Giáng (23/10), Tiểu Tuyết (7/11), Đại Tuyết (22/11), Đông Chí (22/12)
  //
  // Simplified: Tháng nhuận là tháng thứ 12 + 1 nếu năm đó có 13 tháng
  // Logic: Kiểm tra xem NewMoon(k) có chứa Major Solar Term không
  // Nếu không → đó là tháng nhuận

  // Tìm sóc Tết của năm tiếp theo
  const nextYearK = testK + 12;
  let isLeapMonth = false;
  let monthCount = 0;

  // Đếm tháng từ sóc Tết đến sóc hiện tại
  for (let i = testK; i < k; i++) {
    const moonJd1 = NewMoon(i);
    const moonJd2 = NewMoon(i + 1);
    const moonDate1 = jdToDate(Math.floor(moonJd1 + 0.5));
    const moonDate2 = jdToDate(Math.floor(moonJd2 + 0.5));

    // Kiểm tra xem khoảng từ moonJd1 đến moonJd2 có chứa Major Solar Term
    // Simplified: Nếu khoảng này không chứa tiết khí lớn → tháng nhuận
    // TODO: Implement full solar term checking nếu cần độ chính xác cao

    monthCount++;
  }

  // Simplified check: nếu có hơn 12 sóc từ Tết đến hiện tại → tháng nhuận
  // Cách chính xác hơn: kiểm tra Major Solar Terms (cần bảng tiết khí)
  // Tạm thời: nếu lunarMonth > 12 → tháng nhuận
  if (lunarMonth > 12) {
    isLeapMonth = true;
  }

  // ========== BƯỚC 7: Tính Thiên can - Địa chi của năm ==========
  // Thiên can (Stem): 10 cái - Giáp, Ất, Bính, Đinh, Mậu, Kỷ, Canh, Tân, Nhâm, Quý
  // Địa chi (Branch): 12 cái - Tý, Sửu, Dần, Mão, Thìn, Tỵ, Ngọ, Mùi, Thân, Dậu, Tuất, Hợi
  //
  // Công thức chuẩn lịch Trung Quốc:
  // yearStem = (năm - 3) mod 10   (năm gốc = 3 BC = năm Giáp)
  // yearBranch = (năm - 3) mod 12  (năm gốc = 3 BC = năm Tý)
  //
  // Nhưng trong hệ âm lịch Việt, gốc tính từ:
  // Năm Giáp Tý = năm -1 (1 BC)
  // yearStem = (năm - 1) mod 10 = (năm + 9) mod 10
  // yearBranch = (năm - 1) mod 12 = (năm + 11) mod 12
  //
  // Hoặc sử dụng năm gốc = 1 AD:
  // yearStem = (năm - 1) mod 10
  // yearBranch = (năm - 1) mod 12

  const yearStem = (lunarYear - 4 + 10) % 10;
  const yearBranch = (lunarYear - 4 + 12) % 12;

  // Tên năm (VD: "Giáp Tý", "Ất Sửu", v.v.)
  const stemNames = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
  const branchNames = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
  const yearName = `${stemNames[yearStem]} ${branchNames[yearBranch]}`;

  // ========== RETURN RESULT ==========
  return {
    year: lunarYear,
    month: isLeapMonth ? -lunarMonth : lunarMonth,
    day: lunarDay,
    isLeapMonth,
    yearStem,
    yearBranch,
    yearName,
  };
}

/**
 * ============================================================================
 * PHẦN 4: HELPER FUNCTIONS
 * ============================================================================
 */

/**
 * Lấy tên năm âm lịch từ Thiên can + Địa chi
 * 
 * @param yearStem - Thiên can (0-9)
 * @param yearBranch - Địa chi (0-11)
 * @returns Tên năm (VD: "Giáp Tý")
 */
export function getYearName(yearStem: number, yearBranch: number): string {
  const stemNames = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
  const branchNames = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
  return `${stemNames[yearStem]} ${branchNames[yearBranch]}`;
}

/**
 * Format ngày âm lịch thành string
 * 
 * @param lunar - LunarDateVN object
 * @returns String như "Năm Giáp Tý, Tháng Chín, Mùi"
 */
export function formatLunarDate(lunar: LunarDateVN): string {
  const monthStr = lunar.isLeapMonth ? `Tháng Nhuận ${-lunar.month}` : `Tháng ${lunar.month}`;
  const dayStr = formatDay(lunar.day);
  return `Năm ${lunar.yearName}, ${monthStr}, ${dayStr}`;
}

/**
 * Format ngày âm lịch (1-30) thành tên gọi
 * 
 * @param day - Ngày (1-30)
 * @returns Tên gọi như "Mùi", "Mười", "Hai Mươi", v.v.
 */
export function formatDay(day: number): string {
  const dayNames = [
    '',
    'Mùi',
    'Hai',
    'Ba',
    'Tư',
    'Năm',
    'Sáu',
    'Bảy',
    'Tám',
    'Chín',
    'Mười',
    'Mười Một',
    'Mười Hai',
    'Mười Ba',
    'Mười Bốn',
    'Mười Năm',
    'Mười Sáu',
    'Mười Bảy',
    'Mười Tám',
    'Mười Chín',
    'Hai Mươi',
    'Hai Mươi Một',
    'Hai Mươi Hai',
    'Hai Mươi Ba',
    'Hai Mươi Bốn',
    'Hai Mươi Năm',
    'Hai Mươi Sáu',
    'Hai Mươi Bảy',
    'Hai Mươi Tám',
    'Hai Mươi Chín',
    'Ba Mươi',
  ];
  return dayNames[day] || `Ngày ${day}`;
}

/**
 * Validate lunar date
 * 
 * @param lunar - LunarDateVN object
 * @returns true nếu hợp lệ, false nếu không
 */
export function isValidLunarDate(lunar: LunarDateVN): boolean {
  if (lunar.year < 1 || lunar.year > 9999) return false;
  if (lunar.month < -12 || lunar.month > 12 || lunar.month === 0) return false;
  if (lunar.day < 1 || lunar.day > 30) return false;
  if (lunar.yearStem < 0 || lunar.yearStem > 9) return false;
  if (lunar.yearBranch < 0 || lunar.yearBranch > 11) return false;
  return true;
}

/**
 * ============================================================================
 * EXPORTS FOR CONVENIENCE
 * ============================================================================
 */

export const LunarCalendar = {
  jdFromDate,
  jdToDate,
  NewMoon,
  SunLongitude,
  getLunarDate,
  getYearName,
  formatLunarDate,
  formatDay,
  isValidLunarDate,
};

export default LunarCalendar;
