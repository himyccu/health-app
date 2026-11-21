import { useCallback, useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Pause, Play, ShieldCheck, Square } from 'lucide-react';
import { formatDuration, haversineMeters } from '../lib/geo';
import {
  INITIAL_WALK_STATE,
  getActiveSeconds,
  getRestSeconds,
  transition,
  type WalkEvent,
  type WalkSessionState,
} from '../lib/walkSession';
import { SectionHeading } from './SectionHeading';

interface WalkTrackerProps {
  todayDistanceKm: number;
  weightKg: number;
  onSave: (distanceKm: number, minutes: number, calories: number) => void;
}

const WALKING_MET = 3.5;
/** 太短的紀錄不儲存，避免誤觸產生 0 公里的紀錄。 */
const MIN_SAVE_SECONDS = 15;
const MIN_SAVE_METERS = 10;

export function WalkTracker({ todayDistanceKm, weightKg, onSave }: WalkTrackerProps) {
  const [state, setState] = useState<WalkSessionState>(INITIAL_WALK_STATE);
  const stateRef = useRef<WalkSessionState>(INITIAL_WALK_STATE);
  const [now, setNow] = useState(() => Date.now());
  const [message, setMessage] = useState<string | null>(null);
  const [gpsMessage, setGpsMessage] = useState<string | null>(null);
  const [consented, setConsented] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const watchRef = useRef<number | null>(null);
  const lastPointRef = useRef<{ lat: number; lon: number; time: number } | null>(null);

  /** 唯一的狀態更新入口：同步更新 ref，確保連續點擊時判斷一定是最新的狀態。 */
  const apply = useCallback((event: WalkEvent): WalkSessionState => {
    const next = transition(stateRef.current, event);
    stateRef.current = next;
    setState(next);
    setNow(Date.now());
    return next;
  }, []);

  const stopWatch = useCallback(() => {
    if (watchRef.current !== null) {
      navigator.geolocation.clearWatch(watchRef.current);
      watchRef.current = null;
    }
    // 清掉上一個定位點：暫停期間的位移、或恢復後的第一個定位，都不會被算進距離。
    lastPointRef.current = null;
  }, []);

  const handlePosition = useCallback(
    (sessionId: number, position: GeolocationPosition) => {
      const current = stateRef.current;
      // 舊的 GPS 回呼（暫停／繼續／結束之後才送達）一律忽略。
      if (current.sessionId !== sessionId) return;
      if (current.status !== 'locating' && current.status !== 'tracking') return;

      const { latitude, longitude, accuracy } = position.coords;
      // 誤差超過 50 公尺的定位點先跳過，避免距離亂跳。
      if (accuracy && accuracy > 50) return;

      const stamp = position.timestamp || Date.now();

      if (current.status === 'locating') {
        // 第一個有效定位點才算「開始步行」；等待定位的時間不計入步行時間。
        lastPointRef.current = { lat: latitude, lon: longitude, time: stamp };
        apply({ type: 'GPS_READY', now: stamp });
        return;
      }

      const last = lastPointRef.current;
      if (!last) {
        lastPointRef.current = { lat: latitude, lon: longitude, time: stamp };
        return;
      }

      const deltaMeters = haversineMeters(last.lat, last.lon, latitude, longitude);
      const deltaSeconds = Math.max(0.3, (stamp - last.time) / 1000);
      const metersPerSecond = deltaMeters / deltaSeconds;

      // 小於 2 公尺視為原地晃動；速度超過 8 m/s 視為定位跳點，都不計入。
      if (deltaMeters < 2) return;

      lastPointRef.current = { lat: latitude, lon: longitude, time: stamp };
      if (metersPerSecond > 8) return;

      apply({ type: 'ADD_DISTANCE', meters: deltaMeters });
    },
    [apply],
  );

  const handleError = useCallback(
    (sessionId: number, error: GeolocationPositionError) => {
      const current = stateRef.current;
      if (current.sessionId !== sessionId) return;
      if (current.status !== 'locating' && current.status !== 'tracking') return;

      stopWatch();
      apply({ type: 'GPS_ERROR', now: Date.now() });

      if (error.code === error.PERMISSION_DENIED) {
        setGpsMessage('未取得定位權限。請在瀏覽器設定中允許此網站使用定位。');
      } else if (error.code === error.POSITION_UNAVAILABLE) {
        setGpsMessage('目前收不到 GPS 訊號，請到空曠處或開啟手機定位後再試。');
      } else {
        setGpsMessage('定位逾時，請確認已開啟 GPS 後再試一次。');
      }
    },
    [apply, stopWatch],
  );

  const startWatch = useCallback(
    (sessionId: number) => {
      stopWatch();
      watchRef.current = navigator.geolocation.watchPosition(
        (position) => handlePosition(sessionId, position),
        (error) => handleError(sessionId, error),
        { enableHighAccuracy: true, maximumAge: 0, timeout: 20000 },
      );
    },
    [handleError, handlePosition, stopWatch],
  );

  // 顯示用的計時器：只在需要更新的狀態啟動，暫停時不會偷偷累加步行時間。
  useEffect(() => {
    if (state.status !== 'tracking' && state.status !== 'paused') return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [state.status]);

  // 記錄中重新整理或關閉頁面時提醒使用者，避免整段紀錄無聲消失。
  useEffect(() => {
    const inSession =
      state.status === 'locating' || state.status === 'tracking' || state.status === 'paused';
    if (!inSession) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [state.status]);

  useEffect(() => stopWatch, [stopWatch]);

  const beginWalk = useCallback(() => {
    const current = stateRef.current;
    if (current.status === 'locating' || current.status === 'tracking' || current.status === 'paused') {
      return;
    }
    if (!('geolocation' in navigator)) {
      setGpsMessage('此瀏覽器不支援定位功能，請改用 Safari 或 Chrome 開啟。');
      return;
    }
    setMessage(null);
    setGpsMessage(null);
    setShowPrivacy(false);

    const next = apply({ type: 'START', now: Date.now() });
    startWatch(next.sessionId);
  }, [apply, startWatch]);

  const handleStartClick = () => {
    if (!consented) {
      setShowPrivacy(true);
      return;
    }
    beginWalk();
  };

  const handlePause = () => {
    const current = stateRef.current;
    if (current.status !== 'locating' && current.status !== 'tracking') return;
    // 先停止 GPS 回呼再結算，暫停後不會再有定位點被算進距離。
    stopWatch();
    // 暫停時把已經走的這一段結算進去，畫面數字不會倒退，只是停止增加。
    apply({ type: 'PAUSE', now: Date.now() });
    setGpsMessage(null);
  };

  const handleResume = () => {
    const current = stateRef.current;
    if (current.status !== 'paused' && current.status !== 'error') return;
    setGpsMessage(null);
    setMessage(null);
    const next = apply({ type: 'RESUME', now: Date.now() });
    startWatch(next.sessionId);
  };

  const handleStop = () => {
    const current = stateRef.current;
    if (
      current.status !== 'locating' &&
      current.status !== 'tracking' &&
      current.status !== 'paused' &&
      current.status !== 'error'
    ) {
      // 已經儲存過就忽略，避免連點造成重複儲存。
      return;
    }

    stopWatch();
    const finished = apply({ type: 'STOP', now: Date.now() });

    const activeSec = Math.floor(finished.activeSeconds);
    const restSec = Math.floor(finished.restSeconds);
    const distanceKm = Math.round(finished.meters / 10) / 100;
    const minutes = Math.max(1, Math.round(activeSec / 60));
    const calories = weightKg > 0 ? Math.round(WALKING_MET * weightKg * (minutes / 60)) : 0;

    // 清空本次數字，但保留遞增的 sessionId，讓任何遲到的 GPS 回呼都失效。
    stateRef.current = { ...INITIAL_WALK_STATE, sessionId: finished.sessionId };
    setState(stateRef.current);
    setNow(Date.now());
    setGpsMessage(null);

    if (activeSec < MIN_SAVE_SECONDS || finished.meters < MIN_SAVE_METERS) {
      setMessage('這次步行時間太短，沒有儲存。準備好再按一次「開始步行記錄」即可。');
      return;
    }

    onSave(distanceKm, minutes, calories);

    const restNote = restSec >= 60 ? `，休息 ${Math.round(restSec / 60)} 分鐘不計入` : '';
    setMessage(
      weightKg > 0
        ? `已儲存 ${distanceKm.toFixed(2)} 公里、${minutes} 分鐘步行（約 ${calories} kcal）${restNote}。`
        : `已儲存 ${distanceKm.toFixed(2)} 公里、${minutes} 分鐘步行${restNote}。設定體重後即可估算熱量。`,
    );
  };

  const activeSeconds = getActiveSeconds(state, now);
  const restSeconds = getRestSeconds(state, now);
  const liveCalories =
    weightKg > 0 ? Math.round(WALKING_MET * weightKg * (activeSeconds / 3600)) : 0;

  const inSession =
    state.status === 'locating' ||
    state.status === 'tracking' ||
    state.status === 'paused' ||
    state.status === 'error';
  const paused = state.status === 'paused';
  const tracking = state.status === 'tracking';
  const errored = state.status === 'error';

  const statusText = tracking
    ? 'GPS 記錄中，保持頁面開啟'
    : paused
      ? '已暫停，休息時間不計入'
      : errored
        ? 'GPS 中斷，可重新定位或直接儲存'
        : '正在取得 GPS 定位…尚未開始計時';

  const dotClass = tracking
    ? 'bg-emerald-400 animate-pulse'
    : errored
      ? 'bg-rose-400'
      : paused
        ? 'bg-amber-300'
        : 'bg-amber-300 animate-pulse';

  return (
    <section className="mt-4 rounded-[24px] border border-plum-100 bg-white p-4 shadow-sm shadow-amber-900/5">
      <SectionHeading
        icon={Navigation}
        title="步行追蹤"
        subtitle="GPS 量測距離與步行時間，可中途暫停休息"
      />

      <div className="mt-3 flex items-center justify-between rounded-2xl bg-plum-50 px-3.5 py-3">
        <div className="min-w-0">
          <p className="text-[13px] font-bold text-plum-600">今日 GPS 步行距離</p>
          <p className="mt-0.5 flex items-baseline gap-1">
            <span className="text-xl font-black leading-none tabular-nums text-plum-900">
              {todayDistanceKm.toFixed(2)}
            </span>
            <span className="text-[13px] font-bold text-plum-500">km</span>
          </p>
        </div>
        <MapPin className="h-5 w-5 shrink-0 text-plum-400" />
      </div>

      {showPrivacy && !inSession && (
        <div className="animate-fade-up mt-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5">
          <p className="flex items-center gap-1.5 text-[13px] font-black text-emerald-800">
            <ShieldCheck className="h-4 w-4" />
            定位隱私說明
          </p>
          <ul className="mt-2 space-y-1.5 text-[13px] leading-relaxed text-emerald-900">
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
              className="h-10 rounded-xl border border-emerald-200 bg-white text-[13px] font-bold text-emerald-800 transition hover:bg-emerald-100"
            >
              先不用
            </button>
            <button
              type="button"
              onClick={() => {
                setConsented(true);
                beginWalk();
              }}
              className="h-10 rounded-xl bg-emerald-700 text-[13px] font-black text-white transition hover:bg-emerald-800"
            >
              我了解，開始記錄
            </button>
          </div>
        </div>
      )}

      {inSession && (
        <div className="mt-2 rounded-2xl bg-plum-900 p-4 text-white">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[13px] font-bold text-plum-200">本次距離</p>
              <p className="mt-1 flex items-baseline gap-1">
                <span className="text-3xl font-black leading-none tabular-nums">
                  {(state.meters / 1000).toFixed(2)}
                </span>
                <span className="text-[13px] font-bold text-plum-200">km</span>
              </p>
            </div>
            <div className="min-w-0 text-right">
              <p className="text-[13px] font-bold text-plum-200">
                {paused ? '步行時間（暫停中）' : '步行時間'}
              </p>
              <p className="mt-1 text-xl font-black leading-none tabular-nums">
                {formatDuration(activeSeconds)}
              </p>
              <p className="mt-1 text-[13px] font-bold text-amber-200">
                {weightKg > 0 ? `約 ${liveCalories} kcal` : '設定體重後估算熱量'}
              </p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] font-semibold text-plum-100">
            <span className="flex items-center gap-1.5">
              <span className={`h-2 w-2 shrink-0 rounded-full ${dotClass}`} />
              {statusText}
            </span>
            {restSeconds >= 1 && (
              <span className="text-plum-300">
                休息 {formatDuration(restSeconds)}（不計入）
              </span>
            )}
          </div>
        </div>
      )}

      {inSession ? (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {tracking || state.status === 'locating' ? (
            <button
              type="button"
              onClick={handlePause}
              className="flex h-12 min-w-0 items-center justify-center gap-1.5 rounded-2xl border border-amber-300 bg-amber-100 text-base font-black text-amber-900 transition hover:bg-amber-200 active:scale-[0.99]"
            >
              <Pause className="h-4 w-4 shrink-0" strokeWidth={2.8} />
              暫停
            </button>
          ) : (
            <button
              type="button"
              onClick={handleResume}
              className="flex h-12 min-w-0 items-center justify-center gap-1.5 rounded-2xl bg-emerald-700 text-base font-black text-white transition hover:bg-emerald-800 active:scale-[0.99]"
            >
              <Play className="h-4 w-4 shrink-0" strokeWidth={2.8} />
              {errored ? '重新定位' : '繼續步行'}
            </button>
          )}
          <button
            type="button"
            onClick={handleStop}
            className="flex h-12 min-w-0 items-center justify-center gap-1.5 rounded-2xl bg-rose-600 text-base font-black text-white transition hover:bg-rose-700 active:scale-[0.99]"
          >
            <Square className="h-4 w-4 shrink-0 fill-current" />
            結束並儲存
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleStartClick}
          className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-plum-900 text-base font-black text-white shadow-lg shadow-plum-900/20 transition hover:bg-plum-800 active:scale-[0.99]"
        >
          <Navigation className="h-4 w-4 shrink-0" />
          開始步行記錄
        </button>
      )}

      {gpsMessage && (
        <p
          role="alert"
          className="mt-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-[13px] font-semibold leading-relaxed text-rose-800"
        >
          {gpsMessage}
        </p>
      )}

      {message && (
        <p
          role="status"
          className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[13px] font-semibold leading-relaxed text-amber-800"
        >
          {message}
        </p>
      )}

      <p className="mt-2 text-[13px] leading-relaxed text-slate-400">
        暫停期間的休息時間與 GPS 位移都不計入步行距離；繼續後會接續先前累積，不會歸零。
        室內或訊號不佳時，可用下方「活動時間」手動補登。
      </p>
    </section>
  );
}
