/**
 * 肩關節內外轉（由上往下看）。
 *
 * 手肘固定在 90 度、上臂貼著身體側面；前臂往外轉是外轉，往內轉是內轉。
 * 兩張小圖並排，角度只是示意，不是標準值。
 */

function Torso() {
  return (
    <>
      {/* 軀幹 */}
      <rect x={18} y={30} width={34} height={58} rx={12} className="fill-plum-100 stroke-plum-300" strokeWidth={2.5} />
      <circle cx={35} cy={22} r={9} className="fill-white stroke-plum-500" strokeWidth={2.5} />
    </>
  );
}

export function ShoulderRotation() {
  return (
    <div className="grid grid-cols-1 gap-2 min-[380px]:grid-cols-2">
      <figure className="min-w-0 rounded-2xl border border-plum-100 bg-white p-2.5">
        <svg
          viewBox="0 0 150 120"
          role="img"
          aria-label="肩外轉：手肘彎九十度，前臂往外轉"
          className="h-auto w-full"
        >
          <Torso />
          {/* 上臂 */}
          <line x1={52} y1={58} x2={86} y2={62} className="stroke-plum-700" strokeWidth={8} strokeLinecap="round" />
          {/* 前臂往外（往右上） */}
          <line x1={86} y1={62} x2={104} y2={26} className="stroke-plum-500" strokeWidth={7} strokeLinecap="round" />
          <circle cx={106} cy={22} r={7} className="fill-white stroke-plum-700" strokeWidth={2.5} />
          {/* 旋轉弧線 */}
          <g className="stroke-plum-400" strokeWidth={2} fill="none" strokeLinecap="round">
            <path d="M96 38 A26 26 0 0 0 74 34" />
            <polyline points="80,29 73,34 81,38" />
          </g>
        </svg>
        <figcaption className="mt-1 text-center text-[13px] font-black text-plum-800">外轉</figcaption>
      </figure>

      <figure className="min-w-0 rounded-2xl border border-plum-100 bg-white p-2.5">
        <svg
          viewBox="0 0 150 120"
          role="img"
          aria-label="肩內轉：手肘彎九十度，前臂往內、往腹部轉"
          className="h-auto w-full"
        >
          <Torso />
          <line x1={52} y1={58} x2={86} y2={62} className="stroke-plum-700" strokeWidth={8} strokeLinecap="round" />
          {/* 前臂往內（往左下、腹部方向） */}
          <line x1={86} y1={62} x2={62} y2={92} className="stroke-plum-500" strokeWidth={7} strokeLinecap="round" />
          <circle cx={58} cy={96} r={7} className="fill-white stroke-plum-700" strokeWidth={2.5} />
          <g className="stroke-plum-400" strokeWidth={2} fill="none" strokeLinecap="round">
            <path d="M74 82 A26 26 0 0 0 96 86" />
            <polyline points="90,91 97,86 89,82" />
          </g>
        </svg>
        <figcaption className="mt-1 text-center text-[13px] font-black text-plum-800">內轉</figcaption>
      </figure>
    </div>
  );
}
