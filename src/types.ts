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
}

export interface StepsData {
  goal: number;
  days: Record<string, number>;
}
