import { HeartPulse, Settings } from 'lucide-react';

interface AppHeaderProps {
  dateLabel: string;
  onOpenSettings: () => void;
}

export function AppHeader({ dateLabel, onOpenSettings }: AppHeaderProps) {
  return (
    <header className="relative shrink-0 overflow-hidden bg-blue-900 px-5 pb-5 pt-4 text-white">
      <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-blue-800/80" />
      <div className="pointer-events-none absolute -bottom-16 left-16 h-32 w-32 rounded-full bg-blue-800/50" />

      <div className="relative flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-amber-300 text-blue-950 shadow-lg shadow-blue-950/30">
            <HeartPulse className="h-6 w-6" strokeWidth={2.2} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold tracking-[0.22em] text-amber-200">
              HEALTH COMPANION
            </p>
            <h1 className="truncate text-lg font-black tracking-wide">Hayley 的健康管家</h1>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenSettings}
          aria-label="前往設定"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 bg-white/10 text-amber-100 transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 active:scale-95"
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>

      <div className="relative mt-4 flex items-center justify-between text-xs">
        <p className="font-medium text-blue-100">今天也要好好照顧自己</p>
        <span className="rounded-full bg-white/10 px-3 py-1 font-semibold text-blue-50">
          {dateLabel}
        </span>
      </div>
    </header>
  );
}
