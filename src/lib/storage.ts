import type {
  ActivityLevel,
  FoodGroups,
  Gender,
  MealEntry,
  Profile,
  StepsData,
} from '../types';

const KEYS = {
  profile: 'health_app_profile_v1',
  steps: 'health_app_steps_v1',
  meals: 'health_app_meals_v1',
  disclaimer: 'health_app_disclaimer_v1',
} as const;

// 舊版原型使用的鍵值，讀取時保留相容性，清除資料時一併移除。
const LEGACY_KEYS = {
  profile: 'health_app_profile',
  disclaimer: 'health_app_disclaimer_agreed',
} as const;

export const DEFAULT_PROFILE: Profile = {
  gender: 'female',
  age: 30,
  height: 160,
  weight: 55,
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

function dateKeyDaysAgo(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return dateKey(date);
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

function clampNumber(value: unknown, min: number, max: number, fallback: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

export function loadProfile(): Profile {
  const raw = readJson(KEYS.profile) ?? readJson(LEGACY_KEYS.profile);
  if (!isRecord(raw)) return { ...DEFAULT_PROFILE };

  return {
    gender: isGender(raw.gender) ? raw.gender : DEFAULT_PROFILE.gender,
    age: Math.round(clampNumber(raw.age, 1, 120, DEFAULT_PROFILE.age)),
    height: Math.round(clampNumber(raw.height, 80, 250, DEFAULT_PROFILE.height)),
    weight: clampNumber(raw.weight, 20, 300, DEFAULT_PROFILE.weight),
    activity: isActivityLevel(raw.activity) ? raw.activity : DEFAULT_PROFILE.activity,
  };
}

export function saveProfile(profile: Profile): void {
  writeJson(KEYS.profile, profile);
}

const DEMO_STEP_VALUES = [6210, 9120, 7240, 10480, 8350, 5920, 8452];

function createDemoSteps(): StepsData {
  const days: Record<string, number> = {};
  DEMO_STEP_VALUES.forEach((steps, index) => {
    days[dateKeyDaysAgo(DEMO_STEP_VALUES.length - 1 - index)] = steps;
  });
  return { goal: 10000, days };
}

export function loadSteps(): StepsData {
  const raw = readJson(KEYS.steps);
  if (!isRecord(raw) || !isRecord(raw.days)) return createDemoSteps();

  const days: Record<string, number> = {};
  Object.entries(raw.days).forEach(([key, value]) => {
    if (typeof value === 'number' && Number.isFinite(value) && value >= 0) {
      days[key] = Math.round(value);
    }
  });

  return {
    goal: Math.round(clampNumber(raw.goal, 1000, 50000, 10000)),
    days,
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
