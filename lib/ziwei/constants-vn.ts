// lib/ziwei/constants-vn.ts
// Lookup tables: Chinese → Vietnamese for Ziwei Doushu

export const STEM_NAMES_VN = ['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'];
export const BRANCH_NAMES_VN = ['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
export const WUXING_NAMES_VN: Record<string,string> = { '金':'Kim','木':'Mộc','水':'Thủy','火':'Hỏa','土':'Thổ' };

export const STAR_NAMES_VN: Record<string,string> = {
  // 14 Chính tinh
  '紫微':'Tử Vi','天机':'Thiên Cơ','太阳':'Thái Dương','武曲':'Võ Khúc',
  '天同':'Thiên Đồng','廉贞':'Liêm Trinh','天府':'Thiên Phủ','太阴':'Thái Âm',
  '贪狼':'Tham Lang','巨门':'Cự Môn','天相':'Thiên Tương','天梁':'Thiên Lương',
  '七杀':'Thất Sát','破军':'Phá Quân',
  // Phụ tinh
  '左辅':'Tả Phụ','右弼':'Hữu Bật','文昌':'Văn Xương','文曲':'Văn Khúc',
  '天魁':'Thiên Khôi','天钺':'Thiên Việt','禄存':'Lộc Tồn','天马':'Thiên Mã',
  '擎羊':'Kình Dương','陀罗':'Đà La','火星':'Hỏa Tinh','铃星':'Linh Tinh',
  '地空':'Địa Không','地劫':'Địa Kiếp','天空':'Thiên Không',
  '红鸾':'Hồng Loan','天喜':'Thiên Hỷ','天姚':'Thiên Diêu','咸池':'Hàm Trì',
  '天刑':'Thiên Hình','天哭':'Thiên Khốc','天虚':'Thiên Hư','龙池':'Long Trì',
  '凤阁':'Phụng Các','台辅':'Đài Phụ','封诰':'Phong Cáo','三台':'Tam Thai',
  '八座':'Bát Tọa','恩光':'Ân Quang','天贵':'Thiên Quý','天官':'Thiên Quan',
  '天福':'Thiên Phúc','天才':'Thiên Tài','天寿':'Thiên Thọ','破碎':'Phá Toái',
  '天使':'Thiên Sứ','天伤':'Thiên Thương','旬空':'Tuần Không','截空':'Tiệt Không',
  '化禄':'Hóa Lộc','化权':'Hóa Quyền','化科':'Hóa Khoa','化忌':'Hóa Kỵ',
};

export const PALACE_NAMES_VN: Record<string,string> = {
  '命宫':'Mệnh Cung','兄弟宫':'Huynh Đệ Cung','夫妻宫':'Phu Thê Cung',
  '子女宫':'Tử Nữ Cung','财帛宫':'Tài Bạc Cung','疾厄宫':'Tật Ách Cung',
  '迁移宫':'Thiên Di Cung','交友宫':'Giao Hữu Cung','官禄宫':'Quan Lộc Cung',
  '田宅宫':'Điền Trạch Cung','福德宫':'Phúc Đức Cung','父母宫':'Phụ Mẫu Cung',
};

export const SIHUA_NAMES_VN: Record<string,string> = {
  '禄':'Hóa Lộc','权':'Hóa Quyền','科':'Hóa Khoa','忌':'Hóa Kỵ',
};

export const BRIGHTNESS_NAMES_VN: Record<string,string> = {
  '庙':'Miếu','旺':'Vượng','得':'Đắc','利':'Lợi','平':'Bình','不':'Bất','陷':'Hãm',
};

// Tứ Hóa theo Thiên Can (yearStem index 0-9)
export const SIHUA_BY_STEM: Record<number, { loc: string; quyen: string; khoa: string; ky: string }> = {
  0: { loc:'廉贞', quyen:'破军', khoa:'武曲', ky:'太阳' },   // Giáp
  1: { loc:'天机', quyen:'天梁', khoa:'紫微', ky:'太阴' },   // Ất
  2: { loc:'天同', quyen:'天机', khoa:'文昌', ky:'廉贞' },   // Bính
  3: { loc:'太阴', quyen:'天同', khoa:'天机', ky:'巨门' },   // Đinh
  4: { loc:'贪狼', quyen:'太阴', khoa:'右弼', ky:'天机' },   // Mậu
  5: { loc:'武曲', quyen:'贪狼', khoa:'天梁', ky:'文曲' },   // Kỷ
  6: { loc:'太阳', quyen:'武曲', khoa:'太阴', ky:'天同' },   // Canh
  7: { loc:'巨门', quyen:'太阳', khoa:'文曲', ky:'文昌' },   // Tân
  8: { loc:'天梁', quyen:'紫微', khoa:'左辅', ky:'武曲' },   // Nhâm
  9: { loc:'破军', quyen:'巨门', khoa:'太阴', ky:'贪狼' },   // Quý
};

export const GENDER_VN: Record<string,string> = { 'male':'Nam','female':'Nữ','男':'Nam','女':'Nữ' };

export function getStarNameVN(chineseName: string): string {
  return STAR_NAMES_VN[chineseName] ?? chineseName;
}

export function getPalaceNameVN(chineseName: string): string {
  return PALACE_NAMES_VN[chineseName] ?? chineseName;
}

export function getSihuaForStem(stemIndex: number) {
  return SIHUA_BY_STEM[stemIndex] ?? SIHUA_BY_STEM[0];
}

export function getCanChiName(stem: number, branch: number): string {
  return `${STEM_NAMES_VN[stem] ?? '?'} ${BRANCH_NAMES_VN[branch] ?? '?'}`;
}

export default { STAR_NAMES_VN, PALACE_NAMES_VN, SIHUA_NAMES_VN, BRIGHTNESS_NAMES_VN, SIHUA_BY_STEM, getStarNameVN, getPalaceNameVN, getSihuaForStem, getCanChiName };
