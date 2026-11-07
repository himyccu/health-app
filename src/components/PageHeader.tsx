import { Home } from 'lucide-react';

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  onHome: () => void;
}

export function PageHeader({ eyebrow, title, description, onHome }: PageHeaderProps) {
  return (
    <div className="mb-5 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-[11px] font-black tracking-[0.18em] text-plum-700">{eyebrow}</p>
        <h2 className="mt-1 text-2xl font-black leading-tight tracking-tight text-slate-900">
          {title}
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{description}</p>
      </div>
      <button
        type="button"
        onClick={onHome}
        aria-label="回到首頁"
        className="flex shrink-0 items-center gap-1.5 rounded-full border border-plum-100 bg-white px-3 py-2 text-sm font-black text-plum-900 shadow-sm transition hover:bg-plum-50 hover:shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum-900 active:scale-[0.98]"
      >
        <Home className="h-4 w-4" strokeWidth={2.4} />
        首頁
      </button>
    </div>
  );
}
