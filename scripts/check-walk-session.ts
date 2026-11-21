import assert from 'node:assert/strict';
import test from 'node:test';
import {
  INITIAL_WALK_STATE,
  getActiveSeconds,
  getRestSeconds,
  transition,
  type WalkEvent,
  type WalkSessionState,
} from '../src/lib/walkSession.ts';

function run(state: WalkSessionState, ...events: WalkEvent[]): WalkSessionState {
  return events.reduce((acc, event) => transition(acc, event), state);
}

/** 測試用的步行流程：開始 → 定位 → 走 60 秒／150 公尺 → 暫停。 */
function walkingSixtySeconds(): WalkSessionState {
  return run(
    INITIAL_WALK_STATE,
    { type: 'START', now: 0 },
    { type: 'GPS_READY', now: 1_000 },
    { type: 'ADD_DISTANCE', meters: 100 },
    { type: 'ADD_DISTANCE', meters: 50 },
    { type: 'PAUSE', now: 61_000 },
  );
}

test('暫停後繼續會接續先前累積，不會歸零', () => {
  let state = walkingSixtySeconds();

  assert.equal(state.status, 'paused');
  assert.equal(state.meters, 150);
  assert.equal(Math.round(state.activeSeconds), 60);

  // 休息 5 分鐘
  state = transition(state, { type: 'RESUME', now: 361_000 });
  assert.equal(state.status, 'locating');
  assert.equal(Math.round(state.restSeconds), 300);
  assert.equal(state.meters, 150, '繼續後距離必須保留');
  assert.equal(Math.round(state.activeSeconds), 60, '繼續後時間必須保留');

  // 重新取得定位才繼續計時，再走 60 秒／200 公尺
  state = run(
    state,
    { type: 'GPS_READY', now: 362_000 },
    { type: 'ADD_DISTANCE', meters: 200 },
    { type: 'STOP', now: 422_000 },
  );

  assert.equal(state.status, 'saved');
  assert.equal(state.meters, 350, '兩段距離要相加');
  assert.equal(Math.round(state.activeSeconds), 120, '只計算兩段步行時間');
  assert.equal(Math.round(state.restSeconds), 300, '休息時間另外記錄');
});

test('休息期間的 GPS 位移不會被算進距離', () => {
  const paused = walkingSixtySeconds();
  const drifted = transition(paused, { type: 'ADD_DISTANCE', meters: 800 });

  assert.equal(drifted, paused, '暫停時收到距離事件應直接忽略');
  assert.equal(drifted.meters, 150);
});

test('連按暫停不會重設休息計時，也不會重複累加步行時間', () => {
  let state = walkingSixtySeconds();
  state = transition(state, { type: 'PAUSE', now: 121_000 });
  state = transition(state, { type: 'PAUSE', now: 181_000 });

  assert.equal(state.status, 'paused');
  assert.equal(Math.round(state.activeSeconds), 60, '重複暫停不可再加時間');
  assert.equal(state.restStartedAt, 61_000, '休息起點不可被第二次暫停覆蓋');

  state = transition(state, { type: 'STOP', now: 91_000 });
  assert.equal(Math.round(state.restSeconds), 30);
  assert.equal(Math.round(state.activeSeconds), 60);
});

test('連按結束只會儲存一次', () => {
  let state = walkingSixtySeconds();
  state = transition(state, { type: 'STOP', now: 91_000 });
  const saved = state;

  state = transition(state, { type: 'STOP', now: 100_000 });
  assert.equal(state, saved, '已儲存後再按結束必須是 no-op');
  assert.equal(Math.round(state.activeSeconds), 60);
});

test('開始後立刻再按開始，不會清掉已累積的距離', () => {
  let state = run(
    INITIAL_WALK_STATE,
    { type: 'START', now: 0 },
    { type: 'GPS_READY', now: 1_000 },
    { type: 'ADD_DISTANCE', meters: 300 },
  );

  state = transition(state, { type: 'START', now: 60_000 });
  assert.equal(state.status, 'tracking');
  assert.equal(state.meters, 300);
  assert.equal(Math.round(getActiveSeconds(state, 60_000)), 59, '已走的時間不可歸零');
});

