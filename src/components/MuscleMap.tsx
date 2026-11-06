import Model from 'react-body-highlighter';
import type { Muscle } from 'react-body-highlighter';
import type { MuscleGroup } from '../types';

/**
 * 將 App 內的肌群分類對應到人體圖的解剖部位。
 * 對應依解剖學標準位置：胸大肌、背闊肌與斜方肌、三角肌前後束、
 * 二頭／三頭／前臂、腹直肌與腹斜肌、臀大肌、股四頭肌、腿後腱、小腿。
 */
const MUSCLE_MAP: Record<MuscleGroup, Muscle[]> = {
  chest: ['chest'],
  back: ['upper-back', 'lower-back', 'trapezius'],
  shoulders: ['front-deltoids', 'back-deltoids'],
  arms: ['biceps', 'triceps', 'forearm'],
  core: ['abs', 'obliques'],
  glutes: ['gluteal'],
  quads: ['quadriceps'],
  hamstrings: ['hamstring'],
  calves: ['calves', 'left-soleus', 'right-soleus'],
  fullBody: [
    'chest',
    'upper-back',
    'lower-back',
    'trapezius',
    'front-deltoids',
    'back-deltoids',
    'biceps',
    'triceps',
    'forearm',
    'abs',
    'obliques',
    'gluteal',
    'quadriceps',
    'hamstring',
    'calves',
    'left-soleus',
    'right-soleus',
    'adductor',
    'abductors',
  ],
};

const PRIMARY_COLOR = '#472a5d';
const SECONDARY_COLOR = '#cdb5e4';
const BODY_COLOR = '#f4eefb';

function toMuscles(groups: MuscleGroup[]): Muscle[] {
  return groups.flatMap((group) => MUSCLE_MAP[group]);
}

interface MuscleMapProps {
  primaryMuscles: MuscleGroup[];
  secondaryMuscles: MuscleGroup[];
}

export function MuscleMap({ primaryMuscles, secondaryMuscles }: MuscleMapProps) {
  const data = [
    { name: '主要肌群', muscles: toMuscles(primaryMuscles), frequency: 2 },
    { name: '次要肌群', muscles: toMuscles(secondaryMuscles), frequency: 1 },
  ];

  return (
    <div className="mt-3 rounded-2xl border border-plum-100 bg-plum-50/40 p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-black text-slate-700">肌肉位置圖</p>
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: PRIMARY_COLOR }}
            />
            主要
          </span>
          <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: SECONDARY_COLOR }}
            />
            次要
          </span>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2">
        {(
          [
            { type: 'anterior', label: '正面' },
            { type: 'posterior', label: '背面' },
          ] as const
        ).map((view) => (
          <div
            key={view.type}
            className="rounded-xl border border-plum-100 bg-white px-1 pb-1.5 pt-2"
          >
            <Model
              type={view.type}
              data={data}
              bodyColor={BODY_COLOR}
              highlightedColors={[SECONDARY_COLOR, PRIMARY_COLOR]}
              style={{ width: '100%', height: 172 }}
              svgStyle={{ height: '100%' }}
            />
            <p className="mt-0.5 text-center text-[11px] font-bold text-slate-400">
              {view.label}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-2 text-[11px] leading-relaxed text-slate-400">
        肌肉位置為解剖示意。實際參與程度會因動作版本、姿勢與個人身體差異而有所不同。
      </p>
    </div>
  );
}
