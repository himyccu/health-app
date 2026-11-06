import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import heroRunner from './assets/hero-runner.jpg';
import type { Profile, TabId } from './types';
import {
  DEFAULT_PROFILE,
  acceptDisclaimer,
  clearAllData,
  hasAcceptedDisclaimer,
  loadProfile,
  saveProfile,
} from './lib/storage';
import { AppHeader } from './components/AppHeader';
import { BottomNav } from './components/BottomNav';
import { DisclaimerModal } from './components/DisclaimerModal';
import { Toast } from './components/Toast';
import { ActivityPage } from './pages/ActivityPage';
import { HealthPage } from './pages/HealthPage';
import { SettingsPage } from './pages/SettingsPage';

const NutritionPage = lazy(() =>
  import('./pages/NutritionPage').then((module) => ({ default: module.NutritionPage })),
);

export default function App() {
  const [bootstrap] = useState(() => ({
    profile: loadProfile(),
    accepted: hasAcceptedDisclaimer(),
  }));
  const [activeTab, setActiveTab] = useState<TabId>('activity');
  const [profile, setProfile] = useState<Profile>(() => bootstrap.profile);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(() => bootstrap.accepted);
  const [disclaimerOpen, setDisclaimerOpen] = useState(() => !bootstrap.accepted);
  const [toast, setToast] = useState<string | null>(null);

  const mainRef = useRef<HTMLElement | null>(null);
  const toastTimer = useRef<number | null>(null);

  const notify = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => {
      setToast(null);
      toastTimer.current = null;
    }, 2200);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    };
  }, []);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [activeTab]);

  const handleSaveProfile = useCallback(
    (next: Profile) => {
      saveProfile(next);
      setProfile(next);
      notify('生理數據已儲存');
    },
    [notify],
  );

  const handleAcceptDisclaimer = useCallback(() => {
    acceptDisclaimer();
    setDisclaimerAccepted(true);
    setDisclaimerOpen(false);
  }, []);

  const handleCloseDisclaimer = useCallback(() => {
    setDisclaimerOpen(false);
  }, []);

  const handleResetAll = useCallback(() => {
    clearAllData();
    setProfile(DEFAULT_PROFILE);
    window.location.reload();
  }, []);

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-gradient-to-br from-plum-100 via-[#fbf7ff] to-amber-50 md:flex md:items-center md:justify-center md:p-6">
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-plum-200/45 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 h-[28rem] w-[28rem] rounded-full bg-amber-200/30 blur-3xl" />
      <img
        src={heroRunner}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-1/2 hidden h-[74vh] w-auto -translate-y-1/2 opacity-[0.08] mix-blend-multiply lg:block"
      />

      <div className="relative mx-auto flex h-[100dvh] w-full max-w-md flex-col overflow-hidden bg-[#fcfaff] text-slate-900 shadow-2xl shadow-plum-950/20 md:h-[calc(100dvh-3rem)] md:max-h-[920px] md:rounded-[2.75rem] md:ring-1 md:ring-plum-950/10">
        <AppHeader />

        <main
          ref={mainRef}
          className="no-scrollbar flex-1 overflow-y-auto overscroll-contain px-4 pb-6 pt-5"
        >
          {activeTab === 'activity' && <ActivityPage profile={profile} onNotify={notify} />}
          {activeTab === 'health' && (
            <HealthPage profile={profile} onOpenSettings={() => setActiveTab('settings')} />
          )}
          {activeTab === 'nutrition' && (
            <Suspense fallback={<PageLoading label="正在載入食物營養資料…" />}>
              <NutritionPage profile={profile} onNotify={notify} />
            </Suspense>
          )}
          {activeTab === 'settings' && (
            <SettingsPage
              profile={profile}
              onSave={handleSaveProfile}
              onNotify={notify}
              onShowDisclaimer={() => setDisclaimerOpen(true)}
              onReset={handleResetAll}
            />
          )}
        </main>

        <BottomNav activeTab={activeTab} onChange={setActiveTab} />
      </div>

      <Toast message={toast} />

      <DisclaimerModal
        open={disclaimerOpen}
        required={!disclaimerAccepted}
        onAccept={handleAcceptDisclaimer}
        onClose={handleCloseDisclaimer}
      />
    </div>
  );
}

function PageLoading({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-plum-600">
      <LoaderCircle className="h-7 w-7 animate-spin" />
      <p className="mt-3 text-xs font-bold text-slate-400">{label}</p>
    </div>
  );
}
