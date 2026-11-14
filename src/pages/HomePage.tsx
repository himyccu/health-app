import { useState } from 'react';
import {
  ArrowRight,
  ChevronRight,
  Dumbbell,
  Flame,
  Footprints,
  MapPin,
  ShieldCheck,
  Timer,
  TrendingUp,
  Wind,
  BookOpen,
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
  onOpenBasics: () => void;
  onOpenGuide: (guideId: 'warmup' | 'safety') => void;
  onStartOnboarding: () => void;
}

const WEEKDAY_LABELS = ['日', '一', '二', '三', '四', '五', '六'];

const CARD_CLASS =
  'rounded-[28px] border border-plum-100/80 bg-white p-5 shadow-[0_14px_40px_-28px_rgba(71,42,93,0.5)]';

const SETUP_STEPS = [
  {
    title: '建立基本資料',
    description: '填寫年齡、身高與體重。',
  },
  {
    title: '開始步行',
    description: '按開始，GPS 記錄距離與活動時間。',
  },
  {
    title: '查看累積',
    description: '回看近 7 天、30 天與半年的紀錄。',
  },
];

// 首頁的學習順序：暖身 → 安全 → 動作。編號固定，不可打亂。
const START_HERE = [
  {
    id: 'warmup' as const,
    step: '1',
    icon: Wind,
    title: '暖身與筋膜放鬆',
    description: '運動前 5 分鐘的動態暖身與滾筒放鬆。',
    action: '閱讀',
  },
  {
    id: 'safety' as const,
    step: '2',
    icon: ShieldCheck,
    title: '運動安全',
    description: '疼痛警訊、呼吸方式與負荷原則。',
    action: '閱讀',
  },
  {
    id: 'basics' as const,
    step: '3',
    icon: BookOpen,
    title: '基礎動作',
    description: '推、拉、蹲、髖、移動五種動作模式。',
    action: '查看',
  },
];

