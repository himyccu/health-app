import type { SegmentResult, Status } from '../lib/bodyComposition';

/**
 * 節段人體圖
 *
 * 用自繪 SVG 而不是現成的人體圖套件，原因：
 * 1. 套件無法區分左右（同一塊肌肉會左右同時上色），
 *    但 InBody 的重點正是「左邊和右邊差多少」。
 * 2. 只需要五個區塊，自繪可以完全對齊資料。
 *
 * 圖上不放文字：SVG 內的字會隨容器縮小而變得太小，
 * 數值統一由下方的 13px 清單呈現。
 */

const COLORS: Record<Status, string> = {
  low: '#b79ad0',
  normal: '#5d3b7d',
  high: '#d97706',
  veryHigh: '#b45309',
  none: '#e8e2f0',
};

const BODY_COLOR = '#efeaf6';

interface SegmentFigureProps {
  segments: SegmentResult[];
  label: string;
}

export function SegmentFigure({ segments, label }: SegmentFigureProps) {
  const byKey = new Map<SegmentResult['key'], SegmentResult>(
    segments.map((segment) => [segment.key, segment]),
  );
  const statusOf = (key: SegmentResult['key']): Status => byKey.get(key)?.status ?? 'none';
  const color = (key: SegmentResult['key']) => COLORS[statusOf(key)];

  return (
    <div className="rounded-2xl border border-plum-100 bg-white p-3">
      <p className="text-[13px] font-black text-slate-600">{label}</p>

      <svg
        viewBox="0 0 140 200"
        role="img"
        aria-label={label}
        className="mx-auto mt-2 h-[196px] w-auto max-w-full"
      >
        {/* 頭與頸：不納入判讀，用中性色 */}
        <circle cx="70" cy="20" r="13" fill={BODY_COLOR} />
        <rect x="63" y="31" width="14" height="10" rx="5" fill={BODY_COLOR} />

        {/* 右臂（正面看是畫面左側） */}
        <rect x="17" y="43" width="24" height="70" rx="12" fill={color('rightArm')} />
        {/* 左臂（正面看是畫面右側） */}
        <rect x="99" y="43" width="24" height="70" rx="12" fill={color('leftArm')} />

        {/* 軀幹 */}
        <rect x="43" y="41" width="54" height="78" rx="15" fill={color('trunk')} />

        {/* 右腿 */}
        <rect x="45" y="122" width="23" height="72" rx="11" fill={color('rightLeg')} />
        {/* 左腿 */}
        <rect x="72" y="122" width="23" height="72" rx="11" fill={color('leftLeg')} />
      </svg>

      <p className="mt-2 text-center text-[13px] font-semibold leading-6 text-slate-400">
        正面視角，畫面左側為你的右側
      </p>

      <div className="mt-1 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
        {(
          [
            ['偏低', 'low'],
            ['正常', 'normal'],
            ['偏高', 'high'],
            ['未填', 'none'],
          ] as [string, Status][]
        ).map(([text, status]) => (
          <span
            key={status}
            className="flex items-center gap-1 text-[13px] font-semibold text-slate-500"
          >
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: COLORS[status] }}
            />
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
