import type {
  ActivityLevel,
  FoodGroups,
  Gender,
  MealEntry,
  Profile,
  StepsData,
  WorkoutEntry,
} from '../types';

const KEYS = {
  profile: 'health_app_profile_v1',
  steps: 'health_app_steps_v1',
  meals: 'health_app_meals_v1',
  workouts: 'health_app_workouts_v1',
  disclaimer: 'health_app_disclaimer_v1',
} as const;

// 舊版原型使用的鍵值，讀取時保留相容性，清除資料時一併移除。
const LEGACY_KEYS = {
  profile: 'health_app_profile',
  disclaimer: 'health_app_disclaimer_agreed',
} as const;

// 首次使用的預設值：全部留空（0），由使用者在「設定」自行建立專屬基準。
// 性別與活動量不影響「看起來像別人的累積數字」，故保留合理初始選項。
export const DEFAULT_PROFILE: Profile = {
  gender: 'female',
  age: 0,
  height: 0,
  weight: 0,
  activity: 'light',
};

function readJson(key: string): unknown {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage 可能因隱私模式或容量限制而無法寫入，維持目前畫面狀態即可。
  }
}

export function dateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isGender(value: unknown): value is Gender {
  return value === 'male' || value === 'female';
}

function isActivityLevel(value: unknown): value is ActivityLevel {
  return (
    value === 'sedentary' ||
    value === 'light' ||
    value === 'moderate' ||
    value === 'active' ||
    value === 'veryActive'
  );
}

function sanNumber(value: unknown, min: number, max: number): number {
  // 未設定或無效時回傳 0（視為尚未建立），不由系統預設任何數字。
  if (typeof value !== 'number' || !Number.isFinite(value)) return 0;
  if (value < min || value > max) return 0;
  return value;
}

export function loadProfile(): Profile {
  const raw = readJson(KEYS.profile) ?? readJson(LEGACY_KEYS.profile);
  if (!isRecord(raw)) return { ...DEFAULT_PROFILE };

  return {
    gender: isGender(raw.gender) ? raw.gender : DEFAULT_PROFILE.gender,
    age: Math.round(sanNumber(raw.age, 1, 120)),
    height: Math.round(sanNumber(raw.height, 80, 250)),
    weight: sanNumber(raw.weight, 20, 300),
    activity: isActivityLevel(raw.activity) ? raw.activity : DEFAULT_PROFILE.activity,
  };
}

export function saveProfile(profile: Profile): void {
  writeJson(KEYS.profile, profile);
}

function parseMinuteRecords(raw: unknown): Record<string, number> {
  const minutes: Record<string, number> = {};
  if (!isRecord(raw)) return minutes;
  Object.entries(raw).forEach(([key, value]) => {
    if (typeof value === 'number' && Number.isFinite(value) && value >= 0) {
      minutes[key] = Math.round(value);
    }
  });
  return minutes;
}

function parseDistanceRecords(raw: unknown): Record<string, number> {
  const distances: Record<string, number> = {};
  if (!isRecord(raw)) return distances;
  Object.entries(raw).forEach(([key, value]) => {
    if (typeof value === 'number' && Number.isFinite(value) && value >= 0) {
      distances[key] = Math.round(value * 100) / 100;
    }
  });
  return distances;
}

export function loadSteps(): StepsData {
  const raw = readJson(KEYS.steps);
  // 首次使用：沒有任何步數紀錄，全部歸零，由使用者逐日累積。
  if (!isRecord(raw) || !isRecord(raw.days)) {
    return { goal: 10000, days: {}, activeMinutes: {}, distanceKm: {} };
  }

  const days: Record<string, number> = {};
  Object.entries(raw.days).forEach(([key, value]) => {
    if (typeof value === 'number' && Number.isFinite(value) && value >= 0) {
      days[key] = Math.round(value);
    }
  });

  return {
    goal: Math.round(
      typeof raw.goal === 'number' && Number.isFinite(raw.goal)
        ? Math.min(50000, Math.max(1000, raw.goal))
        : 10000,
    ),
    days,
    activeMinutes: parseMinuteRecords(raw.activeMinutes),
    distanceKm: parseDistanceRecords(raw.distanceKm),
  };
}

export function saveSteps(data: StepsData): void {
  writeJson(KEYS.steps, data);
}

function isFoodGroups(value: unknown): value is FoodGroups {
  if (!isRecord(value)) return false;
  return (['grains', 'protein', 'dairy', 'vegetables', 'fruits', 'fats'] as const).every(
    (key) => typeof value[key] === 'number' && Number.isFinite(value[key]),
  );
}

function isOptionalNumber(value: unknown): boolean {
  return value === undefined || (typeof value === 'number' && Number.isFinite(value));
}

function isMealEntry(value: unknown): value is MealEntry {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === 'string' &&
    typeof value.date === 'string' &&
    typeof value.createdAt === 'string' &&
    typeof value.name === 'string' &&
    typeof value.calories === 'number' &&
    typeof value.protein === 'number' &&
    typeof value.carbs === 'number' &&
    typeof value.fat === 'number' &&
    isFoodGroups(value.groups) &&
    (value.source === undefined || value.source === 'tfda') &&
    (value.foodId === undefined || typeof value.foodId === 'string') &&
    (value.mealType === undefined ||
      value.mealType === 'breakfast' ||
      value.mealType === 'lunch' ||
      value.mealType === 'dinner' ||
      value.mealType === 'snack') &&
    isOptionalNumber(value.grams) &&
    isOptionalNumber(value.fiber) &&
    isOptionalNumber(value.sugar) &&
    isOptionalNumber(value.sodium)
  );
}

export function loadMeals(): MealEntry[] {
  const raw = readJson(KEYS.meals);
  if (!Array.isArray(raw)) return [];
  return raw.filter(isMealEntry);
}

export function saveMeals(meals: MealEntry[]): void {
  writeJson(KEYS.meals, meals.slice(-200));
}

function isWorkoutEntry(value: unknown): value is WorkoutEntry {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === 'string' &&
    typeof value.date === 'string' &&
    typeof value.createdAt === 'string' &&
    typeof value.exerciseId === 'string' &&
    typeof value.name === 'string' &&
    typeof value.minutes === 'number' &&
    value.minutes > 0 &&
    typeof value.met === 'number' &&
    typeof value.calories === 'number' &&
    (value.sets === undefined || typeof value.sets === 'number') &&
    (value.reps === undefined || typeof value.reps === 'number')
  );
}

export function loadWorkouts(): WorkoutEntry[] {
  const raw = readJson(KEYS.workouts);
  if (!Array.isArray(raw)) return [];
  return raw.filter(isWorkoutEntry);
}

export function saveWorkouts(workouts: WorkoutEntry[]): void {
  writeJson(KEYS.workouts, workouts.slice(-500));
}

export function hasAcceptedDisclaimer(): boolean {
  try {
    return window.localStorage.getItem(KEYS.disclaimer) === 'accepted';
  } catch {
    return false;
  }
}

export function acceptDisclaimer(): void {
  try {
    window.localStorage.setItem(KEYS.disclaimer, 'accepted');
  } catch {
    // 無法寫入時仍允許本次瀏覽，下次開啟會再次提醒。
  }
}

export function clearAllData(): void {
  try {
    [...Object.values(KEYS), ...Object.values(LEGACY_KEYS)].forEach((key) =>
      window.localStorage.removeItem(key),
    );
  } catch {
    // 忽略無法清除的情況。
  }
}
