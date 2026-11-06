import { useState } from 'react';
import {
  ChevronRight,
  Dumbbell,
  Flame,
  Footprints,
  Home,
  MapPin,
  Timer,
  TrendingUp,
  Utensils,
} from 'lucide-react';
import type { Profile, TabId } from '../types';
import { calcBmi, getStepMetrics, isProfileComplete } from '../lib/health';
import { dateKey, loadSteps, loadWorkouts } from '../lib/storage';
import { PageHeader } from '../components/PageHeader';
import { SectionHeading } from '../components/SectionHeading';
import dogPhoto from '../assets/dog.png';

interface HomePageProps {
  profile: Profile;
  onNavigate: (tab: TabId) => void;
}

const WEEKDAY_LABELS = ['日', '一', '二', '三', '四', '五', '六'];

const CARD_CLASS =
  'rounded-[28px] border border-plum-100/80 bg-white p-5 shadow-[0_14px_40px_-28px_rgba(71,42,93,0.5)]';

export function HomePage({ profile, onNavigate }: HomePageProps) {
  const [snapshot] = useState(() => ({
    steps: loadSteps(),
    workouts: loadWorkouts(),
  }));

  const today = dateKey();
  const profileReady = isProfileComplete(profile);
  const steps = snapshot.steps.days[today] ?? 0;
  const distanceKm = snapshot.steps.distanceKm[today] ?? 0;
  const activeMinutes = snapshot.steps.activeMinutes[today] ?? 0;

  const todayWorkouts = snapshot.workouts.filter((workout) => workout.date === today);
  const todayWalkWorkouts = todayWorkouts.filter((workout) => workout.exerciseId === 'walk');
  const todayTrainingWorkouts = todayWorkouts.filter((workout) => workout.exerciseId !== 'walk');

  // GPS 步行的時間已計入 activeMinutes；步行熱量也已包含在步數熱量裡，
  // 因此首頁只加訓練熱量，避免同一次步行被算兩次。
  const todayWalkCalories = todayWalkWorkouts.reduce((sum, workout) => sum + workout.calories, 0);
  const todayTrainingCalories = todayTrainingWorkouts.reduce(
    (sum, workout) => sum + workout.calories,
    0,
  );
  const todayTrainingMinutes = todayTrainingWorkouts.reduce(
    (sum, workout) => sum + workout.minutes,
    0,
  );
  const todayLoggedCalories = todayWorkouts.reduce((sum, workout) => sum + workout.calories, 0);
  const todayLoggedMinutes = todayWorkouts.reduce((sum, workout) => sum + workout.minutes, 0);

  const stepCalories = getStepMetrics(steps, profile).calories;
  const walkingCalories = steps > 0 ? stepCalories : todayWalkCalories;
  const walkingSourceLabel = steps > 0 ? '步數' : '步行';
  const totalMinutes = activeMinutes + todayTrainingMinutes;
  const totalCalories = walkingCalories + todayTrainingCalories;

  const progress =
    snapshot.steps.goal > 0 ? Math.min(100, Math.round((steps / snapshot.steps.goal) * 100)) : 0;

  const week = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const key = dateKey(date);
    return {
      key,
      label: WEEKDAY_LABELS[date.getDay()],
      steps: snapshot.steps.days[key] ?? 0,
      isToday: key === today,
    };
  });
  const weekKeys = week.map((day) => day.key);
  const weekSteps = week.reduce((sum, day) => sum + day.steps, 0);
  const weekManualMinutes = weekKeys.reduce(
    (sum, key) => sum + (snapshot.steps.activeMinutes[key] ?? 0),
    0,
  );
  const weekWorkoutMinutes = snapshot.workouts
    .filter((workout) => weekKeys.includes(workout.date) && workout.exerciseId !== 'walk')
    .reduce((sum, workout) => sum + workout.minutes, 0);
  const weekMinutes = weekManualMinutes + weekWorkoutMinutes;

  // 每一天只取一種步行來源：有步數就用步數，沒有才用 GPS 步行熱量。
  const weekWalkingCalories = weekKeys.reduce((sum, key) => {
    const daySteps = snapshot.steps.days[key] ?? 0;
    if (daySteps > 0) return sum + getStepMetrics(daySteps, profile).calories;
    return (
      sum +
      snapshot.workouts
        .filter((workout) => workout.date === key && workout.exerciseId === 'walk')
        .reduce((daySum, workout) => daySum + workout.calories, 0)
    );
  }, 0);
  const weekTrainingCalories = snapshot.workouts
    .filter((workout) => weekKeys.includes(workout.date) && workout.exerciseId !== 'walk')
    .reduce((sum, workout) => sum + workout.calories, 0);
  const weekCalories = weekWalkingCalories + weekTrainingCalories;

  const chartMax = Math.max(...week.map((day) => day.steps), snapshot.steps.goal, 1);
  const bmi = calcBmi(profile.weight, profile.height);

  return (
    <div>
      <PageHeader
        eyebrow="OVERVIEW"
        title="今日總覽"
        description="今天的身體與活動，一眼掌握。"
        icon={Home}
      />

      <section className={CARD_CLASS}>
        <div className="flex items-center gap-4">
          <img
            src={dogPhoto}
            alt=""
            aria-hidden="true"
            className="h-[74px] w-[74px] shrink-0 rounded-full object-cover shadow-[0_8px_20px_-10px_rgba(71,42,93,0.55)] ring-4 ring-white"
          />
          <div className="min-w-0 flex-1">
            <p
              lang="en"
              className="font-serif text-[27px] font-bold italic leading-[1.08] tracking-[-0.015em] text-plum-700"
            >
              Small habits,
            </p>
            <p
              lang="en"
              className="font-serif text-[31px] font-bold italic leading-[1.08] tracking-[-0.015em] text-plum-950"
            >
              big changes<span className="text-plum-400">.</span>
            </p>
            {profileReady && (
              <p className="mt-2.5 text-sm font-semibold tracking-wide text-slate-400">
                {profile.gender === 'female' ? '女性' : '男性'} · {profile.age} 歲
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 divide-x divide-slate-200/70 border-t border-slate-100 pt-5">
          <div className="text-center">
            <p className="text-xs font-semibold tracking-wide text-slate-400">身高</p>
            <p className="mt-1.5 text-xl font-black leading-none tabular-nums text-slate-900">
              {profile.height > 0 ? profile.height : '—'}
              <span className="ml-1 text-xs font-semibold text-slate-400">cm</span>
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs font-semibold tracking-wide text-slate-400">體重</p>
            <p className="mt-1.5 text-xl font-black leading-none tabular-nums text-slate-900">
              {profile.weight > 0 ? profile.weight : '—'}
              <span className="ml-1 text-xs font-semibold text-slate-400">kg</span>
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs font-semibold tracking-wide text-slate-400">BMI</p>
            <p className="mt-1.5 text-xl font-black leading-none tabular-nums text-slate-900">
              {profileReady ? bmi.toFixed(1) : '—'}
            </p>
          </div>
        </div>
      </section>

      <section className="relative mt-4 overflow-hidden rounded-[28px] bg-gradient-to-br from-plum-950 via-plum-900 to-plum-800 p-6 text-white shadow-[0_24px_50px_-30px_rgba(47,26,63,0.9)]">
        <div className="pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-20 -left-12 h-40 w-40 rounded-full bg-white/5" />

        <div className="relative flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-bold tracking-[0.08em] text-plum-200">今日活動消耗</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-[46px] font-black leading-none tracking-tight tabular-nums">
                {profileReady ? totalCalories.toLocaleString() : '—'}
              </span>
              <span className="text-base font-bold text-plum-200">kcal</span>
            </div>
          </div>
          <div className="shrink-0 rounded-2xl bg-white/10 px-4 py-3 text-center backdrop-blur-sm">
            <p className="text-xs font-semibold text-plum-200">步數目標</p>
            <p className="mt-1 text-2xl font-black leading-none tabular-nums text-amber-200">
              {progress}%
            </p>
          </div>
        </div>

        <p className="relative mt-3 text-sm font-semibold text-plum-300">
          {walkingSourceLabel} {profileReady ? walkingCalories.toLocaleString() : '—'} ＋ 訓練{' '}
          {profileReady ? todayTrainingCalories.toLocaleString() : '—'} kcal
        </p>

        <div className="relative mt-5 h-2.5 overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-200 to-amber-300 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="relative mt-5 grid grid-cols-3 gap-2 border-t border-white/10 pt-5">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-semibold text-plum-200">
              <Footprints className="h-4 w-4" /> 步數
            </p>
            <p className="mt-1.5 text-2xl font-black leading-none tabular-nums">
              {steps.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="flex items-center gap-1.5 text-xs font-semibold text-plum-200">
              <MapPin className="h-4 w-4" /> 距離
            </p>
            <p className="mt-1.5 flex items-baseline gap-1 text-2xl font-black leading-none tabular-nums">
              {distanceKm.toFixed(2)}
              <span className="text-xs font-semibold text-plum-200">km</span>
            </p>
          </div>
          <div>
            <p className="flex items-center gap-1.5 text-xs font-semibold text-plum-200">
              <Timer className="h-4 w-4" /> 活動
            </p>
            <p className="mt-1.5 flex items-baseline gap-1 text-2xl font-black leading-none tabular-nums">
              {totalMinutes}
              <span className="text-xs font-semibold text-plum-200">分</span>
            </p>
          </div>
        </div>
      </section>

      <section className={`mt-4 ${CARD_CLASS}`}>
        <div className="flex items-start justify-between gap-2">
          <SectionHeading icon={Dumbbell} title="今日運動" subtitle="肌力、有氧與核心訓練" />
          <button
            type="button"
            onClick={() => onNavigate('exercise')}
            className="flex shrink-0 items-center gap-0.5 rounded-full bg-plum-50 px-3 py-2 text-sm font-black text-plum-900 transition hover:bg-plum-100"
          >
            記錄
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {todayWorkouts.length > 0 ? (
          <>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-plum-900 px-3 py-1.5 text-xs font-bold text-white">
                {todayWorkouts.length} 筆紀錄
              </span>
              <span className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-800">
                {todayLoggedCalories} kcal
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                {todayLoggedMinutes} 分鐘
              </span>
            </div>
            <div className="mt-3 space-y-2">
              {todayWorkouts.slice(0, 3).map((workout) => (
                <div
                  key={workout.id}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3"
                >
                  <span className="text-sm font-bold text-slate-800">{workout.name}</span>
                  <span className="shrink-0 text-xs font-semibold text-slate-500">
                    {workout.minutes} 分鐘 · {workout.calories} kcal
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="mt-4 rounded-2xl bg-slate-50 px-4 py-3.5 text-sm leading-relaxed text-slate-500">
            今天還沒有運動紀錄。完成訓練後記下來，熱量會自動加進今日活動消耗。
          </p>
        )}
      </section>

      <section className={`mt-4 ${CARD_CLASS}`}>
        <SectionHeading icon={TrendingUp} title="本週累積" subtitle="近 7 天步數與運動" />

        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-plum-50 px-3 py-3">
            <p className="text-xs font-semibold text-plum-600">步數</p>
            <p className="mt-1 text-lg font-black leading-none tabular-nums text-plum-900">
              {weekSteps.toLocaleString()}
            </p>
          </div>
          <div className="rounded-2xl bg-emerald-50 px-3 py-3">
            <p className="text-xs font-semibold text-emerald-700">活動時間</p>
            <p className="mt-1 flex items-baseline gap-0.5 text-lg font-black leading-none tabular-nums text-emerald-900">
              {weekMinutes.toLocaleString()}
              <span className="text-xs font-semibold text-emerald-600">分</span>
            </p>
          </div>
          <div className="rounded-2xl bg-amber-50 px-3 py-3">
            <p className="text-xs font-semibold text-amber-700">消耗</p>
            <p className="mt-1 flex items-baseline gap-0.5 text-lg font-black leading-none tabular-nums text-amber-900">
              {profileReady ? weekCalories.toLocaleString() : '—'}
              <span className="text-xs font-semibold text-amber-600">kcal</span>
            </p>
          </div>
        </div>

        <div className="mt-5 flex h-28 items-end gap-2">
          {week.map((day) => {
            const height = Math.max(4, (day.steps / chartMax) * 100);
            return (
              <div key={day.key} className="flex h-full flex-1 flex-col items-center justify-end">
                <div
                  className={`w-full max-w-8 rounded-t-lg transition-all duration-500 ${
                    day.isToday ? 'bg-plum-900' : 'bg-plum-200'
                  }`}
                  style={{ height: `${height}%` }}
                  title={`${day.steps.toLocaleString()} 步`}
                />
                <span
                  className={`mt-2 text-xs font-semibold ${
                    day.isToday ? 'text-plum-900' : 'text-slate-400'
                  }`}
                >
                  {day.isToday ? '今天' : day.label}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <div className="mt-4 grid grid-cols-3 gap-2.5">
        {[
          {
            label: '步行記錄',
            icon: Footprints,
            tab: 'activity' as TabId,
            tone: 'bg-plum-50 text-plum-800',
          },
          {
            label: '運動紀錄',
            icon: Dumbbell,
            tab: 'exercise' as TabId,
            tone: 'bg-amber-50 text-amber-800',
          },
          {
            label: '飲食紀錄',
            icon: Utensils,
            tab: 'nutrition' as TabId,
            tone: 'bg-emerald-50 text-emerald-800',
          },
        ].map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.tab}
              type="button"
              onClick={() => onNavigate(action.tab)}
              className={`flex flex-col items-center gap-2 rounded-2xl px-2 py-4 text-sm font-bold transition active:scale-[0.97] ${action.tone}`}
            >
              <Icon className="h-5 w-5" />
              {action.label}
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-center gap-1.5 pb-2 text-xs font-medium text-slate-400">
        <Flame className="h-3.5 w-3.5" />
        活動消耗為步行與訓練的估算加總，不含基礎代謝
      </div>
    </div>
  );
}
