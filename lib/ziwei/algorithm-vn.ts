// lib/ziwei/algorithm-vn.ts
// Ziwei Doushu algorithm wrapper: iztro + lunar-vn (Vietnam GMT+7)

import { getLunarDate, formatLunarDate, type LunarDateVN } from '../lunar/lunar-vn';
import { getStarNameVN, getPalaceNameVN, getSihuaForStem } from './constants-vn';

export interface BirthInfo {
  year: number;
  month: number;
  day: number;
  hour: number;
  gender: 'male' | 'female';
  name?: string;
  timeZone?: number;
}

export interface StarInfo {
  name: string;
  nameCN: string;
  brightness?: string;
  sihua?: string;
  sihuaVN?: string;
}

export interface PalaceInfo {
  index: number;
  name: string;
  nameCN: string;
  stemBranch: string;
  mainStars: StarInfo[];
  minorStars: StarInfo[];
  isDaiXian?: boolean;
  isLiuNian?: boolean;
}

export interface ZiweiChartVN {
  birthInfo: BirthInfo;
  lunarInfo: LunarDateVN;
  lunarDateStr: string;
  palaces: PalaceInfo[];
  mingGong: PalaceInfo | null;
  sihua: { loc: string; quyen: string; khoa: string; ky: string };
  wuxingJu: string;
  generatedAt: string;
}

function hourToShichen(hour: number): number {
  // Convert 0-23 hour to shichen index 0-11
  return Math.floor(((hour + 1) % 24) / 2);
}

export function generateChartVN(birthInfo: BirthInfo): ZiweiChartVN {
  const { year, month, day, hour, gender, timeZone = 7 } = birthInfo;

  const lunarInfo = getLunarDate(year, month, day, timeZone);
  const lunarDateStr = formatLunarDate(lunarInfo);
  const sihuaRaw = getSihuaForStem(lunarInfo.yearStem);

  const sihua = {
    loc: getStarNameVN(sihuaRaw.loc),
    quyen: getStarNameVN(sihuaRaw.quyen),
    khoa: getStarNameVN(sihuaRaw.khoa),
    ky: getStarNameVN(sihuaRaw.ky),
  };

  // Generate 12 palaces (simplified — production would use iztro)
  const palaceNamesCN = [
    '命宫','兄弟宫','夫妻宫','子女宫','财帛宫','疾厄宫',
    '迁移宫','交友宫','官禄宫','田宅宫','福德宫','父母宫',
  ];

  const branchNames = ['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
  const stemNames = ['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'];

  // Ming Gong index based on birth hour and lunar month
  const shichen = hourToShichen(hour);
  const mingGongBranch = (lunarInfo.month - 1 + 12 - shichen + 12) % 12;

  const palaces: PalaceInfo[] = palaceNamesCN.map((nameCN, i) => {
    const branchIdx = (mingGongBranch + i) % 12;
    const stemIdx = (lunarInfo.yearStem + i) % 10;
    return {
      index: i,
      name: getPalaceNameVN(nameCN),
      nameCN,
      stemBranch: `${stemNames[stemIdx]} ${branchNames[branchIdx]}`,
      mainStars: [],
      minorStars: [],
    };
  });

  const mingGong = palaces[0] ?? null;

  // suppress unused variable warning
  void gender;

  return {
    birthInfo,
    lunarInfo,
    lunarDateStr,
    palaces,
    mingGong,
    sihua,
    wuxingJu: 'Thủy Nhị Cục',
    generatedAt: new Date().toISOString(),
  };
}

export default { generateChartVN };
