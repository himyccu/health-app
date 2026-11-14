/**
 * 滾筒放鬆（self-myofascial release）教學內容。
 *
 * 撰寫原則：
 * 1. 每個數字都要對得上 sources.ts 的文獻。
 * 2. 研究結果互相衝突時，寫出衝突，不挑對自己有利的那篇。
 * 3. 不寫「排毒」「代謝乳酸」「打開筋膜沾黏」這類沒有證據的機制。
 */

import type { SourceId } from './sources';

export type StationId = 'foot' | 'calf' | 'hamstring' | 'glute' | 'tfl' | 'thoracic';

/** 插圖幾何，單位為 SVG 座標（viewBox 0 0 320 170） */
export interface BodyPart {
  x: number;
  y: number;
  w: number;
  h: number;
  r: number;
}

export interface StationVisual {
  /** 身體部位的形狀，可多塊 */
  parts: BodyPart[];
  /** 滾筒（或球）的位置 */
  roller: BodyPart;
  /** 哪一個物件在動，以及移動距離 */
  motion: { target: 'body' | 'roller'; dx?: number; dy?: number };
}

export interface RollingStation {
  id: StationId;
  name: string;
  /** 身體哪裡 */
  area: string;
  /** 怎麼擺、往哪裡動 */
  setup: string;
  /** 做多久 */
  dose: string;
  /** 做對的感覺 */
  feel: string;
  /** 常見錯誤 */
  mistakes: string[];
  /** 什麼情況跳過 */
  skip: string;
  /** 沒有滾筒時的替代做法 */
  instead: string;
  /** 補充說明，可省略 */
  note?: string;
  sources: SourceId[];
  visual: StationVisual;
}

/** 由下往上的操作順序 */
export const ROLLING_STATIONS: RollingStation[] = [
  {
    id: 'foot',
    name: '足底',
    area: '腳底，腳跟前方到腳掌前緣。腳跟骨與腳趾不要直接壓。',
    setup:
      '站或坐都可以。球放在腳底，體重慢慢壓上去，從腳跟前方移到腳掌前緣，來回約 10 趟。',
    dose: '每腳 60–90 秒',
    feel: '腳底有被推開的痠，可以忍受。出現刺痛或麻就換位置。',
    mistakes: ['一開始就把全身體重踩上去', '只在腳跟正下方滾', '來回太快，一秒超過一趟'],
    skip: '腳底有傷口、足底筋膜炎正在急性發作、腳底發麻。',
    instead: '網球或高爾夫球；沒有球就用拇指按壓腳底。',
    note: '滾腳底能不能連帶改善大腿後側柔軟度，兩篇研究結果相反，因此不列入效果保證。',
    sources: ['fauris2021', 'grabow2017'],
    visual: {
      parts: [
        { x: 78, y: 62, w: 152, h: 36, r: 18 },
        { x: 210, y: 34, w: 26, h: 40, r: 13 },
      ],
      roller: { x: 104, y: 116, w: 36, h: 36, r: 18 },
      motion: { target: 'roller', dx: 88 },
    },
  },
  {
    id: 'calf',
    name: '小腿後側',
    area: '小腿肚與腳踝上方，分成上下兩段，各約 45–60 秒。',
    setup: '坐在地上，小腿放滾筒上，雙手撐在臀部後方，另一腳踩地。臀部離地，前後移動小腿。',
    dose: '每側 90 秒–2 分鐘',
    feel: '整片小腿肚的痠。腳底或腳趾發麻代表壓到神經，要換位置。',
    mistakes: ['壓在阿基里斯腱上', '臀部著地只用手推', '憋氣出力'],
    skip: '小腿有靜脈曲張、抽筋後 24 小時內、腳踝腫脹。',
    instead: '雙手拇指由下往上按壓，或坐著用網球。',
    sources: ['nakamura2021', 'hofer2026', 'grabow2018'],
    visual: {
      parts: [
        { x: 134, y: 18, w: 62, h: 106, r: 31 },
        { x: 128, y: 4, w: 74, h: 24, r: 12 },
      ],
      roller: { x: 104, y: 134, w: 112, h: 22, r: 11 },
      motion: { target: 'body', dy: -38 },
    },
  },
  {
    id: 'hamstring',
    name: '大腿後側',
    area: '大腿後側中段，坐骨下方到膝窩上方。',
    setup: '坐姿，滾筒橫放大腿後側，雙手撐在身後，臀部離地。從膝蓋上方滾到臀部下方。',
    dose: '每側 90 秒–2 分鐘',
    feel: '大腿後側一整片痠。',
    mistakes: ['滾到膝窩', '用腰拱起來推', '只壓在最痛的那一點'],
    skip: '大腿後側拉傷還沒好、痛的感覺沿著腿往下放電。',
    instead: '坐姿單腿前彎，或躺著用毛巾勾腳。',
    sources: ['hofer2026', 'couture2015', 'nakamura2021'],
    visual: {
      parts: [
        { x: 66, y: 44, w: 176, h: 52, r: 26 },
        { x: 236, y: 62, w: 30, h: 30, r: 15 },
      ],
      roller: { x: 92, y: 108, w: 100, h: 22, r: 11 },
      motion: { target: 'roller', dx: 76 },
    },
  },
  {
    id: 'glute',
    name: '臀部',
    area: '臀部外上方（臀中肌）與臀部中央（臀大肌）。',
    setup: '坐在地上，單邊屁股坐在滾筒上，同側手撐地，另一腳踩地。小幅度前後移動，痛點停留 10 秒。',
    dose: '每側 90 秒',
    feel: '屁股深處的痠。',
    mistakes: ['整片背都躺上滾筒，壓到腰椎', '坐在滾筒正中央不動'],
    skip: '髖關節置換術後、坐骨結節痛到坐不住。',
    instead: '網球放在臀部下方，或坐姿 4 字伸展。',
    sources: ['wiewelhove2019', 'macdonald2013'],
    visual: {
      parts: [
        { x: 108, y: 24, w: 106, h: 98, r: 48 },
        { x: 96, y: 62, w: 30, h: 46, r: 15 },
      ],
      roller: { x: 100, y: 126, w: 116, h: 24, r: 12 },
      motion: { target: 'body', dx: 46 },
    },
  },
  {
    id: 'tfl',
    name: '大腿外側',
    area: '大腿外側，髖骨下方到膝蓋上方三指。',
    setup: '側躺，前臂撐地，下方腿伸直，上方腿踩在身前。身體上下移動 10–15 公分。',
    dose: '每側 60–90 秒',
    feel: '這裡通常最痛，維持 5–6 分就夠。',
    mistakes: ['壓在膝蓋外側的骨頭', '整個人重量壓上去', '痛到憋氣還繼續'],
    skip: '髖部外側有瘀青或急性疼痛。',
    instead: '用軟球小範圍按壓，或站姿交叉腿伸展。',
    note: '髂脛束是結締組織，滾它不會讓它變軟。有幫助的是旁邊的闊筋膜張肌與臀肌。',
    sources: ['grabow2018', 'wiewelhove2019'],
    visual: {
      parts: [
        { x: 126, y: 16, w: 56, h: 122, r: 28 },
        { x: 118, y: 2, w: 72, h: 26, r: 13 },
      ],
      roller: { x: 196, y: 46, w: 22, h: 92, r: 11 },
      motion: { target: 'roller', dy: 40 },
    },
  },
  {
    id: 'thoracic',
    name: '上背（胸椎）',
    area: '肩胛骨下緣到肩胛骨中間。脖子與腰不要滾。',
    setup: '仰躺，滾筒橫放上背，雙手抱胸或輕扶頭（不要拉脖子），膝蓋彎曲，臀部離地上下移動。',
    dose: '90 秒–2 分鐘',
    feel: '上背被撐開的感覺。',
    mistakes: ['滾到腰椎，腰會塌下去', '壓在脖子上', '頭往後仰'],
    skip: '骨質疏鬆、近期肋骨或脊椎受傷、正在頭暈。',
    instead: '靠牆用網球按肩胛骨內側。',
    sources: ['wiewelhove2019', 'beardsley2015'],
    visual: {
      parts: [
        { x: 104, y: 14, w: 112, h: 128, r: 56 },
        { x: 148, y: 30, w: 24, h: 96, r: 12 },
      ],
      roller: { x: 92, y: 98, w: 136, h: 22, r: 11 },
      motion: { target: 'body', dy: -30 },
    },
  },
];

