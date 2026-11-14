import { ArrowLeft, AlertTriangle, ArrowRight, Info } from 'lucide-react';
import type { SourceId } from '../data/sources';
import { SourcePanel } from './SourceList';
import { PoseCard } from './PoseCard';
import {
  STRETCHES,
  STRETCHING_DOSE,
  STRETCHING_INTRO,
  STRETCHING_SAFETY,
} from '../data/sports/stretching';
import { YOGA_DOSE, YOGA_INTRO, YOGA_POSES, YOGA_SAFETY } from '../data/sports/yoga';
import type { Pose } from '../data/sports/types';

interface MobilityGuideProps {
  kind: 'stretching' | 'yoga';
  onBack: () => void;
}

const STRETCH_SOURCES: SourceId[] = ['acsm2018', 'garber2011', 'oba2026', 'behm2011'];
const YOGA_SOURCES: SourceId[] = ['sharma2026', 'lasala2021', 'li2026', 'acsm2018'];

function groupByCategory(poses: Pose[]): { category: string; items: Pose[] }[] {
  const order: string[] = [];
  const map = new Map<string, Pose[]>();
  poses.forEach((pose) => {
    if (!map.has(pose.category)) {
      map.set(pose.category, []);
      order.push(pose.category);
    }
    map.get(pose.category)?.push(pose);
  });
  return order.map((category) => ({ category, items: map.get(category) ?? [] }));
}

export function MobilityGuide({ kind, onBack }: MobilityGuideProps) {
  const isStretch = kind === 'stretching';
  const title = isStretch ? '靜態伸展' : '瑜伽';
  const subtitle = isStretch ? 'Static Stretching' : 'Hatha Yoga';
  const intro = isStretch ? STRETCHING_INTRO : YOGA_INTRO;
  const safety = isStretch ? STRETCHING_SAFETY : YOGA_SAFETY;
  const poses = isStretch ? STRETCHES : YOGA_POSES;
  const sources = isStretch ? STRETCH_SOURCES : YOGA_SOURCES;

  const doseChips = isStretch
    ? [
        STRETCHING_DOSE.hold,
        STRETCHING_DOSE.sets,
        STRETCHING_DOSE.frequency,
        STRETCHING_DOSE.perMuscle,
      ]
    : [YOGA_DOSE.hold, YOGA_DOSE.frequency, YOGA_DOSE.session, YOGA_DOSE.order];

  const groups = groupByCategory(poses);
  const numberOf = new Map(poses.map((pose, index) => [pose.id, index + 1]));

  return (
    <div className="animate-fade-up">
      <button
        type="button"
        onClick={onBack}
        className="mb-3 inline-flex min-h-11 items-center gap-1.5 rounded-full border border-plum-100 bg-white px-3.5 text-[15px] font-black text-plum-900 shadow-sm transition hover:bg-plum-50"
      >
        <ArrowLeft className="h-4 w-4" />
        回到運動
      </button>

      <section className="overflow-hidden rounded-[28px] bg-gradient-to-br from-plum-950 via-plum-900 to-plum-800 px-5 py-5 text-white shadow-lg shadow-plum-900/20">
        <p className="text-[13px] font-black tracking-[0.18em] text-plum-300">{subtitle}</p>
        <h2 className="mt-1 font-serif text-[26px] font-black leading-tight tracking-wide">
          {title}
        </h2>
        <p className="mt-2 text-[15px] leading-7 text-plum-100">{intro}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {doseChips.map((chip) => (
            <span
              key={chip}
              className="rounded-full bg-white/10 px-2.5 py-1 text-[13px] font-bold text-amber-100"
            >
              {chip}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-3 rounded-[24px] border border-amber-200 bg-amber-50/80 p-4">
        <p className="flex items-center gap-1.5 text-[15px] font-black text-amber-900">
          <AlertTriangle className="h-4 w-4" />
          開始前先看
        </p>
        <ul className="mt-2 space-y-1.5">
          {safety.map((note) => (
            <li key={note} className="flex gap-2 text-[13px] leading-6 text-amber-900/85">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" />
              <span className="min-w-0">{note}</span>
            </li>
          ))}
        </ul>
      </section>

      {groups.map((group) => (
        <section key={group.category} className="mt-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-[16px] font-black text-slate-900">{group.category}</h3>
            <span className="shrink-0 text-[13px] font-bold text-slate-400">
              {group.items.length} 個動作
            </span>
          </div>
          <div className="mt-2 space-y-2">
            {group.items.map((pose) => (
              <PoseCard key={pose.id} pose={pose} index={numberOf.get(pose.id) ?? 0} />
            ))}
          </div>
        </section>
      ))}

      <p className="mt-4 flex items-start gap-1.5 rounded-2xl bg-slate-50 px-3.5 py-3 text-[13px] leading-6 text-slate-500">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <span className="min-w-0">
          每張卡都可展開，內容包含做法、感覺、錯誤、替代動作與注意事項。
          若身體有傷或慢性病，先由醫師或物理治療師評估再開始。
        </span>
      </p>

      <SourcePanel ids={sources} />

      <button
        type="button"
        onClick={onBack}
        className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-plum-200 bg-white text-base font-black text-plum-900 shadow-sm transition hover:bg-plum-50 active:scale-[0.99]"
      >
        <ArrowRight className="h-4 w-4 rotate-180" />
        回到運動
      </button>
    </div>
  );
}
