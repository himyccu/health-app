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
import {
  GOLF_APPENDICES,
  GOLF_CHAPTERS,
  GOLF_DOSE,
  GOLF_INTRO,
  GOLF_SAFETY,
  type GolfAppendix,
  type GolfChapter,
} from '../data/sports/golf';
import { ClubChart } from './golf/ClubChart';
import { GripDiagram } from './golf/GripDiagram';
import { SetupDiagram } from './golf/SetupDiagram';
import { AimDiagram } from './golf/AimDiagram';
import { TorsoRotation3D } from './golf/TorsoRotation3D';
import { ForearmRotation } from './golf/ForearmRotation';
import { SwingSequence } from './golf/SwingSequence';
import { SourceChips, SourcePanel } from './SourceList';

interface GolfGuideProps {
  minutes: number;
  onBack: () => void;
}

const VISUALS: Record<
  NonNullable<GolfChapter['visual']>,
  { render: () => ReactNode; caption: string; note?: string; legend: string[] }
> = {
  grip: {
    render: () => <GripDiagram />,
    caption: '由上往下看雙手的位置',
    legend: [
      '握把斜放，從左手小指根部到食指根部，兩端都在手掌邊緣。',
      '左拇指略偏右側，右手才有位置蓋上來。',
      '右手掌根壓住左拇指，手指包住握把。',
    ],
  },
  setup: {
    render: () => <SetupDiagram />,
    caption: '側面站姿',
    note: '左：彎腰，動作在腰椎。右：髖往後，動作在髖關節。',
    legend: [
      '髖往後推（髖屈），骨盆往後、胸口跟著前傾，不是彎腰。',
      '膝蓋微彎 5–10 度，對齊腳尖方向。',
      '耳、肩、膝、腳掌中段大致成一直線（右圖虛線）。',
    ],
  },
  aim: {
    render: () => <AimDiagram />,
    caption: '由上往下看（右打者）',
    note: '左邊是球到目標的連線；右邊的腳線、髖線、肩線都與它平行。',
    legend: [
      '目標。站在球的正後方先看目標。',
      '球與目標之間的中間點，桿面對準這裡。',
      '球與桿面。7 號鐵的球位在雙腳中央略前。',
    ],
  },
  torso: {
    render: () => <TorsoRotation3D />,
    caption: '三層樓：骨盆、腰椎、胸廓',
    note: '由下往上看：腰椎能轉的角度最小，主要旋轉來自髖關節與胸椎。',
    legend: [
      '胸廓（上層）：轉得最多，是上桿主要的旋轉來源。',
      '腰椎（中層）：每一節約 2 度，整段大約 10–13 度；不是「轉腰」的部位。',
      '骨盆（下層）：轉一點，方向與胸廓相反，兩者的差距就是分離。',
    ],
  },
  forearm: {
    render: () => <ForearmRotation />,
    caption: '前臂旋轉：旋後與旋前',
    note: '前臂的兩根骨頭（橈骨、尺骨）平行或交叉，手掌與桿面就跟著轉。',
    legend: [
      '旋後：掌心轉向上，橈骨與尺骨平行；左前臂在下桿時轉到這個位置。',
      '旋前：掌心轉向下，橈骨跨過尺骨；右前臂在下桿時轉到這個位置。',
      '常聽到的「轉手腕」是在描述這個感覺，真正在轉的是前臂，不是手腕。',
    ],
  },
  swing: {
    render: () => <SwingSequence />,
    caption: '四個位置：起桿、頂點、擊球、收桿',
    note: '四張圖都是側面、右打者。看肩膀位置、雙手高度與球桿角度怎麼變。',
    legend: [
      '起桿：球桿沿目標線後移，重心大致不變。',
      '頂點：雙手到右肩高度，球桿在身後。',
      '擊球：重心到前腳，手的位置超過球。',
      '收桿：重心完全在前腳，球桿繞到左肩後方。',
    ],
  },
};

