import { useEffect, useState } from 'react';
import { Download, Share, Smartphone, X } from 'lucide-react';
import {
  getInstallPrompt,
  isIOSDevice,
  isStandaloneMode,
  promptInstall,
  subscribeInstallPrompt,
} from '../lib/pwaInstall';

const DISMISS_KEY = 'health_app_install_dismissed_v1';
const DISMISS_DAYS = 14;

function wasRecentlyDismissed(): boolean {
  try {
    const raw = window.localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    const dismissedAt = Number(raw);
    if (!Number.isFinite(dismissedAt)) return false;
    return Date.now() - dismissedAt < DISMISS_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

export function InstallPrompt() {
  const [hasPrompt, setHasPrompt] = useState(() => getInstallPrompt() !== null);
  const [visible, setVisible] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    const update = () => setHasPrompt(getInstallPrompt() !== null);
    update();
    return subscribeInstallPrompt(update);
  }, []);

  useEffect(() => {
    if (isStandaloneMode() || wasRecentlyDismissed()) return;
    const ios = isIOSDevice();
    // iOS 沒有 beforeinstallprompt，改用 Safari 分享選單的圖文指引。
    if (ios || hasPrompt) {
      const timer = window.setTimeout(() => setVisible(true), 1200);
      return () => window.clearTimeout(timer);
    }
  }, [hasPrompt]);

  if (!visible) return null;

  const ios = isIOSDevice();

  const dismiss = () => {
    setVisible(false);
    try {
      window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* 無法寫入時僅本次隱藏 */
    }
  };

  const handleInstall = async () => {
    setInstalling(true);
    const result = await promptInstall();
    setInstalling(false);
    if (result !== 'unavailable') dismiss();
  };

  return (
    <section className="animate-fade-up mt-4 overflow-hidden rounded-[26px] border border-plum-100 bg-white p-4 shadow-sm shadow-plum-900/5">
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-plum-900 text-amber-200">
          <Smartphone className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-black tracking-[0.14em] text-plum-600">ADD TO HOME SCREEN</p>
          <h3 className="mt-0.5 text-base font-black text-slate-900">把健康管家放到主畫面</h3>
          <p className="mt-1 text-[13px] leading-6 text-slate-500">
            {ios
              ? '像 App 一樣一鍵開啟，紀錄更快、更順手。'
              : '安裝後可從桌面直接開啟，不受瀏覽器分頁影響。'}
          </p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="暫時不要安裝"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {ios ? (
        <div className="mt-3 rounded-2xl bg-plum-50/80 p-3.5">
          <p className="flex items-start gap-2 text-[13px] font-semibold leading-6 text-plum-900">
            <Share className="mt-1 h-4 w-4 shrink-0 text-plum-600" />
            <span>
              點擊 Safari 下方的
              <span className="mx-1 rounded-md bg-white px-1.5 py-0.5 font-black text-plum-800 shadow-sm">
                分享
              </span>
              按鈕，選擇「加入主畫面」即可獲得獨立 App 體驗！
            </span>
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleInstall}
          disabled={installing}
          className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-plum-900 text-sm font-black text-white transition hover:bg-plum-800 active:scale-[0.99] disabled:opacity-60"
        >
          <Download className="h-4 w-4" />
          {installing ? '正在開啟安裝…' : '加入主畫面'}
        </button>
      )}
    </section>
  );
}
