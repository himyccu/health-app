import { useState } from 'react';
import {
  Activity,
  ArrowRight,
  BookOpen,
  ChevronRight,
  Dumbbell,
  Flame,
  Footprints,
  HeartPulse,
  MapPin,
  ShieldCheck,
  Target,
  Timer,
  TrendingUp,
  Utensils,
} from 'lucide-react';
import type { Profile, TabId } from '../types';
import {
  calcBmi,
  calcTdee,
  getBmiCategory,
  getIdealWeightRange,
  getStepMetrics,
  isProfileComplete,
} from '../lib/health';
import { dateKey, loadSteps, loadWorkouts } from '../lib/storage';
import { KNOWLEDGE_CARDS } from '../data/knowledgeCenter';
import { SectionHeading } from '../components/SectionHeading';
import { InstallPrompt } from '../components/InstallPrompt';
import dogPhoto from '../assets/dog.png';

interface HomePageProps {
  profile: Profile;
  onNavigate: (tab: TabId) => void;
  onOpenKnowledge: () => void;
  onShowAbout: () => void;
  onStartOnboarding: () => void;
}

const WEEKDAY_LABELS = ['日', '一', '二', '三', '四', '五', '六'];

const CARD_CLASS =
  'rounded-[28px] border border-plum-100/80 bg-white p-5 shadow-[0_14px_40px_-28px_rgba(71,42,93,0.5)]';

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

const BEGINNER_CONCEPTS = [
  {
    icon: Activity,
    title: '基礎運動醫學',
    description: '先認識肌肉、關節與恢復，理解身體如何適應訓練。',
    tone: 'bg-plum-50 text-plum-700',
  },
  {
    icon: ShieldCheck,
    title: '運動安全',
    description: '暖身、呼吸、疼痛警訊與循序負荷，比拚重量更重要。',
    tone: 'bg-emerald-50 text-emerald-700',
  },
  {
    icon: BookOpen,
    title: '基礎動作模式',
    description: '推、拉、蹲、髖、移動，涵蓋日常與訓練的主要模式。',
    tone: 'bg-amber-50 text-amber-700',
  },
];

