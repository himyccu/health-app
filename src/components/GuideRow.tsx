import { ChevronRight, type LucideIcon } from 'lucide-react';

interface GuideRowProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  /** 右側小字，例如「4 分鐘」 */
  meta?: string;
  onClick: () => void;
}

/**
 * 教學項目列。
 * 首頁「開始之前」與運動頁「教學」共用同一種列，
 * 不使用圓形數字徽章。
 */
export function GuideRow({ icon: Icon, title, description, meta, onClick }: GuideRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3.5 text-left transition hover:border-plum-200 hover:bg-plum-50/60 active:scale-[0.99]"
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-plum-50 text-plum-800">
        <Icon className="h-5 w-5" strokeWidth={2.2} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[16px] font-black leading-snug text-slate-900">{title}</span>
        {description && (
          <span className="mt-0.5 block text-[13px] leading-6 text-slate-500">{description}</span>
        )}
      </span>
      <span className="flex shrink-0 items-center gap-0.5 text-[13px] font-bold text-plum-700">
        {meta}
        <ChevronRight className="h-4 w-4" />
      </span>
    </button>
  );
}