test('等待 GPS 定位的時間不算步行時間', () => {
  let state = transition(INITIAL_WALK_STATE, { type: 'START', now: 0 });
  state = transition(state, { type: 'GPS_READY', now: 30_000 });

  assert.equal(Math.round(state.activeSeconds), 0, '定位前的 30 秒不可計入');
  assert.equal(state.segmentStartedAt, 30_000);
});

test('定位中暫停再繼續，休息時間有記錄、步行時間仍為 0', () => {
  let state = run(
    INITIAL_WALK_STATE,
    { type: 'START', now: 0 },
    { type: 'PAUSE', now: 5_000 },
  );

  assert.equal(state.status, 'paused');
  assert.equal(state.activeSeconds, 0);

  state = transition(state, { type: 'RESUME', now: 65_000 });
  assert.equal(Math.round(state.restSeconds), 60);
  assert.equal(state.status, 'locating');
});

test('GPS 中斷會結算當下時間，之後結束儲存不會重複計算', () => {
  let state = run(
    INITIAL_WALK_STATE,
    { type: 'START', now: 0 },
    { type: 'GPS_READY', now: 1_000 },
    { type: 'ADD_DISTANCE', meters: 100 },
    { type: 'GPS_ERROR', now: 31_000 },
  );

  assert.equal(state.status, 'error');
  assert.equal(Math.round(state.activeSeconds), 30);

  // 中斷後可以重新定位（等同繼續），舊的回呼因為 sessionId 改變而失效
  const retried = transition(state, { type: 'RESUME', now: 61_000 });
  assert.equal(retried.status, 'locating');
  assert.ok(retried.sessionId > state.sessionId);

  state = transition(state, { type: 'STOP', now: 91_000 });
  assert.equal(state.status, 'saved');
  assert.equal(Math.round(state.activeSeconds), 30, '不可再多算 60 秒');
});

test('每次開始、繼續、結束都會換 sessionId，用來擋掉遲到的 GPS 回呼', () => {
  const idle = INITIAL_WALK_STATE;
  const started = transition(idle, { type: 'START', now: 0 });
  const tracking = transition(started, { type: 'GPS_READY', now: 1_000 });
  const paused = transition(tracking, { type: 'PAUSE', now: 11_000 });
  const resumed = transition(paused, { type: 'RESUME', now: 21_000 });
  const stopped = transition(resumed, { type: 'STOP', now: 31_000 });

  assert.ok(started.sessionId > idle.sessionId);
  assert.ok(resumed.sessionId > paused.sessionId);
  assert.ok(stopped.sessionId > resumed.sessionId);
});

test('顯示用秒數：進行中會持續增加，暫停後完全凍結', () => {
  const tracking = run(
    INITIAL_WALK_STATE,
    { type: 'START', now: 0 },
    { type: 'GPS_READY', now: 10_000 },
  );

  assert.equal(Math.round(getActiveSeconds(tracking, 40_000)), 30);
  assert.equal(Math.round(getRestSeconds(tracking, 40_000)), 0);

  const paused = transition(tracking, { type: 'PAUSE', now: 40_000 });
  assert.equal(Math.round(getActiveSeconds(paused, 400_000)), 30, '暫停後數字不再增加');
  assert.equal(Math.round(getRestSeconds(paused, 100_000)), 60);
});

test('無效距離（0 或 NaN）不會污染累積值', () => {
  const tracking = run(
    INITIAL_WALK_STATE,
    { type: 'START', now: 0 },
    { type: 'GPS_READY', now: 1_000 },
  );

  const zero = transition(tracking, { type: 'ADD_DISTANCE', meters: 0 });
  const notANumber = transition(zero, { type: 'ADD_DISTANCE', meters: Number.NaN });
  assert.equal(notANumber.meters, 0);
});

test('從未開始時按暫停、繼續、結束都不會改變狀態', () => {
  assert.equal(transition(INITIAL_WALK_STATE, { type: 'PAUSE', now: 1_000 }), INITIAL_WALK_STATE);
  assert.equal(transition(INITIAL_WALK_STATE, { type: 'RESUME', now: 1_000 }), INITIAL_WALK_STATE);
  assert.equal(transition(INITIAL_WALK_STATE, { type: 'STOP', now: 1_000 }), INITIAL_WALK_STATE);
});
