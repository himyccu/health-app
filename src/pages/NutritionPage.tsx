import { useState } from 'react';
import {
  Apple,
  Beef,
  Database,
  Flame,
  Milk,
  Nut,
  Salad,
  ShieldCheck,
  Trash2,
  UtensilsCrossed,
  Wheat,
  type LucideIcon,
} from 'lucide-react';
import type { FoodGroupKey, MealEntry, MealType, Profile, TfdaFood } from '../types';
import {
  FOOD_GROUPS,
  createFoodMealEntry,
  getNutritionTargets,
  sumMeals,
} from '../lib/nutrition';
import { TFDA_META } from '../lib/tfdaMeta';
import { dateKey, loadMeals, saveMeals } from '../lib/storage';
import { isProfileComplete } from '../lib/health';
import { PageHeader } from '../components/PageHeader';
import { SectionHeading } from '../components/SectionHeading';
import { FoodSearchCard } from '../components/FoodSearchCard';

interface NutritionPageProps {
  profile: Profile;
  onNotify: (message: string) => void;
  onGoHome: () => void;
}

const GROUP_ICONS: Record<FoodGroupKey, LucideIcon> = {
  grains: Wheat,
  protein: Beef,
  dairy: Milk,
  vegetables: Salad,
  fruits: Apple,
  fats: Nut,
};

const MEAL_LABELS: Record<MealType, string> = {
  breakfast: '早餐',
  lunch: '午餐',
  dinner: '晚餐',
  snack: '點心',
};

function formatAmount(value: number, digits = 1): string {
  return String(Number(value.toFixed(digits)));
}

