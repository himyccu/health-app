import { useCallback, useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, ShieldCheck, Square } from 'lucide-react';
import { formatDuration, haversineMeters } from '../lib/geo';
import { SectionHeading } from './SectionHeading';

interface WalkTrackerProps {
  todayDistanceKm: number;
  weightKg: number;
  onSave: (distanceKm: number, minutes: number, calories: number) => void;
}

type GpsStatus = 'idle' | 'locating' | 'tracking' | 'error';

const WALKING_MET = 3.5;

export function WalkTracker({ todayDistanceKm, weightKg, onSave }: WalkTrackerProps) {
  const [tracking, setTracking] = useState(false);
  const [status, setStatus] = useState<GpsStatus>('idle');
  const [meters, setMeters] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [consented, setConsented] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const watchRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const startedAtRef = useRef(0);
  const metersRef = useRef(0);
  const lastPointRef = useRef<{ lat: number; lon: number; time: number } | null>(null);

  const clearResources = useCallback(() => {
    if (watchRef.current !== null) {
      navigator.geolocation.clearWatch(watchRef.current);
      watchRef.current = null;
    }
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => clearResources, [clearResources]);

  const handlePosition = useCallback((position: GeolocationPosition) => {
    const { latitude, longitude, accuracy } = position.coords;
    // 誤差超過 50 公尺的定位點先跳過，避免距離亂跳。
    if (accuracy && accuracy > 50) return;

    const now = position.timestamp || Date.now();
    const last = lastPointRef.current;

    if (!last) {
      lastPointRef.current = { lat: latitude, lon: longitude, time: now };
      setStatus('tracking');
      return;
    }

    const deltaMeters = haversineMeters(last.lat, last.lon, latitude, longitude);
    const deltaSeconds = Math.max(0.3, (now - last.time) / 1000);
    const metersPerSecond = deltaMeters / deltaSeconds;

    // 小於 2 公尺視為原地晃動；速度超過 8 m/s 視為定位跳點，都不計入。
    if (deltaMeters < 2 || metersPerSecond > 8) {
      if (deltaMeters >= 2) {
        lastPointRef.current = { lat: latitude, lon: longitude, time: now };
      }
      return;
    }

    metersRef.current += deltaMeters;
    lastPointRef.current = { lat: latitude, lon: longitude, time: now };
    setMeters(metersRef.current);
    setStatus('tracking');
  }, []);

  const handleError = useCallback((error: GeolocationPositionError) => {
    setStatus('error');
    if (error.code === error.PERMISSION_DENIED) {
      setMessage('未取得定位權限。請在瀏覽器設定中允許此網站使用定位。');
    } else if (error.code === error.POSITION_UNAVAILABLE) {
      setMessage('目前收不到 GPS 訊號，請到空曠處或開啟手機定位後再試。');
    } else {
      setMessage('定位逾時，請確認已開啟 GPS 後再試一次。');
    }
  }, []);

  const startTracking = () => {
    if (!('geolocation' in navigator)) {
      setStatus('error');
      setMessage('此瀏覽器不支援定位功能。');
      return;
    }

    metersRef.current = 0;
    lastPointRef.current = null;
    startedAtRef.current = Date.now();
    setMeters(0);
    setSeconds(0);
    setMessage(null);
    setStatus('locating');
    setTracking(true);

    timerRef.current = window.setInterval(() => {
      setSeconds(Math.floor((Date.now() - startedAtRef.current) / 1000));
    }, 1000);

    watchRef.current = navigator.geolocation.watchPosition(handlePosition, handleError, {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 20000,
    });
  };

  const stop = () => {
    clearResources();
    setTracking(false);
    setStatus('idle');

    const finalMeters = metersRef.current;
    const finalSeconds = Math.floor((Date.now() - startedAtRef.current) / 1000);
    const distanceKm = Math.round(finalMeters / 10) / 100;
    const minutes = Math.max(1, Math.round(finalSeconds / 60));
    const calories = weightKg > 0 ? Math.round(WALKING_MET * weightKg * (minutes / 60)) : 0;

    setMeters(0);
    setSeconds(0);

    if (finalSeconds < 15 || finalMeters < 10) {
      setMessage('這次記錄時間太短，沒有儲存。準備好再按一次開始即可。');
      return;
    }

    onSave(distanceKm, minutes, calories);
    setMessage(
      weightKg > 0
        ? `已儲存 ${distanceKm.toFixed(2)} 公里、${minutes} 分鐘，約 ${calories} kcal。`
        : `已儲存 ${distanceKm.toFixed(2)} 公里、${minutes} 分鐘。設定體重後即可估算熱量。`,
    );
  };

  const handleStartClick = () => {
    if (!consented) {
      setShowPrivacy(true);
      return;
    }
    startTracking();
  };

  const liveCalories =
    weightKg > 0 ? Math.round(WALKING_MET * weightKg * (seconds / 3600)) : 0;

  return (
    <section className="mt-4 rounded-[26px] border border-plum-100 bg-white p-4 shadow-sm shadow-amber-900/5">
      <SectionHeading icon={Navigation} title="步行追蹤" subtitle="GPS 即時量測距離與時間" />

      <div className="mt-3 flex items-center justify-between rounded-2xl bg-plum-50 px-3.5 py-3">
        <div>
          <p className="text-[11px] font-bold text-plum-600">今日 GPS 步行距離</p>
          <p className="mt-0.5 flex items-baseline gap-1">
            <span className="text-xl font-black leading-none tabular-nums text-plum-900">
              {todayDistanceKm.toFixed(2)}
            </span>
            <span className="text-[10px] font-bold text-plum-500">km</span>
          </p>
        </div>
        <MapPin className="h-5 w-5 text-plum-400" />
      </div>

      {showPrivacy && !tracking && (
        <div className="animate-fade-up mt-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5">
          <p className="flex items-center gap-1.5 text-xs font-black text-emerald-800">
            <ShieldCheck className="h-4 w-4" />
            定位隱私說明
          </p>
          <ul className="mt-2 space-y-1.5 text-[11px] leading-relaxed text-emerald-900">
            <li className="flex gap-1.5">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-600" />
              定位只用來計算步行距離，座標不會上傳，也不會被 App 設計者看到。
            </li>
            <li className="flex gap-1.5">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-600" />
              所有紀錄只存在這台手機，換裝置或分享網址都不會看到你的資料。
            </li>
            <li className="flex gap-1.5">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-600" />
              可隨時在瀏覽器關閉定位權限，不影響其他功能。
            </li>
          </ul>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setShowPrivacy(false)}
              className="h-10 rounded-xl border border-emerald-200 bg-white text-xs font-bold text-emerald-800 transition hover:bg-emerald-100"
            >
              先不用
            </button>
            <button
              type="button"
              onClick={() => {
                setConsented(true);
                setShowPrivacy(false);
                startTracking();
              }}
              className="h-10 rounded-xl bg-emerald-700 text-xs font-black text-white transition hover:bg-emerald-800"
            >
              我了解，開始記錄
            </button>
          </div>
        </div>
      )}

      {tracking && (
        <div className="mt-2 rounded-2xl bg-plum-900 p-4 text-white">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold text-plum-200">本次距離</p>
              <p className="mt-1 flex items-baseline gap-1">
                <span className="text-3xl font-black leading-none tabular-nums">
                  {(meters / 1000).toFixed(2)}
                </span>
                <span className="text-xs font-bold text-plum-200">km</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-bold text-plum-200">時間</p>
              <p className="mt-1 text-xl font-black leading-none tabular-nums">
                {formatDuration(seconds)}
              </p>
              <p className="mt-1 text-[11px] font-bold text-amber-200">
                {weightKg > 0 ? `約 ${liveCalories} kcal` : '設定體重後估算熱量'}
              </p>
            </div>
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-plum-100">
            <span
              className={`h-2 w-2 animate-pulse rounded-full ${
                status === 'tracking' ? 'bg-emerald-400' : 'bg-amber-300'
              }`}
            />
            {status === 'tracking' ? 'GPS 記錄中，保持頁面開啟' : '正在取得 GPS 定位…'}
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={tracking ? stop : handleStartClick}
        className={`mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-sm font-black transition active:scale-[0.99] ${
          tracking
            ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20 hover:bg-rose-700'
            : 'bg-plum-900 text-white shadow-lg shadow-plum-900/20 hover:bg-plum-800'
        }`}
      >
        {tracking ? (
          <>
            <Square className="h-4 w-4 fill-current" />
            停止並儲存
          </>
        ) : (
          <>
            <Navigation className="h-4 w-4" />
            開始步行記錄
          </>
        )}
      </button>

      {message && (
        <p
          role="status"
          className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] font-semibold leading-relaxed text-amber-800"
        >
          {message}
        </p>
      )}

      <p className="mt-2 text-[11px] leading-relaxed text-slate-400">
        記錄期間請保持此頁面開啟；室內或訊號不佳時，可用下方「活動時間」手動補登。
      </p>
    </section>
  );
}
