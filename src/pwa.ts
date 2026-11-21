/**
 * 註冊 Service Worker 並確保部署後即時更新。
 * 僅在正式建置啟用，避免開發時快取干擾。
 */
export function registerServiceWorker(): void {
  requestPersistentStorage();
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

/**
 * 要求瀏覽器「不要因為空間不足就清掉本機資料」。
 * 支援的瀏覽器（Chrome、Edge、Safari）會給過；不支援時靜默略過。
 */
function requestPersistentStorage(): void {
  if (typeof navigator === 'undefined' || !navigator.storage?.persist) return;
  navigator.storage
    .persisted()
    .then((already) => (already ? true : navigator.storage.persist()))
    .catch(() => {
      /* 無法取得時不影響使用 */
    });
}