/** 三個必須記住的數字 */
export const ROLLING_DOSE = [
  { label: '每個部位', value: '90 秒–2 分鐘', hint: '少於 90 秒沒效果，超過 2 分鐘沒有更好' },
  { label: '痛感', value: '5–6 / 10', hint: '痛感 3.9 分與 8.2 分，效果相同' },
  { label: '時機', value: '運動前 30 分鐘內', hint: '效果約 30 分鐘後消失' },
] as const;

/** 滾筒怎麼選 */
export const ROLLER_CHOICES = [
  {
    title: '長度',
    detail: '90 公分：背、臀、大腿。30–45 公分：小腿、足底、手臂。',
  },
  {
    title: '直徑',
    detail: '15 公分是一般用途。10 公分壓得更深，痠痛耐受度要夠。',
  },
  {
    title: '硬度',
    detail: '中等硬度，手指壓得下約 5 公釐。太軟的滾筒壓力不足，活動度不會進步。',
  },
  {
    title: '表面',
    detail: '平滑優先。顆粒、狼牙棒沒有額外證據，只是比較痛。',
  },
  {
    title: '預算',
    detail: '一般泡棉滾筒就夠。不需要電動或震動款。',
  },
] as const;

/** 不要做的事 */
export const ROLLING_SAFETY = [
  '不要滾頸部前側、腰椎正中、膝蓋與腳踝的骨頭突出處、傷口與瘀青。',
  '出現麻、刺痛、像放電的感覺，立刻換位置或停止。',
  '滾完 24 小時內出現瘀青，代表力道太大。',
  '急性受傷 48 小時內、發燒、靜脈曲張、懷孕腹部，先不要做。',
  '骨質疏鬆、近期骨折、手術後，先問醫師或物理治療師。',
] as const;

/** 四個常見誤解，每一項都對應一篇文獻 */
export const ROLLING_MYTHS = [
  {
    myth: '越痛越有效',
    fact: '痛感 3.9 分與 8.2 分，活動度增加幅度相同，力量與跳躍也沒有差別。',
    source: 'grabow2018' as SourceId,
  },
  {
    myth: '滾越久越有效',
    fact: '每側滾 2 分鐘與滾 10 分鐘，活動度、肌力、肌肉硬度都沒有差別。',
    source: 'hofer2026' as SourceId,
  },
  {
    myth: '滾完會變強',
    fact: '對肌力與跳躍的影響幾乎是零；能拿到的是柔軟度與痠痛感。',
    source: 'wiewelhove2019' as SourceId,
  },
  {
    myth: '把筋膜沾黏滾開',
    fact: '滾完肌肉硬度沒有改變，活動度變好主要來自對拉伸的耐受度提高。',
    source: 'nakamura2021' as SourceId,
  },
] as const;
