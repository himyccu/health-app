/**
 * 站姿示意圖（側面，右打者）。
 *
 * 左邊是「彎腰」：動作發生在腰椎，背部拱起。
 * 右邊是「髖屈」：骨盆往後推、背部維持一直線、膝微彎。
 * 標記 1–3 只放在右邊（正確）的圖上，對應卡片下方的說明。
 */
export function SetupDiagram() {
  return (
    <svg
      viewBox="0 0 320 172"
      role="img"
      aria-label="側面站姿比較：左邊彎腰拱背，右邊髖往後、背部一直線、膝微彎"
      className="h-auto w-full"
    >
      {/* 地面 */}
      <line
        x1={8}
        y1={154}
        x2={312}
        y2={154}
        className="stroke-slate-200"
        strokeWidth={2}
        strokeDasharray="4 4"
        strokeLinecap="round"
      />

      {/* 左：彎腰（錯誤示範） */}
      <g
        fill="none"
        className="stroke-rose-300"
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="70,152 72,116 78,94" />
        <polyline points="98,152 94,116 78,94" />
        <path d="M78 94 Q94 81 108 77" />
        <line x1={108} y1={77} x2={114} y2={106} />
        <line x1={114} y1={106} x2={128} y2={148} />
        <circle cx={118} cy={75} r={8} className="fill-white" />
      </g>
      <circle cx={134} cy={150} r={5} className="fill-white stroke-rose-400" strokeWidth={2.5} />

      {/* 右：髖屈（正確） */}
      <g
        fill="none"
        className="stroke-plum-700"
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="204,152 206,118 214,92" />
        <polyline points="234,152 234,118 214,92" />
        <line x1={214} y1={92} x2={246} y2={64} />
        <line x1={246} y1={64} x2={252} y2={96} />
        <line x1={252} y1={96} x2={268} y2={148} />
        <circle cx={256} cy={57} r={8} className="fill-white" />
      </g>
      <circle cx={274} cy={150} r={5} className="fill-white stroke-plum-700" strokeWidth={2.5} />

      {/* 耳、肩、膝、腳掌中段的參考線 */}
      <line
        x1={250}
        y1={63}
        x2={232}
        y2={152}
        className="stroke-plum-300"
        strokeWidth={2}
        strokeDasharray="3 5"
        strokeLinecap="round"
      />

      {/* 髖往後的箭頭 */}
      <g className="stroke-plum-400" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
        <line x1={211} y1={99} x2={192} y2={99} />
        <polyline points="199,93 192,99 199,105" fill="none" />
      </g>

      {/* 標記 1：髖往後推 */}
      <g>
        <circle cx={176} cy={99} r={11} className="fill-white stroke-plum-700" strokeWidth={2} />
        <text x={176} y={105} textAnchor="middle" className="fill-plum-800 text-[15px] font-black">
          1
        </text>
      </g>

      {/* 標記 2：膝微彎 */}
      <g>
        <circle cx={212} cy={128} r={11} className="fill-white stroke-plum-700" strokeWidth={2} />
        <text x={212} y={134} textAnchor="middle" className="fill-plum-800 text-[15px] font-black">
          2
        </text>
      </g>

      {/* 標記 3：一直線 */}
      <g>
        <circle cx={276} cy={92} r={11} className="fill-white stroke-plum-700" strokeWidth={2} />
        <text x={276} y={98} textAnchor="middle" className="fill-plum-800 text-[15px] font-black">
          3
        </text>
      </g>
    </svg>
  );
}
