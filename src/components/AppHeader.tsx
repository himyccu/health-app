import { Info } from 'lucide-react';
import heroRunner from '../assets/hero-runner.jpg';

interface AppHeaderProps {
  onShowAbout: () => void;
}

export function AppHeader({ onShowAbout }: AppHeaderProps) {
  return (
    <header className="relative shrink-0 overflow-hidden bg-plum-900 px-4 pb-4 pt-[calc(env(safe-area-inset-top)+0.9rem)] text-white sm:px-5 sm:pb-5 sm:pt-[calc(env(safe-area-inset-top)+1rem)]">
      <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-plum-800/80" />
      <div className="pointer-events-none absolute -bottom-16 left-16 h-32 w-32 rounded-full bg-plum-800/50" />

      <div className="relative grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5 sm:gap-3">
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-[1rem] bg-white shadow-lg shadow-plum-950/40 ring-2 ring-amber-200/70 sm:h-[4.5rem] sm:w-[4.5rem] sm:rounded-[1.4rem]">
          <img
            src={heroRunner}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-contain"
          />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-bold tracking-[0.22em] text-amber-200">
            HEALTH COMPANION
          </p>
          <h1 className="text-[17px] font-black leading-tight tracking-tight sm:text-2xl">
            HAYLEY 健康管家
          </h1>
          <p className="mt-0.5 text-xs font-semibold leading-snug text-plum-200">
            今天的每一步，都算數。
          </p>
        </div>
        <button
          type="button"
          onClick={onShowAbout}
          aria-label="開啟溫馨說明與隱私"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-amber-100 ring-1 ring-white/20 transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200 active:scale-[0.96] sm:h-10 sm:w-10"
        >
          <Info className="h-5 w-5" strokeWidth={2.2} />
        </button>
      </div>
    </header>
  );
}