function ChapterCard({ chapter, defaultOpen }: { chapter: GolfChapter; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const visual = chapter.visual ? VISUALS[chapter.visual] : null;

  return (
    <article className="min-w-0 rounded-[24px] border border-plum-100 bg-white shadow-sm shadow-plum-900/5">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-start gap-3 rounded-[24px] p-4 text-left transition hover:bg-plum-50/50 active:scale-[0.995]"
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-plum-900 text-[16px] font-black text-amber-100">
          {chapter.number}
        </span>

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
                    <li
                      key={item}
                      className="flex gap-2 text-[13px] leading-6 text-plum-900/85"
                    >
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
                    {step.detail && <span className="mt-0.5 block text-emerald-900/80">{step.detail}</span>}
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

function AppendixCard({ appendix }: { appendix: GolfAppendix }) {
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

export function GolfGuide({ minutes, onBack }: GolfGuideProps) {
  const usedIds = [
    ...new Set<SourceId>([
      ...GOLF_CHAPTERS.flatMap((chapter) => chapter.sources),
      ...GOLF_APPENDICES.flatMap((appendix) => appendix.sources),
    ]),
  ];
  const [intro, ...rest] = GOLF_CHAPTERS;
  const basics = rest.filter((chapter) => ['1', '2', '3'].includes(chapter.number));
  const swing = rest.filter((chapter) => ['4', '5', '6'].includes(chapter.number));
  const scoring = rest.filter((chapter) => ['7', '8'].includes(chapter.number));

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
        <p className="text-[13px] font-black tracking-[0.18em] text-plum-300">GOLF · BASICS</p>
        <h2 className="mt-1 font-serif text-[26px] font-black leading-tight tracking-wide">高爾夫</h2>
        <p className="mt-2 text-[15px] leading-7 text-plum-100">{GOLF_INTRO}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {GOLF_DOSE.map((chip) => (
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
          {GOLF_SAFETY.map((note) => (
            <li key={note} className="flex gap-2 text-[13px] leading-6 text-amber-900/85">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" />
              <span className="min-w-0">{note}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-4 flex items-center justify-between gap-2">
        <h3 className="text-[16px] font-black text-slate-900">第 0 章 · 先從這裡開始</h3>
        <span className="shrink-0 text-[13px] font-bold text-slate-400">一頁結論</span>
      </div>

      <div className="mt-2">
        <ChapterCard key={intro.id} chapter={intro} defaultOpen />
      </div>

      <section className="mt-4 rounded-[28px] border border-plum-100 bg-white p-5 shadow-sm shadow-plum-900/5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-[16px] font-black text-slate-900">球桿分類</h3>
          <span className="shrink-0 text-[13px] font-bold text-slate-400">4 類</span>
        </div>
        <p className="mt-1 text-[13px] leading-6 text-slate-500">
          先認得類別與用途，不必背型號。號數越大，桿面角度越大，球飛得越高、越短。
        </p>
        <div className="mt-3">
          <ClubChart />
        </div>
      </section>

      <div className="mt-4 flex items-center justify-between gap-2">
        <h3 className="text-[16px] font-black text-slate-900">第 1–3 章 · 動作基礎</h3>
        <span className="shrink-0 text-[13px] font-bold text-slate-400">{basics.length} 章</span>
      </div>

      <div className="mt-2 space-y-2">
        {basics.map((chapter) => (
          <ChapterCard key={chapter.id} chapter={chapter} defaultOpen={false} />
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <h3 className="text-[16px] font-black text-slate-900">第 4–6 章 · 揮桿</h3>
        <span className="shrink-0 text-[13px] font-bold text-slate-400">{swing.length} 章</span>
      </div>

      <div className="mt-2 space-y-2">
        {swing.map((chapter) => (
          <ChapterCard key={chapter.id} chapter={chapter} defaultOpen={false} />
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <h3 className="text-[16px] font-black text-slate-900">第 7–8 章 · 得分與練習</h3>
        <span className="shrink-0 text-[13px] font-bold text-slate-400">{scoring.length} 章</span>
      </div>

      <div className="mt-2 space-y-2">
        {scoring.map((chapter) => (
          <ChapterCard key={chapter.id} chapter={chapter} defaultOpen={false} />
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <h3 className="text-[16px] font-black text-slate-900">附錄</h3>
        <span className="shrink-0 text-[13px] font-bold text-slate-400">
          {GOLF_APPENDICES.length} 篇
        </span>
      </div>

      <div className="mt-2 space-y-2">
        {GOLF_APPENDICES.map((appendix) => (
          <AppendixCard key={appendix.id} appendix={appendix} />
        ))}
      </div>

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
