import type { BodyCompositionEntry, Profile, SegmentValues } from '../types';
import {
  BODY_FAT_RANGES,
  ECW_TBW,
  SEGMENT_LABELS,
  SEGMENT_ORDER,
  SEGMENT_SHARE,
  SMI_THRESHOLDS,
  VISCERAL_AREA_THRESHOLD,
  VISCERAL_LEVEL,
  WAIST_HIP,
  type Gender,
  type SegmentKey,
} from '../data/bodyComposition';

export type Status = 'low' | 'normal' | 'high' | 'veryHigh' | 'none';

export const STATUS_TEXT: Record<Status, string> = {
  low: '偏低',
  normal: '正常',
  high: '偏高',
  veryHigh: '過高',
  none: '無資料',
};

export interface Finding {
  id: string;
  name: string;
  valueText: string;
  status: Status;
  detail: string;
  action?: string;
}

export interface SegmentResult {
  key: SegmentKey;
  label: string;
  value: number;
  /** 佔五部位合計的百分比 */
  share: number;
  /** 與對側的差距（%） */
  diff: number;
  status: Status;
  /** 顯示用文字，例如「左臂 2.8 kg（10.2%）」 */
  valueText: string;
}

export interface BodyCompositionResult {
  findings: Finding[];
  segmentMuscle: SegmentResult[];
  segmentFat: SegmentResult[];
  smi: number | null;
  targetWeight: number | null;
  fatControl: number | null;
  katchBmr: number | null;
  hasSegments: boolean;
}

export function emptyEntry(date: string): BodyCompositionEntry {
  return {
    id: '',
    date,
    createdAt: '',
    weight: 0,
    skeletalMuscle: 0,
    bodyFatMass: 0,
    bodyFatPercent: 0,
    visceralFatLevel: 0,
    bmr: 0,
    segmentMuscle: emptySegments(),
    segmentFat: emptySegments(),
    waistHipRatio: 0,
    visceralFatArea: 0,
    ecwTbw: 0,
    inbodyScore: 0,
    bodyAge: 0,
  };
}

export function emptySegments(): SegmentValues {
  return { rightArm: 0, leftArm: 0, trunk: 0, rightLeg: 0, leftLeg: 0 };
}

function sumSegments(segments: SegmentValues): number {
  return SEGMENT_ORDER.reduce((sum, key) => sum + (segments[key] || 0), 0);
}

function fatRangeFor(profile: Profile): { low: number; high: number } {
  const gender: Gender = profile.gender === 'male' ? 'male' : 'female';
  const age = profile.age > 0 ? profile.age : 30;
  const band = BODY_FAT_RANGES[gender].find((row) => age >= row.minAge && age <= row.maxAge);
  return band?.range ?? BODY_FAT_RANGES[gender][0].range;
}

function statusForValue(value: number, low: number, high: number): Status {
  if (value <= 0) return 'none';
  if (value < low) return 'low';
  if (value > high) return 'high';
  return 'normal';
}

/**
 * 左右差：以較大一側為分母。
 * 兩側相差 5% 以內屬量測誤差範圍，超過 10% 才是明顯不平衡。
 */
function symmetryDiff(a: number, b: number): number {
  const max = Math.max(a, b);
  if (max <= 0) return 0;
  return (Math.abs(a - b) / max) * 100;
}

function buildSegments(segments: SegmentValues): SegmentResult[] {
  const total = sumSegments(segments);
  const pairs: Record<SegmentKey, SegmentKey> = {
    rightArm: 'leftArm',
    leftArm: 'rightArm',
    trunk: 'trunk',
    rightLeg: 'leftLeg',
    leftLeg: 'rightLeg',
  };

  return SEGMENT_ORDER.map((key) => {
    const value = segments[key] || 0;
    const share = total > 0 ? (value / total) * 100 : 0;
    const isPaired = key !== 'trunk';
    const diff = isPaired ? symmetryDiff(value, segments[pairs[key]]) : 0;
    const band = key === 'trunk' ? SEGMENT_SHARE.trunk : key.includes('Arm') ? SEGMENT_SHARE.arm : SEGMENT_SHARE.leg;

    let status: Status = 'none';
    if (value > 0) {
      // 左右差優先：超過 10% 一律標為需要注意。
      if (isPaired && diff > 10) status = 'high';
      else if (share < band.low) status = 'low';
      else if (share > band.high) status = 'high';
      else status = 'normal';
    }

    return {
      key,
      label: SEGMENT_LABELS[key],
      value,
      share,
      diff,
      status,
      valueText:
        value > 0 ? `${value.toFixed(1)} kg（${share.toFixed(1)}%）` : '未填',
    };
  });
}