export function HomePage({
  profile,
  onNavigate,
  onOpenBasics,
  onOpenGuide,
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

  // GPS 步行的時間已計入 activeMinutes，熱量也已包含在步數熱量裡，
  // 因此只加訓練熱量，避免同一次步行被算兩次。
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

  const handleStartHere = (id: 'warmup' | 'safety' | 'basics') => {
    if (id === 'basics') onOpenBasics();
    else onOpenGuide(id);
  };

  return (
    <div>
      {/* 1. 今日摘要 */}
      {profileReady ? (
        <section className="overflow-hidden rounded-[28px] bg-gradient-to-br from-plum-950 via-plum-900 to-plum-800 text-white shadow-[0_24px_50px_-30px_rgba(47,26,63,0.9)]">
          <div className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-bold tracking-[0.06em] text-plum-200">今天</p>
                <div className="mt-2 flex flex-wrap items-baseline gap-1.5">
                  <span className="text-[clamp(34px,11vw,44px)] font-black leading-none tracking-tight tabular-nums">
                    {steps.toLocaleString()}
                  </span>
                  <span className="text-[15px] font-bold text-plum-200">步</span>
                </div>
                <p className="mt-2 text-[13px] font-semibold text-plum-300">
                  活動消耗 {totalCalories.toLocaleString()} kcal（估算）
                </p>
              </div>
              <img
                src={dogPhoto}
                alt=""
                aria-hidden="true"
                className="h-20 w-20 shrink-0 rounded-full object-cover ring-4 ring-white/85 sm:h-24 sm:w-24"
              />
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-200 to-amber-300 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-1.5 text-[13px] font-semibold text-plum-300">
              今日目標 {snapshot.steps.goal.toLocaleString()} 步 · 已達成 {progress}%
            </p>

            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/10 pt-4">
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-[13px] font-semibold text-plum-200">
                  <Footprints className="h-4 w-4 shrink-0" /> 步數
                </p>
                <p className="mt-1 text-[18px] font-black leading-none tabular-nums">
                  {steps.toLocaleString()}
                </p>
              </div>
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-[13px] font-semibold text-plum-200">
                  <MapPin className="h-4 w-4 shrink-0" /> 距離
                </p>
                <p className="mt-1 flex flex-wrap items-baseline gap-1 text-[18px] font-black leading-none tabular-nums">
                  {distanceKm.toFixed(2)}
                  <span className="text-[13px] font-semibold text-plum-200">km</span>
                </p>
              </div>
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-[13px] font-semibold text-plum-200">
                  <Timer className="h-4 w-4 shrink-0" /> 活動
                </p>
                <p className="mt-1 flex flex-wrap items-baseline gap-1 text-[18px] font-black leading-none tabular-nums">
                  {totalMinutes}
                  <span className="text-[13px] font-semibold text-plum-200">分</span>
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onNavigate('activity')}
                className="flex min-h-[3.5rem] items-center justify-center gap-2 rounded-2xl bg-amber-300 px-3 text-[16px] font-black text-plum-950 shadow-lg shadow-plum-950/20 transition hover:bg-amber-200 active:scale-[0.98]"
              >
                <Footprints className="h-5 w-5 shrink-0" />
                開始步行
              </button>
              <button
                type="button"
                onClick={onOpenBasics}
                className="flex min-h-[3.5rem] items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-3 text-[16px] font-black text-white transition hover:bg-white/20 active:scale-[0.98]"
              >
                <BookOpen className="h-5 w-5 shrink-0" />
                基礎動作
              </button>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('activity')}
              className="mt-2 flex min-h-11 w-full items-center justify-between rounded-2xl px-1 text-left text-[13px] font-bold text-plum-200 transition hover:text-white"
            >
              查看今日動能與累積紀錄
              <ChevronRight className="h-4 w-4 shrink-0" />
            </button>
          </div>
        </section>
      ) : (
        <section className={CARD_CLASS}>
          <SectionHeading icon={Footprints} title="建立你的紀錄基準" subtitle="完成設定後才會顯示數字" />
          <ol className="mt-4 space-y-3">
            {SETUP_STEPS.map((item, index) => (
              <li key={item.title} className="flex items-start gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-plum-900 text-[13px] font-black text-amber-100">
                  {index + 1}
                </span>
                <span className="min-w-0">
                  <span className="block text-[15px] font-black text-slate-900">{item.title}</span>
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
            className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-plum-900 text-[16px] font-black text-white shadow-lg shadow-plum-900/20 transition hover:bg-plum-800 active:scale-[0.99]"
          >
            開始設定
            <ArrowRight className="h-5 w-5" />
          </button>
        </section>
      )}

      {/* 2. 開始之前 */}
      <section className={`mt-4 ${CARD_CLASS}`}>
        <SectionHeading
          icon={ShieldCheck}
          title="開始之前"
          subtitle="依照編號順序，三到五分鐘讀完。"
        />

        <div className="mt-4 space-y-2.5">
          {START_HERE.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleStartHere(item.id)}
                className="flex w-full items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3.5 text-left transition hover:border-plum-200 hover:bg-plum-50/60 active:scale-[0.99]"
              >
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-plum-900 text-[13px] font-black text-amber-100">
                  {item.step}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    <Icon className="h-4 w-4 shrink-0 text-plum-700" />
                    <span className="text-[16px] font-black text-slate-900">{item.title}</span>
                  </span>
                  <span className="mt-1 block text-[13px] leading-6 text-slate-500">
                    {item.description}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-0.5 text-[13px] font-black text-plum-700">
                  {item.action}
                  <ChevronRight className="h-4 w-4" />
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. 本週累積 */}
      {profileReady && (
        <section className={`mt-4 ${CARD_CLASS}`}>
          <SectionHeading icon={TrendingUp} title="本週累積" subtitle="近 7 天" />

          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="min-w-0 rounded-2xl bg-plum-50 px-3 py-3">
              <p className="text-[13px] font-semibold text-plum-600">步數</p>
              <p className="mt-1 text-[18px] font-black leading-none tabular-nums text-plum-900">
                {weekSteps.toLocaleString()}
              </p>
            </div>
            <div className="min-w-0 rounded-2xl bg-emerald-50 px-3 py-3">
              <p className="text-[13px] font-semibold text-emerald-700">活動時間</p>
              <p className="mt-1 flex flex-wrap items-baseline gap-0.5 text-[18px] font-black leading-none tabular-nums text-emerald-900">
                {weekMinutes.toLocaleString()}
                <span className="text-[13px] font-semibold text-emerald-600">分</span>
              </p>
            </div>
            <div className="min-w-0 rounded-2xl bg-amber-50 px-3 py-3">
              <p className="text-[13px] font-semibold text-amber-700">消耗</p>
              <p className="mt-1 flex flex-wrap items-baseline gap-0.5 text-[18px] font-black leading-none tabular-nums text-amber-900">
                {weekCalories.toLocaleString()}
                <span className="text-[13px] font-semibold text-amber-600">kcal</span>
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
                    className={`mt-2 text-[13px] font-semibold ${
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

      {/* 4. 今日運動 */}
      {profileReady && (
        <section className={`mt-4 ${CARD_CLASS}`}>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <SectionHeading icon={Dumbbell} title="今日運動" subtitle="肌力、有氧與核心" />
            <button
              type="button"
              onClick={() => onNavigate('exercise')}
              className="flex min-h-11 shrink-0 items-center gap-0.5 rounded-full bg-plum-50 px-3.5 text-[15px] font-black text-plum-900 transition hover:bg-plum-100"
            >
              前往記錄
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {todayWorkouts.length > 0 ? (
            <>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-plum-900 px-3 py-1.5 text-[13px] font-bold text-white">
                  {todayWorkouts.length} 筆紀錄
                </span>
                <span className="rounded-full bg-amber-100 px-3 py-1.5 text-[13px] font-bold text-amber-800">
                  {todayLoggedCalories} kcal
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[13px] font-bold text-slate-600">
                  {todayLoggedMinutes} 分鐘
                </span>
              </div>
              <div className="mt-3 space-y-2">
                {todayWorkouts.slice(0, 3).map((workout) => (
                  <div
                    key={workout.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-slate-50 px-4 py-3"
                  >
                    <span className="min-w-0 text-[15px] font-bold text-slate-800">{workout.name}</span>
                    <span className="shrink-0 text-[13px] font-semibold text-slate-500">
                      {workout.minutes} 分鐘 · {workout.calories} kcal
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="mt-4 rounded-2xl bg-slate-50 px-4 py-3.5 text-[15px] leading-relaxed text-slate-500">
              今天還沒有運動紀錄。完成訓練後記下來，熱量會加進今日活動消耗。
            </p>
          )}
        </section>
      )}

      <InstallPrompt />

      <div className="mt-5 flex items-center justify-center gap-1.5 pb-2 text-[13px] font-medium text-slate-400">
        <Flame className="h-4 w-4 shrink-0" />
        活動消耗為步行與訓練的估算加總，不含基礎代謝
      </div>
    </div>
  );
}
