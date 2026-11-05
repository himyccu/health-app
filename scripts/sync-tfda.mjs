import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { unzipSync } from 'fflate';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CACHE_DIR = path.join(ROOT, '.cache', 'tfda');
const ZIP_PATH = path.join(CACHE_DIR, 'tfda-nutrition.zip');
const OUTPUT_DIR = path.join(ROOT, 'src', 'data');
const FOODS_PATH = path.join(OUTPUT_DIR, 'tfda-foods.json');
const META_PATH = path.join(OUTPUT_DIR, 'tfda-meta.json');

const DOWNLOAD_URL = 'https://data.fda.gov.tw/data/opendata/export/20/json';
const DATASET_URL = 'https://data.gov.tw/dataset/8543';
const DATASET_API = 'https://data.gov.tw/api/v2/rest/dataset/8543';

const CATEGORY_ORDER = [
  '穀物類',
  '澱粉類',
  '肉類',
  '魚貝類',
  '蛋類',
  '豆類',
  '乳品類',
  '蔬菜類',
  '菇類',
  '藻類',
  '水果類',
  '油脂類',
  '堅果及種子類',
  '糖類',
  '飲料類',
  '糕餅點心類',
  '加工調理食品及其他類',
  '調味料及香辛料類',
];

// 官方欄位名稱 → 前端使用的營養素 key。
const NUTRIENTS = [
  ['k', '熱量'],
  ['p', '粗蛋白'],
  ['f', '粗脂肪'],
  ['ca', '總碳水化合物'],
  ['fb', '膳食纖維'],
  ['sg', '糖質總量'],
  ['na', '鈉'],
];

const REQUIRED_COLUMNS = [
  '食品分類',
  '整合編號',
  '樣品名稱',
  '俗名',
  '樣品英文名稱',
  '內容物描述',
  '分析項',
  '每100克含量',
];

function cleanText(value) {
  if (value === null || value === undefined) return null;
  const text = String(value).replace(/\s+/g, ' ').trim();
  return text.length > 0 ? text : null;
}

