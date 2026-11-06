import { useState } from 'react';
import {
  ChevronRight,
  Dumbbell,
  Flame,
  Footprints,
  Home,
  MapPin,
  Pencil,
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

      <section className="rounded-[26px] border border-amber-100 bg-white p-4 shadow-sm shadow-amber-900/5">
        <div className="flex items-center gap-3">
          <img
            src={dogPhoto}
            alt=""
            aria-hidden="true"
            className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-plum-200"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-black tracking-[0.16em] text-plum-600">MY PROFILE</p>
            <p className="text-xl font-black tracking-tight text-slate-900">HAYLEY</p>
            <p className="mt-0.5 text-xs font-semibold text-slate-500">
              {profileReady
                ? `${profile.gender === 'female' ? '女性' : '男性'} · ${profile.age} 歲`
                : '尚未設定基本資料'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('settings')}
            className="flex shrink-0 items-center gap-1 rounded-full bg-plum-50 px-3 py-2 text-sm font-black text-plum-900 transition hover:bg-plum-100 active:scale-[0.98]"
          >
            <Pencil className="h-3.5 w-3.5" />
            設定
          </button>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-slate-50 px-3 py-2">
            <p className="text-xs font-bold text-slate-400">身高</p>
            <p className="mt-0.5 text-base font-black tabular-nums text-slate-900">
              {profile.height > 0 ? profile.height : '—'}
              <span className="ml-0.5 text-xs font-bold text-slate-400">cm</span>
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 px-3 py-2">
            <p className="text-xs font-bold text-slate-400">體重</p>
            <p className="mt-0.5 text-base font-black tabular-nums text-slate-900">
              {profile.weight > 0 ? profile.weight : '—'}
              <span className="ml-0.5 text-xs font-bold text-slate-400">kg</span>
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 px-3 py-2">
            <p className="text-xs font-bold text-slate-400">BMI</p>
            <p className="mt-0.5 text-base font-black tabular-nums text-slate-900">
              {profileReady ? bmi.toFixed(1) : '—'}
            </p>
          </div>
        </div>
      </section>

      <section className="relative mt-3 overflow-hidden rounded-[26px] bg-plum-900 p-5 text-white shadow-lg shadow-plum-900/20">
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-plum-800/80" />
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-plum-200">今日活動消耗</p>
            <p className="mt-1 flex items-baseline gap-1.5">
              <span className="text-4xl font-black leading-none tabular-nums">
                {profileReady ? totalCalories.toLocaleString() : '—'}
              </span>
              <span className="text-sm font-bold text-plum-200">kcal</span>
            </p>
            <p className="mt-1.5 text-xs font-semibold text-plum-300">
              {walkingSourceLabel} {profileReady ? walkingCalories.toLocaleString() : '—'} ＋ 訓練{' '}
              {profileReady ? todayTrainingCalories.toLocaleString() : '—'} kcal
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 px-3 py-2 text-right">
            <p className="text-xs font-bold text-plum-200">步數目標</p>
            <p className="text-xl font-black leading-tight tabular-nums text-amber-200">
              {progress}%
            </p>
          </div>
        </div>

        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full rounded-full bg-amber-300 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/10 pt-4">
          <div>
            <p className="flex items-center gap-1 text-xs font-bold text-plum-200">
              <Footprints className="h-3.5 w-3.5" /> 步數
            </p>
            <p className="mt-0.5 text-lg font-black leading-none tabular-nums">
              {steps.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="flex items-center gap-1 text-xs font-bold text-plum-200">
              <MapPin className="h-3.5 w-3.5" /> 距離
            </p>
            <p className="mt-0.5 text-lg font-black leading-none tabular-nums">
              {distanceKm.toFixed(2)}
              <span className="ml-0.5 text-xs font-bold text-plum-200">km</span>
            </p>
          </div>
          <div>
            <p className="flex items-center gap-1 text-xs font-bold text-plum-200">
              <Timer className="h-3.5 w-3.5" /> 活動
            </p>
            <p className="mt-0.5 text-lg font-black leading-none tabular-nums">
              {totalMinutes}
              <span className="ml-0.5 text-xs font-bold text-plum-200">分</span>
            </p>
          </div>
        </div>
      </section>

      <section className="mt-3 rounded-[26px] border border-amber-100 bg-white p-4 shadow-sm shadow-amber-900/5">
        <div className="flex items-start justify-between gap-2">
          <SectionHeading icon={Dumbbell} title="今日運動" subtitle="肌力、有氧與核心訓練" />
          <button
            type="button"
            onClick={() => onNavigate('exercise')}
            className="flex shrink-0 items-center gap-0.5 rounded-full bg-plum-50 px-2.5 py-1.5 text-sm font-black text-plum-900 transition hover:bg-plum-100"
          >
            記錄
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {todayWorkouts.length > 0 ? (
          <>
            <div className="mt-3 flex items-center gap-2">
              <span className="rounded-full bg-plum-900 px-3 py-1.5 text-xs font-black text-white">
                {todayWorkouts.length} 筆紀錄
              </span>
              <span className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-black text-amber-800">
                {todayLoggedCalories} kcal
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-600">
                {todayLoggedMinutes} 分鐘
              </span>
            </div>
            <div className="mt-2 space-y-1.5">
              {todayWorkouts.slice(0, 3).map((workout) => (
                <div
                  key={workout.id}
                  className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm"
                >
                  <span className="font-bold text-slate-800">{workout.name}</span>
                  <span className="text-xs font-semibold text-slate-500">
                    {workout.minutes} 分鐘 · {workout.calories} kcal
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="mt-3 rounded-2xl bg-slate-50 px-3.5 py-3 text-sm leading-relaxed text-slate-500">
            今天還沒有運動紀錄。完成訓練後記下來，熱量會自動加進今日總消耗。
          </p>
        )}
      </section>

      <section className="mt-3 rounded-[26px] border border-amber-100 bg-white p-4 shadow-sm shadow-amber-900/5">
        <SectionHeading icon={TrendingUp} title="本週累積" subtitle="近 7 天步數與運動" />

        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-plum-50 px-2.5 py-2">
            <p className="text-xs font-bold text-plum-600">步數</p>
            <p className="mt-0.5 text-base font-black leading-none tabular-nums text-plum-900">
              {weekSteps.toLocaleString()}
            </p>
          </div>
          <div className="rounded-2xl bg-emerald-50 px-2.5 py-2">
            <p className="text-xs font-bold text-emerald-700">活動時間</p>
            <p className="mt-0.5 text-base font-black leading-none tabular-nums text-emerald-900">
              {weekMinutes.toLocaleString()}
              <span className="ml-0.5 text-xs font-bold text-emerald-600">分</span>
            </p>
          </div>
          <div className="rounded-2xl bg-amber-50 px-2.5 py-2">
            <p className="text-xs font-bold text-amber-700">消耗</p>
            <p className="mt-0.5 text-base font-black leading-none tabular-nums text-amber-900">
              {profileReady ? weekCalories.toLocaleString() : '—'}
              <span className="ml-0.5 text-xs font-bold text-amber-600">kcal</span>
            </p>
          </div>
        </div>

        <div className="mt-4 flex h-24 items-end gap-1.5">
          {week.map((day) => {
            const height = Math.max(4, (day.steps / chartMax) * 100);
            return (
              <div key={day.key} className="flex h-full flex-1 flex-col items-center justify-end">
                <div
                  className={`w-full max-w-8 rounded-t-md transition-all duration-500 ${
                    day.isToday ? 'bg-plum-900' : 'bg-plum-200'
                  }`}
                  style={{ height: `${height}%` }}
                  title={`${day.steps.toLocaleString()} 步`}
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
      </section>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {[
          { label: '步行記錄', icon: Footprints, tab: 'activity' as TabId, tone: 'bg-plum-50 text-plum-800' },
          { label: '運動紀錄', icon: Dumbbell, tab: 'exercise' as TabId, tone: 'bg-amber-50 text-amber-800' },
          { label: '飲食紀錄', icon: Utensils, tab: 'nutrition' as TabId, tone: 'bg-emerald-50 text-emerald-800' },
        ].map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.tab}
              type="button"
              onClick={() => onNavigate(action.tab)}
              className={`flex flex-col items-center gap-1.5 rounded-2xl px-2 py-3 text-sm font-black transition active:scale-[0.97] ${action.tone}`}
            >
              <Icon className="h-5 w-5" />
              {action.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-center gap-1.5 pb-2 text-xs font-medium text-slate-400">
        <Flame className="h-3.5 w-3.5" />
        活動消耗為步行與訓練的估算加總，不含基礎代謝
      </div>
    </div>
  );
}
