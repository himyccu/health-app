import { ArrowRight, BookOpen, Clock, Sparkles } from 'lucide-react';
import { KNOWLEDGE_CARDS } from '../data/knowledgeCenter';
import { SectionHeading } from './SectionHeading';
import dogPhoto from '../assets/dog.png';

interface KnowledgeCenterProps {
  onOpenArticle: () => void;
}

export function KnowledgeCenter({ onOpenArticle }: KnowledgeCenterProps) {
  return (
    <div className="animate-fade-up">
      <section className="rounded-[28px] border border-plum-100 bg-white p-4 shadow-sm shadow-plum-900/5">
        <div className="flex items-start justify-between gap-3">
          <SectionHeading
            icon={BookOpen}
            title="運動知識庫"
            subtitle="動作圖文教學，持續新增"
          />
          <span className="shrink-0 rounded-full bg-plum-50 px-2.5 py-1 text-xs font-black text-plum-800">
            5 篇教學
          </span>
        </div>

        <p className="mt-3 rounded-2xl bg-plum-50/70 px-3.5 py-3 text-sm leading-6 text-plum-900">
          從推、拉、蹲、髖到移動，先理解身體怎麼動，再選擇適合自己的訓練。
        </p>

        <div className="mt-3 space-y-2.5">
          {KNOWLEDGE_CARDS.map((card) => {
            const Icon = card.icon;
            const available = card.status === 'available';

            return (
              <article
                key={card.id}
                id={`knowledge-${card.id}`}
                className={`rounded-[24px] border p-3.5 ${
                  available
                    ? 'border-plum-200 bg-white shadow-sm shadow-plum-900/5'
                    : 'border-slate-100 bg-slate-50/60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-2xl ${card.accent.icon}`}
                  >
                    {card.thumbnail ? (
                      <img
                        src={card.thumbnail}
                        alt={card.thumbnailAlt ?? ''}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Icon className="h-8 w-8" strokeWidth={1.8} aria-hidden="true" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-black tracking-[0.14em] text-slate-400">
                        {card.eyebrow}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-black ${card.accent.badge}`}
                      >
                        {card.badge}
                      </span>
                    </div>

                    <h3 className="mt-1 text-base font-black leading-snug text-slate-900">
                      {card.title}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-slate-500">{card.subtitle}</p>

                    {card.tip && (
                      <div className="mt-2 flex items-center gap-2 rounded-xl bg-amber-50 px-2 py-1.5">
                        <img
                          src={dogPhoto}
                          alt=""
                          aria-hidden="true"
                          className="h-7 w-7 shrink-0 rounded-full object-cover ring-1 ring-white"
                        />
                        <p className="min-w-0 text-[13px] font-semibold leading-6 text-amber-900">
                          {card.tip}
                        </p>
                      </div>
                    )}

                    <div className="mt-2.5">
                      {available ? (
                        <button
                          type="button"
                          onClick={onOpenArticle}
                          className="inline-flex h-9 items-center gap-1 rounded-xl bg-plum-900 px-3 text-sm font-black text-white transition hover:bg-plum-800 active:scale-[0.98]"
                        >
                          {card.readMoreLabel}
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      ) : (
                        <span className="inline-flex h-9 items-center gap-1 rounded-xl bg-white px-3 text-sm font-bold text-slate-400 ring-1 ring-slate-200">
                          <Clock className="h-4 w-4" />
                          {card.readMoreLabel}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <p className="mt-3 flex items-start gap-1.5 text-xs leading-5 text-slate-400">
          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          知識庫會依訓練需求持續新增，之後回來就能看到更多教學與圖片。
        </p>
      </section>
    </div>
  );
}
