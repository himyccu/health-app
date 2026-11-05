import { HeartPulse, Settings } from 'lucide-react';
import heroRunner from '../assets/hero-runner.jpg';

interface AppHeaderProps {
  dateLabel: string;
  onOpenSettings: () => void;
}

export function AppHeader({ dateLabel, onOpenSettings }: AppHeaderProps) {
  return (
    <header className="relative shrink-0 overflow-hidden bg-plum-900 px-5 pb-5 pt-4 text-white">
      <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-plum-800/80" />
      <div className="pointer-events-none absolute -bottom-16 left-16 h-32 w-32 rounded-full bg-plum-800/50" />

      <div className="relative flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-2xl bg-amber-300 shadow-lg shadow-plum-950/30 ring-2 ring-amber-200/70">
            <img
              src={heroRunner}
              alt=""
              aria-hidden="true"
              className="h-full w-full scale-[1.55] object-cover object-[50%_8%]"
            />
            <span className="absolute -bottom-0.5 -right-0.5 grid h-5 w-5 place-items-center rounded-full bg-amber-300 text-plum-950 ring-2 ring-plum-900">
              <HeartPulse className="h-3 w-3" strokeWidth={2.6} />
            </span>
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
        <p className="font-medium text-plum-100">今天也要好好照顧自己</p>
        <span className="rounded-full bg-white/10 px-3 py-1 font-semibold text-plum-50">
          {dateLabel}
        </span>
      </div>
    </header>
  );
}
