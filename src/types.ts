export type Gender = 'male' | 'female';

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';

export type TabId = 'activity' | 'health' | 'nutrition' | 'settings';

export interface Profile {
  gender: Gender;
  age: number;
  height: number;
  weight: number;
  activity: ActivityLevel;
}

export interface FoodGroups {
  grains: number;
  protein: number;
  dairy: number;
  vegetables: number;
  fruits: number;
  fats: number;
}

export type FoodGroupKey = keyof FoodGroups;

export type TfdaCategory =
  | '魚貝類'
  | '澱粉類'
  | '加工調理食品及其他類'
  | '蛋類'
  | '乳品類'
  | '油脂類'
  | '糖類'
  | '糕餅點心類'
  | '飲料類'
  | '堅果及種子類'
  | '調味料及香辛料類'
  | '穀物類'
  | '水果類'
  | '蔬菜類'
  | '肉類'
  | '藻類'
  | '豆類'
  | '菇類';

export interface FoodNutrients {
  calories: number | null;
  protein: number | null;
  fat: number | null;
  carbs: number | null;
  fiber: number | null;
  sugar: number | null;
  sodium: number | null;
}

export interface TfdaFood {
  id: string;
  name: string;
  aliases: string | null;
  englishName: string | null;
  category: TfdaCategory;
  state: string | null;
  nutrients: FoodNutrients;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface MealEntry {
  id: string;
  date: string;
  createdAt: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  groups: FoodGroups;

  // 新欄位皆為 optional，讓舊版 mock 紀錄可以繼續讀取。
  source?: 'tfda';
  foodId?: string;
  grams?: number;
  mealType?: MealType;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

export interface StepsData {
  goal: number;
  days: Record<string, number>;
}
