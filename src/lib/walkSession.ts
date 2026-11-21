/**
 * 步行記錄的狀態機。
 *
 * 狀態只允許以下切換：
 * idle → locating → tracking ⇄ paused
 *                  ↓
 *                saved
 *
 * 重要規則：
 * - 只有 tracking 狀態可以累積距離。
 * - 暫停時立刻停止計時，activeSeconds 保留先前累積值。
 * - 繼續時只回到 locating，收到新的第一個 GPS 點才重新開始計時；
 *   上一個定位點會由 UI 清空，避免休息期間的位移被算進距離。
 * - STOP 會把目前這一段的時間結算進去，休息時間另外記錄，不計入步行時間。
 */

export type WalkStatus = 'idle' | 'locating' | 'tracking' | 'paused' | 'error' | 'saved';

export interface WalkSessionState {
  status: WalkStatus;
  /** 目前為止累積的 GPS 距離（公尺）。 */
  meters: number;
  /** 已經結算完成的步行秒數（不含目前這一段）。 */
  activeSeconds: number;
  /** 目前這一段開始計時的時間戳；未在 tracking 時為 null。 */
  segmentStartedAt: number | null;
  /** 已經結算完成的休息秒數。 */
  restSeconds: number;
  /** 目前這一段休息開始的時間戳；未在 paused 時為 null。 */
  restStartedAt: number | null;
  /** 每次開始／繼續／結束都會遞增，用來忽略舊的 GPS 回呼。 */
  sessionId: number;
}

export const INITIAL_WALK_STATE: WalkSessionState = {
  status: 'idle',
  meters: 0,
  activeSeconds: 0,
  segmentStartedAt: null,
  restSeconds: 0,
  restStartedAt: null,
  sessionId: 0,
};

export type WalkEvent =
  | { type: 'START'; now: number }
  | { type: 'GPS_READY'; now: number }
  | { type: 'PAUSE'; now: number }
  | { type: 'RESUME'; now: number }
  | { type: 'STOP'; now: number }
  | { type: 'GPS_ERROR'; now: number }
  | { type: 'ADD_DISTANCE'; meters: number };

function elapsedSeconds(from: number | null, to: number): number {
  if (from === null) return 0;
  return Math.max(0, (to - from) / 1000);
}

export function transition(state: WalkSessionState, event: WalkEvent): WalkSessionState {
  switch (event.type) {
    case 'START': {
      // 已經在記錄中或暫停中時，忽略重複的開始。
      if (state.status === 'locating' || state.status === 'tracking' || state.status === 'paused') {
        return state;
      }
      return {
        ...INITIAL_WALK_STATE,
        status: 'locating',
        sessionId: state.sessionId + 1,
      };
    }

    case 'GPS_READY': {
      if (state.status !== 'locating') return state;
      return {
        ...state,
        status: 'tracking',
        segmentStartedAt: event.now,
      };
    }

    case 'ADD_DISTANCE': {
      // 只有正在記錄時才接受距離；暫停或定位中一律忽略。
      if (state.status !== 'tracking') return state;
      if (!Number.isFinite(event.meters) || event.meters <= 0) return state;
      return {
        ...state,
        meters: state.meters + event.meters,
      };
    }

    case 'PAUSE': {
      if (state.status === 'tracking') {
        return {
          ...state,
          status: 'paused',
          activeSeconds: state.activeSeconds + elapsedSeconds(state.segmentStartedAt, event.now),
          segmentStartedAt: null,
          restStartedAt: event.now,
        };
      }
      if (state.status === 'locating') {
        // 還沒取得 GPS 就先暫停：沒有步行時間，只開始累積休息時間。
        return {
          ...state,
          status: 'paused',
          restStartedAt: event.now,
        };
      }
      return state;
    }

    case 'RESUME': {
      // 暫停後繼續，或 GPS 中斷後重新定位：都回到「等第一個定位點」。
      if (state.status !== 'paused' && state.status !== 'error') return state;
      return {
        ...state,
        status: 'locating',
        restSeconds: state.restSeconds + elapsedSeconds(state.restStartedAt, event.now),
        restStartedAt: null,
        // 換一個 sessionId，舊的 GPS 回呼不能再影響新的這一段。
        sessionId: state.sessionId + 1,
      };
    }

    case 'STOP': {
      if (state.status === 'locating') {
        return {
          ...state,
          status: 'saved',
          segmentStartedAt: null,
          restStartedAt: null,
          sessionId: state.sessionId + 1,
        };
      }
      if (state.status === 'tracking') {
        return {
          ...state,
          status: 'saved',
          activeSeconds: state.activeSeconds + elapsedSeconds(state.segmentStartedAt, event.now),
          segmentStartedAt: null,
          restStartedAt: null,
          sessionId: state.sessionId + 1,
        };
      }
      if (state.status === 'paused') {
        return {
          ...state,
          status: 'saved',
          restSeconds: state.restSeconds + elapsedSeconds(state.restStartedAt, event.now),
          restStartedAt: null,
          sessionId: state.sessionId + 1,
        };
      }
      if (state.status === 'error') {
        return {
          ...state,
          status: 'saved',
          segmentStartedAt: null,
          restStartedAt: null,
          sessionId: state.sessionId + 1,
        };
      }
      return state;
    }

    case 'GPS_ERROR': {
      if (state.status === 'tracking') {
        return {
          ...state,
          status: 'error',
          activeSeconds: state.activeSeconds + elapsedSeconds(state.segmentStartedAt, event.now),
          segmentStartedAt: null,
          restStartedAt: null,
          sessionId: state.sessionId + 1,
        };
      }
      if (state.status === 'locating') {
        return {
          ...state,
          status: 'error',
          segmentStartedAt: null,
          restStartedAt: null,
          sessionId: state.sessionId + 1,
        };
      }
      return state;
    }

    default:
      return state;
  }
}

/** 目前顯示用的步行秒數（含正在進行的那一段）。 */
export function getActiveSeconds(state: WalkSessionState, now: number): number {
  if (state.status === 'tracking') {
    return state.activeSeconds + elapsedSeconds(state.segmentStartedAt, now);
  }
  return state.activeSeconds;
}

/** 目前顯示用的休息秒數（含正在暫停的這一段）。 */
export function getRestSeconds(state: WalkSessionState, now: number): number {
  if (state.status === 'paused') {
    return state.restSeconds + elapsedSeconds(state.restStartedAt, now);
  }
  return state.restSeconds;
}
