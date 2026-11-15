/**
 * 四種正手握法：把握把想成八邊形，手掌的位置一格格往下方轉。
 *
 * 四張小圖只畫握把的橫切面與手掌接觸面（深色），
 * 名稱放在圖下方，避免縮小後看不清。
 */

interface Grip {
  name: string;
  note: string;
  /** 手掌接觸的面：0 右上、1 右、2 右下、3 下 */
  face: number;
}

const GRIPS: Grip[] = [
  { name: '大陸式', note: '手掌在側面', face: 0 },
  { name: '東方式', note: '手掌在後方', face: 1 },
  { name: '半西方式', note: '再往下一格', face: 2 },
  { name: '西方式', note: '手掌在下方', face: 3 },
];

/** 八邊形的八個邊，順時針排列（由右上方開始） */
const EDGES: Array<[number, number, number, number]> = [
  [20, 0, 50, 0], // 上
  [50, 0, 70, 20], // 右上
  [70, 20, 70, 50], // 右
  [70, 50, 50, 70], // 右下
  [50, 70, 20, 70], // 下
  [20, 70, 0, 50], // 左下
  [0, 50, 0, 20], // 左
  [0, 20, 20, 0], // 左上
];

/** 手掌接觸面對應的邊：右上、右、右下、下 */
const FACE_EDGE = [1, 2, 3, 4];

function GripFigure({ grip }: { grip: Grip }) {
  const [x1, y1, x2, y2] = EDGES[FACE_EDGE[grip.face]];

  return (
    <figure className="min-w-0 rounded-2xl border border-plum-100 bg-white p-2">
      <svg
        viewBox="0 0 70 70"
        role="img"
        aria-label={`${grip.name}：${grip.note}`}
        className="mx-auto h-auto w-full max-w-[86px]"
      >
        <polygon
          points="20,0 50,0 70,20 70,50 50,70 20,70 0,50 0,20"
          className="fill-plum-50 stroke-plum-400"
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          className="stroke-plum-700"
          strokeWidth={6}
          strokeLinecap="round"
        />
        {/* 虎口方向：由中心指向接觸面 */}
        <line
          x1={35}
          y1={35}
          x2={(x1 + x2) / 2}
          y2={(y1 + y2) / 2}
          className="stroke-plum-300"
          strokeWidth={2}
          strokeDasharray="3 3"
        />
      </svg>
      <figcaption className="mt-1 text-center text-[13px] font-black leading-5 text-plum-800">
        {grip.name}
        <span className="mt-0.5 block text-[13px] font-bold text-slate-500">{grip.note}</span>
      </figcaption>
    </figure>
  );
}

export function GripOctagon() {
  return (
    <div className="grid grid-cols-2 gap-2 min-[380px]:grid-cols-4">
      {GRIPS.map((grip) => (
        <GripFigure key={grip.name} grip={grip} />
      ))}
    </div>
  );
}
