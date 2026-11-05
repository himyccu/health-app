import type { TfdaCategory, TfdaFood } from '../types';
import { POPULAR_FOODS } from './foodData';

export interface FoodSearchOptions {
  query: string;
  category: TfdaCategory | 'all';
  limit: number;
}

export interface FoodSearchResult {
  items: TfdaFood[];
  total: number;
  hasMore: boolean;
}

const PUNCTUATION = /[\s()（）[\]【】,，、;；:：\-_/\\·.。'"“”‘’]/g;

function normalize(value: string): string {
  return value.normalize('NFKC').toLowerCase().replace(PUNCTUATION, '');
}

function tokenize(query: string): string[] {
  return query
    .normalize('NFKC')
    .toLowerCase()
    .split(/\s+/)
    .map(normalize)
    .filter(Boolean);
}

function scoreToken(food: TfdaFood, token: string): number {
  const name = normalize(food.name);
  if (name === token) return 120;
  if (name.startsWith(token)) return 80;
  if (name.includes(token)) return 55;

  const aliases = food.aliases ? normalize(food.aliases) : '';
  if (aliases.includes(token)) return 38;

  const englishName = food.englishName ? normalize(food.englishName) : '';
  if (englishName === token) return 34;
  if (englishName.includes(token)) return 28;

  const category = normalize(food.category);
  if (category.includes(token)) return 12;

  return 0;
}

function scoreFood(food: TfdaFood, tokens: string[]): number {
  let score = 0;
  for (const token of tokens) {
    const tokenScore = scoreToken(food, token);
    if (tokenScore === 0) return 0;
    score += tokenScore;
  }
  return score;
}

export function searchFoods(
  foods: TfdaFood[],
  { query, category, limit }: FoodSearchOptions,
): FoodSearchResult {
  const safeLimit = Math.max(1, Math.min(100, Math.round(limit)));
  const tokens = tokenize(query);

  if (tokens.length === 0) {
    const source = category === 'all' ? POPULAR_FOODS : foods.filter((food) => food.category === category);
    return {
      items: source.slice(0, safeLimit),
      total: source.length,
      hasMore: source.length > safeLimit,
    };
  }

  const scored: Array<{ food: TfdaFood; score: number }> = [];
  for (const food of foods) {
    if (category !== 'all' && food.category !== category) continue;
    const score = scoreFood(food, tokens);
    if (score > 0) scored.push({ food, score });
  }

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.food.name.length !== b.food.name.length) {
      return a.food.name.length - b.food.name.length;
    }
    return a.food.name.localeCompare(b.food.name, 'zh-TW');
  });

  return {
    items: scored.slice(0, safeLimit).map((item) => item.food),
    total: scored.length,
    hasMore: scored.length > safeLimit,
  };
}
