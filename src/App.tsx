import { useCallback, useEffect, useRef, useState } from 'react';
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
import { NutritionPage } from './pages/NutritionPage';
import { SettingsPage } from './pages/SettingsPage';

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

  const dateLabel = new Date().toLocaleDateString('zh-TW', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-amber-100 via-amber-50 to-blue-100 md:flex md:items-center md:justify-center md:p-6">
      <div className="relative mx-auto flex h-[100dvh] w-full max-w-md flex-col overflow-hidden bg-amber-50 text-slate-900 shadow-2xl shadow-slate-900/20 md:h-[calc(100dvh-3rem)] md:max-h-[920px] md:rounded-[2.75rem] md:ring-1 md:ring-slate-900/10">
        <AppHeader dateLabel={dateLabel} onOpenSettings={() => setActiveTab('settings')} />

        <main
          ref={mainRef}
          className="no-scrollbar flex-1 overflow-y-auto overscroll-contain px-4 pb-6 pt-5"
        >
          {activeTab === 'activity' && <ActivityPage profile={profile} onNotify={notify} />}
          {activeTab === 'health' && (
            <HealthPage profile={profile} onOpenSettings={() => setActiveTab('settings')} />
          )}
          {activeTab === 'nutrition' && <NutritionPage profile={profile} onNotify={notify} />}
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