export function NutritionPage({ profile, onNotify, onGoHome }: NutritionPageProps) {
  const [meals, setMeals] = useState<MealEntry[]>(() => loadMeals());

  const today = dateKey();
  const targets = getNutritionTargets(profile);
  const todayMeals = meals
    .filter((meal) => meal.date === today)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const totals = sumMeals(todayMeals);

  const caloriePercent =
    targets.calories > 0 ? Math.round((totals.calories / targets.calories) * 100) : 0;
  const remainingCalories = targets.calories - totals.calories;
  const profileReady = isProfileComplete(profile);

  const handleAddFood = (food: TfdaFood, grams: number, mealType: MealType) => {
    const entry = createFoodMealEntry(food, grams, mealType, today);
    const next = [...meals, entry];
    setMeals(next);
    saveMeals(next);
    onNotify(`已將「${food.name} ${grams}g」加入${MEAL_LABELS[mealType]}`);
  };

  const handleDeleteMeal = (id: string) => {
    const next = meals.filter((meal) => meal.id !== id);
    setMeals(next);
    saveMeals(next);
    onNotify('已刪除餐點紀錄');
  };

  return (
    <div>
      <PageHeader
        eyebrow="NUTRITION"
        title="飲食分析"
        description="用真實的台灣在地食材，看看今天吃進了什麼。"
        onHome={onGoHome}
      />

      <section className="relative overflow-hidden rounded-[28px] bg-plum-900 p-5 text-white shadow-lg shadow-plum-900/20">
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-plum-800/80" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 h-32 w-32 rounded-full bg-plum-800/50" />

        <div className="relative flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-plum-200">今日攝取熱量</p>
            <p className="mt-1 flex items-baseline gap-1.5">
              <span className="text-4xl font-black leading-none tabular-nums">
                {totals.calories.toLocaleString()}
              </span>
              <span className="text-sm font-bold text-plum-200">
                {profileReady ? `/ ${targets.calories.toLocaleString()} kcal` : 'kcal'}
              </span>
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 px-3 py-2 text-right">
            <p className="text-[10px] font-bold text-plum-200">達成率</p>
            <p className="text-xl font-black leading-tight tabular-nums text-amber-200">
              {profileReady ? `${caloriePercent}%` : '—'}
            </p>
          </div>
        </div>

        <div className="relative mt-4 h-2.5 overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full rounded-full bg-amber-300 transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(0, caloriePercent))}%` }}
          />
        </div>
        <p className="relative mt-2 text-xs font-medium text-plum-100">
          {!profileReady
            ? '尚未設定生理數據，完成設定後會自動算出專屬的熱量建議。'
            : remainingCalories >= 0
              ? `還可攝取約 ${remainingCalories.toLocaleString()} kcal`
              : `已超過每日估算 ${Math.abs(remainingCalories).toLocaleString()} kcal`}
        </p>

        <div className="relative mt-5 grid gap-3 border-t border-white/10 pt-4">
          <MacroBar
            label="蛋白質"
            value={totals.protein}
            target={targets.protein}
            unit="g"
            barClass="bg-sky-300"
          />
          <MacroBar
            label="碳水化合物"
            value={totals.carbs}
            target={targets.carbs}
            unit="g"
            barClass="bg-emerald-300"
          />
          <MacroBar
            label="脂肪"
            value={totals.fat}
            target={targets.fat}
            unit="g"
            barClass="bg-amber-300"
          />
        </div>

        <div className="relative mt-4 grid grid-cols-3 gap-2 border-t border-white/10 pt-4">
          <MiniStat label="膳食纖維" value={totals.fiber} target={targets.fiber} unit="g" />
          <MiniStat label="糖" value={totals.sugar} unit="g" />
          <MiniStat
            label="鈉"
            value={totals.sodium}
            target={targets.sodium}
            unit="mg"
            warning={totals.sodium > targets.sodium}
          />
        </div>
      </section>

      <FoodSearchCard onAdd={handleAddFood} />

      <section className="mt-4 rounded-[26px] border border-plum-100 bg-white p-4 shadow-sm shadow-plum-900/5">
        <div className="flex items-start justify-between gap-2">
          <SectionHeading
            icon={UtensilsCrossed}
            title="今日餐點紀錄"
            subtitle="新增或刪除後會立即更新"
          />
          <span className="shrink-0 rounded-full bg-plum-50 px-2.5 py-1 text-[10px] font-black text-plum-800">
            {todayMeals.length} 筆
          </span>
        </div>

        {todayMeals.length === 0 ? (
          <div className="mt-3 flex flex-col items-center rounded-2xl border border-dashed border-plum-200 bg-plum-50/50 px-4 py-6 text-center">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-white text-plum-300 shadow-sm">
              <UtensilsCrossed className="h-5 w-5" />
            </div>
            <p className="mt-2.5 text-sm font-black text-slate-600">今天還沒有飲食紀錄</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
              搜尋上方食材，選好份量就能加入今天的第一筆紀錄。
            </p>
          </div>
        ) : (
          <div className="mt-3 space-y-2">
            {todayMeals.map((meal) => (
              <div
                key={meal.id}
                className="rounded-2xl border border-slate-100 bg-plum-50/40 p-2.5"
              >
                <div className="flex items-center gap-2.5">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-plum-900 shadow-sm">
                    <UtensilsCrossed className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-sm font-black text-slate-900">{meal.name}</p>
                      {meal.mealType && (
                        <span className="shrink-0 rounded-full bg-plum-100 px-1.5 py-0.5 text-[9px] font-black text-plum-700">
                          {MEAL_LABELS[meal.mealType]}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-[11px] font-medium text-slate-400">
                      {meal.grams ? `${meal.grams} g · ` : ''}
                      {new Date(meal.createdAt).toLocaleTimeString('zh-TW', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-black leading-none text-plum-900 tabular-nums">
                      {meal.calories}
                    </p>
                    <p className="mt-0.5 text-[10px] font-bold text-slate-400">kcal</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteMeal(meal.id)}
                    aria-label={`刪除 ${meal.name}`}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-300 transition hover:bg-rose-50 hover:text-rose-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-2 flex flex-wrap gap-1 pl-[50px]">
                  <span className="rounded-md bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-500">
                    蛋白質 {formatAmount(meal.protein)}g
                  </span>
                  <span className="rounded-md bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-500">
                    碳水 {formatAmount(meal.carbs)}g
                  </span>
                  <span className="rounded-md bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-500">
                    脂肪 {formatAmount(meal.fat)}g
                  </span>
                  {meal.source === 'tfda' && (
                    <>
                      <span className="rounded-md bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-500">
                        纖維 {formatAmount(meal.fiber ?? 0)}g
                      </span>
                      <span className="rounded-md bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-500">
                        糖 {formatAmount(meal.sugar ?? 0)}g
                      </span>
                      <span className="rounded-md bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-500">
                        鈉 {Math.round(meal.sodium ?? 0)}mg
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {todayMeals.length > 0 && (
          <div className="mt-3 flex items-center justify-between rounded-2xl bg-plum-900 px-4 py-3 text-white">
            <span className="flex items-center gap-1.5 text-xs font-bold text-plum-100">
              <Flame className="h-4 w-4 text-amber-300" />
              今日累計
            </span>
            <div className="text-right">
              <p className="text-sm font-black tabular-nums">
                {totals.calories.toLocaleString()}
                <span className="ml-1 text-[10px] font-bold text-plum-200">kcal</span>
              </p>
              <p className="mt-0.5 text-[10px] font-bold text-plum-200">
                纖維 {formatAmount(totals.fiber)}g · 鈉 {Math.round(totals.sodium)}mg
              </p>
            </div>
          </div>
        )}
      </section>

      <section className="mt-4 rounded-[26px] border border-plum-100 bg-white p-4 shadow-sm shadow-plum-900/5">
        <div className="flex items-start justify-between gap-2">
          <SectionHeading
            icon={Salad}
            title="每日飲食指南六大類"
            subtitle={profileReady ? '依你的每日熱量需求估算' : '以 1,800 kcal 為基準'}
          />
          <span className="shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-black text-amber-800">
            參考
          </span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          {FOOD_GROUPS.map((group) => {
            const Icon = GROUP_ICONS[group.key];
            return (
              <div
                key={group.key}
                className="rounded-2xl border border-plum-100 bg-plum-50/50 p-3"
              >
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white text-plum-900 shadow-sm">
                    <Icon className="h-4 w-4" strokeWidth={2.4} />
                  </span>
                  <p className="text-xs font-black text-slate-800">{group.name}</p>
                </div>
                <p className="mt-2 text-[11px] leading-snug text-slate-400">{group.description}</p>
                <p className="mt-1.5 flex items-baseline gap-1">
                  <span className="text-base font-black leading-none text-plum-900 tabular-nums">
                    {targets.groups[group.key]}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">{group.unit}</span>
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-3 rounded-2xl bg-plum-50/70 px-3 py-2.5">
          <p className="text-[11px] font-semibold leading-relaxed text-plum-900">
            「碗」與「份」是不同單位，不能直接比大小。
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
            1 碗穀物約 4 份（約 280 kcal）；1 份蔬菜約 100 公克（約 25 kcal）；1
            份水果約 100 公克（約 60 kcal）。所以 3 碗穀物的熱量會高於 3 份蔬菜。
          </p>
        </div>

        <p className="mt-2.5 text-[11px] leading-relaxed text-slate-400">
          依《每日飲食指南手冊》（115 年版，2026）1,800 kcal
          基準估算；完成基本資料後，會依你的每日熱量需求調整。此卡為建議量，不是本次實際攝取份數。
        </p>
      </section>

      <div className="mt-4 rounded-2xl border border-plum-100 bg-plum-50/70 px-3.5 py-3">
        <p className="flex items-start gap-1.5 text-[10px] leading-relaxed text-slate-500">
          <Database className="mt-0.5 h-3.5 w-3.5 shrink-0 text-plum-600" />
          <span>
            營養資料：{TFDA_META.provider}《{TFDA_META.title}》（{TFDA_META.license}）。
            {TFDA_META.modifiedDate ? `最後更新 ${TFDA_META.modifiedDate}。` : ''}
            部分食材的特定營養素未檢驗，該欄位以 0 計入每日總和。
          </span>
        </p>
        <p className="mt-2 flex items-start gap-1.5 text-[10px] leading-relaxed text-slate-500">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
          <span>
            所有飲食紀錄只儲存在這台裝置的瀏覽器，不會上傳伺服器；重新整理後仍會保留。
          </span>
        </p>
      </div>

      <p className="mt-4 pb-2 text-center text-[11px] font-medium leading-relaxed text-slate-400">
        營養數值僅供參考，不能取代專業醫療建議。
      </p>
    </div>
  );
}

interface MacroBarProps {
  label: string;
  value: number;
  target: number;
  unit: string;
  barClass: string;
}

function MacroBar({ label, value, target, unit, barClass }: MacroBarProps) {
  const percent = target > 0 ? Math.min(100, (value / target) * 100) : 0;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2 text-xs">
        <span className="font-bold text-plum-100">{label}</span>
        <span className="font-black text-white tabular-nums">
          {Math.round(value)}
          <span className="ml-0.5 font-bold text-plum-300">
            {target > 0 ? `/ ${target}${unit}` : unit}
          </span>
        </span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/15">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barClass}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

interface MiniStatProps {
  label: string;
  value: number;
  unit: string;
  target?: number;
  warning?: boolean;
}

function MiniStat({ label, value, unit, target, warning = false }: MiniStatProps) {
  return (
    <div className={`rounded-xl p-2 ${warning ? 'bg-rose-400/15' : 'bg-white/10'}`}>
      <p className="text-[9px] font-bold text-plum-200">{label}</p>
      <p
        className={`mt-0.5 flex items-baseline gap-0.5 text-sm font-black tabular-nums ${
          warning ? 'text-rose-200' : 'text-white'
        }`}
      >
        {formatAmount(value, unit === 'mg' ? 0 : 1)}
        <span className="text-[9px] font-bold text-plum-300">
          {target !== undefined ? `/ ${target} ${unit}` : unit}
        </span>
      </p>
      {warning && <p className="mt-0.5 text-[8px] font-black text-rose-200">已超過建議上限</p>}
    </div>
  );
}
