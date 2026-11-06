import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Check,
  ChevronRight,
  Dumbbell,
  Flame,
  Info,
  Plus,
  Timer,
  Trash2,
  X,
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

interface ExercisePageProps {
  profile: Profile;
  onNotify: (message: string) => void;
}

const CATEGORY_TABS: { id: 'all' | ExerciseCategory; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'cardio', label: CATEGORY_LABELS.cardio },
  { id: 'strength', label: CATEGORY_LABELS.strength },
  { id: 'core', label: CATEGORY_LABELS.core },
  { id: 'mobility', label: CATEGORY_LABELS.mobility },
];

function newId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function ExercisePage({ profile, onNotify }: ExercisePageProps) {
  const [filter, setFilter] = useState<'all' | ExerciseCategory>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [minutesInput, setMinutesInput] = useState('20');
  const [setsInput, setSetsInput] = useState('');
  const [repsInput, setRepsInput] = useState('');
  const [workouts, setWorkouts] = useState<WorkoutEntry[]>(() => loadWorkouts());
  const detailRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (selectedId) {
      detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedId]);

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
    setSelectedId(null);
    setSetsInput('');
    setRepsInput('');
  };

  const handleDelete = (id: string) => {
    const next = workouts.filter((workout) => workout.id !== id);
    setWorkouts(next);
    saveWorkouts(next);
    onNotify('已刪除運動紀錄');
  };

  return (
    <div>
      <PageHeader
        eyebrow="TRAINING"
        title="運動訓練"
        description="用動作模式與肌群，記錄每一次認真的訓練。"
        icon={Dumbbell}
      />

      <section className="relative overflow-hidden rounded-[28px] bg-plum-900 p-5 text-white shadow-lg shadow-plum-900/20">
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-plum-800/80" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 h-32 w-32 rounded-full bg-plum-800/50" />

        <p className="relative text-sm font-bold text-plum-200">今日運動</p>
        <div className="relative mt-2 grid grid-cols-2 gap-3">
          <div>
            <p className="flex items-baseline gap-1">
              <span className="text-4xl font-black leading-none tabular-nums">{totalMinutes}</span>
              <span className="text-sm font-bold text-plum-200">分鐘</span>
            </p>
            <p className="mt-1 text-xs font-semibold text-plum-300">累積運動時間</p>
          </div>
          <div>
            <p className="flex items-baseline gap-1">
              <span className="text-4xl font-black leading-none tabular-nums">{totalCalories}</span>
              <span className="text-sm font-bold text-plum-200">kcal</span>
            </p>
            <p className="mt-1 text-xs font-semibold text-plum-300">MET 估算消耗</p>
          </div>
        </div>

        <div className="relative mt-4 flex flex-wrap items-center gap-1.5">
          {trainedMuscles.length > 0 ? (
            trainedMuscles.map((muscle) => (
              <span
                key={muscle}
                className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-bold text-amber-100"
              >
                {muscle}
              </span>
            ))
          ) : (
            <span className="text-sm font-semibold text-plum-200">
              今天還沒有訓練紀錄，選一個動作開始吧。
            </span>
          )}
        </div>
      </section>

      {selected && (
        <section
          ref={detailRef}
          className="animate-fade-up mt-4 rounded-[26px] border border-plum-200 bg-white p-4 shadow-sm shadow-plum-900/10"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="rounded-full bg-plum-100 px-2 py-0.5 text-xs font-black text-plum-800">
                  {CATEGORY_LABELS[selected.category]}
                </span>
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-black text-amber-800">
                  {PATTERN_LABELS[selected.pattern]}｜MET {selected.met}
                </span>
              </div>
              <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
                {selected.name}
                <span className="ml-1.5 text-sm font-bold text-slate-400">
                  {selected.englishName}
                </span>
              </h3>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                {selected.intensity} · 器材：{selected.equipment}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              aria-label="關閉動作說明"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3">
            <p className="text-xs font-black text-slate-500">主要肌群</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {selected.primaryMuscles.map((muscle) => (
                <span
                  key={muscle}
                  className="rounded-full bg-plum-900 px-3 py-1 text-xs font-black text-amber-100"
                >
                  {MUSCLE_LABELS[muscle]}
                </span>
              ))}
              {selected.secondaryMuscles.map((muscle) => (
                <span
                  key={muscle}
                  className="rounded-full border border-plum-200 bg-plum-50 px-3 py-1 text-xs font-bold text-plum-700"
                >
                  {MUSCLE_LABELS[muscle]}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-3 grid gap-2">
            <div className="rounded-2xl bg-emerald-50/70 p-3">
              <p className="text-xs font-black text-emerald-800">動作要點</p>
              <ul className="mt-1.5 space-y-1.5">
                {selected.cues.map((cue) => (
                  <li key={cue} className="flex gap-1.5 text-sm leading-relaxed text-emerald-900">
                    <Check className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={3} />
                    {cue}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-rose-50/70 p-3">
              <p className="text-xs font-black text-rose-800">常見錯誤</p>
              <ul className="mt-1.5 space-y-1.5">
                {selected.mistakes.map((mistake) => (
                  <li key={mistake} className="flex gap-1.5 text-sm leading-relaxed text-rose-900">
                    <X className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={3} />
                    {mistake}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50/70 p-3">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <p className="text-xs font-black text-amber-800">這次運動時間</p>
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
                  <span className="text-sm font-bold text-amber-800">分鐘</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-black text-amber-800">預估消耗</p>
                <p className="mt-0.5 text-3xl font-black leading-none tabular-nums text-amber-900">
                  {weightReady && validMinutes ? estimatedCalories : '—'}
                  <span className="ml-1 text-xs font-bold text-amber-700">kcal</span>
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
                  className="h-10 w-16 rounded-xl border border-amber-300 bg-white px-2 text-center text-base font-bold text-slate-900 placeholder:text-xs placeholder:font-medium focus:border-plum-900 focus:outline-none"
                />
                <span className="text-sm font-bold text-amber-800">組 ×</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  value={repsInput}
                  onChange={(event) => setRepsInput(event.target.value)}
                  aria-label="次數"
                  placeholder="次數"
                  className="h-10 w-16 rounded-xl border border-amber-300 bg-white px-2 text-center text-base font-bold text-slate-900 placeholder:text-xs placeholder:font-medium focus:border-plum-900 focus:outline-none"
                />
                <span className="text-sm font-bold text-amber-800">下</span>
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
              <p className="mt-2 text-xs font-semibold leading-relaxed text-amber-800">
                尚未設定體重。熱量需要體重才能計算，請先到「設定」填寫。
              </p>
            )}
          </div>

          <a
            href="https://anatomy3datlas.com/body-systems/musculoskeletal/"
            target="_blank"
            rel="noreferrer"
            className="mt-3 flex items-center justify-center gap-1 rounded-xl bg-slate-50 py-2.5 text-xs font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            進一步查看人體解剖構造
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </section>
      )}

      <section className="mt-4 rounded-[26px] border border-amber-100 bg-white p-4 shadow-sm shadow-amber-900/5">
        <SectionHeading icon={Dumbbell} title="選擇運動" subtitle="依動作模式與肌群挑選" />

        <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1">
          {CATEGORY_TABS.map((tab) => {
            const active = filter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                aria-pressed={active}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-black transition ${
                  active
                    ? 'bg-plum-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="mt-2 space-y-2">
          {visibleExercises.map((exercise) => {
            const active = selectedId === exercise.id;
            return (
              <button
                key={exercise.id}
                type="button"
                onClick={() => openExercise(exercise)}
                className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition active:scale-[0.99] ${
                  active
                    ? 'border-plum-900 bg-plum-50/60'
                    : 'border-slate-100 bg-white hover:border-plum-200 hover:bg-plum-50/40'
                }`}
              >
                <span
                  className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-sm font-black ${
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
                  <span className="flex items-center gap-1.5">
                    <span className="text-base font-black text-slate-900">{exercise.name}</span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500">
                      {PATTERN_LABELS[exercise.pattern]}
                    </span>
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-slate-400">
                    MET {exercise.met} · {exercise.primaryMuscles.map((muscle) => MUSCLE_LABELS[muscle]).join('、')}
                  </span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-4 rounded-[26px] border border-amber-100 bg-white p-4 shadow-sm shadow-amber-900/5">
        <SectionHeading icon={Timer} title="今日訓練紀錄" subtitle="依完成時間排序" />

        {todayWorkouts.length > 0 ? (
          <div className="mt-3 space-y-2">
            {todayWorkouts.map((workout) => (
              <div
                key={workout.id}
                className="flex items-center justify-between gap-2 rounded-2xl bg-slate-50 px-3.5 py-2.5"
              >
                <div className="min-w-0">
                  <p className="text-base font-black text-slate-900">
                    {workout.name}
                    {workout.sets && workout.reps && (
                      <span className="ml-1.5 text-xs font-bold text-slate-400">
                        {workout.sets} 組 × {workout.reps} 下
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 text-xs font-semibold text-slate-500">
                    {workout.minutes} 分鐘 · MET {workout.met} · 約 {workout.calories} kcal
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(workout.id)}
                  aria-label={`刪除 ${workout.name} 紀錄`}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 rounded-2xl bg-slate-50 px-3.5 py-3 text-sm leading-relaxed text-slate-500">
            今天還沒有紀錄。從上方選擇一個動作，填寫時間後按「儲存運動紀錄」即可。
          </p>
        )}
      </section>

      <section className="mt-4 rounded-[26px] border border-amber-100 bg-white p-4 shadow-sm shadow-amber-900/5">
        <SectionHeading icon={Info} title="熱量怎麼算" subtitle="公式與資料來源" />

        <div className="mt-3 rounded-2xl bg-plum-50 p-3.5">
          <p className="text-base font-black text-plum-900">{MET_FORMULA_TEXT}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-plum-700">
            MET（代謝當量）代表該活動相對安靜坐著時的能量消耗倍數。例如快走約 4.3 MET，
            表示每公斤體重每小時消耗約 4.3 大卡。
          </p>
        </div>

        <div className="mt-2 space-y-2 text-sm leading-relaxed text-slate-500">
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
    </div>
  );
}
