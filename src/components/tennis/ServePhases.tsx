/**
 * 發球八階段時間軸。
 *
 * 三個時期用底色標示，八個階段用編號圓點表示先後；
 * 每個階段的名稱寫在卡片下方的圖例，圖上只放數字。
 */

const PHASES = [
  { label: '準備期', from: 20, to: 122, tone: 'fill-plum-100' },
  { label: '加速期', from: 122, to: 224, tone: 'fill-amber-100' },
  { label: '隨揮期', from: 224, to: 300, tone: 'fill-emerald-100' },
];

const STAGE_X = [36, 72, 108, 144, 180, 216, 252, 288];

export function ServePhases() {
  return (
    <svg
      viewBox="0 0 320 128"
      role="img"
      aria-label="發球八階段時間軸：準備期一到三、加速期四到六、隨揮期七到八"
      className="h-auto w-full"
    >
      {/* 時期底色 */}
      {PHASES.map((phase) => (
        <g key={phase.label}>
          <rect
            x={phase.from}
            y={26}
            width={phase.to - phase.from}
            height={22}
            rx={7}
            className={phase.tone}
          />
          <text
            x={(phase.from + phase.to) / 2}
            y={42}
            textAnchor="middle"
            className="fill-slate-700 text-[13px] font-black"
          >
            {phase.label}
          </text>
        </g>
      ))}

      {/* 時間軸 */}
      <line
        x1={24}
        y1={80}
        x2={300}
        y2={80}
        className="stroke-plum-200"
        strokeWidth={3}
        strokeLinecap="round"
      />

      {/* 八個階段 */}
      {STAGE_X.map((x, index) => (
        <g key={x}>
          <circle cx={x} cy={80} r={11} className="fill-white stroke-plum-700" strokeWidth={2.4} />
          <text
            x={x}
            y={86}
            textAnchor="middle"
            className="fill-plum-800 text-[15px] font-black"
          >
            {index + 1}
          </text>
        </g>
      ))}

      {/* 方向 */}
      <g className="stroke-plum-400" strokeWidth={2.2} strokeLinecap="round" fill="none">
        <line x1={24} y1={108} x2={296} y2={108} strokeDasharray="4 6" />
        <polyline points="290,103 296,108 290,113" />
      </g>
    </svg>
  );
}