function parseNumber(value) {
  if (value === null || value === undefined) return null;
  const text = String(value).replace(/,/g, '').trim();
  if (!text) return null;
  const parsed = Number.parseFloat(text);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseState(description) {
  if (!description) return null;
  const match = description.match(/樣品狀態\s*[:：]\s*([^;；]+)/);
  if (!match) return null;
  const state = match[1].trim();
  if (!state) return null;
  if (state.includes('熟')) return '熟';
  if (state.includes('生')) return '生';
  if (state.includes('加工')) return '加工';
  return state.slice(0, 12);
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

async function downloadZip() {
  if (existsSync(ZIP_PATH) && !process.argv.includes('--refresh')) {
    console.log('使用快取 ZIP：', path.relative(ROOT, ZIP_PATH));
    return;
  }

  console.log('下載官方資料集 ZIP…');
  const response = await fetch(DOWNLOAD_URL, {
    headers: { Accept: 'application/zip' },
    signal: AbortSignal.timeout(180_000),
    redirect: 'follow',
  });
  if (!response.ok) throw new Error(`下載失敗：HTTP ${response.status}`);

  const buffer = Buffer.from(await response.arrayBuffer());
  await mkdir(CACHE_DIR, { recursive: true });
  await writeFile(ZIP_PATH, buffer);
  console.log(`已下載 ${(buffer.length / 1024 / 1024).toFixed(2)} MB`);
}

async function readDataset() {
  const zipBuffer = await readFile(ZIP_PATH);
  const entries = unzipSync(new Uint8Array(zipBuffer));
  const jsonName = Object.keys(entries).find((name) => name.toLowerCase().endsWith('.json'));
  if (!jsonName) throw new Error('ZIP 中找不到 JSON 檔，官方格式可能已變更。');

  console.log('解壓縮：', jsonName);
  const text = new TextDecoder('utf-8', { fatal: true }).decode(entries[jsonName]);
  const rows = JSON.parse(text);
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error('JSON 內容不是非空陣列，官方格式可能已變更。');
  }

  const columns = new Set(Object.keys(rows[0]));
  const missing = REQUIRED_COLUMNS.filter((column) => !columns.has(column));
  if (missing.length > 0) {
    throw new Error(`缺少必要欄位：${missing.join('、')}。官方格式可能已變更。`);
  }

  return { rows, jsonName };
}

function buildFoods(rows) {
  const foods = new Map();

  for (const row of rows) {
    const id = cleanText(row['整合編號']);
    const name = cleanText(row['樣品名稱']);
    if (!id || !name) continue;

    let food = foods.get(id);
    if (!food) {
      const description = cleanText(row['內容物描述']);
      food = {
        i: id,
        n: name,
        a: cleanText(row['俗名']),
        e: cleanText(row['樣品英文名稱']),
        c: cleanText(row['食品分類']) ?? '其他',
        s: parseState(description),
      };
      foods.set(id, food);
    }

    const label = cleanText(row['分析項']);
    const nutrient = NUTRIENTS.find(([, nutrientLabel]) => nutrientLabel === label);
    if (!nutrient) continue;

    const [key] = nutrient;
    if (food[key] !== undefined) continue;
    food[key] = parseNumber(row['每100克含量']);
  }

  const list = [...foods.values()].map((food) => ({
    i: food.i,
    n: food.n,
    a: food.a,
    e: food.e,
    c: food.c,
    s: food.s,
    k: food.k ?? null,
    p: food.p ?? null,
    f: food.f ?? null,
    ca: food.ca ?? null,
    fb: food.fb ?? null,
    sg: food.sg ?? null,
    na: food.na ?? null,
  }));

  list.sort((a, b) => {
    const categoryA = CATEGORY_ORDER.indexOf(a.c);
    const categoryB = CATEGORY_ORDER.indexOf(b.c);
    const orderA = categoryA === -1 ? CATEGORY_ORDER.length : categoryA;
    const orderB = categoryB === -1 ? CATEGORY_ORDER.length : categoryB;
    if (orderA !== orderB) return orderA - orderB;
    return a.n.localeCompare(b.n, 'zh-TW');
  });

  return list;
}

async function readDatasetMeta() {
  try {
    const payload = await fetchJson(DATASET_API);
    const result = payload?.result;
    return {
      title: result?.title ?? '食品營養成分資料集',
      datasetId: '8543',
      provider: '衛生福利部食品藥物管理署',
      license: '政府資料開放授權條款－第 1 版',
      licenseUrl: 'https://data.gov.tw/license',
      sourceUrl: DATASET_URL,
      downloadUrl: DOWNLOAD_URL,
      modifiedDate: (result?.modifiedDate ?? '').slice(0, 10) || null,
    };
  } catch (error) {
    console.warn('無法取得資料集 metadata，使用預設值：', error.message);
    return {
      title: '食品營養成分資料集',
      datasetId: '8543',
      provider: '衛生福利部食品藥物管理署',
      license: '政府資料開放授權條款－第 1 版',
      licenseUrl: 'https://data.gov.tw/license',
      sourceUrl: DATASET_URL,
      downloadUrl: DOWNLOAD_URL,
      modifiedDate: null,
    };
  }
}

function printStats(foods, jsonText) {
  const categories = new Map();
  for (const food of foods) {
    categories.set(food.c, (categories.get(food.c) ?? 0) + 1);
  }

  console.log('\n完成：');
  console.log(`- 食物筆數：${foods.length.toLocaleString()}`);
  console.log(`- 分類數：${categories.size}`);
  console.log(
    `- 輸出大小：${(Buffer.byteLength(jsonText) / 1024).toFixed(1)} KB（gzip ${(
      gzipSync(jsonText, { level: 9 }).length / 1024
    ).toFixed(1)} KB）`,
  );
  console.log('- 分類統計：');
  for (const [category, count] of [...categories.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${category}: ${count}`);
  }

  const missing = {
    蛋白質: foods.filter((food) => food.p === null).length,
    脂肪: foods.filter((food) => food.f === null).length,
    膳食纖維: foods.filter((food) => food.fb === null).length,
    糖: foods.filter((food) => food.sg === null).length,
    鈉: foods.filter((food) => food.na === null).length,
  };
  console.log('- 缺值筆數：', missing);
}

async function main() {
  await mkdir(CACHE_DIR, { recursive: true });
  await mkdir(OUTPUT_DIR, { recursive: true });

  await downloadZip();
  const [{ rows, jsonName }, sourceMeta] = await Promise.all([readDataset(), readDatasetMeta()]);
  const foods = buildFoods(rows);
  const jsonText = JSON.stringify(foods);

  const meta = {
    ...sourceMeta,
    generatedAt: new Date().toISOString(),
    foodCount: foods.length,
    sourceFile: jsonName,
    note: '數值為每 100 公克可食部分；部分營養素未檢驗時以 null 表示。',
  };

  await writeFile(FOODS_PATH, jsonText, 'utf8');
  await writeFile(META_PATH, `${JSON.stringify(meta, null, 2)}\n`, 'utf8');

  printStats(foods, jsonText);
  console.log(`\n已寫入：${path.relative(ROOT, FOODS_PATH)}`);
  console.log(`已寫入：${path.relative(ROOT, META_PATH)}`);
}

main().catch((error) => {
  console.error('\n同步失敗：', error.message);
  console.error('請確認網路連線，或稍後再執行 `npm run sync:nutrition -- --refresh`。');
  process.exitCode = 1;
});