export function HomePage({
  profile,
  onNavigate,
  onOpenKnowledge,
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

  const bmiRaw = profileReady ? calcBmi(profile.weight, profile.height) : 0;
  const bmi = Math.round(bmiRaw * 10) / 10;
  const bmiCategory = getBmiCategory(bmiRaw);
  const tdee = profileReady ? calcTdee(profile) : 0;
  const ideal = profileReady ? getIdealWeightRange(profile.height) : null;

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
      {/* 第一階段：先建立觀念，再進入個人化設定。 */}
      <section className="overflow-hidden rounded-[32px] border border-plum-100 bg-white shadow-[0_20px_50px_-32px_rgba(71,42,93,0.55)]">
        <div className="bg-gradient-to-br from-plum-950 via-plum-900 to-plum-800 px-5 pb-6 pt-6 text-white">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-amber-300 px-3 py-1 text-[11px] font-black tracking-[0.12em] text-plum-950">
              新手入門
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-plum-100 ring-1 ring-white/15">
              運動醫學導引
            </span>
          </div>

          <h1 className="mt-4 font-serif text-[32px] font-black leading-[1.25] tracking-[0.04em]">
            先懂身體，
            <br />
            再開始變強
          </h1>
          <p className="mt-3 max-w-[22rem] text-[15px] leading-7 text-plum-100">
            從呼吸、脊柱中立與基礎動作開始，建立一輩子可用的訓練底子。
          </p>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={profileReady ? () => onNavigate('activity') : onStartOnboarding}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-amber-300 text-sm font-black text-plum-950 shadow-lg shadow-plum-950/20 transition hover:bg-amber-200 active:scale-[0.98]"
            >
              {profileReady ? <Footprints className="h-4 w-4" /> : <HeartPulse className="h-4 w-4" />}
              {profileReady ? '開始步行' : '開始設定'}
            </button>
            <button
              type="button"
              onClick={onOpenKnowledge}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 text-sm font-black text-white transition hover:bg-white/15 active:scale-[0.98]"
            >
              <BookOpen className="h-4 w-4" />
              運動姿勢庫
            </button>
          </div>

          <button
            type="button"
            onClick={onShowAbout}
            className="mt-3 flex w-full items-center gap-2 rounded-2xl bg-white/10 px-3.5 py-3 text-left ring-1 ring-white/10 transition hover:bg-white/15"
          >
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-200" />
            <span className="min-w-0 flex-1 text-[13px] font-semibold leading-5 text-plum-100">
              無帳號、無上傳，紀錄只留在這台裝置。
            </span>
            <ChevronRight className="h-4 w-4 shrink-0 text-plum-200" />
          </button>
        </div>
      </section>

      <section className={`mt-4 ${CARD_CLASS}`}>
        <SectionHeading
          icon={BookOpen}
          title="先懂再做，練得更久"
          subtitle="新手入門的三個基礎"
        />

        <div className="mt-4 space-y-2.5">
          {BEGINNER_CONCEPTS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex items-start gap-3 rounded-2xl bg-slate-50/80 p-3.5"
              >
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${item.tone}`}
                >
                  <Icon className="h-4 w-4" strokeWidth={2.2} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-black text-slate-900">{item.title}</p>
                  <p className="mt-0.5 text-[13px] leading-6 text-slate-500">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4">
          <p className="text-xs font-black tracking-[0.14em] text-plum-600">常見動作模式</p>
          <div className="mt-2 grid grid-cols-5 gap-1.5">
            {KNOWLEDGE_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={onOpenKnowledge}
                  aria-label={`前往${card.title}教學`}
                  className="flex min-w-0 flex-col items-center gap-1 rounded-xl border border-slate-100 bg-white px-1 py-2.5 text-center transition hover:border-plum-200 hover:bg-plum-50 active:scale-[0.97]"
                >
                  <Icon className="h-5 w-5 text-plum-700" strokeWidth={2} />
                  <span className="text-xs font-black text-slate-700">{card.shortLabel}</span>
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={onOpenKnowledge}
            className="mt-2.5 flex h-11 w-full items-center justify-center gap-1.5 rounded-2xl border border-plum-200 bg-plum-50 text-sm font-black text-plum-900 transition hover:bg-plum-100 active:scale-[0.99]"
          >
            前往運動姿勢庫
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* 第二階段：個人化健康參數與互動功能。 */}
      {profileReady ? (
        <section className={`mt-4 ${CARD_CLASS}`}>
          <div className="flex items-start justify-between gap-2">
            <SectionHeading
              icon={HeartPulse}
              title="你的健康參數"
              subtitle="依目前資料估算"
            />
            <button
              type="button"
              onClick={() => onNavigate('health')}
              className="flex shrink-0 items-center gap-0.5 rounded-full bg-plum-50 px-3 py-2 text-sm font-black text-plum-900 transition hover:bg-plum-100"
            >
              健康指數
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="min-w-0 rounded-2xl bg-plum-50 p-3">
              <p className="text-xs font-bold text-plum-600">BMI</p>
              <p className="mt-1 text-2xl font-black leading-none tabular-nums text-plum-900">
                {bmi.toFixed(1)}
              </p>
              <p className="mt-1 text-xs font-semibold text-plum-700">{bmiCategory.label}</p>
            </div>
            <div className="min-w-0 rounded-2xl bg-amber-50 p-3">
              <p className="text-xs font-bold text-amber-700">TDEE</p>
              <p className="mt-1 text-2xl font-black leading-none tabular-nums text-amber-900">
                {tdee.toLocaleString()}
              </p>
              <p className="mt-1 text-xs font-semibold text-amber-700">kcal / 日</p>
            </div>
            <div className="min-w-0 rounded-2xl bg-emerald-50 p-3">
              <p className="text-xs font-bold text-emerald-700">理想體重</p>
              <p className="mt-1 whitespace-nowrap text-lg font-black leading-none tabular-nums text-emerald-900">
                {ideal ? `${ideal.min}–${ideal.max}` : '—'}
              </p>
              <p className="mt-1 text-xs font-semibold text-emerald-700">kg</p>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-slate-50 px-3.5 py-3">
            <span className="flex items-center gap-2 text-sm font-bold text-slate-700">
              <Target className="h-4 w-4 text-plum-600" />
              每日步數目標
            </span>
            <span className="text-sm font-black tabular-nums text-plum-900">
              {snapshot.steps.goal.toLocaleString()} 步
            </span>
          </div>
        </section>
      ) : (
        <section className={`mt-4 ${CARD_CLASS}`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-black tracking-[0.18em] text-plum-600">PERSONALIZE</p>
              <h2 className="mt-1 text-xl font-black tracking-tight text-slate-900">
                建立你的健康基準
              </h2>
              <p className="mt-1.5 text-sm leading-6 text-slate-500">
                填寫年齡、身高與體重，才能看到 BMI、TDEE 與步數目標。
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
                <span className="min-w-0">
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
      )}

      {profileReady && (
        <>
          <section className="mt-4 overflow-hidden rounded-[28px] bg-gradient-to-br from-plum-950 via-plum-900 to-plum-800 p-5 text-white shadow-[0_24px_50px_-30px_rgba(47,26,63,0.9)]">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-bold tracking-[0.06em] text-plum-200">今天的身體</p>
                <div className="mt-1.5 flex flex-wrap items-baseline gap-1.5">
                  <span className="text-[42px] font-black leading-none tracking-tight tabular-nums">
                    {steps.toLocaleString()}
                  </span>
                  <span className="text-sm font-bold text-plum-200">步</span>
                </div>
                <p className="mt-2 text-[13px] font-semibold text-plum-300">
                  今日活動消耗 {totalCalories.toLocaleString()} kcal
                </p>
              </div>
              <div className="shrink-0 rounded-2xl bg-white/10 px-3.5 py-2.5 text-center">
                <p className="text-[10px] font-bold text-plum-200">步數目標</p>
                <p className="mt-0.5 text-xl font-black leading-none tabular-nums text-amber-200">
                  {progress}%
                </p>
              </div>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-200 to-amber-300 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/10 pt-4">
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold text-plum-200">
                  <Footprints className="h-3.5 w-3.5" /> 步數
                </p>
                <p className="mt-1 text-xl font-black leading-none tabular-nums">
                  {steps.toLocaleString()}
                </p>
              </div>
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold text-plum-200">
                  <MapPin className="h-3.5 w-3.5" /> 距離
                </p>
                <p className="mt-1 flex flex-wrap items-baseline gap-1 text-xl font-black leading-none tabular-nums">
                  {distanceKm.toFixed(2)}
                  <span className="text-[11px] font-semibold text-plum-200">km</span>
                </p>
              </div>
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold text-plum-200">
                  <Timer className="h-3.5 w-3.5" /> 活動
                </p>
                <p className="mt-1 flex flex-wrap items-baseline gap-1 text-xl font-black leading-none tabular-nums">
                  {totalMinutes}
                  <span className="text-[11px] font-semibold text-plum-200">分</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('activity')}
              className="mt-4 flex w-full items-center justify-between rounded-2xl bg-white/10 px-3.5 py-2.5 text-left text-[13px] font-bold text-plum-100 transition hover:bg-white/15"
            >
              查看今日動能與累積紀錄
              <ChevronRight className="h-4 w-4" />
            </button>
          </section>

          <section className={`mt-4 ${CARD_CLASS}`}>
            <div className="flex flex-wrap items-start justify-between gap-2">
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
                      className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-slate-50 px-4 py-3"
                    >
                      <span className="min-w-0 text-sm font-bold text-slate-800">{workout.name}</span>
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
              className={`flex min-w-0 flex-col items-center gap-2 rounded-2xl px-2 py-4 text-sm font-bold transition active:scale-[0.97] ${action.tone}`}
            >
              <Icon className="h-5 w-5" />
              {action.label}
            </button>
          );
        })}
      </div>

      <section className="mt-4 flex items-start gap-3 rounded-[24px] border border-amber-200 bg-amber-50/70 p-4">
        <img
          src={dogPhoto}
          alt=""
          aria-hidden="true"
          className="h-11 w-11 shrink-0 rounded-full object-cover shadow-sm ring-2 ring-white"
        />
        <div className="min-w-0">
          <p className="text-[11px] font-black tracking-[0.14em] text-amber-800">TRAINING TIP</p>
          <p className="mt-0.5 text-sm font-black text-amber-950">訓練小錦囊</p>
          <p className="mt-1 text-[13px] leading-6 text-amber-900/80">
            先求動作正確，再求重量進步。今天只要比昨天多走一點，就是進步。
          </p>
        </div>
      </section>

      {profileReady && (
        <section className={`mt-4 ${CARD_CLASS}`}>
          <SectionHeading icon={TrendingUp} title="本週累積" subtitle="近 7 天步數與運動" />

          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="min-w-0 rounded-2xl bg-plum-50 px-3 py-3">
              <p className="text-xs font-semibold text-plum-600">步數</p>
              <p className="mt-1 text-lg font-black leading-none tabular-nums text-plum-900">
                {weekSteps.toLocaleString()}
              </p>
            </div>
            <div className="min-w-0 rounded-2xl bg-emerald-50 px-3 py-3">
              <p className="text-xs font-semibold text-emerald-700">活動時間</p>
              <p className="mt-1 flex flex-wrap items-baseline gap-0.5 text-lg font-black leading-none tabular-nums text-emerald-900">
                {weekMinutes.toLocaleString()}
                <span className="text-xs font-semibold text-emerald-600">分</span>
              </p>
            </div>
            <div className="min-w-0 rounded-2xl bg-amber-50 px-3 py-3">
              <p className="text-xs font-semibold text-amber-700">消耗</p>
              <p className="mt-1 flex flex-wrap items-baseline gap-0.5 text-lg font-black leading-none tabular-nums text-amber-900">
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
