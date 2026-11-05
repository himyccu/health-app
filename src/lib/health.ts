import type { ActivityLevel, Profile } from '../types';

export interface ActivityOption {
  value: ActivityLevel;
  label: string;
  hint: string;
  factor: number;
}

export const ACTIVITY_OPTIONS: ActivityOption[] = [
  {
    value: 'sedentary',
    label: '久坐',
    hint: '幾乎不運動，長時間辦公室或居家',
    factor: 1.2,
  },
  {
    value: 'light',
    label: '輕度活動',
    hint: '每週運動 1–2 天，日常多為靜態',
    factor: 1.375,
  },
  {
    value: 'moderate',
    label: '中度活動',
    hint: '每週運動 3–5 天，每次約 30 分鐘',
    factor: 1.55,
  },
  {
    value: 'active',
    label: '高度活動',
    hint: '每週運動 6–7 天，或工作需要走動',
    factor: 1.725,
  },
  {
    value: 'veryActive',
    label: '非常活躍',
    hint: '高強度訓練、勞動型工作或每日運動 2 次',
    factor: 1.9,
  },
];

export function getActivityOption(level: ActivityLevel): ActivityOption {
  return ACTIVITY_OPTIONS.find((option) => option.value === level) ?? ACTIVITY_OPTIONS[1];
}

export function calcBmi(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  if (!Number.isFinite(heightM) || heightM <= 0 || !Number.isFinite(weightKg)) return 0;
  return weightKg / (heightM * heightM);
}

export type BmiCategoryId = 'underweight' | 'normal' | 'overweight' | 'obese';

export interface BmiCategory {
  id: BmiCategoryId;
  label: string;
  rangeLabel: string;
  advice: string;
  badgeClass: string;
  barClass: string;
  softClass: string;
  textClass: string;
}

export const BMI_CATEGORIES: BmiCategory[] = [
  {
    id: 'underweight',
    label: '過輕',
    rangeLabel: 'BMI < 18.5',
    advice: '建議增加均衡的熱量與蛋白質攝取，並確認是否有潛在健康因素。',
    badgeClass: 'bg-sky-100 text-sky-800',
    barClass: 'bg-sky-400',
    softClass: 'bg-sky-50 border-sky-200',
    textClass: 'text-sky-700',
  },
  {
    id: 'normal',
    label: '正常範圍',
    rangeLabel: '18.5 ≤ BMI < 24',
    advice: '維持目前均衡飲食與規律活動，繼續保持！',
    badgeClass: 'bg-emerald-100 text-emerald-800',
    barClass: 'bg-emerald-500',
    softClass: 'bg-emerald-50 border-emerald-200',
    textClass: 'text-emerald-700',
  },
  {
    id: 'overweight',
    label: '過重',
    rangeLabel: '24 ≤ BMI < 27',
    advice: '建議逐步調整飲食份量與活動量，以溫和方式管理體位。',
    badgeClass: 'bg-amber-100 text-amber-800',
    barClass: 'bg-amber-500',
    softClass: 'bg-amber-50 border-amber-200',
    textClass: 'text-amber-700',
  },
  {
    id: 'obese',
    label: '肥胖',
    rangeLabel: 'BMI ≥ 27',
    advice: '建議諮詢醫師或營養師，制定安全且可持續的健康管理計畫。',
    badgeClass: 'bg-rose-100 text-rose-800',
    barClass: 'bg-rose-500',
    softClass: 'bg-rose-50 border-rose-200',
    textClass: 'text-rose-700',
  },
];

export function getBmiCategory(bmi: number): BmiCategory {
  if (bmi < 18.5) return BMI_CATEGORIES[0];
  if (bmi < 24) return BMI_CATEGORIES[1];
  if (bmi < 27) return BMI_CATEGORIES[2];
  return BMI_CATEGORIES[3];
}

/** Mifflin–St Jeor 基礎代謝率公式 */
export function calcBmr(profile: Profile): number {
  const base = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age;
  const bmr = profile.gender === 'male' ? base + 5 : base - 161;
  return Math.max(0, Math.round(bmr));
}

export function calcTdee(profile: Profile): number {
  const factor = getActivityOption(profile.activity).factor;
  return Math.round(calcBmr(profile) * factor);
}

export function getIdealWeightRange(heightCm: number): { min: number; max: number } | null {
  const heightM = heightCm / 100;
  if (!Number.isFinite(heightM) || heightM <= 0) return null;
  return {
    min: Math.round(18.5 * heightM * heightM * 10) / 10,
    max: Math.round(24 * heightM * heightM * 10) / 10,
  };
}

export interface CalorieSuggestions {
  maintain: number;
  lose: number;
  gain: number;
}

export function getCalorieSuggestions(profile: Profile): CalorieSuggestions {
  const tdee = calcTdee(profile);
  const floor = profile.gender === 'male' ? 1500 : 1200;
  return {
    maintain: tdee,
    lose: Math.max(floor, tdee - 300),
    gain: tdee + 300,
  };
}

export interface StepMetrics {
  distanceKm: number;
  calories: number;
  activeMinutes: number;
}

export function getStepMetrics(steps: number, profile: Profile): StepMetrics {
  const strideMetres = (profile.height * 0.415) / 100;
  const distanceKm = (steps * strideMetres) / 1000;
  const calories = steps * 0.04 * (profile.weight / 65);
  return {
    distanceKm: Math.round(distanceKm * 10) / 10,
    calories: Math.round(calories),
    activeMinutes: Math.round(steps / 100),
  };
}
