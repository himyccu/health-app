/**
 * 前臂旋轉示意圖：旋後（supination）與旋前（pronation）。
 *
 * 左邊是前臂的兩根骨頭（橈骨、尺骨）平行，掌心轉向上；
 * 右邊是兩根骨頭交叉，掌心轉向下。
 * 說明文字放在卡片下方的圖例，圖上不放小字。
 */

function Forearm({ crossed }: { crossed: boolean }) {
  return (
    <>
      {/* 前臂外框 */}
      <rect
        x={36}
        y={50}
        width={82}
        height={26}
        rx={13}
        className="fill-plum-100 stroke-plum-400"
        strokeWidth={2.5}
      />

      {/* 橈骨與尺骨 */}
      {crossed ? (
        <>
          <line x1={48} y1={56} x2={108} y2={70} className="stroke-plum-500" strokeWidth={2.5} strokeLinecap="round" />
          <line x1={48} y1={70} x2={108} y2={56} className="stroke-plum-300" strokeWidth={2.5} strokeLinecap="round" />
        </>
      ) : (
        <>
          <line x1={48} y1={58} x2={108} y2={58} className="stroke-plum-500" strokeWidth={2.5} strokeLinecap="round" />
          <line x1={48} y1={68} x2={108} y2={68} className="stroke-plum-300" strokeWidth={2.5} strokeLinecap="round" />
        </>
      )}

      {/* 手掌與拇指 */}
      <ellipse cx={126} cy={63} rx={14} ry={11} className="fill-white stroke-plum-700" strokeWidth={2.5} />
      <line x1={122} y1={54} x2={116} y2={44} className="stroke-plum-700" strokeWidth={2.5} strokeLinecap="round" />
    </>
  );
}

export function ForearmRotation() {
  return (
    <div className="grid grid-cols-1 gap-2 min-[380px]:grid-cols-2">
      <figure className="min-w-0 rounded-2xl border border-plum-100 bg-white p-2.5">
        <svg
          viewBox="0 0 150 110"
          role="img"
          aria-label="前臂旋後：手掌轉向上，橈骨與尺骨平行"
          className="h-auto w-full"
        >
          <Forearm crossed={false} />
          {/* 旋轉方向 */}
          <g className="stroke-plum-500" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M64 32 A24 24 0 0 1 96 32" />
            <polyline points="88,30 97,33 92,25" />
          </g>
        </svg>
        <figcaption className="mt-1 text-center text-[13px] font-black text-plum-800">
          旋後（掌心向上）
        </figcaption>
      </figure>

      <figure className="min-w-0 rounded-2xl border border-plum-100 bg-white p-2.5">
        <svg
          viewBox="0 0 150 110"
          role="img"
          aria-label="前臂旋前：手掌轉向下，橈骨與尺骨交叉"
          className="h-auto w-full"
        >
          <Forearm crossed />
          <g className="stroke-plum-500" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M96 32 A24 24 0 0 1 64 32" />
            <polyline points="72,30 63,33 68,25" />
          </g>
        </svg>
        <figcaption className="mt-1 text-center text-[13px] font-black text-plum-800">
          旋前（掌心向下）
        </figcaption>
      </figure>
    </div>
  );
}
