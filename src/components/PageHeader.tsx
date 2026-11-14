import { Home } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  onHome: () => void;
}

/**
 * 頁面標題列。
 * 只保留「標題＋一句事實說明」，不使用英文小標，避免同一資訊重複。
 */
export function PageHeader({ title, description, onHome }: PageHeaderProps) {
  return (
    <div className="mb-5 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h2 className="text-[22px] font-black leading-tight tracking-tight text-slate-900 sm:text-[26px]">
          {title}
        </h2>
        {description && (
          <p className="mt-1.5 text-[15px] leading-relaxed text-slate-500">{description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={onHome}
        aria-label="回到首頁"
        className="flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border border-plum-100 bg-white px-3.5 py-2 text-[15px] font-black text-plum-900 shadow-sm transition hover:bg-plum-50 hover:shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum-900 active:scale-[0.98]"
      >
        <Home className="h-4 w-4" strokeWidth={2.4} />
        首頁
      </button>
    </div>
  );
}
