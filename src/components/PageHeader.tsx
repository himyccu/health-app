import type { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export function PageHeader({ eyebrow, title, description, icon: Icon }: PageHeaderProps) {
  return (
    <div className="mb-5 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-[11px] font-black tracking-[0.18em] text-plum-700">{eyebrow}</p>
        <h2 className="mt-1 text-2xl font-black leading-tight tracking-tight text-slate-900">
          {title}
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{description}</p>
      </div>
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-amber-200 bg-white text-plum-900 shadow-sm">
        <Icon className="h-6 w-6" strokeWidth={2.2} />
      </div>
    </div>
  );
}
