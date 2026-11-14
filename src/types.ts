import type { Muscle } from 'react-body-highlighter';

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

/** 肌肉在動作中的角色，對應 ExRx 的 Target / Synergist / Stabilizer 分類。 */
export type MuscleRole = 'target' | 'synergist' | 'stabilizer';

export interface MuscleInvolvement {
  /** 人體圖上要高亮的部位。 */
  id: Muscle;
  /** 繁體中文肌名。 */
  name: string;
  /** 英文或拉丁原名，方便對照解剖資料。 */
  latin: string;
  role: MuscleRole;
  /** 這個肌肉在這個動作裡實際做什麼。 */
  note: string;
}

export interface JointAction {
  joint: string;
  action: string;
}

/** 單一動作的解剖資料卡：分類、關節動作、肌肉分工與進退階。 */
export interface ExerciseAnatomy {
  classification: {
    utility: string;
    mechanics: string;
    force: string;
  };
  jointActions: JointAction[];
  muscles: MuscleInvolvement[];
  /** 圖層沒有的肌肉（例如前鋸肌、旋轉肌袖），用文字補足。 */
  extraMuscles?: string;
  regressions: string[];
  progressions: string[];
  coachNote: string;
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

/** 節段資料：五個部位。單位為公斤。 */
export interface SegmentValues {
  rightArm: number;
  leftArm: number;
  trunk: number;
  rightLeg: number;
  leftLeg: number;
}

/**
 * 一筆 InBody 報告。
 *
 * 只收錄「有公開標準、可以判讀」的欄位。
 * 阻抗值（FR／FREQ／RA…）、BCM、蛋白質／礦物質不建欄位：
 * 這些不是工程參數，就是原廠沒有公開分級，硬做只會讓畫面更難懂。
 */
export interface BodyCompositionEntry {
  id: string;
  /** 量測日期（YYYY-MM-DD） */
  date: string;
  createdAt: string;

  // 必填六項
  weight: number;
  /** 骨骼肌重 SMM（公斤） */
  skeletalMuscle: number;
  /** 體脂肪重（公斤） */
  bodyFatMass: number;
  /** 體脂肪率（%） */
  bodyFatPercent: number;
  /** 內臟脂肪等級（1–20） */
  visceralFatLevel: number;
  /** 原廠基礎代謝率（kcal／日） */
  bmr: number;

  // 節段（0 表示未填）
  segmentMuscle: SegmentValues;
  segmentFat: SegmentValues;

  // 進階選填（0 表示未填）
  /** 腰臀比 */
  waistHipRatio: number;
  /** 內臟脂肪面積（cm²） */
  visceralFatArea: number;
  /** 細胞外水分 ÷ 總水分 */
  ecwTbw: number;
  /** 原廠 InBody 分數（0–100） */
  inbodyScore: number;
  /** 原廠身體年齡 */
  bodyAge: number;
}
