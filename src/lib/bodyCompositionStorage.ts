import type { BodyCompositionEntry } from '../types';

/**
 * InBody 紀錄的儲存位置。
 *
 * 只存這台裝置的 localStorage：不上傳、不經伺服器。
 * 保留多筆，之後可以看趨勢；目前畫面只顯示最新一筆。
 */
const STORAGE_KEY = 'health_app_inbody_v1';

export function loadBodyCompositions(): BodyCompositionEntry[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is BodyCompositionEntry => {
      if (!item || typeof item !== 'object') return false;
      return typeof (item as BodyCompositionEntry).id === 'string';
    });
  } catch {
    return [];
  }
}

export function saveBodyCompositions(entries: BodyCompositionEntry[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // 空間不足或瀏覽器封鎖時，本次仍可使用，只是不會保存。
  }
}

export function addBodyComposition(entry: BodyCompositionEntry): BodyCompositionEntry[] {
  const next = [entry, ...loadBodyCompositions()].slice(0, 60);
  saveBodyCompositions(next);
  return next;
}

export function deleteBodyComposition(id: string): BodyCompositionEntry[] {
  const next = loadBodyCompositions().filter((item) => item.id !== id);
  saveBodyCompositions(next);
  return next;
}

/** 供「清除所有本機資料」使用 */
export const BODY_COMPOSITION_STORAGE_KEY = STORAGE_KEY;
