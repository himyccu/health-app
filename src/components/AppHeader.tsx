import heroRunner from '../assets/hero-runner.jpg';

export function AppHeader() {
  return (
    <header className="relative shrink-0 overflow-hidden bg-plum-900 px-5 pb-5 pt-4 text-white">
      <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-plum-800/80" />
      <div className="pointer-events-none absolute -bottom-16 left-16 h-32 w-32 rounded-full bg-plum-800/50" />

      <div className="relative flex items-center gap-3.5">
        <div className="h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-[1.4rem] bg-white shadow-lg shadow-plum-950/40 ring-2 ring-amber-200/70">
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
          <h1 className="truncate text-2xl font-black tracking-tight">Hayley 的健康管家</h1>
          <p className="mt-0.5 text-[11px] font-semibold text-plum-200">
            今天的每一步，都算數。
          </p>
        </div>
      </div>
    </header>
  );
}
