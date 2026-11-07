import { useEffect } from 'react';
import { ArrowUpRight, BookOpen, Check, HeartPulse, ShieldCheck, X } from 'lucide-react';
import { TFDA_META } from '../lib/tfdaMeta';

interface DisclaimerModalProps {
  open: boolean;
  required: boolean;
  onAccept: () => void;
  onClose: () => void;
}

export function DisclaimerModal({ open, required, onAccept, onClose }: DisclaimerModalProps) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !required) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, required, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      onClick={() => {
        if (!required) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="disclaimer-title"
        className="animate-fade-up max-h-[90dvh] w-full max-w-sm overflow-y-auto rounded-[28px] bg-white p-5 shadow-2xl shadow-slate-950/30"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-plum-900 text-amber-200">
              <HeartPulse className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-black tracking-[0.18em] text-plum-700">
                健康資訊使用同意
              </p>
              <h2 id="disclaimer-title" className="text-lg font-black leading-tight text-slate-900">
                資料來源與免責聲明
              </h2>
            </div>
          </div>
          {!required && (
            <button
              type="button"
              onClick={onClose}
              aria-label="關閉免責聲明"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="mt-4 rounded-2xl border border-plum-100 bg-plum-50/80 p-3.5">
          <p className="flex items-center gap-1.5 text-xs font-black text-plum-900">
            <BookOpen className="h-4 w-4" />
            資料來源
          </p>
          <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-slate-600">
            <li>• 衛生福利部國民健康署《每日飲食指南手冊》</li>
            <li>• 衛生福利部成人健康體位定義（BMI 18.5–24 為正常範圍）</li>
            <li>
              • 食品藥物管理署
              <a
                href={TFDA_META.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="mx-0.5 inline-flex items-center gap-0.5 font-bold text-plum-800 underline underline-offset-2"
              >
                《{TFDA_META.title}》
                <ArrowUpRight className="h-3 w-3" />
              </a>
              （每 100 公克可食部分）
            </li>
          </ul>
        </div>

        <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 p-3.5">
          <p className="flex items-center gap-1.5 text-xs font-black text-amber-800">
            <ShieldCheck className="h-4 w-4" />
            免責聲明
          </p>
          <p className="mt-2 text-sm font-medium leading-6 text-slate-700">
            本應用程式所提供之健康資訊、營養建議及身體組成標準僅供參考，不能取代專業醫療診斷、建議或治療。在做出任何醫療決定前，務必要諮詢合格的醫療專業人員。
          </p>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-slate-500">
          若您有慢性疾病、懷孕、哺乳或特殊飲食需求，請先諮詢醫師或營養師。您的生理數據、步數與飲食紀錄僅儲存在本機瀏覽器，不會上傳至任何伺服器。
        </p>

        <button
          type="button"
          onClick={onAccept}
          className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-plum-900 px-5 text-base font-black text-white shadow-lg shadow-plum-900/20 transition hover:bg-plum-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum-900 active:scale-[0.99]"
        >
          <Check className="h-5 w-5" strokeWidth={2.6} />
          {required ? '我已閱讀並了解' : '關閉'}
        </button>

        {required && (
          <p className="mt-2.5 text-center text-xs text-slate-400">
            點擊後即表示您已閱讀並同意以上說明
          </p>
        )}
      </div>
    </div>
  );
}
