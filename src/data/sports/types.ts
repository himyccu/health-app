import type { SourceId } from '../sources';

/** 伸展與瑜伽共用的動作型別。 */
export type PoseKind = 'stretch' | 'yoga';

/** 骨架線條。座標系固定為 viewBox 0 0 100 140。 */
export interface FigureLine {
  points: [number, number][];
  tone?: 'body' | 'prop';
}

/** 圓形（頭部）。 */
export interface FigureCircle {
  cx: number;
  cy: number;
  r: number;
}

export interface PoseFigure {
  lines: FigureLine[];
  circles: FigureCircle[];
  /** 是否畫地面虛線 */
  ground?: boolean;
}

export interface Pose {
  id: string;
  kind: PoseKind;
  name: string;
  /** 英文或梵文原名，方便對照國際資料 */
  englishName: string;
  /** 分類，用於分組顯示 */
  category: string;
  /** 一句話定位，給第一次看到的人 */
  summary: string;
  /** 目標肌群或目的 */
  targets: string[];
  /** 做法，依序 2–4 步 */
  steps: string[];
  /** 做對的感覺 */
  feeling: string;
  /** 劑量 */
  dose: string;
  /** 做錯會怎樣 */
  mistakes: string[];
  /** 替代動作，做不到時用 */
  alternatives: string[];
  /** 禁忌與注意 */
  cautions: string[];
  figure: PoseFigure;
  sources: SourceId[];
}
