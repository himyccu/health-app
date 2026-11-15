/**
 * 準備姿勢比較（側面）。
 *
 * 左：站直、球拍垂在身側，起步慢。
 * 右：膝微彎、重心在前腳掌、球拍舉在身前，落地就能移動。
 * 標記 1–3 只放在右邊（正確）的圖上。
 */
export function SplitStep() {
  return (
    <svg
      viewBox="0 0 320 160"
      role="img"
      aria-label="準備姿勢比較：左邊站直、球拍垂下；右邊膝微彎、球拍舉在身前"
      className="h-auto w-full"
    >
      {/* 地面 */}
      <line
        x1={8}
        y1={134}
        x2={312}
        y2={134}
        className="stroke-slate-200"
        strokeWidth={2}
        strokeDasharray="4 4"
        strokeLinecap="round"
      />

      {/* 左：站直（錯誤示範） */}
      <g
        fill="none"
        className="stroke-slate-400"
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1={62} y1={134} x2={62} y2={96} />
        <line x1={78} y1={134} x2={78} y2={96} />
        <line x1={62} y1={96} x2={62} y2={56} />
        <line x1={62} y1={66} x2={74} y2={96} />
        <line x1={74} y1={96} x2={82} y2={122} />
        <circle cx={62} cy={48} r={8} className="fill-white" />
      </g>
      {/* 垂下來的球拍 */}
      <ellipse
        cx={86}
        cy={126}
        rx={6}
        ry={9}
        className="fill-white stroke-slate-400"
        strokeWidth={2.5}
      />

      {/* 右：準備姿勢（正確） */}
      <g
        fill="none"
        className="stroke-plum-700"
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1={196} y1={134} x2={210} y2={104} />
        <line x1={218} y1={134} x2={210} y2={104} />
        <line x1={210} y1={104} x2={212} y2={64} />
        {/* 手臂往前，球拍在身前 */}
        <polyline points="212,70 228,80 232,62" />
        <circle cx={214} cy={56} r={8} className="fill-white" />
      </g>
      {/* 球拍 */}
      <ellipse
        cx={234}
        cy={50}
        rx={6}
        ry={9}
        className="fill-white stroke-plum-700"
        strokeWidth={2.5}
      />

      {/* 落地與啟動箭頭 */}
      <g className="stroke-plum-400" strokeWidth={2.2} strokeLinecap="round" fill="none">
        <line x1={240} y1={134} x2={264} y2={134} />
        <polyline points="258,129 264,134 258,139" />
      </g>

      {/* 標記 1：膝微彎 */}
      <g>
        <circle cx={176} cy={116} r={11} className="fill-white stroke-plum-700" strokeWidth={2} />
        <text x={176} y={122} textAnchor="middle" className="fill-plum-800 text-[15px] font-black">
          1
        </text>
      </g>

      {/* 標記 2：球拍在身前 */}
      <g>
        <circle cx={262} cy={54} r={11} className="fill-white stroke-plum-700" strokeWidth={2} />
        <text x={262} y={60} textAnchor="middle" className="fill-plum-800 text-[15px] font-black">
          2
        </text>
      </g>

      {/* 標記 3：落地後第一步 */}
      <g>
        <circle cx={284} cy={147} r={11} className="fill-white stroke-plum-700" strokeWidth={2} />
        <text x={284} y={153} textAnchor="middle" className="fill-plum-800 text-[15px] font-black">
          3
        </text>
      </g>
    </svg>
  );
}
