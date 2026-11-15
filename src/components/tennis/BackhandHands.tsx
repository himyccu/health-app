/**
 * 反手握法（由上往下看握把）。
 *
 * 左：雙手反手，兩手上下相鄰，非慣用手在上。
 * 右：單手反手，只有持拍手，手臂延伸角度更大。
 */

function Handle() {
  return (
    <>
      <rect x={92} y={26} width={20} height={70} rx={6} className="fill-plum-200 stroke-plum-500" strokeWidth={2.5} />
      <rect x={88} y={92} width={28} height={6} rx={3} className="fill-plum-500" />
    </>
  );
}

export function BackhandHands() {
  return (
    <div className="grid grid-cols-1 gap-2 min-[380px]:grid-cols-2">
      <figure className="min-w-0 rounded-2xl border border-plum-100 bg-white p-2.5">
        <svg
          viewBox="0 0 150 120"
          role="img"
          aria-label="雙手反手：兩手上下相鄰握在握把上"
          className="h-auto w-full"
        >
          <Handle />
          {/* 非慣用手（左手）在上 */}
          <ellipse cx={102} cy={44} rx={15} ry={11} className="fill-white stroke-plum-700" strokeWidth={2.6} />
          <line x1={92} y1={38} x2={80} y2={26} className="stroke-plum-700" strokeWidth={2.6} strokeLinecap="round" />
          {/* 持拍手（右手）在下 */}
          <ellipse cx={102} cy={68} rx={15} ry={11} className="fill-white stroke-plum-700" strokeWidth={2.6} />
          <line x1={92} y1={74} x2={78} y2={86} className="stroke-plum-700" strokeWidth={2.6} strokeLinecap="round" />
          {/* 前臂 */}
          <g className="stroke-plum-300" strokeWidth={6} strokeLinecap="round">
            <line x1={72} y1={24} x2={44} y2={8} />
            <line x1={70} y1={86} x2={38} y2={104} />
          </g>
        </svg>
        <figcaption className="mt-1 text-center text-[13px] font-black text-plum-800">雙手反手</figcaption>
      </figure>

      <figure className="min-w-0 rounded-2xl border border-plum-100 bg-white p-2.5">
        <svg
          viewBox="0 0 150 120"
          role="img"
          aria-label="單手反手：只有持拍手握在握把上"
          className="h-auto w-full"
        >
          <Handle />
          <ellipse cx={102} cy={58} rx={15} ry={12} className="fill-white stroke-plum-700" strokeWidth={2.6} />
          <line x1={92} y1={52} x2={80} y2={40} className="stroke-plum-700" strokeWidth={2.6} strokeLinecap="round" />
          <g className="stroke-plum-300" strokeWidth={7} strokeLinecap="round">
            <line x1={70} y1={36} x2={34} y2={14} />
          </g>
        </svg>
        <figcaption className="mt-1 text-center text-[13px] font-black text-plum-800">單手反手</figcaption>
      </figure>
    </div>
  );
}
