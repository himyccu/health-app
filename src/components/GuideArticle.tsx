import { ArrowLeft, Clock, Info } from 'lucide-react';
import type { Guide } from '../data/guides';

interface GuideArticleProps {
  guide: Guide;
  onBack: () => void;
}

/**
 * 「開始之前」指南的閱讀畫面。
 * 只做一件事：大字、單欄、依序閱讀。
 */
export function GuideArticle({ guide, onBack }: GuideArticleProps) {
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

      <section className="overflow-hidden rounded-[28px] border border-plum-100 bg-white shadow-[0_24px_50px_-30px_rgba(47,26,63,0.5)]">
        <div className="bg-gradient-to-br from-plum-950 via-plum-900 to-plum-800 px-5 pb-5 pt-5 text-white">
          <h2 className="font-serif text-[26px] font-black leading-tight tracking-wide">
            {guide.title}
          </h2>
          <p className="mt-2 text-[15px] font-semibold leading-7 text-plum-100">{guide.summary}</p>
          <p className="mt-3 flex items-center gap-1.5 text-[13px] font-semibold text-plum-300">
            <Clock className="h-4 w-4" />
            閱讀約 {guide.minutes} 分鐘
          </p>
        </div>

        <div className="space-y-4 p-5">
          {guide.sections.map((section) => (
            <section key={section.heading}>
              <h3 className="text-[18px] font-black leading-snug text-slate-900">
                {section.heading}
              </h3>
              {section.intro && (
                <p className="mt-2 text-[15px] leading-7 text-slate-600">{section.intro}</p>
              )}

              {section.points && (
                <ul className="mt-2.5 space-y-2">
                  {section.points.map((point) => (
                    <li
                      key={point.label}
                      className="rounded-2xl bg-slate-50 px-3.5 py-3 text-[15px] leading-7"
                    >
                      <span className="block font-black text-slate-800">{point.label}</span>
                      {point.detail && (
                        <span className="mt-0.5 block text-slate-500">{point.detail}</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {section.note && (
                <p className="mt-2.5 rounded-2xl border border-amber-200 bg-amber-50/70 px-3.5 py-3 text-[15px] leading-7 text-amber-900">
                  {section.note}
                </p>
              )}
            </section>
          ))}

          <div className="rounded-2xl border border-plum-100 bg-plum-50/70 p-4">
            <p className="flex items-center gap-1.5 text-[13px] font-black text-plum-900">
              <Info className="h-4 w-4" />
              資料來源
            </p>
            <ul className="mt-2 space-y-1">
              {guide.sources.map((source) => (
                <li key={source} className="text-[13px] leading-6 text-plum-700">
                  {source}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[13px] leading-6 text-slate-500">
              本內容為一般運動知識，不構成醫療診斷或治療建議。身體不適請就醫。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
