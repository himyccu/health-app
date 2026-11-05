import { AlertCircle, Plus, ShieldCheck } from 'lucide-react';
import type { MealType, TfdaFood } from '../types';

const MEAL_TYPE_OPTIONS: Array<{ value: MealType; label: string }> = [
  { value: 'breakfast', label: '早餐' },
  { value: 'lunch', label: '午餐' },
  { value: 'dinner', label: '晚餐' },
  { value: 'snack', label: '點心' },
];

const QUICK_GRAMS = [50, 100, 150, 200];

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function scale(value: number | null, grams: number): number | null {
  return value === null ? null : round1((value * grams) / 100);
}

function format(value: number | null, digits = 1): string {
  if (value === null) return '—';
  return String(Number(value.toFixed(digits)));
}

interface FoodPortionPanelProps {
  food: TfdaFood;
  gramsInput: string;
  onGramsChange: (value: string) => void;
  mealType: MealType;
  onMealTypeChange: (value: MealType) => void;
  onAdd: () => void;
}

export function FoodPortionPanel({
  food,
  gramsInput,
  onGramsChange,
  mealType,
  onMealTypeChange,
  onAdd,
}: FoodPortionPanelProps) {
  const grams = Number(gramsInput);
  const isValid = Number.isFinite(grams) && grams > 0 && grams <= 2000;
  const safeGrams = isValid ? grams : 100;
  const nutrients = food.nutrients;

  const metrics = [
    { label: '熱量', value: scale(nutrients.calories, safeGrams), unit: 'kcal', digits: 0 },
    { label: '蛋白質', value: scale(nutrients.protein, safeGrams), unit: 'g', digits: 1 },
    { label: '碳水', value: scale(nutrients.carbs, safeGrams), unit: 'g', digits: 1 },
    { label: '脂肪', value: scale(nutrients.fat, safeGrams), unit: 'g', digits: 1 },
    { label: '膳食纖維', value: scale(nutrients.fiber, safeGrams), unit: 'g', digits: 1 },
    { label: '糖', value: scale(nutrients.sugar, safeGrams), unit: 'g', digits: 1 },
    { label: '鈉', value: scale(nutrients.sodium, safeGrams), unit: 'mg', digits: 0 },
  ];

  return (
    <div className="animate-fade-up border-t border-plum-100 bg-plum-50/60 p-3.5">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-[11px] font-black text-plum-900">份量與營養計算</p>
        <p className="text-[10px] font-medium text-slate-400">
          每 100g {format(nutrients.calories, 0)} kcal
        </p>
      </div>

      <div className="mt-2.5 flex items-end gap-2">
        <label className="min-w-0 flex-1" htmlFor={`grams-${food.id}`}>
          <span className="mb-1 block text-[11px] font-bold text-slate-500">食用份量</span>
          <div
            className={`flex items-center rounded-xl border bg-white transition ${
              isValid ? 'border-plum-200 focus-within:border-plum-700' : 'border-rose-300'
            }`}
          >
            <input
              id={`grams-${food.id}`}
              type="number"
              inputMode="decimal"
              min={1}
              max={2000}
              step={10}
              value={gramsInput}
              onChange={(event) => onGramsChange(event.target.value)}
              className="h-11 w-full min-w-0 bg-transparent px-3 text-base font-black text-slate-900 outline-none"
              aria-describedby={isValid ? undefined : `grams-error-${food.id}`}
            />
            <span className="pr-3 text-xs font-bold text-slate-400">g</span>
          </div>
        </label>
        <div className="grid shrink-0 grid-cols-2 gap-1.5">
          {QUICK_GRAMS.map((quick) => (
            <button
              key={quick}
              type="button"
              onClick={() => onGramsChange(String(quick))}
              className={`h-7 rounded-lg px-2.5 text-[11px] font-black transition ${
                grams === quick
                  ? 'bg-plum-900 text-white'
                  : 'border border-plum-200 bg-white text-plum-800 hover:bg-plum-100'
              }`}
            >
              {quick}g
            </button>
          ))}
        </div>
      </div>

      {!isValid && (
        <p
          id={`grams-error-${food.id}`}
          role="alert"
          className="mt-1.5 flex items-center gap-1 text-[11px] font-bold text-rose-600"
        >
          <AlertCircle className="h-3 w-3" />
          請輸入 1 至 2,000 公克之間的份量
        </p>
      )}

      <div className="mt-3 grid grid-cols-3 gap-1.5">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-xl bg-white px-2 py-2 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400">{metric.label}</p>
            <p className="mt-0.5 flex items-baseline gap-0.5 text-sm font-black leading-none text-slate-900 tabular-nums">
              {format(metric.value, metric.digits)}
              <span className="text-[9px] font-bold text-slate-400">{metric.unit}</span>
            </p>
          </div>
        ))}
      </div>

      <div className="mt-3">
        <p className="text-[11px] font-bold text-slate-500">加入哪一餐？</p>
        <div className="mt-1.5 grid grid-cols-4 gap-1.5" role="group" aria-label="選擇餐別">
          {MEAL_TYPE_OPTIONS.map((option) => {
            const selected = mealType === option.value;
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={selected}
                onClick={() => onMealTypeChange(option.value)}
                className={`h-8 rounded-lg text-[11px] font-black transition ${
                  selected
                    ? 'bg-plum-900 text-white shadow-sm shadow-plum-900/20'
                    : 'border border-plum-200 bg-white text-slate-500 hover:bg-plum-100'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={onAdd}
        disabled={!isValid}
        className="mt-3 flex h-11 w-full items-center justify-center gap-1.5 rounded-xl bg-plum-900 text-sm font-black text-white shadow-md shadow-plum-900/20 transition hover:bg-plum-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum-900 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Plus className="h-4 w-4" strokeWidth={2.8} />
        加入今日紀錄
      </button>

      <p className="mt-2 flex items-center justify-center gap-1 text-[10px] font-medium text-slate-400">
        <ShieldCheck className="h-3 w-3 text-emerald-600" />
        計算與紀錄只留在這台裝置
      </p>
    </div>
  );
}
