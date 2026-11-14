import { ChevronDown, Info } from 'lucide-react';
import {
  SOURCE_CHECKED,
  SOURCES,
  citationLine,
  citationLink,
  type SourceId,
} from '../data/sources';

/** 來源短標籤：第一作者姓 + 年份，仍為英文原文 */
function sourceShortLabel(id: SourceId): string {
  const source = SOURCES[id];
  if (!source) return id;
  const firstAuthor = source.authors.split(',')[0].trim().replace(/^The\s+/i, '');
  // 機構作者用縮寫，避免顯示成 "American 2011" 這種看不懂的標籤
  const ORGANISATIONS: Record<string, string> = {
    'American College of Sports Medicine.': 'ACSM',
    'U.S. Department of Health and Human Services.': 'HHS',
  };
  const organisation = ORGANISATIONS[firstAuthor];
  if (organisation) return `${organisation} ${source.year}`;
  const surname = firstAuthor.split(' ')[0];
  return `${surname} ${source.year}`;
}

/** 掛在段落後面的來源標籤，點不開、只做歸屬提示 */
export function SourceChips({ ids }: { ids: SourceId[] }) {
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

/** 頁尾可展開的完整引用，英文原文，附 DOI 或 PMID */
export function SourcePanel({ ids }: { ids: SourceId[] }) {
  const list = [...new Set(ids)]
    .map((id) => SOURCES[id])
    .filter(Boolean)
    .sort((a, b) => b.year - a.year);

  return (
    <details className="mt-4 rounded-[28px] border border-plum-100 bg-plum-50/70 p-5">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
        <span className="flex min-w-0 items-center gap-1.5 text-[15px] font-black text-plum-900">
          <Info className="h-4 w-4 shrink-0" />
          資料來源（{list.length} 筆）
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-plum-600" />
      </summary>

      <ul className="mt-3 space-y-3">
        {list.map((source) => {
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
  );
}
