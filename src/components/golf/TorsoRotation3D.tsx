/**
 * 「三層樓」示意圖：上桿時身體的三個層級各自轉多少。
 *
 * 由下往上是骨盆、腰椎、胸廓。腰椎能轉的角度最小，主要旋轉來自髖與胸椎。
 * 圖上只用數字標記，說明文字放在卡片下方的圖例，避免縮小後看不清。
 */
export function TorsoRotation3D() {
  return (
    <svg
      viewBox="0 0 320 178"
      role="img"
      aria-label="三層樓示意圖：骨盆與胸廓轉得較多，腰椎只能轉一點"
      className="h-auto w-full"
    >
      {/* 身體中軸 */}
      <line
        x1={152}
        y1={26}
        x2={152}
        y2={72}
        className="stroke-plum-300"
        strokeWidth={2}
        strokeDasharray="4 5"
        strokeLinecap="round"
      />
      <line
        x1={152}
        y1={104}
        x2={152}
        y2={112}
        className="stroke-plum-300"
        strokeWidth={2}
        strokeDasharray="4 5"
        strokeLinecap="round"
      />

      {/* 胸廓（上層，轉最多） */}
      <g transform="rotate(-16 160 50)">
        <ellipse cx={160} cy={50} rx={62} ry={21} className="fill-plum-200/80 stroke-plum-500" strokeWidth={3} />
        <line
          x1={98}
          y1={50}
          x2={222}
          y2={50}
          className="stroke-plum-500"
          strokeWidth={3}
          strokeLinecap="round"
        />
      </g>

      {/* 腰椎（中層，幾乎不轉） */}
      <g transform="rotate(-4 160 92)">
        <rect
          x={128}
          y={80}
          width={64}
          height={24}
          rx={10}
          className="fill-plum-100 stroke-plum-400"
          strokeWidth={3}
        />
      </g>

      {/* 骨盆（下層，轉一點、方向相反） */}
      <g transform="rotate(12 160 130)">
        <ellipse cx={160} cy={130} rx={50} ry={19} className="fill-plum-200/80 stroke-plum-500" strokeWidth={3} />
        <line
          x1={110}
          y1={130}
          x2={210}
          y2={130}
          className="stroke-plum-500"
          strokeWidth={3}
          strokeLinecap="round"
        />
      </g>

      {/* 旋轉方向箭頭：胸廓 */}
      <g
        className="stroke-plum-600"
        strokeWidth={2.4}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M214 30 A54 54 0 0 1 236 52" />
        <polyline points="229,50 237,53 235,45" />
      </g>

      {/* 旋轉方向箭頭：骨盆（相反方向） */}
      <g
        className="stroke-plum-400"
        strokeWidth={2.4}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M104 152 A48 48 0 0 1 84 132" />
        <polyline points="85,141 83,132 92,134" />
      </g>

      {/* 標記 1：胸廓 */}
      <g>
        <circle cx={276} cy={44} r={11} className="fill-white stroke-plum-700" strokeWidth={2} />
        <text x={276} y={50} textAnchor="middle" className="fill-plum-800 text-[15px] font-black">
          1
        </text>
      </g>

      {/* 標記 2：腰椎 */}
      <g>
        <circle cx={244} cy={92} r={11} className="fill-white stroke-plum-700" strokeWidth={2} />
        <text x={244} y={98} textAnchor="middle" className="fill-plum-800 text-[15px] font-black">
          2
        </text>
      </g>

      {/* 標記 3：骨盆 */}
      <g>
        <circle cx={48} cy={150} r={11} className="fill-white stroke-plum-700" strokeWidth={2} />
        <text x={48} y={156} textAnchor="middle" className="fill-plum-800 text-[15px] font-black">
          3
        </text>
      </g>
    </svg>
  );
}
