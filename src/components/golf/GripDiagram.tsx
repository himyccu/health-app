/**
 * 握桿示意圖（由上往下看）。
 *
 * 畫的是「握把在左手的位置」與「右手掌根壓住左拇指」兩件事，
 * 圓形數字對應卡片下方的白話說明，圖上不放長文字以免縮小後看不清。
 */
export function GripDiagram() {
  return (
    <svg
      viewBox="0 0 320 160"
      role="img"
      aria-label="握桿示意圖：握把斜放於左手掌邊緣，右手掌根壓住左拇指"
      className="h-auto w-full"
    >
      {/* 握把 */}
      <line
        x1={70}
        y1={118}
        x2={262}
        y2={62}
        className="stroke-plum-200"
        strokeWidth={18}
        strokeLinecap="round"
      />
      {/* 握把尾端 */}
      <circle cx={70} cy={118} r={10} className="fill-plum-100 stroke-plum-300" strokeWidth={2} />
      {/* 桿身 */}
      <line x1={262} y1={62} x2={302} y2={50} className="stroke-slate-300" strokeWidth={4} strokeLinecap="round" />

      {/* 左手掌 */}
      <g className="stroke-plum-700" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx={78} cy={130} rx={24} ry={17} transform="rotate(-16 78 130)" fill="white" />
        {/* 左手三指包覆握把 */}
        <line x1={88} y1={97} x2={97} y2={126} />
        <line x1={106} y1={92} x2={114} y2={121} />
        <line x1={123} y1={87} x2={132} y2={116} />
        {/* 左拇指 */}
        <line x1={140} y1={112} x2={152} y2={120} />
      </g>

      {/* 右手掌 */}
      <g className="stroke-plum-700" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx={240} cy={54} rx={25} ry={17} transform="rotate(-16 240 54)" fill="white" />
        {/* 右手四指包覆握把 */}
        <line x1={171} y1={82} x2={179} y2={111} />
        <line x1={188} y1={77} x2={196} y2={106} />
        <line x1={205} y1={72} x2={213} y2={101} />
        <line x1={222} y1={67} x2={230} y2={96} />
      </g>

      {/* 標記 1：握把斜放於手掌邊緣 */}
      <g>
        <circle cx={70} cy={140} r={11} className="fill-white stroke-plum-700" strokeWidth={2} />
        <text x={70} y={146} textAnchor="middle" className="fill-plum-800 text-[15px] font-black">
          1
        </text>
      </g>

      {/* 標記 2：左拇指略偏右側 */}
      <g>
        <circle cx={158} cy={130} r={11} className="fill-white stroke-plum-700" strokeWidth={2} />
        <text x={158} y={136} textAnchor="middle" className="fill-plum-800 text-[15px] font-black">
          2
        </text>
      </g>

      {/* 標記 3：右手掌根壓住左拇指 */}
      <g>
        <circle cx={244} cy={78} r={11} className="fill-white stroke-plum-700" strokeWidth={2} />
        <text x={244} y={84} textAnchor="middle" className="fill-plum-800 text-[15px] font-black">
          3
        </text>
      </g>
    </svg>
  );
}
