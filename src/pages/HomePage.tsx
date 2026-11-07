import { useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  Dumbbell,
  Flame,
  Footprints,
  MapPin,
  ShieldCheck,
  Sparkles,
  Timer,
  TrendingUp,
  Utensils,
} from 'lucide-react';
import type { Profile, TabId } from '../types';
import { getStepMetrics, isProfileComplete } from '../lib/health';
import { dateKey, loadSteps, loadWorkouts } from '../lib/storage';
import { SectionHeading } from '../components/SectionHeading';
import { InstallPrompt } from '../components/InstallPrompt';
import dogPhoto from '../assets/dog.png';

interface HomePageProps {
  profile: Profile;
  onNavigate: (tab: TabId) => void;
  onShowAbout: () => void;
  onStartOnboarding: () => void;
}

const WEEKDAY_LABELS = ['日', '一', '二', '三', '四', '五', '六'];

const CARD_CLASS =
  'rounded-[28px] border border-plum-100/80 bg-white p-5 shadow-[0_14px_40px_-28px_rgba(71,42,93,0.5)]';

const COVER_IMAGE = '/cover.png';

const SETUP_STEPS = [
  {
    title: '建立基本資料',
    description: '填寫年齡、身高與體重，建立專屬的計算基準。',
  },
  {
    title: '開始步行',
    description: '按下開始，GPS 會自動量測距離與活動時間。',
  },
  {
    title: '查看累積',
    description: '回看近 7 天、30 天與半年的步數與運動紀錄。',
  },
];

