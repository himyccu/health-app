#!/usr/bin/env node
/**
 * 版面溢出檢測
 *
 * 用途：在固定寬度下開啟每一個頁面，檢查是否有元素超出可視範圍（俗稱跑版）。
 * 有溢出時會指出「哪個元素、哪一行 class」，並以 exit code 1 結束，
 * 讓「有溢出就不交付」變成可執行的規則。
 *
 * 使用方式：
 *   1. 先啟動開發伺服器：npm run dev
 *   2. 啟動 Chrome：chrome --headless=new --remote-debugging-port=9333 about:blank
 *   3. node scripts/check-overflow.mjs
 *
 * 可用環境變數：
 *   BASE_URL（預設 http://127.0.0.1:5178）
 *   CDP_PORT（預設 9333）
 *   SHOT_DIR（設定後會同時輸出截圖）
 */

import fs from 'node:fs';
import path from 'node:path';

const BASE_URL = process.env.BASE_URL ?? 'http://127.0.0.1:5178';
const CDP_PORT = Number(process.env.CDP_PORT ?? 9333);
const SHOT_DIR = process.env.SHOT_DIR ?? '';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const VIEWPORTS = [
  { name: '320', width: 320, height: 568 },
  { name: '360', width: 360, height: 740 },
  { name: '375', width: 375, height: 812 },
  { name: '390', width: 390, height: 844 },
  { name: '414', width: 414, height: 896 },
  { name: '430', width: 430, height: 932 },
  { name: '768', width: 768, height: 1024 },
  { name: '1280', width: 1280, height: 900 },
];

const ROUTES = [
  { name: '首頁', url: `${BASE_URL}/?tab=home` },
  { name: '動能', url: `${BASE_URL}/?tab=activity` },
  { name: '運動', url: `${BASE_URL}/?tab=exercise` },
  { name: '運動-暖身', url: `${BASE_URL}/?tab=exercise`, click: '暖身與筋膜放鬆' },
  { name: '運動-安全', url: `${BASE_URL}/?tab=exercise`, click: '運動安全' },
  {
    name: '運動-動作文章',
    url: `${BASE_URL}/?tab=exercise`,
    clickAria: '推：',
  },
  { name: '健康', url: `${BASE_URL}/?tab=health` },
  { name: '飲食', url: `${BASE_URL}/?tab=nutrition` },
  { name: '設定', url: `${BASE_URL}/?tab=settings` },
];

