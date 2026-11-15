import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface SectionHeadingProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  /** 右側動作，例如「查看全部」 */
  action?: ReactNode;
  className?: string;
}

/**
 * 區塊標題。
 * 全站只用這一種規格：圖示磚 36px、標題 18px、說明 13px。
 * 不使用圓形數字徽章，也不在標題前加 ①②③。
 */
export function SectionHeading({
  icon: Icon,
  title,
  subtitle,
  action,
  className = '',
}: SectionHeadingProps) {
  return (
    <div className={`flex items-start justify-between gap-3 ${className}`}>
      <div className="flex min-w-0 items-start gap-2.5">
        <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-plum-50 text-plum-900">
          <Icon className="h-[18px] w-[18px]" strokeWidth={2.4} />
        </div>
        <div className="min-w-0">
          <h3 className="text-[18px] font-black leading-tight text-slate-900">{title}</h3>
          {subtitle && (
            <p className="mt-1 text-[13px] leading-relaxed text-slate-500">{subtitle}</p>
          )}
        </div>
      </div>
      {action}
    </div>
  );
}
