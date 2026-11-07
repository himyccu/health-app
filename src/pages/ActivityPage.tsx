import { useMemo, useState } from 'react';
import {
  Activity,
  CalendarRange,
  Flame,
  Footprints,
  MapPin,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  Timer,
} from 'lucide-react';
import type { Profile, StepsData, WorkoutEntry } from '../types';
import { getStepMetrics, isProfileComplete } from '../lib/health';
import { dateKey, loadSteps, loadWorkouts, saveSteps, saveWorkouts } from '../lib/storage';
import { PageHeader } from '../components/PageHeader';
import { SectionHeading } from '../components/SectionHeading';
import { WalkTracker } from '../components/WalkTracker';

interface ActivityPageProps {
  profile: Profile;
  onNotify: (message: string) => void;
  onOpenExercise: () => void;
  onGoHome: () => void;
}

const WEEKDAY_LABELS = ['日', '一', '二', '三', '四', '五', '六'];

type RangeId = 'week' | 'month' | 'halfYear';

const RANGE_TABS: { id: RangeId; label: string }[] = [
  { id: 'week', label: '近 7 天' },
  { id: 'month', label: '近 30 天' },
  { id: 'halfYear', label: '近 6 個月' },
];

function daysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

function shortDate(date: Date): string {
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

export function ActivityPage({ profile, onNotify, onOpenExercise, onGoHome }: ActivityPageProps) {
  const [data, setData] = useState<StepsData>(() => loadSteps());
  const [showGoalEditor, setShowGoalEditor] = useState(false);
  const [goalDraft, setGoalDraft] = useState(() => String(data.goal));
  const [stepInput, setStepInput] = useState('');
  const [minuteInput, setMinuteInput] = useState('');
  const [range, setRange] = useState<RangeId>('week');

  const today = dateKey();
  const steps = data.days[today] ?? 0;
  const activeMinutes = data.activeMinutes[today] ?? 0;
  const todayDistanceKm = data.distanceKm[today] ?? 0;
  const metrics = getStepMetrics(steps, profile);
  const profileReady = isProfileComplete(profile);

  const progress = data.goal > 0 ? Math.min(100, Math.round((steps / data.goal) * 100)) : 0;
  const ringProgress = data.goal > 0 ? Math.min(1, steps / data.goal) : 0;
  const remaining = Math.max(0, data.goal - steps);
  const reachedGoal = steps >= data.goal;

  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - ringProgress);

  const commit = (next: StepsData) => {
    setData(next);
    saveSteps(next);
  };

  const updateTodaySteps = (value: number) => {
    const safeValue = Math.max(0, Math.min(200000, Math.round(value)));
    commit({ ...data, days: { ...data.days, [today]: safeValue } });
  };

  const addSteps = (amount: number) => {
    updateTodaySteps(steps + amount);
    onNotify(`已新增 ${amount.toLocaleString()} 步`);
  };

  const handleAddCustom = () => {
    const amount = Number(stepInput);
    if (!Number.isFinite(amount) || amount <= 0) {
      onNotify('請輸入大於 0 的步數');
      return;
    }
    addSteps(Math.round(amount));
    setStepInput('');
  };

  const updateTodayMinutes = (value: number) => {
    const safeValue = Math.max(0, Math.min(1440, Math.round(value)));
    commit({ ...data, activeMinutes: { ...data.activeMinutes, [today]: safeValue } });
  };

  const addMinutes = (amount: number) => {
    updateTodayMinutes(activeMinutes + amount);
    onNotify(`已記錄 ${amount} 分鐘活動時間`);
  };

  const handleAddCustomMinutes = () => {
    const amount = Number(minuteInput);
    if (!Number.isFinite(amount) || amount <= 0) {
      onNotify('請輸入大於 0 的分鐘數');
      return;
    }
    addMinutes(Math.round(amount));
    setMinuteInput('');
  };

  const handleSaveGoal = () => {
    const goal = Number(goalDraft);
    if (!Number.isFinite(goal) || goal < 1000 || goal > 50000) {
      onNotify('每日目標請設定在 1,000 至 50,000 步之間');
      return;
    }
    const safeGoal = Math.round(goal);
    commit({ ...data, goal: safeGoal });
    setShowGoalEditor(false);
    onNotify(`每日目標已更新為 ${safeGoal.toLocaleString()} 步`);
  };

  const handleReset = () => {
    updateTodaySteps(0);
    onNotify('今日步數已重設');
  };

  const handleResetMinutes = () => {
    updateTodayMinutes(0);
    onNotify('今日活動時間已重設');
  };

  const handleSaveWalk = (distanceKm: number, minutes: number, calories: number) => {
    const nextDistance =
      Math.round(((data.distanceKm[today] ?? 0) + distanceKm) * 100) / 100;
    commit({
      ...data,
      distanceKm: { ...data.distanceKm, [today]: nextDistance },
      activeMinutes: { ...data.activeMinutes, [today]: activeMinutes + minutes },
    });

    // 同步寫入運動紀錄，讓「運動」頁也能看到這次步行的時間與熱量。
    if (calories > 0) {
      const entry: WorkoutEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        date: today,
        createdAt: new Date().toISOString(),
        exerciseId: 'walk',
        name: '步行（GPS）',
        minutes,
        met: 3.5,
        calories,
      };
      saveWorkouts([...loadWorkouts(), entry]);
    }

    onNotify(`已記錄步行 ${distanceKm.toFixed(2)} 公里、${minutes} 分鐘`);
  };

  const rangeData = useMemo(() => {
    if (range === 'halfYear') {
      const items = Array.from({ length: 6 }, (_, index) => {
        const date = new Date();
        date.setDate(1);
        date.setMonth(date.getMonth() - (5 - index));
        const prefix = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        let value = 0;
        let minutes = 0;
        Object.entries(data.days).forEach(([key, dayValue]) => {
          if (key.startsWith(prefix)) {
            value += dayValue;
            minutes += data.activeMinutes[key] ?? 0;
          }
        });
        return {
          key: prefix,
          label: `${date.getMonth() + 1}月`,
          value,
          minutes,
          isToday: index === 5,
        };
      });
      const totalSteps = items.reduce((sum, item) => sum + item.value, 0);
      const totalMinutes = items.reduce((sum, item) => sum + item.minutes, 0);
      return {
        items,
        totalSteps,
        totalMinutes,
        average: Math.round(totalSteps / items.length),
        averageLabel: '月平均',
      };
    }

    const length = range === 'week' ? 7 : 30;
    const items = Array.from({ length }, (_, index) => {
      const date = daysAgo(length - 1 - index);
      const key = dateKey(date);
      return {
        key,
        label: range === 'week' ? WEEKDAY_LABELS[date.getDay()] : shortDate(date),
        value: key === today ? steps : (data.days[key] ?? 0),
        minutes: key === today ? activeMinutes : (data.activeMinutes[key] ?? 0),
        isToday: key === today,
      };
    });
    const totalSteps = items.reduce((sum, item) => sum + item.value, 0);
    const totalMinutes = items.reduce((sum, item) => sum + item.minutes, 0);
    return {
      items,
      totalSteps,
      totalMinutes,
      average: Math.round(totalSteps / items.length),
      averageLabel: '每日平均',
    };
  }, [range, data, steps, activeMinutes, today]);

  const recentDays = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) => {
        const date = daysAgo(6 - index);
        const key = dateKey(date);
        return {
          key,
          dateLabel: shortDate(date),
          weekday: WEEKDAY_LABELS[date.getDay()],
          steps: key === today ? steps : (data.days[key] ?? 0),
          minutes: key === today ? activeMinutes : (data.activeMinutes[key] ?? 0),
          isToday: key === today,
        };
      }),
    [data, steps, activeMinutes, today],
  );

  const chartMax = Math.max(...rangeData.items.map((item) => item.value), range === 'week' ? data.goal : 1, 1);
  const goalLinePercent = range === 'week' ? (data.goal / chartMax) * 100 : 0;
  const showBarLabels = rangeData.items.length <= 7;

  return (
    <div>
      <PageHeader
        eyebrow="ACTIVITY"
        title="今日動能"
        description="走出自己的節奏，每一步都算數。"
        onHome={onGoHome}
      />

      <section className="relative mb-4 overflow-hidden rounded-[30px] border border-plum-100 bg-gradient-to-br from-plum-50 via-white to-amber-50 shadow-sm shadow-plum-900/5">
        <div className="pointer-events-none absolute -left-8 -top-10 h-28 w-28 rounded-full bg-plum-200/40 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 right-10 h-32 w-32 rounded-full bg-amber-100/60 blur-2xl" />

        <div className="relative flex items-center gap-4 p-5">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-black tracking-[0.18em] text-plum-600">
              A GENTLE START
            </p>
            <p className="mt-2 font-serif text-[20px] font-black leading-[1.45] tracking-wide text-purple-700">
              今天也要
              <br />
              好好照顧自己
            </p>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              每一次紀錄，都是對自己的溫柔。
            </p>
          </div>

          <div className="grid h-24 w-24 shrink-0 place-items-center rounded-full bg-white text-plum-800 shadow-lg shadow-plum-900/10 ring-4 ring-white">
            <Footprints className="h-10 w-10" strokeWidth={1.8} />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[28px] border border-amber-100 bg-white p-5 shadow-sm shadow-amber-900/5">
        <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-amber-100/70" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-plum-50 px-3 py-1 text-xs font-black text-plum-900">
              今日步數
            </span>
            <span className="text-[11px] font-semibold text-slate-400">
              {reachedGoal ? '目標達成' : `目標 ${data.goal.toLocaleString()} 步`}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setGoalDraft(String(data.goal));
              setShowGoalEditor((open) => !open);
            }}
            className="flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          >
            <Pencil className="h-3.5 w-3.5" />
            目標
          </button>
        </div>

        <div className="relative mt-2 flex justify-center">
          <div className="relative h-48 w-48">
            <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90" aria-hidden="true">
              <circle cx="80" cy="80" r={radius} fill="none" stroke="#fef3c7" strokeWidth="13" />
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke="#472a5d"
                strokeWidth="13"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                className="transition-[stroke-dashoffset] duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Activity className="mb-1 h-6 w-6 animate-pulse text-amber-500" />
              <p className="text-[34px] font-black leading-none tracking-tight text-plum-900 tabular-nums">
                {steps.toLocaleString()}
              </p>
              <p className="mt-1 text-xs font-bold text-slate-400">步</p>
            </div>
          </div>
        </div>

        <div className="relative -mt-2 flex items-center justify-center gap-2">
          <span
            className={`rounded-full px-3 py-1.5 text-sm font-black ${
              reachedGoal ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'
            }`}
          >
            {progress}%
          </span>
          <span className="text-sm font-medium text-slate-500">
            {reachedGoal ? '太棒了，今天目標已完成！' : `還差 ${remaining.toLocaleString()} 步`}
          </span>
        </div>

        {showGoalEditor && (
          <div className="relative mt-4 flex gap-2 rounded-2xl bg-amber-50 p-2">
            <label className="sr-only" htmlFor="step-goal">
              每日步數目標
            </label>
            <input
              id="step-goal"
              type="number"
              inputMode="numeric"
              min={1000}
              max={50000}
              step={500}
              value={goalDraft}
              onChange={(event) => setGoalDraft(event.target.value)}
              className="h-11 min-w-0 flex-1 rounded-xl border border-amber-200 bg-white px-3 text-base font-bold text-slate-800 focus:border-plum-900 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleSaveGoal}
              className="flex h-11 items-center gap-1 rounded-xl bg-plum-900 px-4 text-sm font-black text-white transition hover:bg-plum-800 active:scale-[0.98]"
            >
              <Save className="h-4 w-4" />
              儲存
            </button>
          </div>
        )}
      </section>

      <div className="mt-3 grid grid-cols-3 gap-2.5">
        <MetricCard
          icon={Flame}
          label="步數熱量"
          value={profileReady ? metrics.calories.toLocaleString() : '—'}
          unit="kcal"
          accent="text-orange-500"
          soft="bg-orange-50"
        />
        <MetricCard
          icon={MapPin}
          label="行走距離"
          value={todayDistanceKm.toFixed(2)}
          unit="km"
          accent="text-emerald-600"
          soft="bg-emerald-50"
        />
        <MetricCard
          icon={Timer}
          label="活動時間"
          value={activeMinutes.toLocaleString()}
          unit="分鐘"
          accent="text-plum-700"
          soft="bg-plum-50"
        />
      </div>

      <WalkTracker
        todayDistanceKm={todayDistanceKm}
        weightKg={profile.weight}
        onSave={handleSaveWalk}
      />

      <section className="mt-4 rounded-[26px] border border-amber-100 bg-white p-4 shadow-sm shadow-amber-900/5">
        <SectionHeading icon={Plus} title="快速紀錄步數" subtitle="查看手機內建的健康 App 後，輸入今天的步數" />

        <div className="mt-3 grid grid-cols-3 gap-2">
          {[500, 1000, 2000].map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => addSteps(amount)}
              className="flex h-12 items-center justify-center gap-1 rounded-2xl border border-plum-100 bg-plum-50 text-sm font-black text-plum-900 transition hover:bg-plum-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum-900 active:scale-[0.97]"
            >
              <Plus className="h-4 w-4" strokeWidth={2.8} />
              {amount.toLocaleString()}
            </button>
          ))}
        </div>

        <div className="mt-2 flex gap-2">
          <label className="sr-only" htmlFor="custom-steps">
            自訂新增步數
          </label>
          <input
            id="custom-steps"
            type="number"
            inputMode="numeric"
            min={1}
            step={100}
            placeholder="輸入步數，例如 3000"
            value={stepInput}
            onChange={(event) => setStepInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') handleAddCustom();
            }}
            className="h-12 min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base font-semibold text-slate-800 placeholder:text-sm placeholder:font-medium placeholder:text-slate-400 focus:border-plum-900 focus:bg-white focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAddCustom}
            className="h-12 shrink-0 rounded-2xl bg-slate-900 px-5 text-sm font-black text-white transition hover:bg-slate-800 active:scale-[0.98]"
          >
            新增
          </button>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold text-slate-400 transition hover:bg-slate-50 hover:text-slate-600"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          重設今日步數
        </button>
      </section>

      <section className="mt-4 rounded-[26px] border border-plum-100 bg-white p-4 shadow-sm shadow-amber-900/5">
        <SectionHeading icon={Timer} title="活動時間" subtitle="室內或無法定位時，可手動補登" />

        <div className="mt-3 grid grid-cols-4 gap-2">
          {[10, 20, 30, 60].map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => addMinutes(amount)}
              className="flex h-12 items-center justify-center gap-0.5 rounded-2xl border border-plum-100 bg-plum-50 text-sm font-black text-plum-900 transition hover:bg-plum-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum-900 active:scale-[0.97]"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2.8} />
              {amount} 分
            </button>
          ))}
        </div>

        <div className="mt-2 flex gap-2">
          <label className="sr-only" htmlFor="custom-minutes">
            自訂活動時間
          </label>
          <input
            id="custom-minutes"
            type="number"
            inputMode="numeric"
            min={1}
            step={5}
            placeholder="輸入分鐘數，例如 25"
            value={minuteInput}
            onChange={(event) => setMinuteInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') handleAddCustomMinutes();
            }}
            className="h-12 min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base font-semibold text-slate-800 placeholder:text-sm placeholder:font-medium placeholder:text-slate-400 focus:border-plum-900 focus:bg-white focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAddCustomMinutes}
            className="h-12 shrink-0 rounded-2xl bg-slate-900 px-5 text-sm font-black text-white transition hover:bg-slate-800 active:scale-[0.98]"
          >
            新增
          </button>
        </div>

        <button
          type="button"
          onClick={handleResetMinutes}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold text-slate-400 transition hover:bg-slate-50 hover:text-slate-600"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          重設今日活動時間
        </button>

        <button
          type="button"
          onClick={onOpenExercise}
          className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-xl bg-plum-50 py-2.5 text-xs font-black text-plum-800 transition hover:bg-plum-100 active:scale-[0.99]"
        >
          <Flame className="h-3.5 w-3.5 text-orange-500" />
          把活動時間換算成熱量
        </button>
      </section>

      <section className="mt-4 rounded-[26px] border border-amber-100 bg-white p-4 shadow-sm shadow-amber-900/5">
        <SectionHeading icon={CalendarRange} title="累積紀錄" subtitle="每天自動保存，可回看半年" />

        <div className="mt-3 grid grid-cols-3 gap-1 rounded-2xl bg-slate-100 p-1">
          {RANGE_TABS.map((tab) => {
            const selected = range === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setRange(tab.id)}
                aria-pressed={selected}
                className={`h-9 rounded-xl text-xs font-black transition ${
                  selected
                    ? 'bg-white text-plum-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-plum-50 px-2.5 py-2">
            <p className="text-[10px] font-bold text-plum-600">累積步數</p>
            <p className="mt-0.5 text-base font-black leading-none tabular-nums text-plum-900">
              {rangeData.totalSteps.toLocaleString()}
            </p>
          </div>
          <div className="rounded-2xl bg-amber-50 px-2.5 py-2">
            <p className="text-[10px] font-bold text-amber-700">{rangeData.averageLabel}</p>
            <p className="mt-0.5 text-base font-black leading-none tabular-nums text-amber-900">
              {rangeData.average.toLocaleString()}
            </p>
          </div>
          <div className="rounded-2xl bg-emerald-50 px-2.5 py-2">
            <p className="text-[10px] font-bold text-emerald-700">活動時間</p>
            <p className="mt-0.5 text-base font-black leading-none tabular-nums text-emerald-900">
              {rangeData.totalMinutes.toLocaleString()}
              <span className="ml-0.5 text-[10px] font-bold text-emerald-600">分</span>
            </p>
          </div>
        </div>

        <div className="relative mt-5 h-32">
          {range === 'week' && (
            <div
              className="pointer-events-none absolute inset-x-0 z-0 border-t border-dashed border-amber-400/80"
              style={{ bottom: `${goalLinePercent}%` }}
            />
          )}
          <div className="relative z-10 flex h-full items-end gap-[3px]">
            {rangeData.items.map((item) => {
              const height = Math.max(4, (item.value / chartMax) * 100);
              return (
                <div key={item.key} className="flex h-full flex-1 flex-col items-center justify-end">
                  {showBarLabels && (
                    <span
                      className={`mb-1 text-[10px] font-bold tabular-nums ${
                        item.isToday ? 'text-plum-900' : 'text-slate-400'
                      }`}
                    >
                      {item.value > 0 ? `${Math.round(item.value / 100) / 10}k` : '–'}
                    </span>
                  )}
                  <div
                    className={`w-full rounded-t-md transition-all duration-500 ${
                      item.isToday ? 'bg-plum-900' : 'bg-plum-200'
                    }`}
                    style={{ height: `${height}%` }}
                    title={`${item.label}：${item.value.toLocaleString()} 步 · ${item.minutes} 分鐘`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-1.5 flex justify-between text-[10px] font-bold text-slate-400">
          {rangeData.items.length <= 7 ? (
            rangeData.items.map((item) => (
              <span key={item.key} className={item.isToday ? 'text-plum-900' : ''}>
                {item.isToday ? '今天' : item.label}
              </span>
            ))
          ) : (
            <>
              <span>{rangeData.items[0]?.label}</span>
              <span>{rangeData.items[rangeData.items.length - 1]?.label}</span>
            </>
          )}
        </div>

        <div className="mt-4 border-t border-slate-100 pt-3">
          <p className="text-[11px] font-black text-slate-500">最近 7 天紀錄</p>
          <div className="mt-2 space-y-1.5">
            {recentDays.map((day) => (
              <div
                key={day.key}
                className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs ${
                  day.isToday ? 'bg-plum-50 font-black text-plum-900' : 'text-slate-600'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span className="tabular-nums">{day.isToday ? '今天' : day.dateLabel}</span>
                  <span className="text-[10px] font-bold text-slate-400">（{day.weekday}）</span>
                </span>
                <span className="flex items-center gap-2.5 tabular-nums">
                  <span className="font-bold">{day.steps.toLocaleString()} 步</span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    {day.minutes} 分鐘
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-[11px] leading-relaxed text-slate-500">
          每天零點自動開始新的一天，過去的紀錄會保留在本機裝置，最遠可回看半年以上。
        </p>
      </section>

      <div className="mt-4 flex items-center justify-center gap-1.5 pb-2 text-[11px] font-medium text-slate-400">
        <Footprints className="h-3.5 w-3.5" />
        建議每日累積 10,000 步，分段完成也很有效
      </div>
    </div>
  );
}

interface MetricCardProps {
  icon: typeof Flame;
  label: string;
  value: string;
  unit: string;
  accent: string;
  soft: string;
}

function MetricCard({ icon: Icon, label, value, unit, accent, soft }: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-amber-100 bg-white p-3 shadow-sm shadow-amber-900/5">
      <div className={`grid h-8 w-8 place-items-center rounded-xl ${soft} ${accent}`}>
        <Icon className="h-4 w-4" strokeWidth={2.4} />
      </div>
      <p className="mt-2 text-xs font-bold text-slate-400">{label}</p>
      <p className="mt-0.5 flex items-baseline gap-0.5">
        <span className="text-xl font-black leading-none text-slate-900 tabular-nums">{value}</span>
        <span className="text-[11px] font-bold text-slate-400">{unit}</span>
      </p>
    </div>
  );
}
