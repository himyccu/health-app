import type { FoodGroupKey, FoodGroups, MealEntry, Profile } from '../types';
import { calcTdee } from './health';

export interface FoodGroupMeta {
  key: FoodGroupKey;
  name: string;
  unit: string;
  description: string;
  targetAt1800: number;
}

export const FOOD_GROUPS: FoodGroupMeta[] = [
  {
    key: 'grains',
    name: '全穀雜糧類',
    unit: '碗',
    description: '糙米、燕麥、地瓜、全麥麵包',
    targetAt1800: 3,
  },
  {
    key: 'protein',
    name: '豆魚蛋肉類',
    unit: '份',
    description: '黃豆製品、魚類、蛋、雞肉、瘦肉',
    targetAt1800: 6,
  },
  {
    key: 'dairy',
    name: '乳品類',
    unit: '杯',
    description: '鮮奶、無糖優格、起司',
    targetAt1800: 1.5,
  },
  {
    key: 'vegetables',
    name: '蔬菜類',
    unit: '份',
    description: '深綠、深黃、紅橙色蔬菜',
    targetAt1800: 4,
  },
  {
    key: 'fruits',
    name: '水果類',
    unit: '份',
    description: '當季水果，每份約一個拳頭',
    targetAt1800: 3,
  },
  {
    key: 'fats',
    name: '油脂與堅果種子類',
    unit: '份',
    description: '橄欖油、苦茶油、堅果種子',
    targetAt1800: 5,
  },
];

export const EMPTY_FOOD_GROUPS: FoodGroups = {
  grains: 0,
  protein: 0,
  dairy: 0,
  vegetables: 0,
  fruits: 0,
  fats: 0,
};

export interface MealPreset {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  groups: FoodGroups;
  tip: string;
}

export const MEAL_PRESETS: MealPreset[] = [
  {
    name: '香煎雞腿便當',
    calories: 720,
    protein: 34,
    carbs: 88,
    fat: 26,
    groups: { grains: 1.5, protein: 2.5, dairy: 0, vegetables: 1.5, fruits: 0, fats: 2 },
    tip: '蛋白質充足，建議加一份燙青菜並減少炸物配菜。',
  },
  {
    name: '鮭魚酪梨沙拉',
    calories: 480,
    protein: 28,
    carbs: 22,
    fat: 32,
    groups: { grains: 0.5, protein: 2, dairy: 0.5, vegetables: 2.5, fruits: 1, fats: 2.5 },
    tip: '蔬菜與好油脂豐富，可搭配一片全麥麵包補足全穀雜糧。',
  },
  {
    name: '蔬菜蛋餅＋無糖豆漿',
    calories: 420,
    protein: 22,
    carbs: 45,
    fat: 16,
    groups: { grains: 1, protein: 1.5, dairy: 0, vegetables: 1, fruits: 0, fats: 1 },
    tip: '早餐組合清爽，建議再補充一份水果增加膳食纖維。',
  },
  {
    name: '燕麥水果優格碗',
    calories: 380,
    protein: 16,
    carbs: 58,
    fat: 9,
    groups: { grains: 1, protein: 0.5, dairy: 1, vegetables: 0, fruits: 2, fats: 0.5 },
    tip: '富含乳品與水果，適合當早餐；可加一顆蛋提升蛋白質。',
  },
  {
    name: '家常三菜一湯',
    calories: 560,
    protein: 26,
    carbs: 62,
    fat: 20,
    groups: { grains: 1.5, protein: 2, dairy: 0, vegetables: 2.5, fruits: 0.5, fats: 1.5 },
    tip: '蔬菜量不錯，若湯品含加工品可替換為清湯以減少鈉攝取。',
  },
];

export interface NutritionTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  groups: FoodGroups;
}

export function getGroupTargets(tdee: number): FoodGroups {
  const scale = tdee / 1800;
  const roundHalf = (value: number) => Math.round(value * 2) / 2;
  return {
    grains: roundHalf(FOOD_GROUPS[0].targetAt1800 * scale),
    protein: roundHalf(FOOD_GROUPS[1].targetAt1800 * scale),
    dairy: roundHalf(Math.max(1, FOOD_GROUPS[2].targetAt1800 * scale)),
    vegetables: roundHalf(FOOD_GROUPS[3].targetAt1800 * scale),
    fruits: roundHalf(FOOD_GROUPS[4].targetAt1800 * scale),
    fats: roundHalf(FOOD_GROUPS[5].targetAt1800 * scale),
  };
}

export function getNutritionTargets(profile: Profile): NutritionTargets {
  const calories = calcTdee(profile);
  const protein = Math.round(profile.weight * 1.2);
  const fat = Math.round((calories * 0.25) / 9);
  const carbs = Math.max(0, Math.round((calories - protein * 4 - fat * 9) / 4));
  return {
    calories,
    protein,
    carbs,
    fat,
    groups: getGroupTargets(calories),
  };
}

export interface MealTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  groups: FoodGroups;
}

export function sumMeals(meals: MealEntry[]): MealTotals {
  return meals.reduce<MealTotals>(
    (totals, meal) => ({
      calories: totals.calories + meal.calories,
      protein: totals.protein + meal.protein,
      carbs: totals.carbs + meal.carbs,
      fat: totals.fat + meal.fat,
      groups: {
        grains: totals.groups.grains + meal.groups.grains,
        protein: totals.groups.protein + meal.groups.protein,
        dairy: totals.groups.dairy + meal.groups.dairy,
        vegetables: totals.groups.vegetables + meal.groups.vegetables,
        fruits: totals.groups.fruits + meal.groups.fruits,
        fats: totals.groups.fats + meal.groups.fats,
      },
    }),
    {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      groups: { ...EMPTY_FOOD_GROUPS },
    },
  );
}

export function createMealEntry(preset: MealPreset, date: string): MealEntry {
  const randomPart = Math.random().toString(36).slice(2, 8);
  return {
    id: `${Date.now().toString(36)}-${randomPart}`,
    date,
    createdAt: new Date().toISOString(),
    name: preset.name,
    calories: preset.calories,
    protein: preset.protein,
    carbs: preset.carbs,
    fat: preset.fat,
    groups: { ...preset.groups },
  };
}
