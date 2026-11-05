import { useMemo, useState } from 'react';
import {
  Activity,
  Flame,
  Footprints,
  MapPin,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  Target,
  Timer,
  TrendingUp,
} from 'lucide-react';
import type { Profile, StepsData } from '../types';
import { getStepMetrics } from '../lib/health';
import { dateKey, loadSteps, saveSteps } from '../lib/storage';
import { PageHeader } from '../components/PageHeader';
import { SectionHeading } from '../components/SectionHeading';
import heroRunner from '../assets/hero-runner.jpg';

interface ActivityPageProps {
  profile: Profile;
  onNotify: (message: string) => void;
}

const WEEKDAY_LABELS = ['日', '一', '二', '三', '四', '五', '六'];

export function ActivityPage({ profile, onNotify }: ActivityPageProps) {
  const [data, setData] = useState<StepsData>(() => loadSteps());
  const [showGoalEditor, setShowGoalEditor] = useState(false);
  const [goalDraft, setGoalDraft] = useState(() => String(data.goal));
  const [stepInput, setStepInput] = useState('');

  const today = dateKey();
  const steps = data.days[today] ?? 0;
  const metrics = getStepMetrics(steps, profile);
  const progress = data.goal > 0 ? Math.min(100, Math.round((steps / data.goal) * 100)) : 0;
  const ringProgress = data.goal > 0 ? Math.min(1, steps / data.goal) : 0;
  const remaining = Math.max(0, data.goal - steps);
  const reachedGoal = steps >= data.goal;

  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - ringProgress);

  const week = useMemo(() => {
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      const key = dateKey(date);
      return {
        key,
        label: WEEKDAY_LABELS[date.getDay()],
        value: key === today ? steps : (data.days[key] ?? 0),
        isToday: key === today,
      };
    });
  }, [data.days, steps, today]);

  const maxChartValue = Math.max(...week.map((day) => day.value), data.goal, 1) * 1.12;
  const goalLinePercent = (data.goal / maxChartValue) * 100;

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

  return (
    <div>
      <PageHeader
        eyebrow="ACTIVITY"
        title="今日動能"
        description="走出自己的節奏，每一步都算數。"
        icon={Activity}
      />

      <section className="relative mb-4 overflow-hidden rounded-[26px] border border-plum-100 bg-gradient-to-br from-plum-50 via-white to-amber-50 p-4 shadow-sm shadow-plum-900/5">
        <div className="pointer-events-none absolute -left-8 -top-10 h-28 w-28 rounded-full bg-plum-200/40 blur-2xl" />
        <div className="relative z-10 max-w-[64%]">
          <p className="text-[10px] font-black tracking-[0.18em] text-plum-600">A GENTLE START</p>
          <p className="mt-1 text-lg font-black leading-snug text-plum-950">
            今天也要
            <br />
            好好照顧自己
          </p>
          <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500">
            每一次紀錄，都是對自己的溫柔。
          </p>
        </div>
        <img
          src={heroRunner}
          alt=""
          aria-hidden="true"
          style={{
            maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
          }}
          className="pointer-events-none absolute -right-6 bottom-0 h-[145%] w-36 object-cover object-[50%_14%] mix-blend-multiply"
        />
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
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke="#fef3c7"
                strokeWidth="13"
              />
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
            {reachedGoal
              ? '太棒了，今天目標已完成！'
              : `還差 ${remaining.toLocaleString()} 步`}
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
          label="消耗熱量"
          value={metrics.calories.toLocaleString()}
          unit="kcal"
          accent="text-orange-500"
          soft="bg-orange-50"
        />
        <MetricCard
          icon={MapPin}
          label="行走距離"
          value={metrics.distanceKm.toFixed(1)}
          unit="km"
          accent="text-emerald-600"
          soft="bg-emerald-50"
        />
        <MetricCard
          icon={Timer}
          label="活動時間"
          value={metrics.activeMinutes.toLocaleString()}
          unit="分鐘"
          accent="text-plum-700"
          soft="bg-plum-50"
        />
      </div>

      <section className="mt-4 rounded-[26px] border border-amber-100 bg-white p-4 shadow-sm shadow-amber-900/5">
        <SectionHeading icon={Plus} title="快速紀錄步數" subtitle="沒有連接計步器時，可手動補登" />

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

      <section className="mt-4 rounded-[26px] border border-amber-100 bg-white p-4 shadow-sm shadow-amber-900/5">
        <div className="flex items-start justify-between gap-2">
          <SectionHeading icon={TrendingUp} title="近 7 天趨勢" subtitle="每日步數與目標線" />
          <div className="flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-800">
            <Target className="h-3 w-3" />
            {(data.goal / 1000).toFixed(1)}k
          </div>
        </div>

        <div className="relative mt-5 h-32">
          <div
            className="pointer-events-none absolute inset-x-0 z-0 border-t border-dashed border-amber-400/80"
            style={{ bottom: `${goalLinePercent}%` }}
          />
          <div className="relative z-10 flex h-full items-end gap-1.5">
            {week.map((day) => {
              const height = Math.max(4, (day.value / maxChartValue) * 100);
              return (
                <div key={day.key} className="flex h-full flex-1 flex-col items-center justify-end">
                  <span
                    className={`mb-1 text-[10px] font-bold tabular-nums ${
                      day.isToday ? 'text-plum-900' : 'text-slate-400'
                    }`}
                  >
                    {day.value > 0 ? `${Math.round(day.value / 100) / 10}k` : '–'}
                  </span>
                  <div
                    className={`w-full max-w-8 rounded-t-lg transition-all duration-500 ${
                      day.isToday ? 'bg-plum-900' : 'bg-plum-200'
                    }`}
                    style={{ height: `${height}%` }}
                    title={`${day.label}：${day.value.toLocaleString()} 步`}
                  />
                  <span
                    className={`mt-1.5 text-xs font-bold ${
                      day.isToday ? 'text-plum-900' : 'text-slate-400'
                    }`}
                  >
                    {day.isToday ? '今天' : day.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-[11px] leading-relaxed text-slate-500">
          步數由本機手動紀錄。首次開啟提供示範數據，您可以新增或重設為自己的紀錄。
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