export function HomePage({
  profile,
  onNavigate,
  onShowAbout,
  onStartOnboarding,
}: HomePageProps) {
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

  return (
    <div>
      {/* 首頁第一眼：封面、標語與安心使用說明。數據留到下面再出現。 */}
      <section className="overflow-hidden rounded-[32px] border border-plum-100/80 bg-white shadow-[0_20px_50px_-32px_rgba(71,42,93,0.55)]">
        <div className="relative h-44 w-full overflow-hidden bg-plum-100">
          <img
            src={COVER_IMAGE}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover object-[center_38%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-plum-950/80 via-plum-950/10 to-transparent" />
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black tracking-[0.16em] text-plum-800 shadow-sm backdrop-blur">
            HAYLEY 健康管家
          </span>
        </div>

        <div className="relative px-5 pb-6 text-center">
          <img
            src={dogPhoto}
            alt=""
            aria-hidden="true"
            className="-mt-14 mx-auto h-28 w-28 rounded-full object-cover shadow-[0_10px_28px_-12px_rgba(71,42,93,0.6)] ring-4 ring-white"
          />
          <h1 className="mt-3 font-serif text-[34px] font-black leading-[1.2] tracking-[0.05em] text-plum-950">
            <span className="block">小習慣</span>
            <span className="block">大改變</span>
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">一步一步，把健康走成日常。</p>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={profileReady ? () => onNavigate('activity') : onStartOnboarding}
              className="flex h-12 items-center justify-center gap-1.5 rounded-2xl bg-plum-900 text-sm font-black text-white shadow-lg shadow-plum-900/20 transition hover:bg-plum-800 active:scale-[0.98]"
            >
              {profileReady ? <Footprints className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
              {profileReady ? '開始步行' : '開始設定'}
            </button>
            <button
              type="button"
              onClick={onShowAbout}
              className="flex h-12 items-center justify-center gap-1.5 rounded-2xl border border-plum-200 bg-plum-50 text-sm font-black text-plum-900 transition hover:bg-plum-100 active:scale-[0.98]"
            >
              <ShieldCheck className="h-4 w-4" />
              安心使用
            </button>
          </div>
        </div>
      </section>

      <button
        type="button"
        onClick={onShowAbout}
        className="mt-4 flex w-full items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3.5 text-left transition hover:bg-emerald-50 active:scale-[0.99]"
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-emerald-700 shadow-sm">
          <ShieldCheck className="h-5 w-5" strokeWidth={2.2} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-black text-emerald-900">安心使用</span>
          <span className="mt-0.5 block text-[13px] leading-6 text-emerald-900/75">
            無帳號、無上傳，GPS 只在手機內運算。所有紀錄都只留在這台裝置。
          </span>
        </span>
        <ChevronRight className="mt-2 h-4 w-4 shrink-0 text-emerald-600" />
      </button>

      {!profileReady ? (
        <section className={`mt-4 ${CARD_CLASS}`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-black tracking-[0.18em] text-plum-600">GET STARTED</p>
              <h2 className="mt-1 text-xl font-black tracking-tight text-slate-900">
                三個步驟，開始記錄
              </h2>
              <p className="mt-1.5 text-sm leading-6 text-slate-500">
                第一次使用約一分鐘，完成後才會出現你的專屬數據。
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-black text-amber-800">
              1 分鐘
            </span>
          </div>

          <ol className="mt-4 space-y-2.5">
            {SETUP_STEPS.map((item, index) => (
              <li key={item.title} className="flex items-start gap-3 rounded-2xl bg-slate-50/80 p-3.5">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-plum-900 text-xs font-black text-amber-100">
                  {index + 1}
                </span>
                <span>
                  <span className="block text-sm font-black text-slate-900">{item.title}</span>
                  <span className="mt-0.5 block text-[13px] leading-6 text-slate-500">
                    {item.description}
                  </span>
                </span>
              </li>
            ))}
          </ol>

          <button
            type="button"
            onClick={onStartOnboarding}
            className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-plum-900 text-base font-black text-white shadow-lg shadow-plum-900/20 transition hover:bg-plum-800 active:scale-[0.99]"
          >
            開始引導設定
            <ArrowRight className="h-5 w-5" />
          </button>
        </section>
      ) : (
        <>
          <section className="relative mt-4 overflow-hidden rounded-[28px] bg-gradient-to-br from-plum-950 via-plum-900 to-plum-800 p-5 text-white shadow-[0_24px_50px_-30px_rgba(47,26,63,0.9)]">
            <div className="pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full bg-white/5" />
            <div className="pointer-events-none absolute -bottom-20 -left-12 h-40 w-40 rounded-full bg-white/5" />

            <div className="relative flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold tracking-[0.06em] text-plum-200">今天的身體</p>
                <div className="mt-1.5 flex items-baseline gap-1.5">
                  <span className="text-[42px] font-black leading-none tracking-tight tabular-nums">
                    {steps.toLocaleString()}
                  </span>
                  <span className="text-sm font-bold text-plum-200">步</span>
                </div>
                <p className="mt-2 text-[13px] font-semibold text-plum-300">
                  今日活動消耗 {totalCalories.toLocaleString()} kcal
                </p>
              </div>
              <div className="shrink-0 rounded-2xl bg-white/10 px-3.5 py-2.5 text-center backdrop-blur-sm">
                <p className="text-[10px] font-bold text-plum-200">步數目標</p>
                <p className="mt-0.5 text-xl font-black leading-none tabular-nums text-amber-200">
                  {progress}%
                </p>
              </div>
            </div>

            <div className="relative mt-4 h-2 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-200 to-amber-300 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="relative mt-4 grid grid-cols-3 gap-2 border-t border-white/10 pt-4">
              <div>
                <p className="flex items-center gap-1.5 text-[11px] font-semibold text-plum-200">
                  <Footprints className="h-3.5 w-3.5" /> 步數
                </p>
                <p className="mt-1 text-xl font-black leading-none tabular-nums">
                  {steps.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="flex items-center gap-1.5 text-[11px] font-semibold text-plum-200">
                  <MapPin className="h-3.5 w-3.5" /> 距離
                </p>
                <p className="mt-1 flex items-baseline gap-1 text-xl font-black leading-none tabular-nums">
                  {distanceKm.toFixed(2)}
                  <span className="text-[11px] font-semibold text-plum-200">km</span>
                </p>
              </div>
              <div>
                <p className="flex items-center gap-1.5 text-[11px] font-semibold text-plum-200">
                  <Timer className="h-3.5 w-3.5" /> 活動
                </p>
                <p className="mt-1 flex items-baseline gap-1 text-xl font-black leading-none tabular-nums">
                  {totalMinutes}
                  <span className="text-[11px] font-semibold text-plum-200">分</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('activity')}
              className="relative mt-4 flex w-full items-center justify-between rounded-2xl bg-white/10 px-3.5 py-2.5 text-left text-[13px] font-bold text-plum-100 transition hover:bg-white/15"
            >
              查看今日動能與累積紀錄
              <ChevronRight className="h-4 w-4" />
            </button>
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
        </>
      )}

      <InstallPrompt />

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

      <button
        type="button"
        onClick={() => onNavigate('exercise')}
        className="mt-4 flex w-full items-center gap-3.5 overflow-hidden rounded-[26px] bg-gradient-to-br from-amber-100 via-amber-50 to-white p-4 text-left shadow-sm ring-1 ring-amber-200/80 transition hover:shadow-md active:scale-[0.99]"
      >
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-plum-900 text-amber-200 shadow-md shadow-plum-900/20">
          <Dumbbell className="h-6 w-6" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[10px] font-black tracking-[0.16em] text-amber-800">
            WEIGHTLIFTING
          </span>
          <span className="mt-0.5 block text-lg font-black text-slate-900">舉重專欄</span>
          <span className="mt-0.5 block text-[13px] leading-5 text-slate-600">
            硬拉解剖學、正確姿勢與常見代償錯誤
          </span>
        </span>
        <ArrowUpRight className="h-5 w-5 shrink-0 text-plum-700" />
      </button>

      {profileReady && (
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
                {weekCalories.toLocaleString()}
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
      )}

      <div className="mt-5 flex items-center justify-center gap-1.5 pb-2 text-xs font-medium text-slate-400">
        <Flame className="h-3.5 w-3.5" />
        活動消耗為步行與訓練的估算加總，不含基礎代謝
      </div>
    </div>
  );
}
