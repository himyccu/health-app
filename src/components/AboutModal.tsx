import { useEffect, useState, type ReactNode } from 'react';
import {
  CalendarDays,
  ChevronDown,
  Heart,
  Lightbulb,
  Mail,
  MapPin,
  ShieldCheck,
  Sprout,
  X,
} from 'lucide-react';

interface AboutModalProps {
  open: boolean;
  onClose: () => void;
}

type SectionId = 'origin' | 'privacy' | 'gps' | 'tips';

interface Section {
  id: SectionId;
  icon: typeof Sprout;
  title: string;
  content: ReactNode;
}

const SECTIONS: Section[] = [
  {
    id: 'origin',
    icon: Sprout,
    title: 'APP 開發初衷',
    content: (
      <p className="text-[15px] leading-7 text-slate-600">
        這款健康紀錄 App，最初是我為了日常運動管理所設計的小工具。現在開放分享給校園同學們使用！
        純屬個人分享，無任何商業營利行為。
      </p>
    ),
  },
  {
    id: 'privacy',
    icon: ShieldCheck,
    title: '隱私與資料安全',
    content: (
      <div className="space-y-3">
        <div className="rounded-2xl bg-emerald-50/80 p-3.5">
          <p className="text-sm font-black text-emerald-900">零帳號、零資料收集</p>
          <p className="mt-1 text-[14px] leading-6 text-emerald-900/80">
            本 App 不需要註冊，開發者不會收集您的姓名、手機或任何個人隱私。
          </p>
        </div>
        <div className="rounded-2xl bg-emerald-50/80 p-3.5">
          <p className="text-sm font-black text-emerald-900">資料只留存在您的手機裡</p>
          <p className="mt-1 text-[14px] leading-6 text-emerald-900/80">
            所有走路紀錄與計算數據，100% 只儲存在您自己的手機（LocalStorage）中，絕不會上傳到任何雲端伺服器。
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'gps',
    icon: MapPin,
    title: 'GPS 定位權限說明',
    content: (
      <p className="text-[15px] leading-7 text-slate-600">
        GPS 只用來計算步行距離，運算全部在您的手機內進行，定位資料絕不外流。您也可以隨時在手機設定中關閉定位。
      </p>
    ),
  },
  {
    id: 'tips',
    icon: Lightbulb,
    title: '友善使用小提醒',
    content: (
      <p className="text-[15px] leading-7 text-slate-600">
        本 App 所提供的運動距離與計時數據，主要提供健康管理的參考。由於各款手機硬體 GPS 晶片精準度不同，數據請以個人娛樂與運動參考為主，非專業賽事量測設備喔！
      </p>
    ),
  },
];

export function AboutModal({ open, onClose }: AboutModalProps) {
  const [openSection, setOpenSection] = useState<SectionId | null>('origin');

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-950/55 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-title"
        className="animate-fade-up flex max-h-[92dvh] w-full max-w-md flex-col overflow-hidden rounded-t-[32px] bg-[#fcfaff] shadow-2xl shadow-slate-950/30 sm:rounded-[32px]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative shrink-0 overflow-hidden bg-gradient-to-br from-plum-900 via-plum-800 to-plum-700 px-5 pb-5 pt-5 text-white">
          <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-16 -left-8 h-32 w-32 rounded-full bg-amber-200/10" />

          <div className="relative flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/15 text-amber-200 ring-1 ring-white/20">
                <Heart className="h-6 w-6" fill="currentColor" strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-[11px] font-black tracking-[0.18em] text-amber-200">
                  ABOUT & PRIVACY
                </p>
                <h2 id="about-title" className="mt-0.5 text-xl font-black leading-tight">
                  關於本 App 與溫馨提示
                </h2>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="關閉溫馨說明"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <p className="relative mt-4 rounded-2xl bg-white/10 px-3.5 py-3 text-[13px] font-medium leading-6 text-plum-100 ring-1 ring-white/10">
            這個 App 沒有帳號、沒有後端。你的每一步、每一筆紀錄，都只留在自己的手機裡。
          </p>
        </div>

        <div className="no-scrollbar flex-1 space-y-2.5 overflow-y-auto px-4 py-4">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            const expanded = openSection === section.id;
            return (
              <section
                key={section.id}
                className={`overflow-hidden rounded-2xl border transition ${
                  expanded
                    ? 'border-plum-200 bg-white shadow-sm shadow-plum-900/5'
                    : 'border-slate-100 bg-white/80'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenSection(expanded ? null : section.id)}
                  aria-expanded={expanded}
                  className="flex w-full items-center gap-3 px-3.5 py-3.5 text-left"
                >
                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl transition ${
                      expanded ? 'bg-plum-900 text-amber-200' : 'bg-plum-50 text-plum-700'
                    }`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={2.2} />
                  </span>
                  <span className="min-w-0 flex-1 text-[15px] font-black text-slate-900">
                    {section.title}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${
                      expanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expanded && (
                  <div className="animate-fade-up border-t border-slate-100 px-3.5 pb-4 pt-3.5">
                    {section.content}
                  </div>
                )}
              </section>
            );
          })}

          <div className="rounded-2xl border border-plum-100 bg-plum-50/70 p-4">
            <p className="flex items-center gap-2 text-sm font-black text-plum-900">
              <Mail className="h-4 w-4" />
              聯繫開發者
            </p>
            <a
              href="mailto:himyccu@gmail.com"
              className="mt-1.5 inline-block text-[15px] font-bold text-plum-700 underline decoration-plum-300 underline-offset-4"
            >
              himyccu@gmail.com
            </a>
            <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <CalendarDays className="h-3.5 w-3.5" />
              最新修訂日期：2026 年 11 月 7 日
            </p>
          </div>
        </div>

        <div className="shrink-0 border-t border-slate-100 bg-white/90 px-4 pb-[calc(env(safe-area-inset-bottom)+0.9rem)] pt-3 backdrop-blur">
          <button
            type="button"
            onClick={onClose}
            className="h-12 w-full rounded-2xl bg-plum-900 text-base font-black text-white shadow-lg shadow-plum-900/20 transition hover:bg-plum-800 active:scale-[0.99]"
          >
            我知道了
          </button>
        </div>
      </div>
    </div>
  );
}
