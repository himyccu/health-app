/**
 * 正手動力鏈（側面，右手持拍）。
 *
 * 由下往上五個位置：踩地、髖、軀幹、肩、拍頭。
 * 箭頭由腳往拍頭方向，表示力量傳遞的順序；不是說五個部位同時用力。
 */
export function ForehandChain() {
  return (
    <svg
      viewBox="0 0 320 200"
      role="img"
      aria-label="正手動力鏈：踩地、髖、軀幹、肩、拍頭，力量由下往上"
      className="h-auto w-full"
    >
      {/* 地面 */}
      <line
        x1={12}
        y1={170}
        x2={300}
        y2={170}
        className="stroke-slate-200"
        strokeWidth={2}
        strokeDasharray="4 4"
        strokeLinecap="round"
      />

      {/* 身體 */}
      <g
        fill="none"
        className="stroke-plum-700"
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* 後腳 */}
        <polyline points="86,170 96,140" />
        {/* 前腳（踩地） */}
        <polyline points="130,170 116,140" />
        {/* 腿 */}
        <polyline points="96,140 112,110" />
        <polyline points="116,140 112,110" />
        {/* 軀幹：略前傾 */}
        <polyline points="112,110 128,78" />
        {/* 肩到肘、肘到手腕 */}
        <polyline points="128,78 156,92 168,116" />
        {/* 頭 */}
        <circle cx={136} cy={68} r={8} className="fill-white" />
      </g>

      {/* 球拍：由手腕往左前下方延伸到球 */}
      <line
        x1={168}
        y1={116}
        x2={132}
        y2={148}
        className="stroke-plum-700"
        strokeWidth={3.4}
        strokeLinecap="round"
      />
      <ellipse
        cx={126}
        cy={152}
        rx={7}
        ry={10}
        transform="rotate(-38 126 152)"
        className="fill-white stroke-plum-700"
        strokeWidth={2.6}
      />

      {/* 球 */}
      <circle cx={112} cy={170} r={4} className="fill-amber-300 stroke-amber-500" strokeWidth={2} />

      {/* 力量傳遞的弧線 */}
      <g className="stroke-plum-300" strokeWidth={2.2} fill="none" strokeLinecap="round">
        <path d="M96 158 C 74 148 74 128 92 120" strokeDasharray="4 5" />
        <path d="M100 118 C 92 100 98 88 112 82" strokeDasharray="4 5" />
        <path d="M124 74 C 140 66 158 76 162 90" strokeDasharray="4 5" />
      </g>

      {/* 標記 1：踩地 */}
      <g>
        <circle cx={72} cy={170} r={11} className="fill-white stroke-plum-700" strokeWidth={2} />
        <text x={72} y={176} textAnchor="middle" className="fill-plum-800 text-[15px] font-black">
          1
        </text>
      </g>

      {/* 標記 2：髖 */}
      <g>
        <circle cx={74} cy={112} r={11} className="fill-white stroke-plum-700" strokeWidth={2} />
        <text x={74} y={118} textAnchor="middle" className="fill-plum-800 text-[15px] font-black">
          2
        </text>
      </g>

      {/* 標記 3：軀幹 */}
      <g>
        <circle cx={170} cy={66} r={11} className="fill-white stroke-plum-700" strokeWidth={2} />
        <text x={170} y={72} textAnchor="middle" className="fill-plum-800 text-[15px] font-black">
          3
        </text>
      </g>

      {/* 標記 4：肩 */}
      <g>
        <circle cx={196} cy={96} r={11} className="fill-white stroke-plum-700" strokeWidth={2} />
        <text x={196} y={102} textAnchor="middle" className="fill-plum-800 text-[15px] font-black">
          4
        </text>
      </g>

      {/* 標記 5：拍頭 */}
      <g>
        <circle cx={82} cy={134} r={11} className="fill-white stroke-plum-700" strokeWidth={2} />
        <text x={82} y={140} textAnchor="middle" className="fill-plum-800 text-[15px] font-black">
          5
        </text>
      </g>
    </svg>
  );
}
