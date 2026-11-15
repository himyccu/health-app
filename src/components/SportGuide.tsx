import { useState, type ReactNode } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  ChevronDown,
  ClipboardCheck,
  Info,
  ListChecks,
  Target,
  Timer,
  TrendingDown,
} from 'lucide-react';
import type { SourceId } from '../data/sources';
import type {
  SportAppendix,
  SportChapter,
  SportGuideContent,
} from '../data/sports/sportGuide';
import { SourceChips, SourcePanel } from './SourceList';

export interface SportVisual {
  render: () => ReactNode;
  caption: string;
  note?: string;
  legend: string[];
}

interface SportGuideProps {
  content: SportGuideContent;
  visuals: Record<string, SportVisual>;
  minutes: number;
  onBack: () => void;
}

function ChapterCard({
  chapter,
  visual,
  defaultOpen,
}: {
  chapter: SportChapter;
  visual?: SportVisual;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <article className="min-w-0 rounded-[24px] border border-plum-100 bg-white shadow-sm shadow-plum-900/5">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-start gap-3 rounded-[24px] p-4 text-left transition hover:bg-plum-50/50 active:scale-[0.995]"
      >
        <span className="min-w-0 flex-1">
          <span className="flex items-start justify-between gap-2">
            <span className="min-w-0">
              <span className="block text-base font-black leading-snug text-slate-900">
                {chapter.title}
              </span>
              <span className="mt-0.5 block break-anywhere text-[13px] font-bold text-plum-600">
                {chapter.englishTitle}
              </span>
            </span>
            <ChevronDown
              className={`mt-1 h-4 w-4 shrink-0 text-plum-500 transition ${open ? 'rotate-180' : ''}`}
            />
          </span>

          <span className="mt-2 block text-[15px] leading-6 text-slate-600">{chapter.summary}</span>
        </span>
      </button>

      {open && (
        <div className="animate-fade-up border-t border-plum-100 px-4 pb-4 pt-3.5">
          {visual && (
            <div className="min-w-0 rounded-2xl bg-plum-50/60 p-3">
              <p className="text-[13px] font-black text-plum-800">{visual.caption}</p>
              {visual.note && (
                <p className="mt-1 break-anywhere text-[13px] leading-6 text-plum-900/75">
                  {visual.note}
                </p>
              )}
              <div className="mt-2">{visual.render()}</div>
              {visual.legend.length > 0 && (
                <ol className="mt-2 space-y-1">
                  {visual.legend.map((item, index) => (
                    <li key={item} className="flex gap-2 text-[13px] leading-6 text-plum-900/85">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-plum-700 text-[13px] font-black text-white">
                        {index + 1}
                      </span>
                      <span className="min-w-0">{item}</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          )}

          <div className="mt-2 rounded-2xl bg-slate-50 p-3">
            <p className="flex items-center gap-1.5 text-[13px] font-black text-slate-800">
              <Info className="h-3.5 w-3.5" />
              這是什麼
            </p>
            <p className="mt-1 text-[15px] leading-6 text-slate-700">{chapter.what}</p>
          </div>

          <div className="mt-2 rounded-2xl bg-emerald-50/70 p-3">
            <p className="flex items-center gap-1.5 text-[13px] font-black text-emerald-800">
              <ListChecks className="h-3.5 w-3.5" />
              怎麼做
            </p>
            <ol className="mt-1.5 space-y-1.5">
              {chapter.steps.map((step, index) => (
                <li key={step.label} className="flex gap-2 text-[15px] leading-6 text-emerald-900/90">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-600 text-[13px] font-black text-white">
                    {index + 1}
                  </span>
                  <span className="min-w-0">
                    <span className="font-bold">{step.label}</span>
                    {step.detail && (
                      <span className="mt-0.5 block text-emerald-900/80">{step.detail}</span>
                    )}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-2 rounded-2xl bg-rose-50/70 p-3">
            <p className="flex items-center gap-1.5 text-[13px] font-black text-rose-800">
              <TrendingDown className="h-3.5 w-3.5" />
              做錯會怎樣
            </p>
            <ul className="mt-1.5 space-y-1.5">
              {chapter.mistakes.map((item) => (
                <li key={item.mistake} className="flex gap-1.5 text-[13px] leading-6 text-rose-900/85">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />
                  <span className="min-w-0">
                    <span className="font-bold">{item.mistake}</span>
                    <span className="mt-0.5 block">{item.result}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-2 rounded-2xl bg-sky-50/70 p-3">
            <p className="flex items-center gap-1.5 text-[13px] font-black text-sky-900">
              <ClipboardCheck className="h-3.5 w-3.5" />
              怎麼檢查
            </p>
            <ul className="mt-1.5 space-y-1">
              {chapter.checks.map((item) => (
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
              {chapter.cautions.map((item) => (
                <li key={item} className="flex gap-1.5 text-[13px] leading-6 text-amber-900/85">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" />
                  <span className="min-w-0">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <SourceChips ids={chapter.sources} />
        </div>
      )}
    </article>
  );
}

function AppendixCard({ appendix }: { appendix: SportAppendix }) {
  const [open, setOpen] = useState(false);

  return (
    <article className="min-w-0 rounded-[24px] border border-slate-200 bg-white shadow-sm shadow-plum-900/5">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-start gap-3 rounded-[24px] p-4 text-left transition hover:bg-slate-50 active:scale-[0.995]"
      >
        <span className="min-w-0 flex-1">
          <span className="block text-base font-black leading-snug text-slate-900">
            {appendix.title}
          </span>
          <span className="mt-0.5 block break-anywhere text-[13px] font-bold text-slate-500">
            {appendix.englishTitle}
          </span>
          <span className="mt-2 block text-[15px] leading-6 text-slate-600">{appendix.intro}</span>
        </span>
        <ChevronDown
          className={`mt-1 h-4 w-4 shrink-0 text-plum-500 transition ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="animate-fade-up border-t border-slate-100 px-4 pb-4 pt-3.5">
          <ol className="space-y-1.5">
            {appendix.points.map((point, index) => (
              <li key={point.label} className="flex gap-2 text-[15px] leading-6 text-slate-700">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-slate-700 text-[13px] font-black text-white">
                  {index + 1}
                </span>
                <span className="min-w-0">
                  <span className="font-bold">{point.label}</span>
                  {point.detail && <span className="mt-0.5 block text-slate-600">{point.detail}</span>}
                </span>
              </li>
            ))}
          </ol>

          {appendix.note && (
            <p className="mt-2.5 rounded-2xl bg-slate-50 px-3 py-2.5 text-[13px] leading-6 text-slate-600">
              {appendix.note}
            </p>
          )}

          <SourceChips ids={appendix.sources} />
        </div>
      )}
    </article>
  );
}

export function SportGuide({ content, visuals, minutes, onBack }: SportGuideProps) {
  const usedIds = [
    ...new Set<SourceId>([
      ...content.chapters.flatMap((chapter) => chapter.sources),
      ...(content.appendices ?? []).flatMap((appendix) => appendix.sources),
    ]),
  ];

  const [intro, ...rest] = content.chapters;

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
        <p className="text-[13px] font-black tracking-[0.18em] text-plum-300">{content.eyebrow}</p>
        <h2 className="mt-1 font-serif text-[26px] font-black leading-tight tracking-wide">
          {content.title}
        </h2>
        <p className="mt-2 text-[15px] leading-7 text-plum-100">{content.intro}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {content.dose.map((chip) => (
            <span
              key={chip}
              className="rounded-full bg-white/10 px-2.5 py-1 text-[13px] font-bold text-amber-100"
            >
              {chip}
            </span>
          ))}
          <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[13px] font-bold text-amber-100">
            <Timer className="h-3 w-3" />
            閱讀約 {minutes} 分鐘
          </span>
        </div>
      </section>

      <section className="mt-3 rounded-[24px] border border-amber-200 bg-amber-50/80 p-4">
        <p className="flex items-center gap-1.5 text-[15px] font-black text-amber-900">
          <AlertTriangle className="h-4 w-4" />
          開始前先看
        </p>
        <ul className="mt-2 space-y-1.5">
          {content.safety.map((note) => (
            <li key={note} className="flex gap-2 text-[13px] leading-6 text-amber-900/85">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" />
              <span className="min-w-0">{note}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-4 flex items-center justify-between gap-2">
        <h3 className="text-[16px] font-black text-slate-900">先從這裡開始</h3>
        <span className="shrink-0 text-[13px] font-bold text-slate-400">一頁結論</span>
      </div>

      <div className="mt-2">
        <ChapterCard
          chapter={intro}
          visual={intro.visual ? visuals[intro.visual] : undefined}
          defaultOpen
        />
      </div>

      {content.equipment && (
        <section className="mt-4 rounded-[28px] border border-plum-100 bg-white p-5 shadow-sm shadow-plum-900/5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-[16px] font-black text-slate-900">{content.equipment.title}</h3>
            {content.equipment.count && (
              <span className="shrink-0 text-[13px] font-bold text-slate-400">
                {content.equipment.count}
              </span>
            )}
          </div>
          <p className="mt-1 text-[13px] leading-6 text-slate-500">{content.equipment.text}</p>
          {visuals[content.equipment.visual] && (
            <div className="mt-3">{visuals[content.equipment.visual].render()}</div>
          )}
        </section>
      )}

      {content.groups.map((group) => {
        const chapters = rest.filter((chapter) => group.numbers.includes(chapter.number));
        if (chapters.length === 0) return null;

        return (
          <div key={group.heading}>
            <div className="mt-4 flex items-center justify-between gap-2">
              <h3 className="text-[16px] font-black text-slate-900">{group.heading}</h3>
              <span className="shrink-0 text-[13px] font-bold text-slate-400">
                {chapters.length} 節
              </span>
            </div>

            <div className="mt-2 space-y-2">
              {chapters.map((chapter) => (
                <ChapterCard
                  key={chapter.id}
                  chapter={chapter}
                  visual={chapter.visual ? visuals[chapter.visual] : undefined}
                  defaultOpen={false}
                />
              ))}
            </div>
          </div>
        );
      })}

      {content.appendices && content.appendices.length > 0 && (
        <>
          <div className="mt-4 flex items-center justify-between gap-2">
            <h3 className="text-[16px] font-black text-slate-900">附錄</h3>
            <span className="shrink-0 text-[13px] font-bold text-slate-400">
              {content.appendices.length} 篇
            </span>
          </div>

          <div className="mt-2 space-y-2">
            {content.appendices.map((appendix) => (
              <AppendixCard key={appendix.id} appendix={appendix} />
            ))}
          </div>
        </>
      )}

      <p className="mt-4 flex items-start gap-1.5 rounded-2xl bg-slate-50 px-3.5 py-3 text-[13px] leading-6 text-slate-500">
        <Target className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <span className="min-w-0">
          每張卡都可展開，內容包含圖解、做法、錯誤、檢查與注意事項。
          動作要點依國際規則、運動生物力學期刊與教學法整理，教學法會另外標示。
        </span>
      </p>

      <SourcePanel ids={usedIds} />

      <button
        type="button"
        onClick={onBack}
        className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-plum-200 bg-white text-base font-black text-plum-900 shadow-sm transition hover:bg-plum-50 active:scale-[0.99]"
      >
        <ArrowLeft className="h-4 w-4" />
        回到運動
      </button>
    </div>
  );
}
