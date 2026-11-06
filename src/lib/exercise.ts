/**
 * 運動熱量計算
 *
 * 公式：kcal = MET × 體重(kg) × 時間(小時)
 * MET 1 定義為安靜坐著時的能量消耗（約 3.5 mL O2/kg/min）。
 * 參考：Ainsworth et al., Compendium of Physical Activities (2011)、
 *       ACSM《運動測試與處方指引》。
 *
 * 這是國際通用的估算方式，但屬於群體平均值：實際消耗仍受動作幅度、
 * 組間休息、肌肉量與代謝率影響，數值應視為「估算」而非精確測量。
 */
export function calcExerciseCalories(met: number, weightKg: number, minutes: number): number {
  if (!Number.isFinite(met) || !Number.isFinite(weightKg) || !Number.isFinite(minutes)) return 0;
  if (met <= 0 || weightKg <= 0 || minutes <= 0) return 0;
  return Math.round(met * weightKg * (minutes / 60));
}

export const MET_FORMULA_TEXT = 'kcal ＝ MET × 體重(kg) × 運動時間(小時)';

export const MET_SOURCE_TEXT =
  'MET 值參考 Ainsworth 等人《Compendium of Physical Activities》(2011) 與 ACSM 運動指引。';
