import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Brush,
  Check,
  ChevronRight,
  Dumbbell,
  Flame,
  Flower2,
  Info,
  Plus,
  ShieldCheck,
  StretchHorizontal,
  Timer,
  Trash2,
  Wind,
  X,
  type LucideIcon,
} from 'lucide-react';
import type { ExerciseCategory, ExerciseDefinition, Profile, WorkoutEntry } from '../types';
import {
  CATEGORY_LABELS,
  EXERCISES,
  EXERCISE_MAP,
  MUSCLE_LABELS,
  PATTERN_LABELS,
} from '../data/exercises';
import {
  MET_FORMULA_TEXT,
  MET_SOURCE_TEXT,
  calcExerciseCalories,
} from '../lib/exercise';
import { dateKey, loadWorkouts, saveWorkouts } from '../lib/storage';
import { PageHeader } from '../components/PageHeader';
import { SectionHeading } from '../components/SectionHeading';
import { GuideRow } from '../components/GuideRow';
import { AnatomyFigure } from '../components/AnatomyFigure';
import { KnowledgeArticle } from '../components/KnowledgeArticle';
import { GuideArticle } from '../components/GuideArticle';
import { GolfGuide } from '../components/GolfGuide';
import { TennisGuide } from '../components/TennisGuide';
import { MobilityGuide } from '../components/MobilityGuide';
import { MovementCards } from '../components/MovementCards';
import { GUIDES, type GuideId } from '../data/guides';
import { FoamRollingGuide } from '../components/FoamRollingGuide';
import {
  ARTICLE_ID_BY_PATTERN,
  PATTERN_ARTICLES,
  type KnowledgePatternId,
} from '../data/knowledgeCenter';
import { getExerciseAnatomy } from '../data/anatomy';

interface ExercisePageProps {
  profile: Profile;
  initialView?: 'main' | 'article' | 'guide';
  initialTab?: 'log' | 'teach';
  initialArticleId?: KnowledgePatternId | null;
  initialGuideId?: GuideId | null;
  onNotify: (message: string) => void;
  onGoHome: () => void;
  onOpenArticle: (articleId: KnowledgePatternId) => void;
}

type View = 'tabs' | 'detail' | 'article' | 'guide';
type MainTab = 'log' | 'teach';

const CARD = 'rounded-[28px] border border-plum-100 bg-white p-5 shadow-sm shadow-plum-900/5';

const CATEGORY_TABS: { id: 'all' | ExerciseCategory; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'cardio', label: CATEGORY_LABELS.cardio },
  { id: 'strength', label: CATEGORY_LABELS.strength },
  { id: 'core', label: CATEGORY_LABELS.core },
  { id: 'mobility', label: CATEGORY_LABELS.mobility },
];

/** 教學頁的固定順序：先動作模式，再暖身、安全與伸展。 */
const TEACH_GUIDES: { id: GuideId; icon: LucideIcon; description: string }[] = [
  {
    id: 'warmup',
    icon: Wind,
    description: '運動前 5 分鐘的動態暖身與滾筒放鬆。',
  },
  {
    id: 'safety',
    icon: ShieldCheck,
    description: '疼痛警訊、呼吸方式與負荷原則。',
  },
  {
    id: 'foamRolling',
    icon: Brush,
    description: '六個部位由下往上，每個 90 秒。',
  },
  {
    id: 'stretching',
    icon: StretchHorizontal,
    description: '八個部位，每個 30 秒 × 2–4 次。',
  },
  {
    id: 'yoga',
    icon: Flower2,
    description: '十六個基本體位，含替代動作。',
  },
];

/** 球類項目的技術教學入口 */
const SPORT_GUIDE_BY_EXERCISE: Record<string, GuideId> = {
  'golf-practice': 'golf',
  'golf-round': 'golf',
  tennis: 'tennis',
};

