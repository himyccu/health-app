/**
 * 註冊 Service Worker 並確保部署後即時更新。
 * 僅在正式建置啟用，避免開發時快取干擾。
 */
export function registerServiceWorker(): void {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;

  const hadController = Boolean(navigator.serviceWorker.controller);
  let refreshing = false;

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadController || refreshing) return;
    refreshing = true;
    window.location.reload();
  });

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { updateViaCache: 'none' })
      .then((registration) => {
        registration.update().catch(() => {
          /* 離線時忽略 */
        });

        const checkForUpdate = () => {
          if (document.visibilityState === 'visible') {
            registration.update().catch(() => {
              /* 離線時忽略 */
            });
          }
        };

        document.addEventListener('visibilitychange', checkForUpdate);
        window.setInterval(checkForUpdate, 30 * 60 * 1000);
      })
      .catch(() => {
        /* 瀏覽器不支援或註冊失敗時，App 仍可正常使用 */
      });
  });
}
