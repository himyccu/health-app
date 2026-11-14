/**
 * 瞄準示意圖（由上往下看，右打者）。
 *
 * 目標線在左側：球與目標連成一條線。右側的腳線、髖線、肩線都與目標線平行。
 * 標記 1：目標。標記 2：球與目標之間的中間點。標記 3：球與桿面。
 */
export function AimDiagram() {
  return (
    <svg
      viewBox="0 0 320 192"
      role="img"
      aria-label="瞄準示意圖：由上往下看，右打者的腳線、髖線、肩線都與球到目標的連線平行"
      className="h-auto w-full"
    >
      {/* 目標線 */}
      <line
        x1={96}
        y1={176}
        x2={96}
        y2={34}
        className="stroke-plum-200"
        strokeWidth={2.5}
        strokeDasharray="6 6"
      />

      {/* 旗 */}
      <line x1={96} y1={34} x2={96} y2={22} className="stroke-plum-500" strokeWidth={3} />
      <path d="M96 22 L116 27 L96 32 Z" className="fill-plum-500" />

      {/* 中間點 */}
      <circle cx={96} cy={104} r={5} className="fill-amber-400" />

      {/* 球與桿面 */}
      <rect x={84} y={157} width={24} height={6} rx={3} className="fill-plum-700" />
      <circle cx={96} cy={150} r={7} className="fill-white stroke-plum-700" strokeWidth={3} />

      {/* 腳線與雙腳 */}
      <line
        x1={166}
        y1={108}
        x2={166}
        y2={180}
        className="stroke-plum-400"
        strokeWidth={2}
        strokeDasharray="3 5"
      />
      <rect
        x={151}
        y={122}
        width={30}
        height={11}
        rx={5.5}
        className="fill-white stroke-plum-700"
        strokeWidth={3}
      />
      <rect
        x={151}
        y={157}
        width={30}
        height={11}
        rx={5.5}
        className="fill-white stroke-plum-700"
        strokeWidth={3}
      />

      {/* 髖線 */}
      <rect x={191} y={116} width={10} height={50} rx={5} className="fill-plum-200" />

      {/* 肩線 */}
      <rect x={208} y={102} width={16} height={54} rx={8} className="fill-plum-700" />

      {/* 手臂與球桿 */}
      <polyline
        points="208,134 178,142 104,150"
        fill="none"
        className="stroke-plum-700"
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 頭頂 */}
      <circle cx={216} cy={129} r={8} className="fill-white stroke-plum-700" strokeWidth={3} />

      {/* 標記 1：目標 */}
      <g>
        <circle cx={62} cy={27} r={11} className="fill-white stroke-plum-700" strokeWidth={2} />
        <text x={62} y={33} textAnchor="middle" className="fill-plum-800 text-[15px] font-black">
          1
        </text>
      </g>

      {/* 標記 2：中間點 */}
      <g>
        <circle cx={62} cy={104} r={11} className="fill-white stroke-plum-700" strokeWidth={2} />
        <text x={62} y={110} textAnchor="middle" className="fill-plum-800 text-[15px] font-black">
          2
        </text>
      </g>

      {/* 標記 3：球位 */}
      <g>
        <circle cx={62} cy={170} r={11} className="fill-white stroke-plum-700" strokeWidth={2} />
        <text x={62} y={176} textAnchor="middle" className="fill-plum-800 text-[15px] font-black">
          3
        </text>
      </g>
    </svg>
  );
}
