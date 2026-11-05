import rawFoods from '../data/tfda-foods.json';
import type { TfdaCategory, TfdaFood } from '../types';

interface RawTfdaFood {
  i: string;
  n: string;
  a: string | null;
  e: string | null;
  c: TfdaCategory;
  s: string | null;
  k: number | null;
  p: number | null;
  f: number | null;
  ca: number | null;
  fb: number | null;
  sg: number | null;
  na: number | null;
}

export const TFDA_FOODS: TfdaFood[] = (rawFoods as unknown as RawTfdaFood[]).map((food) => ({
  id: food.i,
  name: food.n,
  aliases: food.a,
  englishName: food.e,
  category: food.c,
  state: food.s,
  nutrients: {
    calories: food.k,
    protein: food.p,
    fat: food.f,
    carbs: food.ca,
    fiber: food.fb,
    sugar: food.sg,
    sodium: food.na,
  },
}));

export const TFDA_FOODS_BY_ID = new Map(TFDA_FOODS.map((food) => [food.id, food]));

export const TFDA_CATEGORIES: TfdaCategory[] = [
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

// 以官方「整合編號」精選的常用食材；找不到時會自動忽略。
export const POPULAR_FOOD_IDS = [
  'A0550601', // 白飯
  'K0100101', // 雞蛋（白殼）
  'I0402402', // 去皮清肉（肉雞）
  'R4700901', // 傳統豆腐
  'L0102101', // 全脂鮮乳
  'D0800301', // 北蕉
  'D3200404', // 富士蘋果
  'E3000103', // 甘藍（圓球形）
  'J0402201', // 白肉鮭魚切片
  'A0810101', // 燕麥片
  'B0400401', // 紅肉甘藷
  'E5800101', // 花椰菜
];

export const POPULAR_FOODS = POPULAR_FOOD_IDS.map((id) => TFDA_FOODS_BY_ID.get(id)).filter(
  (food): food is TfdaFood => food !== undefined,
);

export function getFoodById(id: string): TfdaFood | undefined {
  return TFDA_FOODS_BY_ID.get(id);
}
