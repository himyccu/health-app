/**
 * 球拍構造圖：拍頭、拍面、拍喉、握把。
 *
 * 標記 1–4 對應卡片下方的圖例；圖上只放數字，說明文字留在畫面。
 */
export function RacketDiagram() {
  return (
    <svg
      viewBox="0 0 320 196"
      role="img"
      aria-label="球拍構造：拍頭、拍面、拍喉、握把"
      className="h-auto w-full"
    >
      {/* 拍頭 */}
      <ellipse
        cx={160}
        cy={62}
        rx={44}
        ry={52}
        className="fill-plum-50 stroke-plum-700"
        strokeWidth={3}
      />

      {/* 拍面：直線與橫線 */}
      <g className="stroke-plum-300" strokeWidth={1.4} opacity={0.9}>
        {[140, 152, 164, 176, 188].map((x) => (
          <line key={`v-${x}`} x1={x} y1={16} x2={x} y2={108} />
        ))}
        {[30, 48, 66, 84, 100].map((y) => (
          <line key={`h-${y}`} x1={120} y1={y} x2={200} y2={y} />
        ))}
      </g>

      {/* 拍喉 */}
      <g className="stroke-plum-700" strokeWidth={3} strokeLinecap="round" fill="none">
        <line x1={134} y1={104} x2={152} y2={130} />
        <line x1={186} y1={104} x2={168} y2={130} />
      </g>

      {/* 握把 */}
      <rect
        x={153}
        y={128}
        width={14}
        height={54}
        rx={6}
        className="fill-plum-200 stroke-plum-700"
        strokeWidth={3}
      />
      {/* 握把底 */}
      <rect
        x={149}
        y={180}
        width={22}
        height={7}
        rx={3.5}
        className="fill-plum-700"
      />

      {/* 標記 1：拍頭 */}
      <g>
        <line x1={104} y1={30} x2={128} y2={38} className="stroke-plum-300" strokeWidth={2} />
        <circle cx={95} cy={28} r={11} className="fill-white stroke-plum-700" strokeWidth={2} />
        <text x={95} y={34} textAnchor="middle" className="fill-plum-800 text-[15px] font-black">
          1
        </text>
      </g>

      {/* 標記 2：拍面 */}
      <g>
        <line x1={218} y1={62} x2={200} y2={62} className="stroke-plum-300" strokeWidth={2} />
        <circle cx={228} cy={62} r={11} className="fill-white stroke-plum-700" strokeWidth={2} />
        <text x={228} y={68} textAnchor="middle" className="fill-plum-800 text-[15px] font-black">
          2
        </text>
      </g>

      {/* 標記 3：拍喉 */}
      <g>
        <line x1={222} y1={124} x2={172} y2={126} className="stroke-plum-300" strokeWidth={2} />
        <circle cx={232} cy={124} r={11} className="fill-white stroke-plum-700" strokeWidth={2} />
        <text x={232} y={130} textAnchor="middle" className="fill-plum-800 text-[15px] font-black">
          3
        </text>
      </g>

      {/* 標記 4：握把 */}
      <g>
        <line x1={112} y1={152} x2={150} y2={152} className="stroke-plum-300" strokeWidth={2} />
        <circle cx={102} cy={152} r={11} className="fill-white stroke-plum-700" strokeWidth={2} />
        <text x={102} y={158} textAnchor="middle" className="fill-plum-800 text-[15px] font-black">
          4
        </text>
      </g>
    </svg>
  );
}
