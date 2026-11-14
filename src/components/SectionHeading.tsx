import type { LucideIcon } from 'lucide-react';

interface SectionHeadingProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
}

export function SectionHeading({ icon: Icon, title, subtitle }: SectionHeadingProps) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-plum-50 text-plum-900">
        <Icon className="h-4 w-4" strokeWidth={2.4} />
      </div>
      <div className="min-w-0">
        <h3 className="text-[18px] font-black leading-tight text-slate-900">{title}</h3>
        {subtitle && <p className="mt-1 text-[13px] leading-relaxed text-slate-500">{subtitle}</p>}
      </div>
    </div>
  );
}
