import { useDeferredValue, useMemo, useState } from 'react';
import {
  ArrowUpRight,
  ChevronDown,
  Database,
  Search,
  ShieldCheck,
  X,
  Zap,
} from 'lucide-react';
import type { MealType, TfdaCategory, TfdaFood } from '../types';
import { TFDA_CATEGORIES, TFDA_FOODS, getFoodById } from '../lib/foodData';
import { TFDA_META } from '../lib/tfdaMeta';
import { searchFoods } from '../lib/foodSearch';
import { SectionHeading } from './SectionHeading';
import { FoodPortionPanel } from './FoodPortionPanel';

interface FoodSearchCardProps {
  onAdd: (food: TfdaFood, grams: number, mealType: MealType) => void;
}

function defaultMealType(): MealType {
  const hour = new Date().getHours();
  if (hour < 11) return 'breakfast';
  if (hour < 15) return 'lunch';
  if (hour < 21) return 'dinner';
  return 'snack';
}

function formatCalories(value: number | null): string {
  return value === null ? '—' : String(Math.round(value));
}

function formatNutrient(value: number | null): string {
  return value === null ? '—' : String(Number(value.toFixed(1)));
}

export function FoodSearchCard({ onAdd }: FoodSearchCardProps) {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const [category, setCategory] = useState<TfdaCategory | 'all'>('all');
  const [limit, setLimit] = useState(20);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [gramsInput, setGramsInput] = useState('100');
  const [mealType, setMealType] = useState<MealType>(defaultMealType);

  const result = useMemo(
    () => searchFoods(TFDA_FOODS, { query: deferredQuery, category, limit }),
    [deferredQuery, category, limit],
  );

  const selectedFood = selectedId ? getFoodById(selectedId) : undefined;

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setLimit(20);
    setSelectedId(null);
  };

  const handleCategoryChange = (value: TfdaCategory | 'all') => {
    setCategory(value);
    setLimit(20);
    setSelectedId(null);
  };

  const toggleFood = (food: TfdaFood) => {
    if (selectedId === food.id) {
      setSelectedId(null);
      return;
    }
    setSelectedId(food.id);
    setGramsInput('100');
    setMealType(defaultMealType());
  };

  const handleAdd = () => {
    if (!selectedFood) return;
    const grams = Number(gramsInput);
    if (!Number.isFinite(grams) || grams <= 0 || grams > 2000) return;
    onAdd(selectedFood, grams, mealType);
    setSelectedId(null);
    setGramsInput('100');
  };

  const resultLabel =
    deferredQuery.trim().length > 0
      ? `找到 ${result.total.toLocaleString()} 筆`
      : category === 'all'
        ? '常用食材'
        : `${category}食材`;

  return (
    <section className="mt-4 rounded-[26px] border border-plum-100 bg-white p-4 shadow-sm shadow-plum-900/5">
      <div className="flex items-start justify-between gap-2">
        <SectionHeading
          icon={Search}
          title="食物營養搜尋"
          subtitle={`TFDA 開放資料 · ${TFDA_META.foodCount.toLocaleString()} 種`}
        />
        <span className="flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-black text-emerald-700">
          <Zap className="h-3 w-3" />
          即時查詢
        </span>
      </div>

      <div className="relative mt-3">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-plum-500" />
        <label className="sr-only" htmlFor="food-search">
          搜尋食物
        </label>
        <input
          id="food-search"
          type="search"
          value={query}
          onChange={(event) => handleQueryChange(event.target.value)}
          placeholder="搜尋食物，例如：白飯、雞蛋、鮭魚"
          autoComplete="off"
          className="h-12 w-full rounded-2xl border border-plum-200 bg-plum-50/60 pl-10 pr-10 text-base font-semibold text-slate-900 outline-none transition placeholder:text-sm placeholder:font-medium placeholder:text-slate-400 focus:border-plum-700 focus:bg-white"
        />
        {query.length > 0 && (
          <button
            type="button"
            onClick={() => handleQueryChange('')}
            aria-label="清除搜尋關鍵字"
            className="absolute right-2.5 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full bg-white text-slate-400 shadow-sm transition hover:text-plum-800"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="no-scrollbar -mx-1 mt-2.5 flex gap-1.5 overflow-x-auto px-1 pb-1">
        <CategoryChip
          active={category === 'all'}
          onClick={() => handleCategoryChange('all')}
          label="全部"
        />
        {TFDA_CATEGORIES.map((item) => (
          <CategoryChip
            key={item}
            active={category === item}
            onClick={() => handleCategoryChange(item)}
            label={item.replace('加工調理食品及其他類', '加工食品')}
          />
        ))}
      </div>

      <div className="mt-2 flex items-center justify-between gap-2">
        <p className="text-[11px] font-bold text-slate-400">{resultLabel}</p>
        {result.total > 0 && (
          <p className="text-[10px] font-medium text-slate-400">
            {deferredQuery.trim().length === 0 && category === 'all'
              ? '點選食材查看份量'
              : `共 ${result.total.toLocaleString()} 種`}
          </p>
        )}
      </div>

      {result.items.length > 0 ? (
        <div className="mt-2 space-y-2">
          {result.items.map((food) => {
            const selected = selectedId === food.id;
            return (
              <div
                key={food.id}
                className={`overflow-hidden rounded-2xl border bg-white transition ${
                  selected
                    ? 'border-plum-300 shadow-md shadow-plum-900/5'
                    : 'border-slate-100'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFood(food)}
                  aria-expanded={selected}
                  className="flex w-full items-center gap-2.5 p-3 text-left transition hover:bg-plum-50/40 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-plum-700"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-sm font-black text-slate-900">{food.name}</p>
                      {food.state && (
                        <span className="shrink-0 rounded-full bg-amber-50 px-1.5 py-0.5 text-[9px] font-black text-amber-700">
                          {food.state}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-[11px] font-medium text-slate-400">
                      {food.category} · 每 100g
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-black leading-none text-plum-900 tabular-nums">
                      {formatCalories(food.nutrients.calories)}
                      <span className="ml-0.5 text-[9px] font-bold text-slate-400">kcal</span>
                    </p>
                    <p className="mt-1 text-[10px] font-medium text-slate-400">
                      蛋白質 {formatNutrient(food.nutrients.protein)}g
                    </p>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 transition ${
                      selected ? 'rotate-180 text-plum-700' : 'text-slate-300'
                    }`}
                  />
                </button>

                {selected && (
                  <FoodPortionPanel
                    food={food}
                    gramsInput={gramsInput}
                    onGramsChange={setGramsInput}
                    mealType={mealType}
                    onMealTypeChange={setMealType}
                    onAdd={handleAdd}
                  />
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-3 rounded-2xl border border-dashed border-plum-200 bg-plum-50/50 px-4 py-6 text-center">
          <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-white text-plum-300 shadow-sm">
            <Search className="h-5 w-5" />
          </div>
          <p className="mt-2.5 text-sm font-black text-slate-600">找不到符合的食物</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
            試試更短的關鍵字，或切換到「全部」分類。
          </p>
          {category !== 'all' && (
            <button
              type="button"
              onClick={() => handleCategoryChange('all')}
              className="mt-2.5 rounded-full border border-plum-200 bg-white px-3 py-1.5 text-[11px] font-bold text-plum-800 transition hover:bg-plum-50"
            >
              清除分類篩選
            </button>
          )}
        </div>
      )}

      {result.hasMore && (
        <button
          type="button"
          onClick={() => setLimit((current) => current + 20)}
          className="mt-2.5 h-10 w-full rounded-xl border border-plum-200 bg-plum-50/60 text-xs font-black text-plum-800 transition hover:bg-plum-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum-900"
        >
          顯示更多
        </button>
      )}

      <div className="mt-3 rounded-xl border border-plum-100 bg-plum-50/60 px-3 py-2.5">
        <p className="flex items-start gap-1.5 text-[10px] leading-relaxed text-slate-500">
          <Database className="mt-0.5 h-3.5 w-3.5 shrink-0 text-plum-600" />
          <span>
            資料來源：{TFDA_META.provider}《{TFDA_META.title}》（{TFDA_META.license}）。數值以每
            100g 可食量計算
            {TFDA_META.modifiedDate ? `，最後更新 ${TFDA_META.modifiedDate}` : ''}。
            <a
              href={TFDA_META.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="ml-0.5 inline-flex items-center gap-0.5 font-bold text-plum-700 underline underline-offset-2"
            >
              原始資料
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </span>
        </p>
      </div>

      <p className="mt-2 flex items-center justify-center gap-1 text-[10px] font-medium text-slate-400">
        <ShieldCheck className="h-3 w-3 text-emerald-600" />
        搜尋、計算與紀錄都在本機完成，不會上傳個人資料。
      </p>
    </section>
  );
}

interface CategoryChipProps {
  active: boolean;
  label: string;
  onClick: () => void;
}

function CategoryChip({ active, label, onClick }: CategoryChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-black transition ${
        active
          ? 'bg-plum-900 text-white shadow-sm shadow-plum-900/20'
          : 'border border-plum-200 bg-white text-slate-500 hover:bg-plum-50 hover:text-plum-800'
      }`}
    >
      {label}
    </button>
  );
}