function newId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function ExercisePage({
  profile,
  initialView = 'main',
  initialTab = 'log',
  initialArticleId = null,
  initialGuideId = null,
  onNotify,
  onGoHome,
  onOpenArticle,
}: ExercisePageProps) {
  const [view, setView] = useState<View>(initialView === 'main' ? 'tabs' : initialView);
  const [tab, setTab] = useState<MainTab>(initialTab);
  const [articleId, setArticleId] = useState<KnowledgePatternId | null>(initialArticleId);
  const [guideId, setGuideId] = useState<GuideId | null>(initialGuideId);
  const [filter, setFilter] = useState<'all' | ExerciseCategory>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [minutesInput, setMinutesInput] = useState('20');
  const [setsInput, setSetsInput] = useState('');
  const [repsInput, setRepsInput] = useState('');
  const [workouts, setWorkouts] = useState<WorkoutEntry[]>(() => loadWorkouts());
  const topRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [view, tab, selectedId]);

  const today = dateKey();
  const todayWorkouts = useMemo(
    () =>
      workouts
        .filter((workout) => workout.date === today)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [workouts, today],
  );

  const totalMinutes = todayWorkouts.reduce((sum, workout) => sum + workout.minutes, 0);
  const totalCalories = todayWorkouts.reduce((sum, workout) => sum + workout.calories, 0);

  const trainedMuscles = useMemo(() => {
    const muscles = new Set<string>();
    todayWorkouts.forEach((workout) => {
      const exercise = EXERCISE_MAP.get(workout.exerciseId);
      exercise?.primaryMuscles.forEach((muscle) => muscles.add(MUSCLE_LABELS[muscle]));
    });
    return [...muscles];
  }, [todayWorkouts]);

  const visibleExercises = useMemo(
    () => (filter === 'all' ? EXERCISES : EXERCISES.filter((item) => item.category === filter)),
    [filter],
  );

  const selected = selectedId ? (EXERCISE_MAP.get(selectedId) ?? null) : null;
  const selectedAnatomy = selected ? getExerciseAnatomy(selected.id) : null;
  const relatedArticleId = selected ? ARTICLE_ID_BY_PATTERN[selected.pattern] : undefined;
  const selectedGuideId = selected ? SPORT_GUIDE_BY_EXERCISE[selected.id] : undefined;
  const minutes = Number(minutesInput);
  const validMinutes = Number.isFinite(minutes) && minutes > 0;
  const weightReady = profile.weight > 0;
  const estimatedCalories =
    selected && validMinutes && weightReady
      ? calcExerciseCalories(selected.met, profile.weight, minutes)
      : 0;
  const showSetsReps = selected?.category === 'strength' || selected?.category === 'core';

  const openExercise = (exercise: ExerciseDefinition) => {
    setSelectedId(exercise.id);
    setMinutesInput('20');
    setSetsInput('');
    setRepsInput('');
    setView('detail');
  };

  const goMain = (nextTab: MainTab = 'log') => {
    setView('tabs');
    setTab(nextTab);
  };

  const handleSave = () => {
    if (!selected) return;
    if (!weightReady) {
      onNotify('請先到「設定」填寫體重，才能依 MET 估算熱量');
      return;
    }
    if (!validMinutes) {
      onNotify('請輸入正確的運動時間');
      return;
    }

    const sets = Number(setsInput);
    const reps = Number(repsInput);
    const entry: WorkoutEntry = {
      id: newId(),
      date: today,
      createdAt: new Date().toISOString(),
      exerciseId: selected.id,
      name: selected.name,
      minutes: Math.round(minutes),
      sets: Number.isFinite(sets) && sets > 0 ? Math.round(sets) : undefined,
      reps: Number.isFinite(reps) && reps > 0 ? Math.round(reps) : undefined,
      met: selected.met,
      calories: estimatedCalories,
    };

    const next = [...workouts, entry];
    setWorkouts(next);
    saveWorkouts(next);
    onNotify(`已記錄 ${selected.name} ${entry.minutes} 分鐘，約 ${entry.calories} kcal`);
    setSetsInput('');
    setRepsInput('');
    setSelectedId(null);
    goMain('log');
  };

  const handleDelete = (id: string) => {
    const next = workouts.filter((workout) => workout.id !== id);
    setWorkouts(next);
    saveWorkouts(next);
    onNotify('已刪除運動紀錄');
  };

  return (
    <div>
      <div ref={topRef} />

      {view === 'article' && articleId ? (
        <KnowledgeArticle
          key={articleId}
          article={PATTERN_ARTICLES[articleId]}
          onBack={() => goMain('teach')}
        />
      ) : view === 'guide' && guideId === 'foamRolling' ? (
        <FoamRollingGuide
          key={guideId}
          summary={GUIDES.foamRolling.summary}
          minutes={GUIDES.foamRolling.minutes}
          onBack={() => goMain('teach')}
        />
      ) : view === 'guide' && guideId === 'golf' ? (
        <GolfGuide key={guideId} minutes={GUIDES.golf.minutes} onBack={() => goMain('teach')} />
      ) : view === 'guide' && guideId === 'tennis' ? (
        <TennisGuide key={guideId} minutes={GUIDES.tennis.minutes} onBack={() => goMain('teach')} />
      ) : view === 'guide' && (guideId === 'stretching' || guideId === 'yoga') ? (
        <MobilityGuide key={guideId} kind={guideId} onBack={() => goMain('teach')} />
      ) : view === 'guide' && guideId ? (
        <GuideArticle key={guideId} guide={GUIDES[guideId]} onBack={() => goMain('teach')} />
      ) : view === 'detail' && selected ? (
        <div className="animate-fade-up">
          <button
            type="button"
            onClick={() => goMain('log')}
            className="mb-3 inline-flex min-h-11 items-center gap-1.5 rounded-full border border-plum-100 bg-white px-3.5 text-[15px] font-black text-plum-900 shadow-sm transition hover:bg-plum-50"
          >
            <ArrowLeft className="h-4 w-4" />
            回到運動紀錄
          </button>

          <section className={`${CARD} overflow-hidden p-0`}>
            <div className="bg-gradient-to-br from-plum-950 via-plum-900 to-plum-800 px-5 pb-5 pt-5 text-white">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="rounded-full bg-white/15 px-2.5 py-1 text-[13px] font-black text-amber-100">
                  {CATEGORY_LABELS[selected.category]}
                </span>
                <span className="rounded-full bg-white/15 px-2.5 py-1 text-[13px] font-bold text-plum-100">
                  MET {selected.met}
                </span>
                <span className="rounded-full bg-white/15 px-2.5 py-1 text-[13px] font-bold text-plum-100">
                  {PATTERN_LABELS[selected.pattern]}
                </span>
              </div>
              <h2 className="mt-3 font-serif text-[26px] font-black leading-tight tracking-wide">
                {selected.name}
              </h2>
              <p className="mt-1 break-anywhere text-[13px] font-bold text-plum-300">
                {selected.englishName}
              </p>
              <p className="mt-2 text-[15px] leading-7 text-plum-100">
                {selected.intensity} · 器材：{selected.equipment}
              </p>
            </div>

            <div className="p-5">
              <p className="text-[13px] font-black text-slate-500">主要肌群</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {selected.primaryMuscles.map((muscle) => (
                  <span
                    key={muscle}
                    className="rounded-full bg-plum-900 px-3 py-1 text-[13px] font-black text-amber-100"
                  >
                    {MUSCLE_LABELS[muscle]}
                  </span>
                ))}
                {selected.secondaryMuscles.map((muscle) => (
                  <span
                    key={muscle}
                    className="rounded-full border border-plum-200 bg-plum-50 px-3 py-1 text-[13px] font-bold text-plum-700"
                  >
                    {MUSCLE_LABELS[muscle]}
                  </span>
                ))}
              </div>

              <div className="mt-4 grid gap-2">
                <div className="rounded-2xl bg-emerald-50/70 p-3.5">
                  <p className="text-[13px] font-black text-emerald-800">動作要點</p>
                  <ul className="mt-1.5 space-y-1.5">
                    {selected.cues.map((cue) => (
                      <li
                        key={cue}
                        className="flex gap-1.5 text-[15px] leading-relaxed text-emerald-900"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={3} />
                        {cue}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl bg-rose-50/70 p-3.5">
                  <p className="text-[13px] font-black text-rose-800">常見錯誤</p>
                  <ul className="mt-1.5 space-y-1.5">
                    {selected.mistakes.map((mistake) => (
                      <li
                        key={mistake}
                        className="flex gap-1.5 text-[15px] leading-relaxed text-rose-900"
                      >
                        <X className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={3} />
                        {mistake}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {selectedAnatomy && (
                <>
                  <div className="mt-3">
                    <AnatomyFigure
                      muscles={selectedAnatomy.muscles}
                      title="動作解剖圖"
                      note="顏色越深代表參與越多。點圖上肌肉或下方名稱，可以看到它在這個動作裡負責什麼。"
                    />
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className="rounded-lg bg-slate-50 px-2 py-1 text-[13px] font-bold text-slate-600">
                      層級：{selectedAnatomy.classification.utility}
                    </span>
                    <span className="rounded-lg bg-slate-50 px-2 py-1 text-[13px] font-bold text-slate-600">
                      關節：{selectedAnatomy.classification.mechanics}
                    </span>
                    <span className="rounded-lg bg-slate-50 px-2 py-1 text-[13px] font-bold text-slate-600">
                      方向：{selectedAnatomy.classification.force}
                    </span>
                  </div>

                  <div className="mt-2 rounded-2xl border border-sky-100 bg-sky-50/60 p-3.5">
                    <p className="text-[13px] font-black text-sky-900">關節動作</p>
                    <ul className="mt-1.5 space-y-1">
                      {selectedAnatomy.jointActions.map((item) => (
                        <li
                          key={`${item.joint}-${item.action}`}
                          className="flex gap-1.5 text-[13px] leading-6 text-sky-900/85"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-600" />
                          <span className="min-w-0">
                            <span className="font-black">{item.joint}</span>：{item.action}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {selectedAnatomy.extraMuscles && (
                    <p className="mt-2 flex items-start gap-1.5 rounded-xl bg-slate-50 px-3 py-2.5 text-[13px] leading-5 text-slate-500">
                      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      {selectedAnatomy.extraMuscles}
                    </p>
                  )}

                  <div className="mt-2 grid gap-2">
                    <div className="rounded-2xl bg-slate-50 p-3.5">
                      <p className="text-[13px] font-black text-slate-600">先退階：動作還不穩時</p>
                      <ul className="mt-1.5 space-y-1">
                        {selectedAnatomy.regressions.map((item) => (
                          <li
                            key={item}
                            className="flex gap-1.5 text-[13px] leading-6 text-slate-600"
                          >
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-2xl bg-plum-50 p-3.5">
                      <p className="text-[13px] font-black text-plum-800">再進階：動作穩定之後</p>
                      <ul className="mt-1.5 space-y-1">
                        {selectedAnatomy.progressions.map((item) => (
                          <li
                            key={item}
                            className="flex gap-1.5 text-[13px] leading-6 text-plum-900/85"
                          >
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-plum-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <p className="mt-2 rounded-2xl border border-amber-200 bg-amber-50/70 px-3 py-2.5 text-[13px] leading-6 text-amber-900">
                    <span className="font-black">教練提醒：</span>
                    {selectedAnatomy.coachNote}
                  </p>

                  {relatedArticleId && (
                    <button
                      type="button"
                      onClick={() => onOpenArticle(relatedArticleId)}
                      className="mt-2 flex h-11 w-full items-center justify-center gap-1.5 rounded-xl border border-plum-200 bg-white text-[15px] font-black text-plum-900 transition hover:bg-plum-50 active:scale-[0.99]"
                    >
                      看完整的「{PATTERN_ARTICLES[relatedArticleId].title.split('：')[0]}」教學
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                </>
              )}

              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
                <div className="flex flex-wrap items-end justify-between gap-2">
                  <div>
                    <p className="text-[13px] font-black text-amber-800">這次運動時間</p>
                    <div className="mt-1 flex items-center gap-2">
                      <input
                        type="number"
                        inputMode="numeric"
                        min={1}
                        max={600}
                        value={minutesInput}
                        onChange={(event) => setMinutesInput(event.target.value)}
                        aria-label="運動時間（分鐘）"
                        className="h-11 w-20 rounded-xl border border-amber-300 bg-white px-2 text-center text-lg font-black text-slate-900 focus:border-plum-900 focus:outline-none"
                      />
                      <span className="text-[15px] font-bold text-amber-800">分鐘</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] font-black text-amber-800">預估消耗</p>
                    <p className="mt-0.5 text-[28px] font-black leading-none tabular-nums text-amber-900">
                      {weightReady && validMinutes ? estimatedCalories : '—'}
                      <span className="ml-1 text-[13px] font-bold text-amber-700">kcal</span>
                    </p>
                  </div>
                </div>

                {showSetsReps && (
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="number"
                      inputMode="numeric"
                      min={1}
                      value={setsInput}
                      onChange={(event) => setSetsInput(event.target.value)}
                      aria-label="組數"
                      placeholder="組數"
                      className="h-10 w-16 rounded-xl border border-amber-300 bg-white px-2 text-center text-base font-bold text-slate-900 placeholder:text-[13px] placeholder:font-medium focus:border-plum-900 focus:outline-none"
                    />
                    <span className="text-[15px] font-bold text-amber-800">組 ×</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      min={1}
                      value={repsInput}
                      onChange={(event) => setRepsInput(event.target.value)}
                      aria-label="次數"
                      placeholder="次數"
                      className="h-10 w-16 rounded-xl border border-amber-300 bg-white px-2 text-center text-base font-bold text-slate-900 placeholder:text-[13px] placeholder:font-medium focus:border-plum-900 focus:outline-none"
                    />
                    <span className="text-[15px] font-bold text-amber-800">下</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleSave}
                  className="mt-2.5 flex h-12 w-full items-center justify-center gap-1.5 rounded-xl bg-plum-900 text-base font-black text-white transition hover:bg-plum-800 active:scale-[0.98]"
                >
                  <Plus className="h-5 w-5" strokeWidth={2.8} />
                  儲存運動紀錄
                </button>

                {!weightReady && (
                  <p className="mt-2 text-[13px] font-semibold leading-relaxed text-amber-800">
                    尚未設定體重。熱量需要體重才能計算，請先到「設定」填寫。
                  </p>
                )}
              </div>

              {selectedGuideId && (
                <button
                  type="button"
                  onClick={() => {
                    setGuideId(selectedGuideId);
                    setView('guide');
                  }}
                  className="mt-3 flex min-h-12 w-full items-center justify-between gap-2 rounded-2xl border border-plum-200 bg-plum-50 px-4 text-left transition hover:bg-plum-100 active:scale-[0.99]"
                >
                  <span className="min-w-0">
                    <span className="block text-[16px] font-black text-plum-900">學習指南</span>
                    <span className="mt-0.5 block text-[13px] font-semibold text-plum-700">
                      握法、站位、擊球與傷害預防
                    </span>
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-plum-700" />
                </button>
              )}
            </div>
          </section>
        </div>
      ) : (
        <>
          <PageHeader
            title="運動"
            description="紀錄訓練，也看暖身、基礎動作與伸展教學。"
            onHome={onGoHome}
          />

          <div className="grid grid-cols-2 gap-1 rounded-2xl bg-plum-50 p-1">
            {(
              [
                { id: 'log', label: '運動紀錄' },
                { id: 'teach', label: '教學' },
              ] as const
            ).map((item) => {
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  aria-pressed={active}
                  className={`min-h-11 rounded-xl text-[16px] font-black transition ${
                    active
                      ? 'bg-white text-plum-900 shadow-sm'
                      : 'text-slate-500 hover:text-plum-900'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {tab === 'log' ? (
            <>
              <section className="mt-4 overflow-hidden rounded-[28px] bg-plum-900 p-5 text-white shadow-lg shadow-plum-900/20">
                <p className="text-[15px] font-bold text-plum-200">今日運動</p>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-baseline gap-1">
                      <span className="text-[34px] font-black leading-none tabular-nums">
                        {totalMinutes}
                      </span>
                      <span className="text-[15px] font-bold text-plum-200">分鐘</span>
                    </p>
                    <p className="mt-1 text-[13px] font-semibold text-plum-300">累積運動時間</p>
                  </div>
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-baseline gap-1">
                      <span className="text-[34px] font-black leading-none tabular-nums">
                        {totalCalories}
                      </span>
                      <span className="text-[15px] font-bold text-plum-200">kcal</span>
                    </p>
                    <p className="mt-1 text-[13px] font-semibold text-plum-300">MET 估算消耗</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-1.5">
                  {trainedMuscles.length > 0 ? (
                    trainedMuscles.map((muscle) => (
                      <span
                        key={muscle}
                        className="rounded-full bg-white/10 px-2.5 py-1 text-[13px] font-bold text-amber-100"
                      >
                        {muscle}
                      </span>
                    ))
                  ) : (
                    <span className="text-[15px] font-semibold text-plum-200">
                      今天還沒有訓練紀錄，選一個動作開始。
                    </span>
                  )}
                </div>
              </section>

              <section className={`mt-4 ${CARD}`}>
                <SectionHeading icon={Dumbbell} title="選擇運動" subtitle="依動作模式與肌群挑選" />

                <div className="no-scrollbar mt-3 flex gap-1.5 overflow-x-auto pb-1">
                  {CATEGORY_TABS.map((item) => {
                    const active = filter === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setFilter(item.id)}
                        aria-pressed={active}
                        className={`shrink-0 rounded-full px-4 py-2 text-[15px] font-black transition ${
                          active
                            ? 'bg-plum-900 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-2 space-y-2">
                  {visibleExercises.map((exercise) => (
                    <button
                      key={exercise.id}
                      type="button"
                      onClick={() => openExercise(exercise)}
                      className="flex w-full items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 text-left transition hover:border-plum-200 hover:bg-plum-50/40 active:scale-[0.99]"
                    >
                      <span
                        className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-[15px] font-black ${
                          exercise.category === 'cardio'
                            ? 'bg-orange-50 text-orange-600'
                            : exercise.category === 'strength'
                              ? 'bg-plum-50 text-plum-700'
                              : exercise.category === 'core'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-sky-50 text-sky-700'
                        }`}
                      >
                        {CATEGORY_LABELS[exercise.category].slice(0, 1)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[16px] font-black text-slate-900">
                            {exercise.name}
                          </span>
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[13px] font-bold text-slate-500">
                            {PATTERN_LABELS[exercise.pattern]}
                          </span>
                        </span>
                        <span className="mt-0.5 block truncate text-[13px] text-slate-400">
                          MET {exercise.met} ·{' '}
                          {exercise.primaryMuscles.map((muscle) => MUSCLE_LABELS[muscle]).join('、')}
                        </span>
                      </span>
                      <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
                    </button>
                  ))}
                </div>
              </section>

              <section className={`mt-4 ${CARD}`}>
                <SectionHeading icon={Timer} title="今日訓練紀錄" subtitle="依完成時間排序" />

                {todayWorkouts.length > 0 ? (
                  <div className="mt-3 space-y-2">
                    {todayWorkouts.map((workout) => (
                      <div
                        key={workout.id}
                        className="flex items-center justify-between gap-2 rounded-2xl bg-slate-50 px-3.5 py-2.5"
                      >
                        <div className="min-w-0">
                          <p className="text-[16px] font-black text-slate-900">
                            {workout.name}
                            {workout.sets && workout.reps && (
                              <span className="ml-1.5 text-[13px] font-bold text-slate-400">
                                {workout.sets} 組 × {workout.reps} 下
                              </span>
                            )}
                          </p>
                          <p className="mt-0.5 text-[13px] font-semibold text-slate-500">
                            {workout.minutes} 分鐘 · MET {workout.met} · 約 {workout.calories} kcal
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDelete(workout.id)}
                          aria-label={`刪除 ${workout.name} 紀錄`}
                          className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 rounded-2xl bg-slate-50 px-3.5 py-3 text-[15px] leading-relaxed text-slate-500">
                    今天還沒有紀錄。從上方選擇一個動作，填寫時間後按「儲存運動紀錄」即可。
                  </p>
                )}
              </section>

              <section className={`mt-4 ${CARD}`}>
                <SectionHeading icon={Info} title="熱量怎麼算" subtitle="公式與資料來源" />

                <div className="mt-3 rounded-2xl bg-plum-50 p-3.5">
                  <p className="text-[16px] font-black text-plum-900">{MET_FORMULA_TEXT}</p>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-plum-700">
                    MET（代謝當量）代表該活動相對安靜坐著時的能量消耗倍數。例如快走約 4.3 MET，
                    表示每公斤體重每小時消耗約 4.3 大卡。
                  </p>
                </div>

                <div className="mt-2 space-y-2 text-[15px] leading-relaxed text-slate-500">
                  <p className="flex gap-1.5">
                    <Flame className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
                    以 60 公斤的人快走 30 分鐘為例：4.3 × 60 × 0.5 ≈ 129 kcal。
                  </p>
                  <p>{MET_SOURCE_TEXT}</p>
                  <p>
                    實際消耗會因動作幅度、組間休息、肌肉量與代謝率而異，數值屬於估算，不作為醫療或營養處方依據。
                  </p>
                </div>
              </section>
            </>
          ) : (
            <>
              <section className={`mt-4 ${CARD}`}>
                <SectionHeading
                  icon={BookOpen}
                  title="基礎動作"
                  subtitle="推、拉、蹲、髖、移動五種動作模式"
                />
                <div className="mt-4">
                  <MovementCards
                    onOpenArticle={(nextArticleId) => {
                      setArticleId(nextArticleId);
                      setView('article');
                    }}
                  />
                </div>
                <p className="mt-3 text-[13px] leading-6 text-slate-500">
                  點字卡可看肌肉圖、原理、步驟、劑量與常見錯誤。
                </p>
              </section>

              <section className={`mt-4 ${CARD}`}>
                <SectionHeading
                  icon={ShieldCheck}
                  title="暖身、安全與伸展"
                  subtitle="依序讀完約 10 分鐘"
                />
                <div className="mt-4 space-y-2.5">
                  {TEACH_GUIDES.map((item) => (
                    <GuideRow
                      key={item.id}
                      icon={item.icon}
                      title={GUIDES[item.id].title}
                      description={item.description}
                      meta={`${GUIDES[item.id].minutes} 分鐘`}
                      onClick={() => {
                        setGuideId(item.id);
                        setView('guide');
                      }}
                    />
                  ))}
                </div>
              </section>
            </>
          )}
        </>
      )}
    </div>
  );
}
