/**
 * InBody 判讀用到的標準值與白話說明。
 *
 * 這裡只放「有公開來源、可以判讀」的項目。
 * 原廠專利演算法（InBody 分數、身體年齡）不重算，只顯示輸入值。
 * 阻抗值、BCM 沒有公開分級，因此不做紅黃綠判定。
 */

export type Gender = 'male' | 'female';

export interface Range {
  low: number;
  high: number;
}

/** 體脂肪率參考範圍（依年齡分組）。來源：ACE 分齡體脂對照表。 */
export const BODY_FAT_RANGES: Record<Gender, { minAge: number; maxAge: number; range: Range }[]> = {
  male: [
    { minAge: 20, maxAge: 39, range: { low: 8, high: 20 } },
    { minAge: 40, maxAge: 59, range: { low: 11, high: 22 } },
    { minAge: 60, maxAge: 200, range: { low: 13, high: 25 } },
  ],
  female: [
    { minAge: 20, maxAge: 39, range: { low: 21, high: 33 } },
    { minAge: 40, maxAge: 59, range: { low: 23, high: 34 } },
    { minAge: 60, maxAge: 200, range: { low: 24, high: 36 } },
  ],
};

/** 骨骼肌指數 SMI 切點（AWGS 2019 亞洲共識）。 */
export const SMI_THRESHOLDS: Record<Gender, number> = {
  male: 7.0,
  female: 5.7,
};

/** 內臟脂肪等級（InBody 原廠分級）。 */
export const VISCERAL_LEVEL = {
  normalMax: 9,
  highMax: 14,
};

/** 內臟脂肪面積（日本肥胖學會）：≥100 cm² 為代謝風險。 */
export const VISCERAL_AREA_THRESHOLD = 100;

/** 細胞外水分比例 ECW/TBW。 */
export const ECW_TBW = {
  normalMax: 0.39,
  edema: 0.4,
};

/** 腰臀比（WHO）。 */
export const WAIST_HIP: Record<Gender, { normal: number; high: number }> = {
  male: { normal: 0.9, high: 0.95 },
  female: { normal: 0.85, high: 0.9 },
};

/** 節段肌肉「佔全身比例」的常見範圍（%）。僅作分布參考，不是原廠標準。 */
export const SEGMENT_SHARE = {
  arm: { low: 5, high: 8.5 },
  trunk: { low: 42, high: 56 },
  leg: { low: 16, high: 23 },
};

export const SEGMENT_LABELS = {
  rightArm: '右臂',
  leftArm: '左臂',
  trunk: '軀幹',
  rightLeg: '右腿',
  leftLeg: '左腿',
} as const;

export type SegmentKey = keyof typeof SEGMENT_LABELS;

export const SEGMENT_ORDER: SegmentKey[] = [
  'leftArm',
  'rightArm',
  'trunk',
  'leftLeg',
  'rightLeg',
];

export interface MetricDoc {
  id: string;
  name: string;
  /** 這是什麼 */
  what: string;
  /** 怎麼算 */
  how: string;
  /** 多少算標準 */
  standard: string;
  /** 不在範圍內怎麼做 */
  action: string;
}

