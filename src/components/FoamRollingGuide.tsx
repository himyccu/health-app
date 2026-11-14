import { ArrowLeft, ChevronDown, Clock, Info } from 'lucide-react';
import type { SourceId } from '../data/sources';
import { SOURCES, SOURCE_CHECKED, citationLine, citationLink } from '../data/sources';
import {
  ROLLER_CHOICES,
  ROLLING_DOSE,
  ROLLING_MYTHS,
  ROLLING_SAFETY,
  ROLLING_STATIONS,
} from '../data/foamRolling';
import { RollingLoop } from './RollingLoop';

interface FoamRollingGuideProps {
  summary: string;
  minutes: number;
  onBack: () => void;
}

/** 來源短標籤：第一作者姓 + 年份，仍為英文原文 */
function sourceShortLabel(id: SourceId): string {
  const source = SOURCES[id];
  if (!source) return id;
  const firstAuthor = source.authors.split(',')[0].trim();
  const surname = firstAuthor.split(' ')[0];
  return `${surname} ${source.year}`;
}

function SourceChips({ ids }: { ids: SourceId[] }) {
  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {ids.map((id) => {
        const source = SOURCES[id];
        return (
          <span
            key={id}
            className="inline-flex items-center gap-1 rounded-full bg-plum-50 px-2.5 py-1 text-[13px] font-bold text-plum-700"
          >
            {sourceShortLabel(id)}
            <span className="text-plum-400">{source?.country ?? ''}</span>
          </span>
        );
      })}
    </div>
  );
}

