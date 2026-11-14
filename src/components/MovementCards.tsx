import { KNOWLEDGE_CARDS, type KnowledgePatternId } from '../data/knowledgeCenter';

interface MovementCardsProps {
  onOpenArticle: (articleId: KnowledgePatternId) => void;
}

/**
 * 五張中文字卡：推、拉、蹲、髖、移動。
 * 不用照片、不用箭頭，縮放時不會模糊，五張視覺重量一致。
 */
export function MovementCards({ onOpenArticle }: MovementCardsProps) {
  return (
    <div className="grid grid-cols-5 gap-1.5">
      {KNOWLEDGE_CARDS.map((card) => (
        <button
          key={card.id}
          type="button"
          onClick={() => onOpenArticle(card.id)}
          aria-label={`${card.shortLabel}：${card.title}`}
          title={card.title}
          className="flex min-h-[96px] min-w-0 flex-col items-center justify-center gap-1 rounded-2xl border border-plum-100 bg-white px-1 py-3 text-center transition hover:border-plum-300 hover:bg-plum-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum-900 active:scale-[0.97]"
        >
          <span className="font-serif text-[24px] font-black leading-none text-plum-900">
            {card.shortLabel === '移動' ? (
              <>
                移
                <br />
                動
              </>
            ) : (
              card.shortLabel
            )}
          </span>
          <span className="text-[13px] font-semibold text-slate-400">{card.hint}</span>
        </button>
      ))}
    </div>
  );
}
