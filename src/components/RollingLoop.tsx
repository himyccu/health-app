import { useId, useState, type CSSProperties } from 'react';
import { Pause, Play } from 'lucide-react';
import type { StationVisual } from '../data/foamRolling';

interface RollingLoopProps {
  visual: StationVisual;
  /** 給螢幕閱讀器的說明 */
  label: string;
}

/**
 * 滾筒動作的循環示範。
 *
 * 用幾何圖形表示身體部位與滾筒，箭頭標出滾動方向。
 * 不依賴影片檔：不會失效、不需下載、可以暫停與放慢。
 * 使用者若開啟「減少動態效果」，動畫自動停止，只留靜態圖。
 */
export function RollingLoop({ visual, label }: RollingLoopProps) {
  const [playing, setPlaying] = useState(true);
  const [slow, setSlow] = useState(false);
  const gradientId = useId().replace(/:/g, '');
  const bodyGradient = `body-${gradientId}`;
  const rollerGradient = `roller-${gradientId}`;

  const { parts, roller, motion } = visual;
  const isHorizontal = (motion.dx ?? 0) !== 0;
  const duration = slow ? '6.4s' : '3.2s';

  const body = (
    <g>
      {parts.map((part, index) => (
        <rect
          key={`part-${index}`}
          x={part.x}
          y={part.y}
          width={part.w}
          height={part.h}
          rx={part.r}
          fill={`url(#${bodyGradient})`}
          stroke="#c9aedd"
          strokeWidth={1.5}
        />
      ))}
    </g>
  );

  const drum = (
    <g>
      <rect
        x={roller.x}
        y={roller.y}
        width={roller.w}
        height={roller.h}
        rx={roller.r}
        fill={`url(#${rollerGradient})`}
      />
      <rect
        x={roller.x + 4}
        y={roller.y + 4}
        width={Math.max(2, roller.w - 8)}
        height={Math.max(2, roller.h - 8)}
        rx={Math.max(1, roller.r - 4)}
        fill="none"
        stroke="#ffffff"
        strokeOpacity={0.28}
      />
    </g>
  );

  const animated = motion.target === 'roller' ? drum : body;

  const animatedStyle = {
    animationDuration: duration,
    animationPlayState: playing ? 'running' : 'paused',
    '--roll-dx': `${motion.dx ?? 0}px`,
    '--roll-dy': `${motion.dy ?? 0}px`,
  } as CSSProperties;

  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-plum-100 bg-plum-50/70">
        <svg
          viewBox="0 0 320 170"
          className="h-auto w-full"
          role="img"
          aria-label={`${label}的滾筒方向示範`}
        >
          <defs>
            <linearGradient id={bodyGradient} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f2e6f9" />
              <stop offset="100%" stopColor="#d3b8e8" />
            </linearGradient>
            <linearGradient id={rollerGradient} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5b3f72" />
              <stop offset="100%" stopColor="#2f1a3f" />
            </linearGradient>
          </defs>

          <line
            x1="24"
            y1="152"
            x2="296"
            y2="152"
            stroke="#cdb5e4"
            strokeWidth={1}
            strokeDasharray="6 8"
            opacity={0.8}
          />

          {motion.target === 'roller' ? body : drum}

          <g className="roll-sweep" style={animatedStyle}>
            {animated}
          </g>

          {isHorizontal ? (
            <g stroke="#9668be" strokeWidth={2} strokeLinecap="round" fill="none" opacity={0.75}>
              <line x1={118} y1={160} x2={206} y2={160} strokeDasharray="3 6" />
              <path d="M124 155 L118 160 L124 165" />
              <path d="M200 155 L206 160 L200 165" />
            </g>
          ) : (
            <g stroke="#9668be" strokeWidth={2} strokeLinecap="round" fill="none" opacity={0.75}>
              <line x1={48} y1={62} x2={48} y2={120} strokeDasharray="3 6" />
              <path d="M43 68 L48 62 L53 68" />
              <path d="M43 114 L48 120 L53 114" />
            </g>
          )}
        </svg>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setPlaying((value) => !value)}
          aria-pressed={!playing}
          className="inline-flex min-h-12 items-center gap-1.5 rounded-2xl border border-plum-200 bg-white px-3 text-[13px] font-black text-plum-900 transition hover:bg-plum-50"
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {playing ? '暫停' : '播放'}
        </button>
        <button
          type="button"
          onClick={() => setSlow((value) => !value)}
          aria-pressed={slow}
          className="inline-flex min-h-12 items-center rounded-2xl border border-plum-200 bg-white px-3 text-[13px] font-black text-plum-900 transition hover:bg-plum-50"
        >
          {slow ? '正常速度' : '慢速'}
        </button>
        <span className="text-[13px] text-slate-500">箭頭是滾動方向</span>
      </div>
    </div>
  );
}
