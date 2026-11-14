import { useState } from 'react';
import { AlertTriangle, Check, ChevronDown, Repeat, Sparkles, Timer } from 'lucide-react';
import type { Pose } from '../data/sports/types';
import { PoseFigure } from './PoseFigure';

interface PoseCardProps {
  pose: Pose;
  index: number;
}

export function PoseCard({ pose, index }: PoseCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <section className="rounded-[24px] border border-plum-100 bg-white shadow-sm shadow-plum-900/5">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-start gap-3 rounded-[24px] p-3.5 text-left transition hover:bg-plum-50/50 active:scale-[0.995]"
      >
        <span className="grid h-[104px] w-[74px] shrink-0 place-items-center rounded-2xl bg-plum-50/80">
          <PoseFigure figure={pose.figure} label={`${pose.name}示意圖`} />
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex items-start justify-between gap-2">
            <span className="min-w-0">
              <span className="flex items-center gap-1.5">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-plum-900 text-[13px] font-black text-amber-100">
                  {index}
                </span>
                <span className="text-base font-black leading-tight text-slate-900">
                  {pose.name}
                </span>
              </span>
              <span className="mt-0.5 block break-anywhere text-[13px] font-bold text-plum-600">
                {pose.englishName}
              </span>
            </span>
            <ChevronDown
              className={`mt-1 h-4 w-4 shrink-0 text-plum-500 transition ${open ? 'rotate-180' : ''}`}
            />
          </span>

          <span className="mt-1.5 block text-[15px] leading-6 text-slate-600">{pose.summary}</span>

          <span className="mt-2 flex flex-wrap gap-1.5">
            {pose.targets.slice(0, 2).map((target) => (
              <span
                key={target}
                className="rounded-full bg-plum-50 px-2 py-0.5 text-[13px] font-bold text-plum-700"
              >
                {target}
              </span>
            ))}
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[13px] font-bold text-amber-800">
              <Timer className="h-3 w-3" />
              {pose.dose}
            </span>
          </span>
        </span>
      </button>

      {open && (
        <div className="animate-fade-up border-t border-plum-100 px-3.5 pb-3.5 pt-3">
          <div className="rounded-2xl bg-emerald-50/70 p-3">
            <p className="text-[13px] font-black text-emerald-800">怎麼做</p>
            <ol className="mt-1.5 space-y-1.5">
              {pose.steps.map((step, stepIndex) => (
                <li key={step} className="flex gap-2 text-[15px] leading-6 text-emerald-900/90">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-600 text-[13px] font-black text-white">
                    {stepIndex + 1}
                  </span>
                  <span className="min-w-0">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-2 rounded-2xl bg-plum-50/70 p-3">
            <p className="flex items-center gap-1.5 text-[13px] font-black text-plum-800">
              <Sparkles className="h-3.5 w-3.5" />
              做對的感覺
            </p>
            <p className="mt-1 text-[15px] leading-6 text-plum-900/85">{pose.feeling}</p>
          </div>

          <div className="mt-2 rounded-2xl bg-rose-50/70 p-3">
            <p className="flex items-center gap-1.5 text-[13px] font-black text-rose-800">
              <AlertTriangle className="h-3.5 w-3.5" />
              常見錯誤
            </p>
            <ul className="mt-1.5 space-y-1">
              {pose.mistakes.map((mistake) => (
                <li key={mistake} className="flex gap-1.5 text-[13px] leading-6 text-rose-900/85">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />
                  <span className="min-w-0">{mistake}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-2 rounded-2xl bg-sky-50/70 p-3">
            <p className="flex items-center gap-1.5 text-[13px] font-black text-sky-900">
              <Repeat className="h-3.5 w-3.5" />
              做不到時的替代動作
            </p>
            <ul className="mt-1.5 space-y-1">
              {pose.alternatives.map((item) => (
                <li key={item} className="flex gap-1.5 text-[13px] leading-6 text-sky-900/85">
                  <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-sky-600" strokeWidth={3} />
                  <span className="min-w-0">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-2 rounded-2xl border border-amber-200 bg-amber-50/80 p-3">
            <p className="flex items-center gap-1.5 text-[13px] font-black text-amber-900">
              <AlertTriangle className="h-3.5 w-3.5" />
              注意
            </p>
            <ul className="mt-1.5 space-y-1">
              {pose.cautions.map((item) => (
                <li key={item} className="flex gap-1.5 text-[13px] leading-6 text-amber-900/85">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" />
                  <span className="min-w-0">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
