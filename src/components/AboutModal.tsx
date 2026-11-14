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
    title: 'App 定位',
    content: (
      <div className="space-y-2 text-[15px] leading-7 text-slate-600">
        <p>
          本 App 為非營利之個人健康紀錄工具，提供步行紀錄、運動紀錄、飲食紀錄、身體參數計算與動作教學。
        </p>
        <p>不設帳號、不上傳資料、不投放廣告，亦不提供醫療診斷或治療建議。</p>
      </div>
    ),
  },
  {
    id: 'privacy',
    icon: ShieldCheck,
    title: '隱私與資料安全',
    content: (
      <div className="space-y-2.5">
        <div className="rounded-2xl bg-emerald-50/80 p-3.5">
          <p className="text-[15px] font-black text-emerald-900">不需註冊</p>
          <p className="mt-1 text-[15px] leading-6 text-emerald-900/80">
            不收集姓名、電話、電子郵件或帳號資料。
          </p>
        </div>
        <div className="rounded-2xl bg-emerald-50/80 p-3.5">
          <p className="text-[15px] font-black text-emerald-900">資料只存在這台裝置</p>
          <p className="mt-1 text-[15px] leading-6 text-emerald-900/80">
            步數、運動與飲食紀錄儲存在瀏覽器本機空間（localStorage），不會上傳到任何伺服器。
          </p>
        </div>
        <div className="rounded-2xl bg-emerald-50/80 p-3.5">
          <p className="text-[15px] font-black text-emerald-900">可隨時清除</p>
          <p className="mt-1 text-[15px] leading-6 text-emerald-900/80">
            於「設定 → 清除所有本機資料」即可一次刪除全部紀錄。
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
        定位只用來計算步行距離，座標不會上傳、不會儲存，也不會提供給開發者。可隨時在手機設定中關閉定位。
      </p>
    ),
  },
  {
    id: 'tips',
    icon: Lightbulb,
    title: '使用限制',
    content: (
      <p className="text-[15px] leading-7 text-slate-600">
        GPS 與計步數據會因手機硬體與環境而異，僅供健康管理參考，不作為賽事或醫療量測依據。
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
        className="animate-fade-up flex max-h-[92dvh] w-full max-w-md flex-col overflow-hidden rounded-t-[28px] bg-[#fcfaff] shadow-2xl shadow-slate-950/30 sm:rounded-[28px]"
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
                <h2 id="about-title" className="text-[22px] font-black leading-tight">
                  關於本 App
                </h2>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="關閉說明"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <p className="relative mt-4 rounded-2xl bg-white/10 px-3.5 py-3 text-[13px] font-medium leading-6 text-plum-100 ring-1 ring-white/10">
            無帳號・無雲端・無廣告。所有紀錄僅儲存於本機裝置。
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
            <p className="flex items-center gap-2 text-[15px] font-black text-plum-900">
              <Mail className="h-4 w-4" />
              聯繫開發者
            </p>
            <a
              href="mailto:himyccu@gmail.com"
              className="mt-1.5 inline-block text-[15px] font-bold text-plum-700 underline decoration-plum-300 underline-offset-4"
            >
              himyccu@gmail.com
            </a>
            <p className="mt-3 flex items-center gap-1.5 text-[13px] font-semibold text-slate-400">
              <CalendarDays className="h-3.5 w-3.5" />
              最新修訂日期：2026 年 11 月 7 日
            </p>
          </div>
        </div>

        <div className="shrink-0 border-t border-slate-100 bg-white/90 px-4 pb-[calc(env(safe-area-inset-bottom)+0.9rem)] pt-3 backdrop-blur">
          <button
            type="button"
            onClick={onClose}
            className="h-12 w-full rounded-2xl bg-plum-900 text-[16px] font-black text-white shadow-lg shadow-plum-900/20 transition hover:bg-plum-800 active:scale-[0.99]"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
}