export function FoamRollingGuide({ summary, minutes, onBack }: FoamRollingGuideProps) {
  const usedIds = [
    ...new Set<SourceId>([
      ...ROLLING_STATIONS.flatMap((station) => station.sources),
      ...ROLLING_MYTHS.map((item) => item.source),
    ]),
  ];
  const usedSources = usedIds
    .map((id) => SOURCES[id])
    .filter(Boolean)
    .sort((a, b) => b.year - a.year);

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
            滾筒放鬆
          </h2>
          <p className="mt-2 text-[15px] font-semibold leading-7 text-plum-100">{summary}</p>
          <p className="mt-3 flex items-center gap-1.5 text-[13px] font-semibold text-plum-300">
            <Clock className="h-4 w-4" />
            閱讀約 {minutes} 分鐘
          </p>
        </div>

        <div className="p-5">
          <div className="divide-y divide-slate-100 rounded-2xl bg-plum-50/70 px-4">
            {ROLLING_DOSE.map((item) => (
              <div key={item.label} className="min-w-0 py-3">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="shrink-0 text-[13px] font-bold text-plum-700">{item.label}</span>
                  <span className="min-w-0 break-anywhere text-right text-[18px] font-black leading-snug text-plum-950">
                    {item.value}
                  </span>
                </div>
                <p className="mt-1 text-[13px] leading-6 text-slate-500">{item.hint}</p>
              </div>
            ))}
          </div>

          <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/70 px-3.5 py-3 text-[15px] leading-7 text-amber-900">
            能拿到的是柔軟度與痠痛感，不是力量。對肌力、跳躍的影響幾乎是零。
          </p>
        </div>
      </section>

      <section className="mt-4 rounded-[28px] border border-plum-100 bg-white p-5 shadow-sm shadow-plum-900/5">
        <h3 className="text-[18px] font-black leading-snug text-slate-900">六個部位，由下往上</h3>
        <p className="mt-2 text-[15px] leading-7 text-slate-600">
          每個部位做完再換下一個，全部約 10 分鐘。順序是操作上的安排，不是效果上的規定。
        </p>

        <div className="mt-4 space-y-4">
          {ROLLING_STATIONS.map((station, index) => (
            <article
              key={station.id}
              className="min-w-0 rounded-2xl border border-slate-100 bg-white p-3.5"
            >
              <p className="flex items-baseline gap-2">
                <span className="text-[13px] font-black text-plum-500">{index + 1}</span>
                <span className="min-w-0 text-[16px] font-black text-slate-900">{station.name}</span>
                <span className="ml-auto shrink-0 rounded-full bg-plum-50 px-2.5 py-0.5 text-[13px] font-bold text-plum-700">
                  {station.dose}
                </span>
              </p>

              <div className="mt-3">
                <RollingLoop visual={station.visual} label={station.name} />
              </div>

              <dl className="mt-3 space-y-2.5">
                <div className="min-w-0">
                  <dt className="text-[13px] font-black text-slate-500">位置</dt>
                  <dd className="mt-0.5 text-[15px] leading-7 text-slate-700">{station.area}</dd>
                </div>
                <div className="min-w-0">
                  <dt className="text-[13px] font-black text-slate-500">怎麼擺</dt>
                  <dd className="mt-0.5 text-[15px] leading-7 text-slate-700">{station.setup}</dd>
                </div>
                <div className="min-w-0">
                  <dt className="text-[13px] font-black text-slate-500">做對的感覺</dt>
                  <dd className="mt-0.5 text-[15px] leading-7 text-slate-700">{station.feel}</dd>
                </div>
              </dl>

              <div className="mt-3 rounded-2xl bg-rose-50/70 px-3.5 py-3">
                <p className="text-[13px] font-black text-rose-900">常見錯誤</p>
                <ul className="mt-1.5 space-y-1">
                  {station.mistakes.map((mistake) => (
                    <li key={mistake} className="flex gap-2 text-[15px] leading-7 text-rose-900/85">
                      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />
                      <span className="min-w-0">{mistake}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-2 grid grid-cols-1 gap-2 min-[380px]:grid-cols-2">
                <div className="min-w-0 rounded-2xl bg-slate-50 px-3.5 py-3">
                  <p className="text-[13px] font-black text-slate-500">這些情況跳過</p>
                  <p className="mt-1 text-[15px] leading-7 text-slate-700">{station.skip}</p>
                </div>
                <div className="min-w-0 rounded-2xl bg-slate-50 px-3.5 py-3">
                  <p className="text-[13px] font-black text-slate-500">沒有滾筒時</p>
                  <p className="mt-1 text-[15px] leading-7 text-slate-700">{station.instead}</p>
                </div>
              </div>

              {station.note && (
                <p className="mt-2 rounded-2xl border border-amber-200 bg-amber-50/70 px-3.5 py-3 text-[15px] leading-7 text-amber-900">
                  {station.note}
                </p>
              )}

              <SourceChips ids={station.sources} />
            </article>
          ))}
        </div>
      </section>

      <section className="mt-4 rounded-[28px] border border-plum-100 bg-white p-5 shadow-sm shadow-plum-900/5">
        <h3 className="text-[18px] font-black leading-snug text-slate-900">滾筒怎麼選</h3>
        <ul className="mt-3 space-y-2">
          {ROLLER_CHOICES.map((item) => (
            <li key={item.title} className="rounded-2xl bg-slate-50 px-3.5 py-3">
              <span className="block text-[15px] font-black text-slate-800">{item.title}</span>
              <span className="mt-0.5 block text-[15px] leading-7 text-slate-600">
                {item.detail}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-4 rounded-[28px] border border-rose-200 bg-rose-50/60 p-5">
        <h3 className="text-[18px] font-black leading-snug text-rose-900">不要做的事</h3>
        <ul className="mt-3 space-y-2">
          {ROLLING_SAFETY.map((item) => (
            <li key={item} className="flex gap-2 text-[15px] leading-7 text-rose-900/90">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />
              <span className="min-w-0">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-4 rounded-[28px] border border-plum-100 bg-white p-5 shadow-sm shadow-plum-900/5">
        <h3 className="text-[18px] font-black leading-snug text-slate-900">四個常見誤解</h3>
        <div className="mt-3 space-y-2.5">
          {ROLLING_MYTHS.map((item) => (
            <div key={item.myth} className="min-w-0 rounded-2xl bg-slate-50 px-3.5 py-3">
              <p className="text-[15px] font-black text-slate-800">{item.myth}</p>
              <p className="mt-1 text-[15px] leading-7 text-slate-600">{item.fact}</p>
              <SourceChips ids={[item.source]} />
            </div>
          ))}
        </div>
      </section>

      <details className="mt-4 rounded-[28px] border border-plum-100 bg-plum-50/70 p-5">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
          <span className="flex min-w-0 items-center gap-1.5 text-[15px] font-black text-plum-900">
            <Info className="h-4 w-4 shrink-0" />
            資料來源（{usedSources.length} 筆）
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-plum-600" />
        </summary>

        <ul className="mt-3 space-y-3">
          {usedSources.map((source) => {
            const link = citationLink(source);
            return (
              <li key={source.id} className="min-w-0">
                <p className="break-anywhere text-[13px] leading-6 text-plum-900">
                  {citationLine(source)}
                </p>
                <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-slate-500">
                  {link && (
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-anywhere font-bold text-plum-700 underline decoration-plum-300 underline-offset-2"
                    >
                      {source.doi ? `DOI ${source.doi}` : source.pmid ? `PMID ${source.pmid}` : '原文'}
                    </a>
                  )}
                  {source.doi && source.pmid && <span className="break-anywhere">PMID {source.pmid}</span>}
                  <span>{source.country}</span>
                </p>
              </li>
            );
          })}
        </ul>

        <p className="mt-3 text-[13px] leading-6 text-slate-500">
          文獻查核日期 {SOURCE_CHECKED}。引用格式為英文原文，未經翻譯。
        </p>
        <p className="mt-1 text-[13px] leading-6 text-slate-500">
          本內容為一般運動知識，不構成醫療診斷或治療建議。身體不適請就醫。
        </p>
      </details>
    </div>
  );
}
