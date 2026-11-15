import type { SourceId } from '../sources';

/**
 * 球類運動教學的共用資料結構。
 *
 * 高爾夫（golf.ts）另有自己的型別，內容結構相同；
 * 網球與桌球共用這裡的型別，畫面由 components/SportGuide.tsx 負責。
 * 每一節固定五段：這是什麼、怎麼做、做錯會怎樣、怎麼檢查、注意。
 * 排序編號只給資料分組用，畫面不顯示「第幾章」。
 */

export interface SportStep {
  label: string;
  detail?: string;
}

export interface SportMistake {
  mistake: string;
  result: string;
}

export interface SportChapter {
  id: string;
  /** 排序編號，字串以保留「0」；只用於分組，畫面不顯示 */
  number: string;
  title: string;
  englishTitle: string;
  /** 一句話結論 */
  summary: string;
  what: string;
  steps: SportStep[];
  mistakes: SportMistake[];
  checks: string[];
  cautions: string[];
  /** 圖解代號，對應頁面元件裡的 VISUALS */
  visual?: string;
  sources: SourceId[];
}

export interface SportAppendix {
  id: string;
  title: string;
  englishTitle: string;
  intro: string;
  points: SportStep[];
  note?: string;
  sources: SourceId[];
}

/** 分組：只寫標題與排序編號，章節內容留在 chapters */
export interface SportGroup {
  heading: string;
  numbers: string[];
}

export interface SportGuideContent {
  id: 'tennis' | 'tableTennis';
  /** 卡片最上方的英文小標，例如 TENNIS · BASICS */
  eyebrow: string;
  title: string;
  intro: string;
  /** 劑量標籤，例如「每次 40–60 分鐘」 */
  dose: string[];
  /** 開始前先看 */
  safety: string[];
  /** 開頭之後的器材區塊，可省略 */
  equipment?: {
    title: string;
    text: string;
    count?: string;
    /** 圖解代號，對應頁面元件裡的 VISUALS */
    visual: string;
  };
  groups: SportGroup[];
  chapters: SportChapter[];
  appendices?: SportAppendix[];
}
