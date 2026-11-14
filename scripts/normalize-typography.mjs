#!/usr/bin/env node
/**
 * 字級與圓角正規化（一次性工具）
 *
 * 目的：把散落在各檔案的任意字級收斂到固定級距，避免同一頁出現 9、10、11、12、14 五種大小。
 *
 * 字級級距：13 / 15 / 16 / 18 / 22 / 28 / 34
 *   text-[9px]  ~ text-[12px]  → 13px（輔助文字最小尺寸）
 *   text-xs（12px）             → 13px
 *   text-[14px]、text-sm（14px）→ 15px（內文）
 *
 * 例外：圖片授權與法務標註固定 11px，該行必須帶 data-annotation，腳本會跳過。
 *
 * 圓角：30px / 32px → 28px、26px → 24px
 * 亮紫：text-purple-700 → text-plum-800
 *
 * 直接執行：node scripts/normalize-typography.mjs
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('src');
const FONT_MAP = [
  [/text-\[(?:9|10|11|12)px\]/g, 'text-[13px]'],
  [/text-\[14px\]/g, 'text-[15px]'],
  [/text-xs\b/g, 'text-[13px]'],
  [/text-sm\b/g, 'text-[15px]'],
];

const OTHER_MAP = [
  [/rounded-\[32px\]/g, 'rounded-[28px]'],
  [/rounded-\[30px\]/g, 'rounded-[28px]'],
  [/rounded-\[26px\]/g, 'rounded-[24px]'],
  [/text-purple-700/g, 'text-plum-800'],
];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    if (!/\.(tsx?|css)$/.test(entry.name)) return [];
    return [full];
  });
}

let changed = 0;
for (const file of walk(ROOT)) {
  const before = fs.readFileSync(file, 'utf8');
  const after = before
    .split('\n')
    .map((line) => {
      let next = line;
      // 圖片授權與法務標註固定 11px，不納入字級正規化
      if (!next.includes('data-annotation')) {
        for (const [pattern, replacement] of FONT_MAP) next = next.replace(pattern, replacement);
      }
      for (const [pattern, replacement] of OTHER_MAP) next = next.replace(pattern, replacement);
      return next;
    })
    .join('\n');
  if (after !== before) {
    fs.writeFileSync(file, after);
    changed += 1;
    console.log(`updated ${path.relative(process.cwd(), file)}`);
  }
}
console.log(`\n完成：共更新 ${changed} 個檔案。`);
