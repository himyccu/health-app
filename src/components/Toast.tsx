interface ToastProps {
  message: string | null;
}

export function Toast({ message }: ToastProps) {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed bottom-28 left-1/2 z-[60] w-full max-w-md -translate-x-1/2 px-8"
    >
      <div className="animate-fade-up mx-auto w-fit max-w-full rounded-full bg-slate-900 px-5 py-3 text-center text-sm font-bold text-white shadow-2xl shadow-slate-900/30">
        {message}
      </div>
    </div>
  );
}