export function evaluateBodyComposition(
  entry: BodyCompositionEntry,
  profile: Profile,
): BodyCompositionResult {
  const findings: Finding[] = [];
  const gender: Gender = profile.gender === 'male' ? 'male' : 'female';

  // 體脂肪率
  if (entry.bodyFatPercent > 0) {
    const range = fatRangeFor(profile);
    const status = statusForValue(entry.bodyFatPercent, range.low, range.high);
    findings.push({
      id: 'bodyFat',
      name: '體脂肪率',
      valueText: `${entry.bodyFatPercent.toFixed(1)}%`,
      status,
      detail: `你的年齡層參考範圍 ${range.low}–${range.high}%。`,
      action:
        status === 'high'
          ? '先減少含糖飲料與久坐時間，每週增加 150 分鐘中等強度活動。'
          : status === 'low'
            ? '體脂已偏低，不建議再減脂，改為維持肌肉量。'
            : '維持目前飲食與活動量。',
    });
  }

  // 骨骼肌重（只描述，不判定，因為要搭配身高）
  if (entry.skeletalMuscle > 0) {
    findings.push({
      id: 'skeletalMuscle',
      name: '骨骼肌重',
      valueText: `${entry.skeletalMuscle.toFixed(1)} kg`,
      status: 'normal',
      detail: '骨骼肌沒有單一標準值，需換算成 SMI 才能判斷是否偏低。',
    });
  }

  // SMI（需要四個肢段）
  const limbs = [entry.segmentMuscle.leftArm, entry.segmentMuscle.rightArm, entry.segmentMuscle.leftLeg, entry.segmentMuscle.rightLeg];
  const limbsComplete = limbs.every((value) => value > 0);
  const heightM = profile.height > 0 ? profile.height / 100 : 0;
  const asm = limbs.reduce((sum, value) => sum + value, 0);
  const smi = limbsComplete && heightM > 0 ? asm / (heightM * heightM) : null;

  if (smi !== null) {
    const threshold = SMI_THRESHOLDS[gender];
    const low = smi < threshold;
    findings.push({
      id: 'smi',
      name: '骨骼肌指數（SMI）',
      valueText: `${smi.toFixed(1)} kg/m²`,
      status: low ? 'low' : 'normal',
      detail: `AWGS 2019 切點：${gender === 'male' ? '男性 < 7.0' : '女性 < 5.7'} kg/m² 為偏低。`,
      action: low
        ? '優先做下肢與背部的阻力訓練，每週 2–3 次，並確認蛋白質攝取。'
        : '肌肉量足夠，維持目前的訓練頻率。',
    });
  }

  // 內臟脂肪等級
  if (entry.visceralFatLevel > 0) {
    const level = entry.visceralFatLevel;
    const status: Status =
      level <= VISCERAL_LEVEL.normalMax ? 'normal' : level <= VISCERAL_LEVEL.highMax ? 'high' : 'veryHigh';
    findings.push({
      id: 'visceral',
      name: '內臟脂肪等級',
      valueText: `${level}`,
      status,
      detail: '1–9 正常、10–14 偏高、15 以上過高。',
      action:
        status === 'normal'
          ? '維持目前的活動量。'
          : '以有氧運動與飲食控制為主，不需要局部訓練。',
    });
  }

  // 腰臀比
  if (entry.waistHipRatio > 0) {
    const limits = WAIST_HIP[gender];
    const value = entry.waistHipRatio;
    const status: Status = value < limits.normal ? 'normal' : value <= limits.high ? 'high' : 'veryHigh';
    findings.push({
      id: 'waistHip',
      name: '腰臀比',
      valueText: value.toFixed(2),
      status,
      detail: `WHO 標準：${gender === 'male' ? '男性 < 0.90' : '女性 < 0.85'}。`,
      action: status === 'normal' ? undefined : '腹部脂肪偏高，優先增加日常步行量。',
    });
  }

  // 內臟脂肪面積
  if (entry.visceralFatArea > 0) {
    findings.push({
      id: 'vfa',
      name: '內臟脂肪面積',
      valueText: `${Math.round(entry.visceralFatArea)} cm²`,
      status: entry.visceralFatArea >= VISCERAL_AREA_THRESHOLD ? 'high' : 'normal',
      detail: `日本肥胖學會：≥ ${VISCERAL_AREA_THRESHOLD} cm² 屬代謝風險。`,
      action:
        entry.visceralFatArea >= VISCERAL_AREA_THRESHOLD
          ? '建議追蹤血脂與血糖，並與醫師討論。'
          : undefined,
    });
  }

  // ECW/TBW
  if (entry.ecwTbw > 0) {
    const status: Status =
      entry.ecwTbw <= ECW_TBW.normalMax ? 'normal' : entry.ecwTbw <= ECW_TBW.edema ? 'high' : 'veryHigh';
    findings.push({
      id: 'ecwTbw',
      name: '細胞外水分比例',
      valueText: entry.ecwTbw.toFixed(3),
      status,
      detail: '0.360–0.390 正常；0.390–0.400 輕微偏高；> 0.400 可能水腫。',
      action:
        status === 'normal'
          ? undefined
          : '若持續偏高，請就醫檢查，不要只靠運動或喝水調整。',
    });
  }

  // 原廠 BMR 與公式比對
  const leanMass = entry.weight > 0 && entry.bodyFatMass > 0 ? entry.weight - entry.bodyFatMass : 0;
  const katchBmr = leanMass > 0 ? Math.round(370 + 21.6 * leanMass) : null;
  if (entry.bmr > 0 && katchBmr) {
    const diffPercent = (Math.abs(entry.bmr - katchBmr) / katchBmr) * 100;
    findings.push({
      id: 'bmr',
      name: '基礎代謝率',
      valueText: `${entry.bmr.toLocaleString()} kcal`,
      status: diffPercent > 10 ? 'high' : 'normal',
      detail: `Katch-McArdle 公式以瘦肉量推算為 ${katchBmr.toLocaleString()} kcal，相差 ${Math.round(diffPercent)}%。`,
      action:
        diffPercent > 10
          ? '差距超過 10%，可能與量測條件有關（進食、水分、運動後）。以同一台機器、同樣條件量測再比較。'
          : '兩個數值接近，可安心使用。',
    });
  }

  // 原廠分數與身體年齡（只顯示，不重算）
  if (entry.inbodyScore > 0 || entry.bodyAge > 0) {
    const parts: string[] = [];
    if (entry.inbodyScore > 0) parts.push(`分數 ${entry.inbodyScore}`);
    if (entry.bodyAge > 0) parts.push(`身體年齡 ${entry.bodyAge} 歲`);
    findings.push({
      id: 'score',
      name: 'InBody 分數與身體年齡',
      valueText: parts.join('、'),
      status: 'normal',
      detail: '原廠專利演算法，公式未公開，本 App 只顯示、不重算。',
    });
  }

  // 目標體重與脂肪控制量（以 BMI 22 為基準，屬參考值）
  let targetWeight: number | null = null;
  let fatControl: number | null = null;
  if (heightM > 0) {
    targetWeight = Math.round(22 * heightM * heightM * 10) / 10;
    if (entry.bodyFatMass > 0) {
      const range = fatRangeFor(profile);
      const targetFatPercent = (range.low + range.high) / 2;
      fatControl = Math.round((entry.bodyFatMass - (targetWeight * targetFatPercent) / 100) * 10) / 10;
    }
  }

  return {
    findings,
    segmentMuscle: buildSegments(entry.segmentMuscle),
    segmentFat: buildSegments(entry.segmentFat),
    smi,
    targetWeight,
    fatControl,
    katchBmr,
    hasSegments: sumSegments(entry.segmentMuscle) > 0,
  };
}

/** 把節段結果轉成一句話，例如「左右差 3.4%，正常」。 */
export function symmetryText(result: SegmentResult): string {
  if (result.value <= 0) return '未填';
  if (result.key === 'trunk') return '單一部位';
  if (result.diff <= 5) return `左右差 ${result.diff.toFixed(1)}%，良好`;
  if (result.diff <= 10) return `左右差 ${result.diff.toFixed(1)}%，留意`;
  return `左右差 ${result.diff.toFixed(1)}%，明顯不平衡`;
}
