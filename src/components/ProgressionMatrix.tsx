import { TrendingUp } from 'lucide-react';
import type { ArticleLevel } from '../data/knowledgeCenter';
import { SectionHeading } from './SectionHeading';

interface ProgressionMatrixProps {
  levels: ArticleLevel[];
}

export function ProgressionMatrix({ levels }: ProgressionMatrixProps) {
  return (
    <section className="mt-3 rounded-[24px] border border-plum-100 bg-white p-4 shadow-sm shadow-plum-900/5">
      <SectionHeading
        icon={TrendingUp}
        title="五級進階訓練"
        subtitle="從最輕的版本開始，動作穩定再往下一級"
      />

      <div className="mt-3 space-y-2">
        {levels.map((level) => (
          <div
            key={level.level}
            className="flex gap-3 rounded-2xl border border-slate-100 bg-white p-3.5"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-plum-900 text-[13px] font-black text-amber-200">
              {level.level}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <p className="text-[15px] font-black leading-snug text-slate-900">{level.title}</p>
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[13px] font-black text-amber-800">
                  {level.dosage}
                </span>
              </div>
              <p className="mt-1 text-[13px] leading-6 text-slate-600">{level.focus}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-2 text-[13px] leading-5 text-slate-400">
        組數與次數是通則，請依當天狀況調整。動作品質開始下降時，退回上一級比硬撐完成更有效。
      </p>
    </section>
  );
}
