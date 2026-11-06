export type Gender = 'male' | 'female';

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';

export type TabId = 'home' | 'activity' | 'exercise' | 'health' | 'nutrition' | 'settings';

export type ExerciseCategory = 'cardio' | 'strength' | 'core' | 'mobility';

export type MovementPattern = 'push' | 'pull' | 'squat' | 'hinge' | 'lunge' | 'core' | 'cardio' | 'mobility';

export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'arms'
  | 'core'
  | 'glutes'
  | 'quads'
  | 'hamstrings'
  | 'calves'
  | 'fullBody';

export interface ExerciseDefinition {
  id: string;
  name: string;
  englishName: string;
  category: ExerciseCategory;
  pattern: MovementPattern;
  /** 代謝當量（MET），依 Compendium of Physical Activities 的運動分類取整。 */
  met: number;
  intensity: string;
  primaryMuscles: MuscleGroup[];
  secondaryMuscles: MuscleGroup[];
  equipment: string;
  cues: string[];
  mistakes: string[];
}

export interface WorkoutEntry {
  id: string;
  date: string;
  createdAt: string;
  exerciseId: string;
  name: string;
  minutes: number;
  sets?: number;
  reps?: number;
  met: number;
  calories: number;
}

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
  /** 每日活動時間（分鐘）。與步數分開記錄，因為同樣步數每個人的實際時間不同。 */
  activeMinutes: Record<string, number>;
  /** 每日 GPS 實際步行距離（公里）。 */
  distanceKm: Record<string, number>;
}
