import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import {
  Apple,
  Beef,
  Camera,
  Flame,
  ImagePlus,
  LoaderCircle,
  Milk,
  Nut,
  Plus,
  Salad,
  Sparkles,
  Trash2,
  Utensils,
  UtensilsCrossed,
  Wheat,
  type LucideIcon,
} from 'lucide-react';
import type { FoodGroupKey, MealEntry, Profile } from '../types';
import {
  FOOD_GROUPS,
  MEAL_PRESETS,
  createMealEntry,
  getNutritionTargets,
  sumMeals,
  type MealPreset,
} from '../lib/nutrition';
import { dateKey, loadMeals, saveMeals } from '../lib/storage';
import { PageHeader } from '../components/PageHeader';
import { SectionHeading } from '../components/SectionHeading';

interface NutritionPageProps {
  profile: Profile;
  onNotify: (message: string) => void;
}

const GROUP_ICONS: Record<FoodGroupKey, LucideIcon> = {
  grains: Wheat,
  protein: Beef,
  dairy: Milk,
  vegetables: Salad,
  fruits: Apple,
  fats: Nut,
};

export function NutritionPage({ profile, onNotify }: NutritionPageProps) {
  const [meals, setMeals] = useState<MealEntry[]>(() => loadMeals());
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<MealPreset | null>(null);
  const timerRef = useRef<number | null>(null);

  const today = dateKey();
  const targets = getNutritionTargets(profile);
  const todayMeals = meals
    .filter((meal) => meal.date === today)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const totals = sumMeals(todayMeals);

  const caloriePercent =
    targets.calories > 0 ? Math.round((totals.calories / targets.calories) * 100) : 0;
  const remainingCalories = targets.calories - totals.calories;

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  const runAnalysis = (preset: MealPreset) => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    setAnalyzing(true);
    setAnalysis(null);
    timerRef.current = window.setTimeout(() => {
      setAnalysis(preset);
      setAnalyzing(false);
      timerRef.current = null;
    }, 1300);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      onNotify('請選擇 JPG、PNG 等圖片檔案');
      return;
    }

    setImageUrl(URL.createObjectURL(file));
    const nameScore = Array.from(file.name).reduce((sum, char) => sum + char.charCodeAt(0), 0);
    runAnalysis(MEAL_PRESETS[nameScore % MEAL_PRESETS.length]);
  };

  const handleSample = (preset: MealPreset) => {
    setImageUrl(null);
    runAnalysis(preset);
  };

  const resetAnalysis = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setAnalyzing(false);
    setAnalysis(null);
    setImageUrl(null);
  };

  const handleAddMeal = () => {
    if (!analysis) return;
    const entry = createMealEntry(analysis, today);
    const next = [...meals, entry];
    setMeals(next);
    saveMeals(next);
    onNotify(`已將「${analysis.name}」加入今日紀錄`);
    setAnalysis(null);
    setImageUrl(null);
    setAnalyzing(false);
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
        description="看看今天吃進了什麼，讓每一餐更均衡。"
        icon={Utensils}
      />

      <section className="relative overflow-hidden rounded-[28px] bg-blue-900 p-5 text-white shadow-lg shadow-blue-900/20">
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-blue-800/80" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 h-32 w-32 rounded-full bg-blue-800/50" />

        <div className="relative flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-blue-200">今日攝取熱量</p>
            <p className="mt-1 flex items-baseline gap-1.5">
              <span className="text-4xl font-black leading-none tabular-nums">
                {totals.calories.toLocaleString()}
              </span>
              <span className="text-sm font-bold text-blue-200">
                / {targets.calories.toLocaleString()} kcal
              </span>
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 px-3 py-2 text-right">
            <p className="text-[10px] font-bold text-blue-200">達成率</p>
            <p className="text-xl font-black leading-tight tabular-nums text-amber-200">
              {caloriePercent}%
            </p>
          </div>
        </div>

        <div className="relative mt-4 h-2.5 overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full rounded-full bg-amber-300 transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(0, caloriePercent))}%` }}
          />
        </div>
        <p className="relative mt-2 text-xs font-medium text-blue-100">
          {remainingCalories >= 0
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
      </section>

      <section className="mt-4 rounded-[26px] border border-amber-100 bg-white p-4 shadow-sm shadow-amber-900/5">
        <div className="flex items-start justify-between gap-2">
          <SectionHeading
            icon={Camera}
            title="餐點影像辨識"
            subtitle="拍照或上傳，快速估算營養成分"
          />
          <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-black text-amber-800">
            模擬功能
          </span>
        </div>

        <div className="mt-3">
          {imageUrl ? (
            <div className="relative overflow-hidden rounded-2xl">
              <img src={imageUrl} alt="待辨識的餐點預覽" className="h-44 w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent p-3">
                <span className="text-xs font-bold text-white">餐點預覽</span>
                <button
                  type="button"
                  onClick={resetAnalysis}
                  className="flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur transition hover:bg-white/30"
                >
                  <Trash2 className="h-3 w-3" />
                  移除
                </button>
              </div>
            </div>
          ) : (
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/60 px-4 py-6 text-center transition hover:border-blue-300 hover:bg-amber-50 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-blue-900">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="sr-only"
                aria-label="上傳餐點照片"
              />
              <div className="grid h-14 w-14 place-items-center rounded-full bg-blue-900 text-amber-200 shadow-lg shadow-blue-900/20">
                <Camera className="h-6 w-6" />
              </div>
              <p className="mt-3 text-base font-black text-slate-900">拍照 / 上傳餐點照片</p>
              <p className="mt-1 text-xs text-slate-500">支援 JPG、PNG；圖片僅在本機預覽</p>
            </label>
          )}
        </div>

        {analyzing && (
          <div className="mt-3 flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-3.5">
            <LoaderCircle className="h-6 w-6 animate-spin text-blue-900" />
            <div>
              <p className="text-sm font-black text-blue-900">正在辨識餐點內容…</p>
              <p className="text-[11px] text-blue-700/70">分析蛋白質、碳水、脂肪與六大類份量</p>
            </div>
          </div>
        )}

        {!analyzing && analysis && (
          <div className="animate-fade-up mt-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-3.5">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-black text-blue-700 shadow-sm">
                  示範辨識結果
                </span>
                <p className="mt-1.5 truncate text-lg font-black text-slate-900">{analysis.name}</p>
              </div>
              <p className="shrink-0 text-right">
                <span className="text-2xl font-black leading-none text-blue-900 tabular-nums">
                  {analysis.calories}
                </span>
                <span className="ml-1 text-[10px] font-bold text-slate-500">kcal</span>
              </p>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              {[
                { label: '蛋白質', value: analysis.protein },
                { label: '碳水', value: analysis.carbs },
                { label: '脂肪', value: analysis.fat },
              ].map((macro) => (
                <div key={macro.label} className="rounded-xl bg-white py-2 shadow-sm">
                  <p className="text-[11px] font-bold text-slate-400">{macro.label}</p>
                  <p className="mt-0.5 text-lg font-black leading-none text-slate-900 tabular-nums">
                    {macro.value}
                    <span className="ml-0.5 text-[10px] font-bold text-slate-400">g</span>
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-2.5 flex gap-1.5 rounded-xl bg-white/80 p-2.5 text-[11px] leading-relaxed text-slate-600">
              <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
              {analysis.tip}
            </p>

            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={handleAddMeal}
                className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-900 text-sm font-black text-white shadow-md shadow-blue-900/20 transition hover:bg-blue-800 active:scale-[0.98]"
              >
                <Plus className="h-4 w-4" strokeWidth={2.8} />
                加入今日紀錄
              </button>
              <button
                type="button"
                onClick={resetAnalysis}
                className="h-11 shrink-0 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
              >
                重新辨識
              </button>
            </div>
          </div>
        )}

        <p className="mt-3 text-[11px] font-bold text-slate-400">沒有照片？試試範例餐點</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {MEAL_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => handleSample(preset)}
              disabled={analyzing}
              className="rounded-full border border-amber-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {preset.name}
            </button>
          ))}
        </div>

        <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-[11px] leading-relaxed text-slate-500">
          影像辨識為示範功能，不會將照片上傳至伺服器，也不會進行真實 AI 分析。營養數值依一般份量估算，實際含量會因食材與烹調方式而異。
        </p>
      </section>

      <section className="mt-4 rounded-[26px] border border-amber-100 bg-white p-4 shadow-sm shadow-amber-900/5">
        <SectionHeading
          icon={ImagePlus}
          title="六大類食物攝取"
          subtitle="對照每日飲食指南，補足缺少的營養"
        />

        <div className="mt-3 grid grid-cols-2 gap-2">
          {FOOD_GROUPS.map((group) => {
            const Icon = GROUP_ICONS[group.key];
            const target = targets.groups[group.key];
            const consumed = Math.round(totals.groups[group.key] * 10) / 10;
            const percent = target > 0 ? Math.min(100, (consumed / target) * 100) : 0;

            return (
              <div key={group.key} className="rounded-2xl border border-amber-100 bg-amber-50/50 p-3">
                <div className="flex items-center justify-between">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-white text-blue-900 shadow-sm">
                    <Icon className="h-4 w-4" strokeWidth={2.4} />
                  </span>
                  <span className="text-[11px] font-black text-amber-700">
                    {Math.round(percent)}%
                  </span>
                </div>
                <p className="mt-2 text-xs font-black text-slate-800">{group.name}</p>
                <p className="mt-0.5 text-[11px] leading-snug text-slate-400">{group.description}</p>
                <p className="mt-1.5 flex items-baseline gap-1">
                  <span className="text-base font-black leading-none text-blue-900 tabular-nums">
                    {consumed}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">
                    / {target} {group.unit}
                  </span>
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white">
                  <div
                    className="h-full rounded-full bg-blue-900 transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
          建議量以《每日飲食指南手冊》1,800 kcal 基準，依您的 TDEE 比例估算；實際份量請依個人需求與營養師建議調整。
        </p>
      </section>

      <section className="mt-4 rounded-[26px] border border-amber-100 bg-white p-4 shadow-sm shadow-amber-900/5">
        <div className="flex items-start justify-between gap-2">
          <SectionHeading icon={UtensilsCrossed} title="今日餐點紀錄" subtitle="點擊垃圾桶可刪除紀錄" />
          <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-black text-blue-800">
            {todayMeals.length} 餐
          </span>
        </div>

        {todayMeals.length === 0 ? (
          <div className="mt-3 flex flex-col items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-6 text-center">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-white text-slate-300 shadow-sm">
              <UtensilsCrossed className="h-5 w-5" />
            </div>
            <p className="mt-2.5 text-sm font-black text-slate-600">今天還沒有飲食紀錄</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
              上傳照片或選擇範例餐點，開始記錄今天的第一餐。
            </p>
          </div>
        ) : (
          <div className="mt-3 space-y-2">
            {todayMeals.map((meal) => (
              <div
                key={meal.id}
                className="flex items-center gap-2.5 rounded-2xl border border-slate-100 bg-slate-50/70 p-2.5"
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-blue-900 shadow-sm">
                  <UtensilsCrossed className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black text-slate-900">{meal.name}</p>
                  <p className="mt-0.5 truncate text-[11px] font-medium text-slate-400">
                    {new Date(meal.createdAt).toLocaleTimeString('zh-TW', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    {' · '}蛋白質 {meal.protein}g · 碳水 {meal.carbs}g · 脂肪 {meal.fat}g
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-black leading-none text-blue-900 tabular-nums">
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
            ))}
          </div>
        )}

        {todayMeals.length > 0 && (
          <div className="mt-3 flex items-center justify-between rounded-2xl bg-blue-900 px-4 py-3 text-white">
            <span className="flex items-center gap-1.5 text-xs font-bold text-blue-100">
              <Flame className="h-4 w-4 text-amber-300" />
              今日累計
            </span>
            <span className="text-sm font-black tabular-nums">
              {totals.calories.toLocaleString()}
              <span className="ml-1 text-[10px] font-bold text-blue-200">kcal</span>
            </span>
          </div>
        )}
      </section>
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
        <span className="font-bold text-blue-100">{label}</span>
        <span className="font-black text-white tabular-nums">
          {Math.round(value)}
          <span className="font-bold text-blue-300">
            /{target}
            {unit}
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
