/**
 * 揮桿四段位置圖：起桿、頂點、擊球、收桿（側面，右打者）。
 *
 * 四張小圖只畫身體與球桿的位置，不畫揮桿軌跡；
 * 每一張的差別在肩膀位置、雙手高度與球桿角度。
 */

interface Pose {
  shoulder: [number, number];
  elbow: [number, number];
  head: [number, number];
  hands: [number, number];
  clubHead: [number, number];
  heelUp: boolean;
}

const POSES: Pose[] = [
  {
    // 起桿：球桿沿目標線後移，重心大致不變
    shoulder: [76, 43],
    elbow: [85, 51],
    head: [89, 33],
    hands: [93, 60],
    clubHead: [57, 84],
    heelUp: false,
  },
  {
    // 頂點：雙手到右肩上方，球桿在身後
    shoulder: [74, 41],
    elbow: [78, 33],
    head: [87, 31],
    hands: [80, 24],
    clubHead: [42, 8],
    heelUp: false,
  },
  {
    // 擊球：重心到前腳，手超過球、桿頭在球上
    shoulder: [82, 44],
    elbow: [90, 52],
    head: [95, 34],
    hands: [97, 59],
    clubHead: [98, 96],
    heelUp: true,
  },
  {
    // 收桿：重心完全在前腳，球桿繞到左肩後方
    shoulder: [86, 46],
    elbow: [84, 40],
    head: [99, 38],
    hands: [81, 32],
    clubHead: [43, 14],
    heelUp: true,
  },
];

function Frame({ pose, index }: { pose: Pose; index: number }) {
  const [sx, sy] = pose.shoulder;
  const [hx, hy] = pose.head;

  return (
    <svg viewBox="0 0 150 110" role="img" aria-label={`揮桿第 ${index + 1} 段`} className="h-auto w-full">
      {/* 地面 */}
      <line
        x1={6}
        y1={96}
        x2={144}
        y2={96}
        className="stroke-slate-200"
        strokeWidth={2}
        strokeDasharray="4 4"
        strokeLinecap="round"
      />

      <g
        fill="none"
        className="stroke-plum-700"
        strokeWidth={3.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* 後腳 */}
        {pose.heelUp ? <polyline points="52,96 52,90 60,88" /> : <polyline points="52,96 60,90" />}
        {/* 前腳 */}
        <polyline points="86,96 78,90" />
        {/* 腿 */}
        <polyline points="60,90 68,64" />
        <polyline points="78,90 68,64" />
        {/* 軀幹 */}
        <polyline points={`68,64 ${sx},${sy}`} />
        {/* 手臂：肩 → 肘 → 手 */}
        <polyline points={`${sx},${sy} ${pose.elbow[0]},${pose.elbow[1]} ${pose.hands[0]},${pose.hands[1]}`} />
        {/* 球桿 */}
        <line
          x1={pose.hands[0]}
          y1={pose.hands[1]}
          x2={pose.clubHead[0]}
          y2={pose.clubHead[1]}
          strokeWidth={2.4}
        />
        {/* 頭 */}
        <circle cx={hx} cy={hy} r={6.5} className="fill-white" />
      </g>

      {/* 球 */}
      <circle cx={98} cy={96} r={3.4} className="fill-white stroke-plum-700" strokeWidth={2} />
    </svg>
  );
}

const LABELS = ['1 起桿', '2 頂點', '3 擊球', '4 收桿'];

export function SwingSequence() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {POSES.map((pose, index) => (
        <figure key={LABELS[index]} className="min-w-0 rounded-2xl border border-plum-100 bg-white p-2">
          <Frame pose={pose} index={index} />
          <figcaption className="mt-0.5 text-center text-[13px] font-black text-plum-800">
            {LABELS[index]}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
