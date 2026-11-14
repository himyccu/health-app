import { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Check,
  Dumbbell,
  Info,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wind,
  X,
} from 'lucide-react';
import type { PatternArticle } from '../data/knowledgeCenter';
import { AnatomyFigure } from './AnatomyFigure';
import { ProgressionMatrix } from './ProgressionMatrix';
import { SectionHeading } from './SectionHeading';

type ArticleTab = 'anatomy' | 'technique' | 'levels' | 'errors' | 'checklist';

const TABS: { id: ArticleTab; label: string; icon: typeof Activity }[] = [
  { id: 'anatomy', label: '解剖', icon: Activity },
  { id: 'technique', label: '動作', icon: Dumbbell },
  { id: 'levels', label: '分級', icon: TrendingUp },
  { id: 'errors', label: '錯誤', icon: ShieldAlert },
  { id: 'checklist', label: '檢核', icon: ShieldCheck },
];

interface KnowledgeArticleProps {
  article: PatternArticle;
  onBack: () => void;
}

export function KnowledgeArticle({ article, onBack }: KnowledgeArticleProps) {
  const [tab, setTab] = useState<ArticleTab>('anatomy');

  return (
    <div className="animate-fade-up">
      <section className="overflow-hidden rounded-[30px] border border-plum-100 bg-white shadow-[0_24px_50px_-30px_rgba(47,26,63,0.6)]">
        {article.hero && (
          <div className="aspect-[11/10] w-full bg-plum-100">
            <img
              src={article.hero.src}
              alt={article.hero.alt}
              className="h-full w-full object-contain"
              loading="lazy"
            />
          </div>
        )}
        <div className="bg-plum-950 px-5 pb-5 pt-4 text-white">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-300 px-3 py-1 text-[10px] font-black tracking-[0.14em] text-plum-950">
              <Dumbbell className="h-3.5 w-3.5" />
              {article.eyebrow}
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold text-plum-100 ring-1 ring-white/15">
              動作教學
            </span>
          </div>
          <h2 className="mt-3 font-serif text-[26px] font-black leading-tight tracking-wide sm:text-[28px]">
            {article.title}
          </h2>
          <p className="mt-1 text-sm font-semibold text-plum-100">{article.englishTitle}</p>
          <p className="mt-1 text-[13px] font-semibold text-plum-300">{article.subtitle}</p>
          <p className="mt-3 text-[15px] leading-7 text-plum-100">{article.intro}</p>
        </div>
      </section>

      <div className="mt-4 grid grid-cols-5 gap-1 rounded-2xl bg-slate-100 p-1">
        {TABS.map((item) => {
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              aria-pressed={active}
              className={`flex h-11 flex-col items-center justify-center gap-0.5 rounded-xl text-[12px] font-black transition sm:flex-row sm:gap-1 sm:text-[13px] ${
                active
                  ? 'bg-plum-900 text-white shadow-sm'
                  : 'text-slate-500 hover:bg-white/70 hover:text-slate-700'
              }`}
            >
              <item.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2.4} />
              {item.label}
            </button>
          );
        })}
      </div>

      {tab === 'anatomy' && (
        <div className="animate-fade-up">
          <section className="mt-3 rounded-[26px] border border-plum-100 bg-white p-4 shadow-sm shadow-plum-900/5">
            <SectionHeading
              icon={Activity}
              title={article.anatomy.headline}
              subtitle="顏色越深，參與越多；點肌群可看說明"
            />
            <p className="mt-3 rounded-2xl bg-plum-50/70 px-3.5 py-3 text-[14px] leading-6 text-plum-900">
              {article.anatomy.summary}
            </p>

            {article.anatomy.image && (
              <figure className="mt-3 overflow-hidden rounded-2xl border border-slate-100">
                <img
                  src={article.anatomy.image.src}
                  alt={article.anatomy.image.alt}
                  className="w-full"
                  loading="lazy"
                />
                {article.anatomy.image.caption && (
                  <figcaption className="bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-500">
                    {article.anatomy.image.caption}
                  </figcaption>
                )}
              </figure>
            )}

            <AnatomyFigure muscles={article.anatomy.muscles} />

            {article.anatomy.extraMuscles && (
              <p className="mt-2 flex items-start gap-1.5 rounded-xl bg-slate-50 px-3 py-2.5 text-[12px] leading-5 text-slate-500">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {article.anatomy.extraMuscles}
              </p>
            )}

            <div className="mt-3 rounded-2xl border border-sky-100 bg-sky-50/70 p-3.5">
              <p className="flex items-center gap-1.5 text-sm font-black text-sky-900">
                <Activity className="h-4 w-4" />
                關節與動作分析
              </p>
              <ul className="mt-2 space-y-1.5">
                {article.anatomy.kinesiology.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-[14px] leading-6 text-sky-900/85"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {article.anatomy.groups && (
              <div className="mt-3 space-y-2">
                {article.anatomy.groups.map((group, index) => (
                  <div
                    key={group.group}
                    className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-plum-900 text-[11px] font-black text-amber-100">
                        {index + 1}
                      </span>
                      <p className="text-[15px] font-black text-slate-900">{group.group}</p>
                    </div>
                    <p className="mt-1.5 text-[14px] font-black text-plum-800">{group.muscles}</p>
                    <p className="mt-1 text-[14px] leading-6 text-slate-600">{group.role}</p>
                  </div>
                ))}
              </div>
            )}

            {article.anatomy.whyWorth && (
              <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50/80 p-3.5">
                <p className="flex items-center gap-1.5 text-sm font-black text-amber-900">
                  <Sparkles className="h-4 w-4" />
                  為什麼值得練
                </p>
                <p className="mt-1.5 text-[14px] leading-6 text-amber-900/80">
                  {article.anatomy.whyWorth}
                </p>
              </div>
            )}
          </section>
        </div>
      )}

      {tab === 'technique' && (
        <div className="animate-fade-up">
          {article.technique.image && (
            <figure className="mt-3 overflow-hidden rounded-[26px] border border-plum-100 bg-white shadow-sm">
              <div className="aspect-[11/10] w-full bg-slate-100">
                <img
                  src={article.technique.image.src}
                  alt={article.technique.image.alt}
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
              </div>
              {article.technique.image.caption && (
                <figcaption className="px-4 pb-4 pt-3.5">
                  <p className="text-[11px] font-black tracking-[0.16em] text-plum-600">起始位置</p>
                  <p className="mt-1 text-[16px] font-black leading-7 text-slate-900">
                    {article.technique.image.caption}
                  </p>
                  {article.technique.startCues && (
                    <ul className="mt-3 space-y-2">
                      {article.technique.startCues.map((cue) => (
                        <li
                          key={cue}
                          className="flex gap-2.5 rounded-2xl bg-slate-50 px-3 py-2.5 text-[15px] font-bold leading-6 text-slate-800"
                        >
                          <Check
                            className="mt-1 h-4 w-4 shrink-0 text-emerald-600"
                            strokeWidth={3}
                          />
                          <span className="min-w-0">{cue}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </figcaption>
              )}
            </figure>
          )}

          {!article.technique.image && article.technique.startCues && (
            <section className="mt-3 rounded-[24px] border border-emerald-200 bg-emerald-50/60 p-4">
              <p className="flex items-center gap-1.5 text-sm font-black text-emerald-900">
                <Check className="h-4 w-4" strokeWidth={3} />
                起始位置
              </p>
              <ul className="mt-2 space-y-1.5">
                {article.technique.startCues.map((cue) => (
                  <li key={cue} className="flex gap-2 text-[14px] leading-6 text-emerald-900/85">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-emerald-600" strokeWidth={3} />
                    {cue}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="mt-3 space-y-2.5">
            {article.technique.phases.map((phase) => (
              <section
                key={phase.step}
                className="rounded-[24px] border border-slate-100 bg-white p-4 shadow-sm shadow-plum-900/5"
              >
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-plum-900 text-sm font-black text-amber-200">
                    {phase.step}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-[17px] font-black leading-tight text-slate-900">
                      {phase.title}
                    </h3>
                    <p className="mt-0.5 text-[13px] font-bold text-plum-600">{phase.subtitle}</p>
                  </div>
                </div>
                <ul className="mt-3 space-y-2">
                  {phase.points.map((point) => (
                    <li
                      key={point}
                      className="flex gap-2 text-[15px] font-semibold leading-7 text-slate-700"
                    >
                      <Check className="mt-1.5 h-4 w-4 shrink-0 text-emerald-600" strokeWidth={3} />
                      <span className="min-w-0">{point}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          {article.technique.breathing && (
            <section className="mt-3 rounded-[24px] border border-sky-100 bg-sky-50/70 p-4">
              <SectionHeading
                icon={Wind}
                title="腹壓與核心建立"
                subtitle="Valsalva 呼吸法：先建立剛性，再輸出力量"
              />
              <div className="mt-3 space-y-2">
                {article.technique.breathing.map((item, index) => (
                  <div key={item.title} className="flex gap-2.5 rounded-2xl bg-white/80 p-3">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sky-700 text-[11px] font-black text-white">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-black text-sky-950">{item.title}</p>
                      <p className="mt-0.5 text-[14px] leading-6 text-sky-900/75">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {article.technique.warning && (
                <p className="mt-2.5 flex items-start gap-1.5 text-xs leading-5 text-sky-900/70">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  {article.technique.warning}
                </p>
              )}
            </section>
          )}

          {article.technique.coachNote && (
            <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50/80 p-3.5">
              <p className="flex items-center gap-1.5 text-sm font-black text-amber-900">
                <Sparkles className="h-4 w-4" />
                教練提醒
              </p>
              <p className="mt-1 text-[14px] leading-6 text-amber-900/85">
                {article.technique.coachNote}
              </p>
            </div>
          )}
        </div>
      )}

      {tab === 'levels' && (
        <div className="animate-fade-up">
          <ProgressionMatrix levels={article.levels} />
        </div>
      )}

      {tab === 'errors' && (
        <div className="animate-fade-up">
          {article.comparison && (
            <section className="mt-3 rounded-[26px] border border-plum-100 bg-white p-4 shadow-sm shadow-plum-900/5">
              <SectionHeading
                icon={ShieldAlert}
                title="正確與錯誤的對比"
                subtitle="同一個重量，排列不同，風險就完全不同"
              />

              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="min-w-0 overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50/60">
                  <div className="flex items-center gap-1.5 bg-emerald-600 px-2.5 py-1.5 text-white">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    <span className="text-xs font-black">正確</span>
                  </div>
                  <div className="aspect-[11/10] w-full overflow-hidden bg-white">
                    <img
                      src={article.comparison.image}
                      alt={article.comparison.imageAlt}
                      className="h-full w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-2.5">
                    <p className="text-[13px] font-black leading-5 text-emerald-900">
                      {article.comparison.correctTitle}
                    </p>
                    <p className="mt-1 text-[12px] leading-5 text-emerald-900/70">
                      {article.comparison.correctSummary}
                    </p>
                  </div>
                </div>

                <div className="min-w-0 overflow-hidden rounded-2xl border border-rose-200 bg-rose-50/60">
                  <div className="flex items-center gap-1.5 bg-rose-600 px-2.5 py-1.5 text-white">
                    <X className="h-3.5 w-3.5" strokeWidth={3} />
                    <span className="text-xs font-black">錯誤</span>
                  </div>
                  <div className="grid aspect-[11/10] w-full place-items-center overflow-hidden bg-rose-100/70 px-1">
                    {article.comparison.spineDiagram ? (
                      <SpineDiagram />
                    ) : (
                      <AlertTriangle className="h-8 w-8 text-rose-400" />
                    )}
                  </div>
                  <div className="p-2.5">
                    <p className="text-[13px] font-black leading-5 text-rose-900">
                      {article.comparison.wrongTitle}
                    </p>
                    <p className="mt-1 text-[12px] leading-5 text-rose-900/70">
                      {article.comparison.wrongSummary}
                    </p>
                    <ul className="mt-1.5 space-y-0.5">
                      {article.comparison.wrongPoints.map((point) => (
                        <li key={point} className="flex gap-1 text-[11px] leading-5 text-rose-900/70">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-rose-400" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          )}

          <div className="mt-3 space-y-2.5">
            {article.errors.map((error) => (
              <section
                key={error.title}
                className="rounded-[24px] border border-rose-100 bg-white p-4 shadow-sm shadow-rose-900/5"
              >
                <div className="flex items-start gap-2.5">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-rose-50 text-rose-600">
                    <AlertTriangle className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-[16px] font-black leading-snug text-slate-900">
                      {error.title}
                    </h3>
                    <p className="mt-1 text-[14px] leading-6 text-slate-600">{error.summary}</p>
                  </div>
                </div>
                <ul className="mt-2.5 space-y-1.5 rounded-2xl bg-rose-50/60 p-3">
                  {error.harms.map((harm) => (
                    <li key={harm} className="flex gap-2 text-[13px] leading-6 text-rose-900/80">
                      <X className="mt-1 h-3.5 w-3.5 shrink-0 text-rose-500" strokeWidth={3} />
                      <span className="min-w-0">{harm}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-2 rounded-2xl bg-emerald-50 px-3 py-2.5">
                  <p className="text-[12px] font-black text-emerald-800">矯正方式</p>
                  <p className="mt-0.5 text-[14px] leading-6 text-emerald-900">{error.fix}</p>
                </div>
              </section>
            ))}
          </div>
        </div>
      )}

      {tab === 'checklist' && (
        <div className="animate-fade-up">
          <section className="mt-3 rounded-[26px] border border-plum-100 bg-white p-4 shadow-sm shadow-plum-900/5">
            <SectionHeading
              icon={ShieldCheck}
              title="訓練檢核清單"
              subtitle="每次開始前，快速確認這幾件事"
            />

            <div className="mt-3 grid gap-2.5">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3.5">
                <p className="flex items-center gap-1.5 text-sm font-black text-emerald-900">
                  <Check className="h-4 w-4" strokeWidth={3} />
                  必做關鍵點
                </p>
                <ul className="mt-2 space-y-1.5">
                  {article.checklist.do.map((item) => (
                    <li key={item} className="flex gap-2 text-[14px] leading-6 text-emerald-900/85">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-emerald-600" strokeWidth={3} />
                      <span className="min-w-0">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-3.5">
                <p className="flex items-center gap-1.5 text-sm font-black text-rose-900">
                  <X className="h-4 w-4" strokeWidth={3} />
                  避免動作
                </p>
                <ul className="mt-2 space-y-1.5">
                  {article.checklist.dont.map((item) => (
                    <li key={item} className="flex gap-2 text-[14px] leading-6 text-rose-900/85">
                      <X className="mt-1 h-4 w-4 shrink-0 text-rose-500" strokeWidth={3} />
                      <span className="min-w-0">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="mt-3 rounded-[24px] border border-amber-200 bg-amber-50/80 p-4">
            <p className="flex items-center gap-1.5 text-sm font-black text-amber-900">
              <ShieldAlert className="h-4 w-4" />
              安全提醒
            </p>
            <ul className="mt-2 space-y-2">
              {article.safety.map((note) => (
                <li key={note} className="flex gap-2 text-[13px] leading-6 text-amber-900/85">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" />
                  <span className="min-w-0">{note}</span>
                </li>
              ))}
            </ul>
          </section>

          {article.credits && (
            <p className="mt-3 rounded-2xl bg-slate-50 px-3.5 py-3 text-[11px] leading-5 text-slate-400">
              {article.credits}
            </p>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={onBack}
        className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-plum-200 bg-white text-sm font-black text-plum-900 shadow-sm transition hover:bg-plum-50 active:scale-[0.99]"
      >
        <ArrowLeft className="h-4 w-4" />
        回到運動知識庫
      </button>
    </div>
  );
}

function SpineDiagram() {
  return (
    <svg viewBox="0 0 160 120" className="h-full w-full" aria-hidden="true">
      <g transform="translate(8, 8)">
        <rect x="0" y="0" width="68" height="104" rx="14" fill="#ffffff" opacity="0.85" />
        <path
          d="M34 14 C 34 40, 34 66, 34 92"
          fill="none"
          stroke="#059669"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <circle cx="34" cy="14" r="5" fill="#059669" />
        <text x="34" y="110" textAnchor="middle" fontSize="10" fontWeight="700" fill="#047857">
          中立
        </text>
      </g>
      <g transform="translate(84, 8)">
        <rect x="0" y="0" width="68" height="104" rx="14" fill="#ffffff" opacity="0.85" />
        <path
          d="M34 14 C 58 34, 10 66, 34 92"
          fill="none"
          stroke="#e11d48"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <circle cx="34" cy="14" r="5" fill="#e11d48" />
        <text x="34" y="110" textAnchor="middle" fontSize="10" fontWeight="700" fill="#be123c">
          圓背
        </text>
      </g>
    </svg>
  );
}
