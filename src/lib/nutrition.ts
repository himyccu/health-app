import type {
  FoodGroupKey,
  FoodGroups,
  MealEntry,
  MealType,
  Profile,
  TfdaFood,
} from '../types';
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
    targetAt1800: 5,
  },
  {
    key: 'dairy',
    name: '乳品類',
    unit: '杯',
    description: '鮮奶、無糖優格、起司（1 杯＝240ml）',
    targetAt1800: 1.5,
  },
  {
    key: 'vegetables',
    name: '蔬菜類',
    unit: '份',
    description: '深綠、深黃、紅橙色蔬菜',
    targetAt1800: 3,
  },
  {
    key: 'fruits',
    name: '水果類',
    unit: '份',
    description: '當季水果，每份約一個拳頭',
    targetAt1800: 2,
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

export interface NutritionTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium: number;
  groups: FoodGroups;
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

export function getGroupTargets(tdee: number): FoodGroups {
  // 尚未建立生理資料時，先用官方 1,800 kcal 基準顯示六大類建議量，
  // 避免出現「乳品 1 杯、其餘全為 0」的錯誤畫面。
  const referenceCalories = tdee > 0 ? tdee : 1800;
  const scale = referenceCalories / 1800;
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
    fiber: 25,
    sodium: 2300,
    groups: getGroupTargets(calories),
  };
}

export interface MealTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  groups: FoodGroups;
}

export function sumMeals(meals: MealEntry[]): MealTotals {
  return meals.reduce<MealTotals>(
    (totals, meal) => ({
      calories: totals.calories + meal.calories,
      protein: totals.protein + meal.protein,
      carbs: totals.carbs + meal.carbs,
      fat: totals.fat + meal.fat,
      fiber: totals.fiber + (meal.fiber ?? 0),
      sugar: totals.sugar + (meal.sugar ?? 0),
      sodium: totals.sodium + (meal.sodium ?? 0),
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
      fiber: 0,
      sugar: 0,
      sodium: 0,
      groups: { ...EMPTY_FOOD_GROUPS },
    },
  );
}

export function createFoodMealEntry(
  food: TfdaFood,
  grams: number,
  mealType: MealType,
  date: string,
): MealEntry {
  const safeGrams = Math.max(1, Math.min(2000, grams));
  const factor = safeGrams / 100;
  const nutrients = food.nutrients;
  const randomPart = Math.random().toString(36).slice(2, 8);

  return {
    id: `${Date.now().toString(36)}-${randomPart}`,
    date,
    createdAt: new Date().toISOString(),
    name: food.name,
    calories: Math.round((nutrients.calories ?? 0) * factor),
    protein: round1((nutrients.protein ?? 0) * factor),
    carbs: round1((nutrients.carbs ?? 0) * factor),
    fat: round1((nutrients.fat ?? 0) * factor),
    fiber: round1((nutrients.fiber ?? 0) * factor),
    sugar: round1((nutrients.sugar ?? 0) * factor),
    sodium: Math.round((nutrients.sodium ?? 0) * factor),
    groups: { ...EMPTY_FOOD_GROUPS },
    source: 'tfda',
    foodId: food.id,
    grams: safeGrams,
    mealType,
  };
}