async function findTarget() {
  for (let i = 0; i < 60; i += 1) {
    try {
      const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`);
      const list = await res.json();
      const page = list.find((item) => item.type === 'page');
      if (page) return page;
    } catch {
      /* 等待瀏覽器啟動 */
    }
    await sleep(250);
  }
  throw new Error('找不到 Chrome 偵錯目標，請確認 --remote-debugging-port 是否正確');
}

async function main() {
  const target = await findTarget();
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  let messageId = 0;
  const pending = new Map();
  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(JSON.stringify(message.error)));
      else resolve(message.result);
    }
  };
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const id = ++messageId;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });

  await send('Page.enable');
  await send('Runtime.enable');

  // 預先寫入本機資料，讓每一頁都呈現「已設定完成」的完整內容。
  await send('Page.addScriptToEvaluateOnNewDocument', {
    source: `
      try {
        localStorage.setItem('health_app_disclaimer_v1', 'accepted');
        localStorage.setItem('health_app_profile_v1', JSON.stringify({
          gender: 'female', age: 42, height: 162, weight: 58, activity: 'light'
        }));
      } catch (error) { /* ignore */ }
    `,
  });

  const evaluate = async (expression) => {
    const result = await send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (result.exceptionDetails) {
      throw new Error(result.exceptionDetails.text ?? 'evaluate failed');
    }
    return result.result?.value;
  };

  const measure = () =>
    evaluate(`(() => {
      const viewport = window.innerWidth;
      const root = document.documentElement;
      const body = document.body;
      const offenders = [];
      const inScrollable = (el) => {
        let node = el.parentElement;
        while (node) {
          const s = getComputedStyle(node);
          if (/(auto|scroll)/.test(s.overflowX) || /(auto|scroll)/.test(s.overflow)) return true;
          node = node.parentElement;
        }
        return false;
      };
      const nodes = document.querySelectorAll('body *');
      for (const el of nodes) {
        const style = getComputedStyle(el);
        if (style.position === 'absolute' || style.position === 'fixed') continue;
        if (style.display === 'none' || style.visibility === 'hidden') continue;
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) continue;
        if (rect.right > viewport + 1 || rect.left < -1) {
          if (inScrollable(el)) continue;
          offenders.push({
            tag: el.tagName.toLowerCase(),
            cls: String(el.className || '').slice(0, 90),
            text: (el.textContent || '').trim().slice(0, 24),
            left: Math.round(rect.left),
            right: Math.round(rect.right),
          });
          if (offenders.length >= 6) break;
        }
      }
      return {
        viewport,
        scrollWidth: root.scrollWidth,
        bodyScrollWidth: body ? body.scrollWidth : 0,
        overflow: root.scrollWidth > viewport + 1,
        offenders,
      };
    })()`);

  if (SHOT_DIR) fs.mkdirSync(SHOT_DIR, { recursive: true });

  const failures = [];
  const rows = [];

  for (const route of ROUTES) {
    for (const view of VIEWPORTS) {
      await send('Emulation.setDeviceMetricsOverride', {
        width: view.width,
        height: view.height,
        deviceScaleFactor: 1,
        mobile: view.width < 768,
        screenWidth: view.width,
        screenHeight: view.height,
      });
      await send('Page.navigate', { url: route.url });
      await sleep(1100);

      if (route.click) {
        await evaluate(`(() => {
          const label = ${JSON.stringify(route.click)};
          const button = [...document.querySelectorAll('button')]
            .find((node) => (node.textContent || '').replace(/\\s+/g, '').includes(label.replace(/\\s+/g, '')));
          if (button) button.click();
          return Boolean(button);
        })()`);
        await sleep(700);
      }

      if (route.clickAria) {
        await evaluate(`(() => {
          const label = ${JSON.stringify(route.clickAria)};
          const button = [...document.querySelectorAll('button')]
            .find((node) => (node.getAttribute('aria-label') || '').includes(label));
          if (button) button.click();
          return Boolean(button);
        })()`);
        await sleep(700);
      }

      if (SHOT_DIR) {
        const shot = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(
          path.join(SHOT_DIR, `${route.name}-${view.name}.png`),
          Buffer.from(shot.data, 'base64'),
        );
      }

      const result = await measure();
      const ok = !result.overflow && result.offenders.length === 0;
      rows.push({ route: route.name, view: view.name, ok, result });
      if (!ok) {
        failures.push({ route: route.name, view: view.name, result });
      }
    }
  }

  ws.close();

  const header = ['頁面', ...VIEWPORTS.map((view) => view.name)];
  const table = ROUTES.map((route) => {
    const cells = VIEWPORTS.map((view) => {
      const row = rows.find((item) => item.route === route.name && item.view === view.name);
      return row?.ok ? 'OK' : 'NG';
    });
    return [route.name, ...cells];
  });

  const widths = header.map((cell) => Math.max(6, cell.length + 2));
  const line = (cells) =>
    cells
      .map((cell, index) => String(cell).padEnd(widths[index], ' '))
      .join('');

  console.log(line(header));
  table.forEach((cells) => console.log(line(cells)));

  if (failures.length > 0) {
    console.log('\n溢出明細：');
    failures.forEach(({ route, view, result }) => {
      console.log(`\n[${route} @ ${view}] 可視寬度 ${result.viewport}，實際內容寬度 ${result.scrollWidth}`);
      result.offenders.forEach((item) => {
        console.log(`  - <${item.tag}> ${item.cls} | left=${item.left} right=${item.right} | ${item.text}`);
      });
    });
    process.exitCode = 1;
  } else {
    console.log('\n全部通過：沒有任何水平溢出。');
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
