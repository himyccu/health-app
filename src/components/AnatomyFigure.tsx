import { useMemo, useState } from 'react';
import Model, { type IMuscleStats, type Muscle } from 'react-body-highlighter';
import type { MuscleInvolvement, MuscleRole } from '../types';
import { MUSCLE_ROLE_LABELS, MUSCLE_ROLE_ORDER } from '../data/anatomy';

/**
 * 動作解剖圖
 *
 * 以正面／背面人體圖標示三層肌肉角色，顏色深淺代表參與程度：
 * 主要（深）→ 協同（中）→ 穩定（淡）。
 * 點擊圖上的肌肉或下方的名稱，可以查看該肌肉在這個動作裡負責什麼。
 */

const ROLE_COLORS: Record<MuscleRole, string> = {
  target: '#472a5d',
  synergist: '#9668be',
  stabilizer: '#d8c7ea',
};

const BODY_COLOR = '#f4eefb';

const ROLE_RANK: Record<MuscleRole, number> = {
  target: 3,
  synergist: 2,
  stabilizer: 1,
};

const VIEWS = [
  { type: 'anterior', label: '正面' },
  { type: 'posterior', label: '背面' },
] as const;

interface AnatomyFigureProps {
  muscles: MuscleInvolvement[];
  title?: string;
  note?: string;
}

export function AnatomyFigure({
  muscles,
  title = '肌肉位置圖',
  note = '顏色越深代表參與越多。實際參與程度會因動作版本、姿勢與個人身體差異而略有不同。',
}: AnatomyFigureProps) {
  const [activeMuscle, setActiveMuscle] = useState<Muscle | null>(null);

  // 同一塊肌肉若同時出現在兩層，只保留參與程度最高的那一層，避免顏色被重複加權。
  const effective = useMemo(() => {
    const map = new Map<Muscle, MuscleInvolvement>();
    muscles.forEach((muscle) => {
      const existing = map.get(muscle.id);
      if (!existing || ROLE_RANK[muscle.role] > ROLE_RANK[existing.role]) {
        map.set(muscle.id, muscle);
      }
    });
    return [...map.values()];
  }, [muscles]);

  const grouped = useMemo(
    () =>
      MUSCLE_ROLE_ORDER.map((role) => ({
        role,
        items: effective.filter((muscle) => muscle.role === role),
      })).filter((group) => group.items.length > 0),
    [effective],
  );

  const activeDetail = activeMuscle
    ? effective.find((muscle) => muscle.id === activeMuscle)
    : undefined;

  const visible = activeDetail ? [activeDetail] : effective;

  const modelData = grouped
    .map((group) => ({
      name: MUSCLE_ROLE_LABELS[group.role],
      muscles: visible.filter((muscle) => muscle.role === group.role).map((muscle) => muscle.id),
      frequency: ROLE_RANK[group.role],
    }))
    .filter((group) => group.muscles.length > 0);

  const handleMuscleClick = (stats: IMuscleStats) => {
    setActiveMuscle((current) => (current === stats.muscle ? null : stats.muscle));
  };

  return (
    <div className="mt-3 rounded-2xl border border-plum-100 bg-plum-50/40 p-3">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
        <p className="text-xs font-black text-slate-700">{title}</p>
        <div className="flex flex-wrap items-center gap-2">
          {MUSCLE_ROLE_ORDER.map((role) => (
            <span key={role} className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: ROLE_COLORS[role] }}
              />
              {MUSCLE_ROLE_LABELS[role].replace('肌群', '')}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2">
        {VIEWS.map((view) => (
          <div
            key={view.type}
            className="min-w-0 rounded-xl border border-plum-100 bg-white px-1 pb-1.5 pt-2"
          >
            <div className="h-[190px] w-full sm:h-[210px]">
              <Model
                type={view.type}
                data={modelData}
                bodyColor={BODY_COLOR}
                highlightedColors={[
                  ROLE_COLORS.stabilizer,
                  ROLE_COLORS.synergist,
                  ROLE_COLORS.target,
                ]}
                onClick={handleMuscleClick}
                style={{ width: '100%', height: '100%' }}
                svgStyle={{ height: '100%' }}
              />
            </div>
            <p className="mt-0.5 text-center text-[11px] font-bold text-slate-400">{view.label}</p>
          </div>
        ))}
      </div>

      {activeDetail ? (
        <div className="mt-2 rounded-xl border border-plum-200 bg-white p-3">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: ROLE_COLORS[activeDetail.role] }}
            />
            <p className="text-sm font-black text-slate-900">{activeDetail.name}</p>
            <p className="text-[11px] font-semibold text-slate-400">{activeDetail.latin}</p>
            <span className="rounded-full bg-plum-100 px-2 py-0.5 text-[10px] font-black text-plum-800">
              {MUSCLE_ROLE_LABELS[activeDetail.role]}
            </span>
          </div>
          <p className="mt-1.5 text-[13px] leading-6 text-slate-600">{activeDetail.note}</p>
          <button
            type="button"
            onClick={() => setActiveMuscle(null)}
            className="mt-1.5 text-[12px] font-bold text-plum-700 underline decoration-plum-300 underline-offset-2"
          >
            顯示全部肌群
          </button>
        </div>
      ) : (
        <div className="mt-2 space-y-1.5">
          {grouped.map((group) => (
            <div key={group.role} className="min-w-0">
              <p className="flex items-center gap-1.5 text-[11px] font-black tracking-wide text-slate-500">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: ROLE_COLORS[group.role] }}
                />
                {MUSCLE_ROLE_LABELS[group.role]}
              </p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {group.items.map((muscle) => (
                  <button
                    key={`${group.role}-${muscle.id}`}
                    type="button"
                    onClick={() => setActiveMuscle(muscle.id)}
                    className="inline-flex max-w-full min-w-0 items-baseline gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-left transition hover:border-plum-300 hover:bg-plum-50 active:scale-[0.98]"
                  >
                    <span className="text-[12px] font-black text-slate-800">{muscle.name}</span>
                    <span className="truncate text-[10px] font-semibold text-slate-400">
                      {muscle.latin}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="mt-2 text-[11px] leading-5 text-slate-400">{note}</p>
    </div>
  );
}
