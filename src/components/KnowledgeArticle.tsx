import { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
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
import { SourcePanel } from './SourceList';

type ArticleTab = 'muscles' | 'steps' | 'dose' | 'errors' | 'checklist';

const TABS: { id: ArticleTab; label: string; icon: typeof Activity }[] = [
  { id: 'muscles', label: '肌肉', icon: Activity },
  { id: 'steps', label: '做法', icon: Dumbbell },
  { id: 'dose', label: '劑量', icon: TrendingUp },
  { id: 'errors', label: '錯誤', icon: ShieldAlert },
  { id: 'checklist', label: '檢核', icon: ShieldCheck },
];

interface KnowledgeArticleProps {
  article: PatternArticle;
  onBack: () => void;
}

export function KnowledgeArticle({ article, onBack }: KnowledgeArticleProps) {
  const [tab, setTab] = useState<ArticleTab>('muscles');

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

      <section className="overflow-hidden rounded-[28px] border border-plum-100 bg-white shadow-[0_24px_50px_-30px_rgba(47,26,63,0.6)]">
        <div className="bg-gradient-to-br from-plum-950 via-plum-900 to-plum-800 px-5 pb-5 pt-5 text-white">
          <p className="text-[13px] font-black tracking-[0.18em] text-plum-300">
            {article.eyebrow}
          </p>
          <h2 className="mt-1 font-serif text-[26px] font-black leading-tight tracking-wide sm:text-[28px]">
            {article.title}
          </h2>
          <p className="mt-2 text-[15px] font-semibold leading-7 text-plum-100">
            {article.subtitle}
          </p>
          <p className="mt-3 text-[15px] leading-7 text-plum-100/85">{article.intro}</p>
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
              className={`flex h-11 flex-col items-center justify-center gap-0.5 rounded-xl text-[13px] font-black transition sm:flex-row sm:gap-1 ${
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

      {tab === 'muscles' && (
        <div className="animate-fade-up">
          <section className="mt-3 rounded-[24px] border border-plum-100 bg-white p-4 shadow-sm shadow-plum-900/5">
            <SectionHeading icon={Sparkles} title="為什麼要練這個動作" subtitle="日常生活裡用得到的地方" />
            <p className="mt-3 rounded-2xl bg-plum-50/70 px-3.5 py-3 text-[15px] leading-7 text-plum-900">
              {article.why}
            </p>
          </section>

          <section className="mt-3 rounded-[24px] border border-plum-100 bg-white p-4 shadow-sm shadow-plum-900/5">
            <SectionHeading
              icon={Activity}
              title={article.anatomy.headline}
              subtitle="顏色越深，參與越多；點肌群可看說明"
            />
            <p className="mt-3 rounded-2xl bg-plum-50/70 px-3.5 py-3 text-[15px] leading-7 text-plum-900">
              {article.anatomy.summary}
            </p>

            <AnatomyFigure muscles={article.anatomy.muscles} />

            {article.anatomy.extraMuscles && (
              <p className="mt-2 flex items-start gap-1.5 rounded-xl bg-slate-50 px-3 py-2.5 text-[13px] leading-6 text-slate-500">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span className="min-w-0">{article.anatomy.extraMuscles}</span>
              </p>
            )}

            {article.anatomy.groups && (
              <div className="mt-3 space-y-2">
                {article.anatomy.groups.map((group, index) => (
                  <div
                    key={group.group}
                    className="min-w-0 rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-plum-900 text-[13px] font-black text-amber-100">
                        {index + 1}
                      </span>
                      <p className="min-w-0 text-[15px] font-black text-slate-900">{group.group}</p>
                    </div>
                    <p className="mt-1.5 text-[15px] font-black text-plum-800">{group.muscles}</p>
                    <p className="mt-1 text-[15px] leading-7 text-slate-600">{group.role}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="mt-3 rounded-[24px] border border-sky-100 bg-sky-50/70 p-4">
            <SectionHeading
              icon={Activity}
              title="白話原理"
              subtitle="身體哪裡在動、怎麼做、感覺像什麼"
            />
            <ul className="mt-3 space-y-2.5">
              {article.principle.map((item, index) => (
                <li key={item} className="flex gap-2.5">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sky-700 text-[13px] font-black text-white">
                    {index + 1}
                  </span>
                  <span className="min-w-0 text-[15px] leading-7 text-sky-950/85">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}

      {tab === 'steps' && (
        <div className="animate-fade-up">
          <section className="mt-3 rounded-[24px] border border-emerald-200 bg-emerald-50/60 p-4">
            <p className="flex items-center gap-1.5 text-[15px] font-black text-emerald-900">
              <Check className="h-4 w-4" strokeWidth={3} />
              起始位置
            </p>
            <ul className="mt-2 space-y-1.5">
              {article.technique.startCues.map((cue) => (
                <li key={cue} className="flex gap-2 text-[15px] leading-7 text-emerald-900/85">
                  <Check className="mt-1.5 h-4 w-4 shrink-0 text-emerald-600" strokeWidth={3} />
                  <span className="min-w-0">{cue}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-3 space-y-2.5">
            {article.technique.phases.map((phase) => (
              <section
                key={phase.step}
                className="rounded-[24px] border border-slate-100 bg-white p-4 shadow-sm shadow-plum-900/5"
              >
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-plum-900 text-[15px] font-black text-amber-200">
                    {phase.step}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-[18px] font-black leading-tight text-slate-900">
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

          <section className="mt-3 rounded-[24px] border border-plum-200 bg-plum-50/70 p-4">
            <p className="flex items-center gap-1.5 text-[15px] font-black text-plum-900">
              <Sparkles className="h-4 w-4" />
              做對的感覺
            </p>
            <ul className="mt-2 space-y-2">
              {article.feeling.map((item) => (
                <li key={item} className="flex gap-2 text-[15px] leading-7 text-plum-900/85">
                  <Check className="mt-1.5 h-4 w-4 shrink-0 text-plum-600" strokeWidth={3} />
                  <span className="min-w-0">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {article.technique.breathing && (
            <section className="mt-3 rounded-[24px] border border-sky-100 bg-sky-50/70 p-4">
              <SectionHeading
                icon={Wind}
                title="腹壓與核心"
                subtitle="先建立剛性，再輸出力量"
              />
              <div className="mt-3 space-y-2">
                {article.technique.breathing.map((item, index) => (
                  <div key={item.title} className="flex gap-2.5 rounded-2xl bg-white/80 p-3">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sky-700 text-[13px] font-black text-white">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[15px] font-black text-sky-950">{item.title}</p>
                      <p className="mt-0.5 text-[15px] leading-7 text-sky-900/75">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {article.technique.warning && (
                <p className="mt-2.5 flex items-start gap-1.5 text-[13px] leading-6 text-sky-900/70">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span className="min-w-0">{article.technique.warning}</span>
                </p>
              )}
            </section>
          )}

          {article.technique.note && (
            <p className="mt-3 border-l-2 border-plum-300 px-3 py-1 text-[15px] leading-7 text-slate-600">
              <span className="font-black text-plum-800">小提醒：</span>
              {article.technique.note}
            </p>
          )}
        </div>
      )}

      {tab === 'dose' && (
        <div className="animate-fade-up">
          <section className="mt-3 rounded-[24px] border border-plum-100 bg-white p-4 shadow-sm shadow-plum-900/5">
            <SectionHeading
              icon={TrendingUp}
              title="三個要記住的數字"
              subtitle="依美國運動醫學會的阻力訓練指引"
            />
            <div className="mt-3 divide-y divide-slate-100 rounded-2xl bg-plum-50/70 px-4">
              {article.dose.map((item) => (
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
          </section>

          <ProgressionMatrix levels={article.levels} />

          <section className="mt-3 rounded-[24px] border border-emerald-200 bg-emerald-50/70 p-4">
            <p className="flex items-center gap-1.5 text-[15px] font-black text-emerald-900">
              <ArrowRight className="h-4 w-4" />
              {article.nextStep.title}
            </p>
            <p className="mt-1.5 text-[15px] leading-7 text-emerald-900/85">
              {article.nextStep.detail}
            </p>
          </section>
        </div>
      )}

      {tab === 'errors' && (
        <div className="animate-fade-up">
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
                    <p className="mt-1 text-[15px] leading-7 text-slate-600">{error.summary}</p>
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
                  <p className="text-[13px] font-black text-emerald-800">矯正方式</p>
                  <p className="mt-0.5 text-[15px] leading-7 text-emerald-900">{error.fix}</p>
                </div>
              </section>
            ))}
          </div>
        </div>
      )}

      {tab === 'checklist' && (
        <div className="animate-fade-up">
          <section className="mt-3 rounded-[24px] border border-plum-100 bg-white p-4 shadow-sm shadow-plum-900/5">
            <SectionHeading
              icon={ShieldCheck}
              title="動作檢核"
              subtitle="每次開始前，快速確認這幾件事"
            />

            <div className="mt-3 grid gap-2.5">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3.5">
                <p className="flex items-center gap-1.5 text-[15px] font-black text-emerald-900">
                  <Check className="h-4 w-4" strokeWidth={3} />
                  必做關鍵點
                </p>
                <ul className="mt-2 space-y-1.5">
                  {article.checklist.do.map((item) => (
                    <li key={item} className="flex gap-2 text-[15px] leading-7 text-emerald-900/85">
                      <Check className="mt-1.5 h-4 w-4 shrink-0 text-emerald-600" strokeWidth={3} />
                      <span className="min-w-0">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-3.5">
                <p className="flex items-center gap-1.5 text-[15px] font-black text-rose-900">
                  <X className="h-4 w-4" strokeWidth={3} />
                  避免動作
                </p>
                <ul className="mt-2 space-y-1.5">
                  {article.checklist.dont.map((item) => (
                    <li key={item} className="flex gap-2 text-[15px] leading-7 text-rose-900/85">
                      <X className="mt-1.5 h-4 w-4 shrink-0 text-rose-500" strokeWidth={3} />
                      <span className="min-w-0">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="mt-3 rounded-[24px] border border-amber-200 bg-amber-50/80 p-4">
            <p className="flex items-center gap-1.5 text-[15px] font-black text-amber-900">
              <ShieldAlert className="h-4 w-4" />
              安全提醒
            </p>
            <ul className="mt-2 space-y-2">
              {article.safety.map((note) => (
                <li key={note} className="flex gap-2 text-[15px] leading-7 text-amber-900/85">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" />
                  <span className="min-w-0">{note}</span>
                </li>
              ))}
            </ul>
          </section>

          <SourcePanel ids={article.sources} />
        </div>
      )}

      <button
        type="button"
        onClick={onBack}
        className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-plum-200 bg-white text-[15px] font-black text-plum-900 shadow-sm transition hover:bg-plum-50 active:scale-[0.99]"
      >
        <ArrowLeft className="h-4 w-4" />
        回到運動
      </button>
    </div>
  );
}