/** 每個指標的四段白話說明：是什麼 → 怎麼算 → 標準 → 怎麼改。 */
export const METRIC_DOCS: MetricDoc[] = [
  {
    id: 'skeletalMuscle',
    name: '骨骼肌重（SMM）',
    what: '全身可以主動收縮的肌肉重量，是力量、代謝與行動能力的基礎。',
    how: '由機器量測後直接顯示，不需要自己計算。',
    standard: '沒有單一標準值，要搭配身高換算成 SMI 一起看。',
    action: '低於 SMI 切點時，優先增加阻力訓練與蛋白質攝取，再談減重。',
  },
  {
    id: 'bodyFat',
    name: '體脂肪率',
    what: '脂肪重量占體重的比例。同樣體重，體脂率不同代表組成不同。',
    how: '體脂肪重 ÷ 體重 × 100%。',
    standard: '依性別與年齡分組，例如 30 歲男性約 8–20%、女性約 21–33%。',
    action: '高於範圍先減少精製糖與久坐時間；低於範圍不建議再減脂。',
  },
  {
    id: 'visceral',
    name: '內臟脂肪等級',
    what: '包在器官周圍的脂肪。比皮下脂肪更容易影響代謝。',
    how: '機器依電阻與腰圍推估，以等級表示。',
    standard: '1–9 正常、10–14 偏高、15 以上過高。',
    action: '偏高時以有氧運動與飲食控制為主，不需要局部訓練。',
  },
  {
    id: 'smi',
    name: '骨骼肌指數（SMI）',
    what: '四肢肌肉量除以身高平方，用來篩檢肌少症風險。',
    how: '（右臂＋左臂＋右腿＋左腿肌肉重）÷ 身高（公尺）²。',
    standard: 'AWGS 2019：男性 < 7.0、女性 < 5.7 kg/m² 為偏低。',
    action: '偏低時增加下肢與背部阻力訓練，並確認每日蛋白質是否足夠。',
  },
  {
    id: 'segment',
    name: '節段肌肉與脂肪',
    what: '把身體分成左右臂、軀幹、左右腿五塊，看分布是否平均。',
    how: '左右差＝|右−左| ÷ 較大一側 × 100%；佔比＝該部位 ÷ 五部位合計。',
    standard: '左右差 ≤5% 良好、5–10% 留意、>10% 明顯不平衡。佔比為參考值。',
    action: '左右差明顯時，優先補弱側的單邊訓練，而不是加重整體重量。',
  },
  {
    id: 'waistHip',
    name: '腰臀比（WHR）',
    what: '腰圍與臀圍的比例，反映脂肪集中在腹部的程度。',
    how: '腰圍 ÷ 臀圍。',
    standard: 'WHO：男性 < 0.90、女性 < 0.85。',
    action: '偏高代表腹部脂肪較多，優先增加日常活動量與減少含糖飲料。',
  },
  {
    id: 'vfa',
    name: '內臟脂肪面積（VFA）',
    what: '把內臟脂肪攤平後的面積，比等級更精細。',
    how: '由機器推估，單位 cm²。',
    standard: '日本肥胖學會：≥ 100 cm² 屬代謝風險。',
    action: '≥100 cm² 時，建議一年內追蹤一次，並與醫師討論血脂與血糖。',
  },
  {
    id: 'ecwTbw',
    name: '細胞外水分比例（ECW/TBW）',
    what: '細胞外的水分占總水分的比例，用來觀察是否有水腫。',
    how: '細胞外水分 ÷ 總水分。',
    standard: '0.360–0.390 正常；0.390–0.400 輕微偏高；> 0.400 可能水腫。',
    action: '持續偏高時就醫檢查，不要只靠運動或喝水調整。',
  },
  {
    id: 'bmr',
    name: '基礎代謝率（BMR）',
    what: '躺著不動一天也會消耗的熱量。',
    how: '原廠以體組成推估；本 App 另用 Katch-McArdle 公式比對。',
    standard: '兩者相差 10% 以內屬正常誤差。',
    action: '不要用 BMR 當作每日進食上限，仍需加上活動消耗。',
  },
  {
    id: 'score',
    name: 'InBody 分數與身體年齡',
    what: '原廠依體組成換算的綜合評分與年齡。',
    how: '原廠專利演算法，未公開公式。',
    standard: '只顯示你輸入的數值，不重算、不判定好壞。',
    action: '把它當作參考，實際進步仍看體脂率、SMI 與訓練表現。',
  },
];

/** 判讀結果要對應到的動作模式，讓建議可以直接連到教學。 */
export const METRIC_TO_PATTERN: Record<string, string> = {
  bodyFat: '移動',
  visceral: '移動',
  smi: '蹲',
  segment: '推',
  waistHip: '移動',
  vfa: '移動',
};
