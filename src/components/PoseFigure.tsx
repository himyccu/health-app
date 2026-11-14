import type { PoseFigure as FigureSpec } from '../data/sports/types';

interface PoseFigureProps {
  figure: FigureSpec;
  label: string;
  className?: string;
}

/**
 * 伸展與瑜伽的線稿示意圖。
 *
 * 座標系固定為 viewBox 0 0 100 140，由資料檔提供折線與圓形，
 * 這個元件只負責畫，不含任何姿勢邏輯。
 */
export function PoseFigure({ figure, label, className = '' }: PoseFigureProps) {
  const bodyLines = figure.lines.filter((line) => line.tone !== 'prop');
  const propLines = figure.lines.filter((line) => line.tone === 'prop');

  return (
    <svg
      viewBox="0 0 100 140"
      role="img"
      aria-label={label}
      className={`h-[104px] w-[74px] shrink-0 ${className}`}
    >
      {figure.ground && (
        <line
          x1={8}
          y1={132}
          x2={92}
          y2={132}
          className="stroke-slate-200"
          strokeWidth={2}
          strokeDasharray="4 4"
          strokeLinecap="round"
        />
      )}

      {propLines.map((line, index) => (
        <polyline
          key={`prop-${index}`}
          points={line.points.map(([x, y]) => `${x},${y}`).join(' ')}
          fill="none"
          className="stroke-slate-300"
          strokeWidth={2.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}

      <g
        fill="none"
        className="stroke-plum-700"
        strokeWidth={3.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {bodyLines.map((line, index) => (
          <polyline
            key={`body-${index}`}
            points={line.points.map(([x, y]) => `${x},${y}`).join(' ')}
          />
        ))}
        {figure.circles.map((circle, index) => (
          <circle
            key={`head-${index}`}
            cx={circle.cx}
            cy={circle.cy}
            r={circle.r}
            className="fill-white"
          />
        ))}
      </g>
    </svg>
  );
}
