/**
 * 五個基礎動作的完整教學。
 *
 * 每一篇都是同一個八段結構：
 * 1. 為什麼學（why）
 * 2. 肌肉圖（anatomy）
 * 3. 白話原理（principle）
 * 4. 步驟（technique.phases）
 * 5. 做對的感覺（feeling）
 * 6. 常見錯誤（errors）
 * 7. 劑量（dose）
 * 8. 下一步（nextStep）
 *
 * 撰寫原則：
 * 1. 術語第一次出現時，要說明「身體哪裡、怎麼做、感覺像什麼」。
 * 2. 數字要對得上 sources.ts 的文獻。
 * 3. 只寫事實、操作說明與安全警語，不寫口號。
 */

import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Footprints,
  MoveDown,
  PersonStanding,
  type LucideIcon,
} from 'lucide-react';
import type { MovementPattern, MuscleInvolvement } from '../types';
import { EXERCISE_ANATOMY } from './anatomy';
import type { SourceId } from './sources';

export type KnowledgePatternId = 'push' | 'pull' | 'squat' | 'hinge' | 'locomotion';

export interface KnowledgeCard {
  id: KnowledgePatternId;
  /** 字卡上的大字，例如「推」 */
  shortLabel: string;
  /** 字卡下方兩到四個字的提示，例如「胸肩」 */
  hint: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  accent: {
    icon: string;
  };
}

export interface ArticlePhase {
  step: string;
  title: string;
  subtitle: string;
  points: string[];
}

export interface ArticleLevel {
  level: string;
  title: string;
  dosage: string;
  focus: string;
}

export interface ArticleError {
  title: string;
  summary: string;
  harms: string[];
  fix: string;
}

export interface ArticleDose {
  label: string;
  value: string;
  hint: string;
}

export interface PatternArticle {
  id: KnowledgePatternId;
  eyebrow: string;
  title: string;
  englishTitle: string;
  subtitle: string;
  intro: string;
  accent: {
    icon: string;
    badge: string;
  };
  /** 為什麼學：日常生活中會用到這個動作的地方 */
  why: string;
  /** 白話原理：身體哪裡、怎麼做、感覺像什麼 */
  principle: string[];
  anatomy: {
    headline: string;
    summary: string;
    muscles: MuscleInvolvement[];
    extraMuscles?: string;
    groups?: { group: string; muscles: string; role: string }[];
  };
  technique: {
    startCues: string[];
    phases: ArticlePhase[];
    breathing?: { title: string; description: string }[];
    note?: string;
    warning?: string;
  };
  /** 做對的感覺 */
  feeling: string[];
  /** 劑量：三個要記住的數字 */
  dose: ArticleDose[];
  levels: ArticleLevel[];
  errors: ArticleError[];
  checklist: { do: string[]; dont: string[] };
  safety: string[];
  nextStep: { title: string; detail: string };
  sources: SourceId[];
}

/* ------------------------------------------------------------------ */
/* 知識庫首頁卡片                                                       */
/* ------------------------------------------------------------------ */

export const KNOWLEDGE_CARDS: KnowledgeCard[] = [
  {
    id: 'push',
    shortLabel: '推',
    hint: '胸肩',
    title: '推：水平推與垂直推',
    subtitle: '胸、肩、三頭與肩胛穩定的發力順序。',
    icon: ArrowUpFromLine,
    accent: { icon: 'bg-sky-50 text-sky-700' },
  },
  {
    id: 'pull',
    shortLabel: '拉',
    hint: '背部',
    title: '拉：水平拉與垂直拉',
    subtitle: '背部、二頭與肩胛控制的離心技巧。',
    icon: ArrowDownToLine,
    accent: { icon: 'bg-emerald-50 text-emerald-700' },
  },
  {
    id: 'squat',
    shortLabel: '蹲',
    hint: '臀腿',
    title: '蹲：下肢推與膝髖協調',
    subtitle: '股四頭、臀肌與足踝活動度的整合。',
    icon: PersonStanding,
    accent: { icon: 'bg-amber-50 text-amber-700' },
  },
  {
    id: 'hinge',
    shortLabel: '髖',
    hint: '臀後',
    title: '髖：硬舉與髖鉸鏈',
    subtitle: '臀腿後側動力鏈、脊柱中立與腹壓。',
    icon: MoveDown,
    accent: { icon: 'bg-plum-50 text-plum-700' },
  },
  {
    id: 'locomotion',
    shortLabel: '移動',
    hint: '全身',
    title: '移動：走路、跑步與動態穩定',
    subtitle: '步態、落地緩衝與單腳穩定的基礎。',
    icon: Footprints,
    accent: { icon: 'bg-rose-50 text-rose-700' },
  },
];

/* ------------------------------------------------------------------ */
/* 五篇完整教學                                                         */
/* ------------------------------------------------------------------ */

const PUSH_ARTICLE: PatternArticle = {
  id: 'push',
  eyebrow: 'PUSH PATTERN',
  title: '推：水平推與垂直推',
  englishTitle: 'Horizontal & Vertical Push',
  subtitle: '胸、肩、三頭與肩胛穩定的發力順序',
  intro:
    '推，是把重量從身體前方送出去。伏地挺身、胸推屬於水平推，肩推屬於垂直推。看起來是手臂在動，實際上是肩胛骨先穩定、軀幹先撐住，手臂才有平台可以出力。',
  accent: {
    icon: 'bg-sky-50 text-sky-700',
    badge: 'bg-sky-100 text-sky-800',
  },
  why: '伏地挺身、把行李箱放上行李架、從地上撐起身體，用的都是推。推的力量不足，這些動作會先變成肩膀與腰在代勞。',
  principle: [
    '肩胛骨是背後左右各一片的三角形骨頭，貼在肋骨上。推之前先把它穩住，手臂才有地方施力。',
    '手肘與身體夾約 45 度時，肩關節前側的空間最大；張成 90 度會讓肩前側被夾住。',
    '從頭到腳踝維持一條線，力量才不會從腰漏掉。腰一塌，推力就只剩手臂。',
    '推到頂點時肩胛骨會自然往前滑開，這是正常的；但不要同時把肩膀聳向耳朵。',
  ],
  anatomy: {
    headline: '推的肌肉分工',
    summary:
      '胸大肌負責把上臂帶向身體中線，三角肌前束與三頭肌接手完成末段。前鋸肌讓肩胛骨貼著肋骨滑動，核心與臀部把身體變成一塊板子。',
    muscles: [
      {
        id: 'chest',
        name: '胸大肌',
        latin: 'Pectoralis Major',
        role: 'target',
        note: '水平推的主要發力，把上臂帶向身體中線。',
      },
      {
        id: 'front-deltoids',
        name: '三角肌前束',
        latin: 'Anterior Deltoid',
        role: 'target',
        note: '垂直推的主力，水平推時協助肩屈曲。',
      },
      {
        id: 'triceps',
        name: '三頭肌',
        latin: 'Triceps Brachii',
        role: 'target',
        note: '伸直手肘，決定推的末端能不能穩定收尾。',
      },
      {
        id: 'trapezius',
        name: '斜方肌上束',
        latin: 'Trapezius',
        role: 'synergist',
        note: '垂直推時上旋肩胛骨，讓手臂舉得更高。',
      },
      {
        id: 'upper-back',
        name: '背部肌群',
        latin: 'Upper Back',
        role: 'stabilizer',
        note: '穩定肩胛，避免推到一半肩膀往前掉。',
      },
      {
        id: 'abs',
        name: '腹直肌',
        latin: 'Rectus Abdominis',
        role: 'stabilizer',
        note: '讓軀幹不出現塌腰，維持推的力量傳導。',
      },
      {
        id: 'obliques',
        name: '腹斜肌',
        latin: 'Obliques',
        role: 'stabilizer',
        note: '抵抗身體左右晃動與旋轉。',
      },
      {
        id: 'gluteal',
        name: '臀大肌',
        latin: 'Gluteus Maximus',
        role: 'stabilizer',
        note: '夾臀固定骨盆，避免腰椎代償。',
      },
      {
        id: 'lower-back',
        name: '豎脊肌',
        latin: 'Erector Spinae',
        role: 'stabilizer',
        note: '維持脊柱中立，尤其在手腳支撐時。',
      },
    ],
    extraMuscles:
      '前鋸肌（Serratus Anterior）負責肩胛骨前伸與貼合胸廓，旋轉肌袖負責穩定肩關節；兩者在人體圖上沒有獨立圖層，以相鄰部位呈現。',
  },
  technique: {
    startCues: [
      '手掌在肩膀正下方或略寬，指尖朝前。',
      '收緊核心與臀部，頭、背、臀、腳跟成一直線。',
      '肩膀離開耳朵，先穩住肩胛骨再開始。',
    ],
    phases: [
      {
        step: '01',
        title: '起始位置',
        subtitle: '手撐穩、身體成板',
        points: [
          '手腕在肩膀正下方，手肘微彎不鎖死。',
          '腹部收緊、臀部夾緊，骨盆不前傾也不後傾。',
          '視線看向前下方，頸部與脊柱保持同一條線。',
        ],
      },
      {
        step: '02',
        title: '下降',
        subtitle: '吸氣、慢慢放下',
        points: [
          '手肘沿著與軀幹約 45 度的方向彎曲。',
          '胸口下降到離地約一個拳頭，不需要貼地。',
          '全程 2 秒以上，讓肌肉真正承受張力。',
        ],
      },
      {
        step: '03',
        title: '推起',
        subtitle: '吐氣、手掌推地',
        points: [
          '手掌推地，胸口往前往上離開地面。',
          '肩膀不聳起，肩胛骨可以自然向前滑動。',
          '手肘伸直但不完全鎖死，保留一點控制。',
        ],
      },
      {
        step: '04',
        title: '頂點穩定',
        subtitle: '維持一直線再進入下一次',
        points: [
          '頂點時身體仍是一條直線，不拱腰也不掉臀。',
          '呼吸穩定後再開始下一次，不用趕。',
          '肩膀前側出現夾擠感時，先停下檢查手肘角度。',
        ],
      },
    ],
    note: '推的品質取決於肩胛骨穩不穩，不是手有沒有力。每次推完都是脖子與肩膀痠，先降一級難度，把肩胛控制練回來。',
  },
  feeling: [
    '胸口、肩膀前側與手臂後側有痠脹感，肩膀前側沒有被夾住的痛。',
    '推起時感覺手掌把地板推遠，整個身體一起移動。',
    '脖子與肩膀上緣沒有先痠。',
    '隔天痠在胸與手臂後側，不是肩頸。',
  ],
  dose: [
    { label: '次數與組數', value: '8–12 下 × 2–3 組', hint: '最後 2 下吃力但動作不變形' },
    { label: '組間休息', value: '2–3 分鐘', hint: '休息不足會讓下一組姿勢先崩' },
    { label: '頻率', value: '每週 2 次', hint: '同一肌群之間隔 48 小時' },
  ],
  levels: [
    {
      level: 'L1',
      title: '牆壁伏地挺身',
      dosage: '15–20 下 × 3 組',
      focus: '建立推力與肩胛控制，身體斜度越大越輕鬆。',
    },
    {
      level: 'L2',
      title: '上斜伏地挺身（桌沿或椅子）',
      dosage: '20–30 下 × 3 組',
      focus: '降低體重比例，練習完整行程。',
    },
    {
      level: 'L3',
      title: '跪姿伏地挺身',
      dosage: '20–30 下 × 3 組',
      focus: '減少核心負擔，把注意力放回胸與三頭。',
    },
    {
      level: 'L4',
      title: '標準伏地挺身',
      dosage: '6–20 下 × 3 組',
      focus: '完整體重，維持軀幹一直線。',
    },
    {
      level: 'L5',
      title: '腳抬高伏地挺身',
      dosage: '15–20 下 × 3 組',
      focus: '增加肩部負荷，往垂直推前進。',
    },
  ],
  errors: [
    {
      title: '錯誤一：手肘完全外張',
      summary: '手肘張成 90 度，上臂與軀幹垂直，肩關節前側承受最大壓力。',
      harms: ['肩關節前側與旋轉肌袖負擔上升。', '胸大肌的收縮角度變差，出力反而更少。'],
      fix: '手肘與軀幹維持約 45 度，從上方看像一個箭頭，不是 T 字。',
    },
    {
      title: '錯誤二：塌腰掉臀',
      summary: '腹部沒有收緊，骨盆前傾、腰部下沉，力量集中在下背。',
      harms: ['腰椎過度前凸，容易出現下背痠痛。', '胸口無法下降到足夠深度。'],
      fix: '收腹、夾臀，先降難度（跪姿或上斜），確認身體能維持一直線。',
    },
    {
      title: '錯誤三：只做半程',
      summary: '下降幅度太小，胸大肌幾乎沒有被拉長，訓練量不足。',
      harms: ['動作看起來做很多下，實際刺激有限。', '習慣後會誤以為自己已具備完整動作能力。'],
      fix: '下降到胸口離地約一個拳頭，寧可少做幾下也要完整。',
    },
    {
      title: '錯誤四：聳肩推',
      summary: '肩膀往耳朵方向抬起，上斜方肌代償，頸部緊繃。',
      harms: ['頸部與上背容易痠痛。', '肩胛骨沒有穩定，推力傳導變差。'],
      fix: '開始前先把肩膀往後下方收，再讓胸口帶著身體下降與推起。',
    },
  ],
  checklist: {
    do: [
      '手掌在肩膀正下方或略寬。',
      '手肘與軀幹約 45 度。',
      '腹部收緊、臀部夾緊，身體成一直線。',
      '下降 2 秒、推起 1 秒，呼吸不憋氣。',
      '肩膀遠離耳朵，肩胛骨先穩定。',
    ],
    dont: [
      '手肘完全外張成 90 度。',
      '塌腰、掉臀或頭部前伸。',
      '只做半程就急著加次數。',
      '推到底時用力聳肩。',
      '手腕過度後折、體重壓在手掌根部。',
    ],
  },
  safety: [
    '肩膀曾有脫臼、夾擠或旋轉肌袖傷害，先諮詢醫師或物理治療師。',
    '推的過程出現肩前側刺痛，立即停止並降低難度。',
    '手腕不適時可使用伏地挺身握把，讓手腕維持中立。',
    '本內容為一般運動知識，不能取代醫療建議。',
  ],
  nextStep: {
    title: '下一步：把拉補上',
    detail: '推與拉每週各 2 次。只練推容易讓肩膀往前捲，拉可以把肩胛骨帶回原位。',
  },
  sources: ['ratamess2009', 'cogley2005', 'kibler2010', 'hhs2018'],
};

const PULL_ARTICLE: PatternArticle = {
  id: 'pull',
  eyebrow: 'PULL PATTERN',
  title: '拉：水平拉與垂直拉',
  englishTitle: 'Horizontal & Vertical Pull',
  subtitle: '背部、二頭與肩胛控制的離心技巧',
  intro:
    '拉，是把自己或重量往身體帶。划船屬於水平拉，引體向上與滑輪下拉屬於垂直拉。拉的力量從肩胛開始：先讓肩胛骨下沉後收，手肘才有穩定的軌道，背闊肌才真的參與。',
  accent: {
    icon: 'bg-emerald-50 text-emerald-700',
    badge: 'bg-emerald-100 text-emerald-800',
  },
  why: '把購物袋提到桌上、拉開抽屜、從地上把小孩抱起來，都是拉。拉的肌力不足時，這些動作會變成手腕與下背在出力。',
  principle: [
    '第一個動作在肩胛骨：先往下、往後收，再彎手肘。順序顛倒，就變成只用手臂拉。',
    '背闊肌從腋下延伸到腰側。收縮時感覺腋下被夾緊、背側變厚。',
    '回放要花 2–3 秒，這是背部訓練量最大的一半。',
    '身體前後擺盪會把力量變成動能，背部實際做的功變少。',
  ],
  anatomy: {
    headline: '拉的肌肉分工',
    summary:
      '背闊肌與大圓肌把上臂往身體拉，是垂直拉與划船的主力。中下斜方肌與菱形肌負責把肩胛骨往後收，二頭肌與前臂完成屈肘與握持。',
    muscles: [
      {
        id: 'upper-back',
        name: '背闊肌、大圓肌',
        latin: 'Latissimus Dorsi / Teres Major',
        role: 'target',
        note: '把上臂往身體拉，是垂直拉與划船的主要動力。',
      },
      {
        id: 'biceps',
        name: '二頭肌',
        latin: 'Biceps Brachii',
        role: 'target',
        note: '屈肘，讓重量靠近身體。',
      },
      {
        id: 'trapezius',
        name: '中下斜方肌與菱形肌',
        latin: 'Trapezius / Rhomboids',
        role: 'synergist',
        note: '肩胛骨後縮與下壓，讓背部先啟動。',
      },
      {
        id: 'back-deltoids',
        name: '三角肌後束',
        latin: 'Posterior Deltoid',
        role: 'synergist',
        note: '協助肩水平伸展，划船時特別明顯。',
      },
      {
        id: 'forearm',
        name: '前臂肌群',
        latin: 'Forearm Flexors',
        role: 'synergist',
        note: '握力是拉的起點，握不住就拉不動。',
      },
      {
        id: 'abs',
        name: '腹直肌',
        latin: 'Rectus Abdominis',
        role: 'stabilizer',
        note: '固定軀幹，避免用擺盪借力。',
      },
      {
        id: 'obliques',
        name: '腹斜肌',
        latin: 'Obliques',
        role: 'stabilizer',
        note: '抵抗旋轉，讓兩側平均出力。',
      },
      {
        id: 'lower-back',
        name: '豎脊肌',
        latin: 'Erector Spinae',
        role: 'stabilizer',
        note: '維持俯身划船時的脊柱中立。',
      },
    ],
    extraMuscles:
      '肱橈肌（前臂）與後三角肌共同協助屈肘與肩伸展；肩胛骨的穩定也依賴旋轉肌袖，圖層以相鄰部位呈現。',
  },
  technique: {
    startCues: [
      '握距略寬於肩，手腕保持中立。',
      '核心收緊，肩膀先離開耳朵。',
      '先後縮下壓肩胛骨，再開始屈肘。',
    ],
    phases: [
      {
        step: '01',
        title: '握與預備',
        subtitle: '肩胛先就位',
        points: [
          '雙手握穩，手肘微彎但不放鬆。',
          '肩膀往後下方收，感覺背闊肌微微出力。',
          '軀幹穩定，不靠後仰或擺盪製造動能。',
        ],
      },
      {
        step: '02',
        title: '啟動',
        subtitle: '肩胛下沉、手肘跟上',
        points: [
          '先讓肩胛骨往下、往後移動。',
          '手肘沿著身體側邊往後帶。',
          '重量由背部主導，二頭只是協助。',
        ],
      },
      {
        step: '03',
        title: '拉到底',
        subtitle: '胸口靠近、頂點停一秒',
        points: [
          '水平拉：手肘超過身體側面，肩胛骨夾緊。',
          '垂直拉：胸口靠近橫桿或握把，不拉到頸後。',
          '頂點停留 1 秒，確認是背部在收縮。',
        ],
      },
      {
        step: '04',
        title: '回放',
        subtitle: '慢、穩、不放手',
        points: [
          '用 2–3 秒把重量放回起始位置。',
          '回放時保持張力，不要讓配重直接撞擊。',
          '肩膀不完全放鬆，下一組才接得上。',
        ],
      },
    ],
    note: '拉完是手臂先痠、背部沒感覺，代表第一步的肩胛下壓沒有做到。先降重量，把這一步做確實再慢慢加回來。',
  },
  feeling: [
    '肩胛骨中間（膏肓附近）與腋下後側有收縮感。',
    '手肘往後帶時，二頭只是跟著移動。',
    '回放時腋下被撐開，背闊肌被拉長。',
    '隔天痠在背，手臂沒有先沒力。',
  ],
  dose: [
    { label: '次數與組數', value: '8–12 下 × 2–3 組', hint: '最後 2 下吃力但姿勢不變形' },
    { label: '組間休息', value: '2–3 分鐘', hint: '休息不足會先用到手臂' },
    { label: '頻率', value: '每週 2 次', hint: '與推的日子錯開，同一肌群隔 48 小時' },
  ],
  levels: [
    {
      level: 'L1',
      title: '彈力帶坐姿划船',
      dosage: '20 下 × 3 組',
      focus: '建立肩胛後縮的順序，阻力溫和。',
    },
    {
      level: 'L2',
      title: '三點支撐啞鈴划船',
      dosage: '10–20 下 × 3 組',
      focus: '單側訓練，練習軀幹不旋轉。',
    },
    {
      level: 'L3',
      title: '滑輪下拉',
      dosage: '10–20 下 × 3 組',
      focus: '垂直拉的第一步，控制回放速度。',
    },
    {
      level: 'L4',
      title: '輔助引體向上',
      dosage: '8–15 下 × 3 組',
      focus: '用彈力帶或輔助機分攤體重。',
    },
    {
      level: 'L5',
      title: '標準引體向上',
      dosage: '盡力 × 3 組',
      focus: '完整體重，保持肩胛控制不擺盪。',
    },
  ],
  errors: [
    {
      title: '錯誤一：用身體擺盪借力',
      summary: '靠前後晃動把重量甩上去，背部沒有真正收縮。',
      harms: ['訓練效果大幅下降。', '下背與肩關節承受不必要的前後剪力。'],
      fix: '降低重量或使用輔助，讓身體在靜止狀態下啟動；必要時把雙腳踩穩。',
    },
    {
      title: '錯誤二：拉到頸後',
      summary: '把橫桿拉到後頸，肩關節被強迫外旋與水平外展。',
      harms: ['肩關節前側與旋轉肌袖壓力上升。', '頸椎被迫前推，容易不適。'],
      fix: '一律拉到鎖骨或胸口上方，手肘往身體兩側帶。',
    },
    {
      title: '錯誤三：只用手臂拉',
      summary: '肩胛骨沒有先動，直接屈肘，變成二頭肌訓練。',
      harms: ['背闊肌幾乎沒有參與。', '手臂很快疲勞，背部訓練量不足。'],
      fix: '每次開始前先做一次「肩膀下壓」的預備動作，再屈肘。',
    },
    {
      title: '錯誤四：回放失控',
      summary: '放手讓重量快速上升，回放階段完全沒有張力。',
      harms: ['失去背部訓練最重要的一半。', '配重撞擊容易造成肩關節與手肘不適。'],
      fix: '回放至少 2 秒，感覺背闊肌被拉長再進入下一次。',
    },
  ],
  checklist: {
    do: [
      '先下壓、後縮肩胛，再屈肘。',
      '手肘貼近身體往後帶。',
      '頂點停 1 秒，確認背部收縮。',
      '回放 2–3 秒，保持張力。',
      '軀幹穩定，不靠擺盪借力。',
    ],
    dont: [
      '把橫桿拉到頸後。',
      '用身體前後晃動把重量甩上去。',
      '只用手臂拉，肩膀完全沒動。',
      '回放時直接放手。',
      '握住時手腕過度彎折。',
    ],
  },
  safety: [
    '肩關節或手肘曾有傷害，先從彈力帶與輕重量開始。',
    '拉的時候出現肩前側或手肘內側刺痛，立即停止。',
    '引體向上不要用跳躍方式硬上，先做離心或輔助版本。',
    '本內容為一般運動知識，不能取代醫療建議。',
  ],
  nextStep: {
    title: '下一步：把回放放慢到 3 秒',
    detail: '同一個重量下，回放 3 秒比多做 2 下更能增加背部訓練量。做得到再加重。',
  },
  sources: ['ratamess2009', 'lusk2010', 'youdas2010', 'kibler2010'],
};

const SQUAT_ARTICLE: PatternArticle = {
  id: 'squat',
  eyebrow: 'SQUAT PATTERN',
  title: '蹲：下肢推與膝髖協調',
  englishTitle: 'Squat Pattern',
  subtitle: '股四頭、臀肌與足踝活動度的整合',
  intro:
    '蹲，是髖、膝、踝三個關節同時彎曲再伸直。蹲得深不深，取決於踝關節活動度與髖部構造，不是「膝蓋能不能超過腳尖」。先把腳掌踩穩，膝蓋自然會跟著腳尖走。',
  accent: {
    icon: 'bg-amber-50 text-amber-700',
    badge: 'bg-amber-100 text-amber-800',
  },
  why: '從椅子站起來、上廁所、蹲下來撿東西，都是蹲。蹲得好，膝蓋與下背在日常生活會輕鬆很多。',
  principle: [
    '蹲是髖、膝、踝三個關節同時彎曲再伸直，不是只有膝蓋在動。',
    '膝蓋可以超過腳尖。限制深度的是踝關節活動度與每個人的髖關節構造，不是「膝蓋不能超過腳尖」這條規定。',
    '腳掌三點（腳跟、大腳趾根部、小腳趾根部）平均受力，重心才穩。',
    '膝蓋與腳尖同向時，膝關節的壓力分散；往內夾會讓內側集中受力。',
  ],
  anatomy: {
    headline: '蹲的肌肉分工',
    summary:
      '股四頭肌負責伸膝，臀大肌與內收大肌負責伸髖，小腿穩定腳踝。臀中肌控制膝蓋方向，核心建立腹壓讓軀幹在負重下不塌。',
    muscles: [
      {
        id: 'quadriceps',
        name: '股四頭肌',
        latin: 'Quadriceps',
        role: 'target',
        note: '伸膝的主要肌群，負責站起來的末段。',
      },
      {
        id: 'gluteal',
        name: '臀大肌',
        latin: 'Gluteus Maximus',
        role: 'target',
        note: '伸髖的主力，決定蹲起的爆發力。',
      },
      {
        id: 'adductor',
        name: '內收大肌',
        latin: 'Adductor Magnus',
        role: 'synergist',
        note: '在髖伸展時提供大量協助，常被忽略。',
      },
      {
        id: 'hamstring',
        name: '膕繩肌',
        latin: 'Hamstrings',
        role: 'synergist',
        note: '協助伸髖並穩定膝關節。',
      },
      {
        id: 'calves',
        name: '小腿三頭肌',
        latin: 'Gastrocnemius / Soleus',
        role: 'synergist',
        note: '穩定腳踝，控制重心不往前衝。',
      },
      {
        id: 'abs',
        name: '腹直肌',
        latin: 'Rectus Abdominis',
        role: 'stabilizer',
        note: '建立腹壓，保護腰椎。',
      },
      {
        id: 'obliques',
        name: '腹斜肌',
        latin: 'Obliques',
        role: 'stabilizer',
        note: '維持軀幹剛性，抵抗側向偏移。',
      },
      {
        id: 'lower-back',
        name: '豎脊肌',
        latin: 'Erector Spinae',
        role: 'stabilizer',
        note: '保持脊柱中立，不圓背。',
      },
      {
        id: 'upper-back',
        name: '背部肌群',
        latin: 'Upper Back',
        role: 'stabilizer',
        note: '讓胸口保持打開，重量不往前掉。',
      },
      {
        id: 'abductors',
        name: '臀中肌',
        latin: 'Gluteus Medius',
        role: 'stabilizer',
        note: '控制膝蓋方向，避免膝蓋內夾。',
      },
    ],
    extraMuscles:
      '深蹲時髂腰肌與髖外轉肌群負責穩定髖關節；足弓肌群則維持足底三點著地。',
  },
  technique: {
    startCues: [
      '雙腳站距與肩同寬，腳尖自然外開 15–30 度。',
      '足中、腳跟與大腳趾根部三點踩穩。',
      '核心收緊、胸口打開，視線看向前下方。',
    ],
    phases: [
      {
        step: '01',
        title: '站距與足底',
        subtitle: '先把地基踩好',
        points: [
          '腳掌三點均勻受力，不要只站腳跟或腳尖。',
          '膝蓋微微彎曲、不鎖死，大腿微微外轉。',
          '肋骨不外翻，骨盆維持中立。',
        ],
      },
      {
        step: '02',
        title: '髖膝同步下降',
        subtitle: '像往後下方坐',
        points: [
          '臀部先向後，再讓膝蓋彎曲，兩者同時發生。',
          '膝蓋沿著腳尖方向移動，不內夾也不外翻。',
          '上半身保持直立，胸口不塌。',
        ],
      },
      {
        step: '03',
        title: '底部位置',
        subtitle: '停在可控制的最深處',
        points: [
          '骨盆不後傾、下背不彎曲（不「屁股眨眼」）。',
          '腳跟不離地，重心仍在足中。',
          '停半秒確認穩定，不要用彈震反彈。',
        ],
      },
      {
        step: '04',
        title: '站起',
        subtitle: '腳掌推地、髖膝同時伸直',
        points: [
          '腳掌三點往地板推，像把地板踩遠。',
          '髖與膝同步伸展，不要先抬臀再挺胸。',
          '站直時夾臀，但不需要骨盆前傾或後仰。',
        ],
      },
    ],
    note: '每個人的髖關節構造不同，蹲的深度本來就不一樣。只要腳跟不離地、骨盆不後傾，就是你目前最好的深度。',
  },
  feeling: [
    '腳掌三點都貼地，腳跟沒有浮起來。',
    '站起時臀部與大腿前側一起出力，膝蓋不會痛。',
    '底部像坐在一張矮凳上，不是往前趴。',
    '隔天痠在大腿前側與臀部，不是膝蓋前面或下背。',
  ],
  dose: [
    { label: '次數與組數', value: '8–12 下 × 3 組', hint: '最後 2 下吃力但腳跟仍貼地' },
    { label: '組間休息', value: '2–3 分鐘', hint: '蹲的負荷大，休息要夠' },
    { label: '頻率', value: '每週 2–3 次', hint: '同一肌群之間隔 48 小時' },
  ],
  levels: [
    {
      level: 'L1',
      title: '椅子深蹲',
      dosage: '10–20 下 × 3 組',
      focus: '用椅子當深度提示，練習向後坐。',
    },
    {
      level: 'L2',
      title: '箱式深蹲',
      dosage: '10–20 下 × 3 組',
      focus: '輕觸箱面就站起，建立底部控制。',
    },
    {
      level: 'L3',
      title: '徒手深蹲',
      dosage: '10–20 下 × 3 組',
      focus: '完整行程，腳掌三點穩定。',
    },
    {
      level: 'L4',
      title: '負重深蹲',
      dosage: '6–15 下 × 3 組',
      focus: '增加負荷，維持脊柱中立與腹壓。',
    },
    {
      level: 'L5',
      title: '保加利亞分腿蹲',
      dosage: '6–15 下 × 3 組',
      focus: '單腳承重，挑戰髖部穩定與平衡。',
    },
  ],
  errors: [
    {
      title: '錯誤一：膝蓋內夾',
      summary: '蹲下或站起時膝蓋往內靠，形成動態外翻。',
      harms: ['膝關節內側韌帶與半月板壓力上升。', '臀中肌沒有參與，長期會加重膝痛。'],
      fix: '膝蓋主動往腳尖方向推，必要時在膝蓋上方套一條彈力帶提醒外展。',
    },
    {
      title: '錯誤二：腳跟離地',
      summary: '踝關節背屈不足或重心前移，腳跟抬起來代償。',
      harms: ['重心跑到前腳掌，膝蓋壓力增加。', '底部位置不穩，容易前傾。'],
      fix: '在腳跟墊一本薄書或縮小深度，先改善踝關節活動度。',
    },
    {
      title: '錯誤三：圓背或骨盆後傾',
      summary: '蹲到超過目前活動度時，腰椎屈曲、骨盆向後翻轉。',
      harms: ['腰椎間盤與後側韌帶承受額外壓力。', '起身時容易用下背代償。'],
      fix: '蹲到骨盆開始後傾前就停下，把深度交給活動度進步，而不是硬壓。',
    },
    {
      title: '錯誤四：只蹲一半',
      summary: '下降幅度太小，股四頭與臀肌都沒有被充分使用。',
      harms: ['訓練量不足，效果不明顯。', '誤判自己已能承受更大重量。'],
      fix: '先降重量，蹲到可控制的深度；必要時用椅子標記目標高度。',
    },
  ],
  checklist: {
    do: [
      '腳掌三點踩穩，腳跟不離地。',
      '膝蓋沿腳尖方向移動。',
      '髖與膝同步下降、同步站起。',
      '核心收緊、胸口打開。',
      '蹲到骨盆不後傾的最深處。',
    ],
    dont: [
      '膝蓋內夾或外翻。',
      '腳跟抬起、重心全壓在前腳掌。',
      '圓背、低頭或肋骨外翻。',
      '用彈震反彈的方式站起。',
      '為了蹲更低而硬壓骨盆。',
    ],
  },
  safety: [
    '膝蓋或髖關節曾有傷害，先從椅子深蹲與小幅度開始。',
    '蹲的過程出現膝蓋前側刺痛或卡住感，立即停止並諮詢專業人員。',
    '負重深蹲請使用深蹲架與安全槓，並由合格指導者確認動作。',
    '本內容為一般運動知識，不能取代醫療建議。',
  ],
  nextStep: {
    title: '下一步：練髖鉸鏈',
    detail: '蹲是膝與髖一起出力，髖鉸鏈只動髖。兩個都會，撿東西與搬重物才不會用腰。',
  },
  sources: ['ratamess2009', 'schoenfeld2010', 'hartmann2013', 'fry2003', 'caterisano2002'],
};

const HINGE_ARTICLE: PatternArticle = {
  id: 'hinge',
  eyebrow: 'HINGE PATTERN',
  title: '髖：硬舉與髖鉸鏈',
  englishTitle: 'Hip Hinge & Deadlift',
  subtitle: '臀腿後側動力鏈、脊柱中立與腹壓',
  intro:
    '髖鉸鏈是「臀部向後推、上半身向前傾」，膝蓋只微彎。硬舉就是加上重量的髖鉸鏈。動作的引擎是臀部與大腿後側，下背的工作是保持不動。',
  accent: {
    icon: 'bg-plum-50 text-plum-700',
    badge: 'bg-plum-900 text-amber-100',
  },
  why: '彎腰撿東西、把地上的箱子搬起來，都應該是髖鉸鏈。用臀部出力，下背就不必代勞；這是最常被忽略、也最容易受傷的日常動作。',
  principle: [
    '髖鉸鏈是「臀部向後推、上半身向前傾」，膝蓋只微彎，像用屁股把身後的門關上。',
    '引擎是臀大肌與大腿後側；下背的工作是「不要動」，不是「把重量拉起來」。',
    '重量越靠近身體，下背的力臂越短，力矩越小。',
    '起槓前先吸氣、核心撐住，讓腹部變成一個充氣的氣囊，脊柱才有支撐。',
  ],
  anatomy: {
    headline: '硬舉主導肌群',
    summary:
      '臀大肌與膕繩肌負責伸髖，豎脊肌與核心維持脊柱中立，背闊肌與握力讓重量貼近身體。股四頭肌在起始段推蹬地面。',
    muscles: EXERCISE_ANATOMY.deadlift.muscles,
    groups: [
      {
        group: '後側動力鏈',
        muscles: '臀大肌、膕繩肌',
        role: '負責伸髖的主導發力，是硬舉最重要的引擎。',
      },
      {
        group: '軀幹與脊柱穩定',
        muscles: '豎脊肌、腹橫肌、腹斜肌',
        role: '提供抗屈曲的剛性，讓脊柱在負重下維持中立。',
      },
      {
        group: '上背與握力鎖定',
        muscles: '背闊肌、斜方肌、前臂握力',
        role: '背闊肌防止槓鈴前移，斜方肌與握力讓槓鈴穩定貼身。',
      },
      {
        group: '下肢推蹬',
        muscles: '股四頭肌、小腿肌群',
        role: '從地面啟動時推蹬地面，與伸髖動作同步完成。',
      },
    ],
  },
  technique: {
    startCues: [
      '雙腳站距與髖同寬，足中對準槓鈴正下方。',
      '臀部向後推，背部保持直線，肩膀略在槓鈴前方。',
      '腋下向後收緊、夾緊背闊肌，雙手握在雙腿外側。',
    ],
    phases: [
      {
        step: '01',
        title: '預備姿勢',
        subtitle: '站距、握距與屈髖',
        points: [
          '雙腳站距與髖同寬，腳尖自然朝前或微微外開。',
          '足中對準槓鈴正下方，讓重力線保持垂直。',
          '臀部向後下方推，膝蓋不往前跪，小腿接近垂直地面。',
          '手臂自然下垂握槓，雙臂維持垂直拉力線。',
        ],
      },
      {
        step: '02',
        title: '建立剛性',
        subtitle: '背部、肩胛與核心',
        points: [
          '背部保持直線，肩膀略在槓鈴前方，腋下向後收緊。',
          '大腿與地面形成自然傾斜角，不是過低的深蹲位置。',
          '深吸氣填滿腹腔，腹部全向收緊，建立腹壓。',
          '視線看向前下方約 2 公尺，頸椎與脊柱維持中立。',
        ],
      },
      {
        step: '03',
        title: '發力上升',
        subtitle: '推蹬、伸髖、貼腿',
        points: [
          '重心落在足中，腳掌三點穩穩踩地，向地面推蹬。',
          '槓鈴緊貼小腿與大腿上升，讓力臂維持最小。',
          '股四頭肌與臀肌同步伸展，過膝後加速推髖。',
          '肩膀與髖部同步上升，避免臀部先抬或上半身先起。',
        ],
      },
      {
        step: '04',
        title: '頂點鎖定',
        subtitle: '站直、夾臀、不後仰',
        points: [
          '站直時臀大肌夾緊，軀幹保持直立。',
          '肩膀、髖關節與腳踝大致在同一垂直線上。',
          '避免腰椎過度後仰，否則會擠壓腰椎後側關節。',
          '吐氣並維持核心安定，再控制下放。',
        ],
      },
      {
        step: '05',
        title: '控制下放',
        subtitle: '先屈髖、再屈膝',
        points: [
          '先將臀部向後推，槓鈴沿大腿下降。',
          '過膝後再屈膝，讓槓鈴回到足中位置。',
          '全程保持背部中立與核心張力，不讓槓鈴遠離身體。',
          '輕放或控制觸地，不刻意砸地，也不瞬間放鬆。',
        ],
      },
    ],
    breathing: [
      {
        title: '深吸氣填滿腹腔',
        description: '橫膈膜下沉，把空氣壓入腹腔，形成內部高壓。',
      },
      {
        title: '核心全向收緊',
        description: '腹部與腰側一起收緊，建立支撐脊柱的氣墊。',
      },
      {
        title: '鎖定後再發力',
        description: '腹壓穩定後才起槓，讓力量有效傳導到槓鈴。',
      },
    ],
    note: '起槓前先建立腹壓、夾緊背闊肌，再推蹬地面。重量是結果，順序才是原因。',
    warning: '初學者可先用自然呼吸搭配核心收緊；有血壓或心血管相關問題，先諮詢醫師。',
  },
  feeling: [
    '臀部向後推時，大腿後側被拉長。',
    '背部全程是一條直線，下背沒有擠壓感。',
    '起槓時腳掌把地板踩穿，臀與腿同時伸直。',
    '隔天痠在臀部與大腿後側，不是下背。',
  ],
  dose: [
    { label: '次數與組數', value: '6–10 下 × 3 組', hint: '重量大，次數少，每下都要完整' },
    { label: '組間休息', value: '2–3 分鐘', hint: '讓腹壓與握力恢復再下一組' },
    { label: '頻率', value: '每週 1–2 次', hint: '恢復需求高，不與深蹲排在同一天' },
  ],
  levels: [
    {
      level: 'L1',
      title: '臀橋',
      dosage: '25 下 × 3 組',
      focus: '先學會用臀部伸髖，而不是用下背拱起。',
    },
    {
      level: 'L2',
      title: '輕重量羅馬尼亞硬舉',
      dosage: '20 下 × 3 組',
      focus: '練習髖向後推與大腿後側的離心控制。',
    },
    {
      level: 'L3',
      title: '壺鈴硬舉',
      dosage: '10 下 × 3 組',
      focus: '把髖鉸鏈帶到站立姿勢，重量在身體前方。',
    },
    {
      level: 'L4',
      title: '髖外展控制',
      dosage: '每側 10 下 × 3 組',
      focus: '訓練單腳站立時的髖部旋轉控制。',
    },
    {
      level: 'L5',
      title: '傳統硬舉',
      dosage: '6–10 下 × 3 組',
      focus: '完整動作，維持脊柱中立與槓鈴貼身。',
    },
  ],
  errors: [
    {
      title: '錯誤一：預先抬腰',
      summary: '臀部過早拉高，腿部肌群脫離發力位置，壓力瞬間轉到下背。',
      harms: ['豎脊肌承受過大的張力。', '下背的剪力增加。', '下肢沒有參與，變成彎腰拉重量。'],
      fix: '起槓前先把胸口抬到肩膀略在槓鈴前方，臀部自然會停在較低的位置。',
    },
    {
      title: '錯誤二：頭部過度仰伸',
      summary: '仰頭會破壞脊柱的中立排列，也讓核心的張力傳導中斷。',
      harms: ['頸椎後側關節被壓迫。', '背闊肌的鎖定效果變差。', '視線離開前下方，頸椎與胸椎失去中立。'],
      fix: '視線固定在前下方約 2 公尺的地面，讓頸椎跟著胸椎走。',
    },
    {
      title: '錯誤三：圓背',
      summary: '背部彎曲又同時拉起重物，脊柱後側的韌帶被拉到極限。',
      harms: ['肌肉無法維持結構剛性。', '腰椎間盤承受反覆剪力。', '長期提高腰椎間盤突出的風險。'],
      fix: '降低重量，先確認背部能在全程維持中立，再逐步加回負荷。',
    },
    {
      title: '錯誤四：槓鈴遠離身體',
      summary: '槓鈴往前飄，下背的力臂變長，力矩跟著放大。',
      harms: ['下背負荷明顯上升。', '重心前移，容易失去平衡。'],
      fix: '起槓前夾緊背闊肌，讓槓鈴全程貼著小腿與大腿上升。',
    },
  ],
  checklist: {
    do: [
      '槓鈴全程貼緊下肢移動。',
      '起槓前先建立腹壓。',
      '視線維持前下方約 2 公尺。',
      '肩膀與髖部同步上升。',
      '頂點站直夾臀，不後仰。',
    ],
    dont: [
      '起動時先抬高臀部代償。',
      '拉起過程中仰頭。',
      '頂點鎖定時腰椎過度後仰。',
      '圓背、駝背或讓槓鈴遠離身體。',
      '用猛拉或彈震的方式起槓。',
    ],
  },
  safety: [
    '初學者先以空槓或輕重量練習，確認動作模式後再逐步加重量。',
    '有下背、心血管、關節或血壓相關問題，先諮詢醫師或合格指導者。',
    '憋氣用力會短暫提高腹壓與血壓，不適時立即停止。',
    '本內容為一般運動知識，不能取代醫療建議。',
  ],
  nextStep: {
    title: '下一步：換六角槓',
    detail: '六角槓讓重量更靠近身體，髖與膝的力矩都比傳統硬舉小，適合剛學會髖鉸鏈的人。',
  },
  sources: ['ratamess2009', 'hackett2013', 'swinton2011', 'bengtsson2018'],
};

const LOCOMOTION_ARTICLE: PatternArticle = {
  id: 'locomotion',
  eyebrow: 'LOCOMOTION',
  title: '移動：走路、跑步與動態穩定',
  englishTitle: 'Locomotion',
  subtitle: '步態、落地緩衝與單腳穩定的基礎',
  intro:
    '移動是日常最常發生的動作模式：走路、快走、慢跑。步態分成支撐期與擺盪期，落地緩衝與單腳穩定決定膝蓋與足底要承受多少負擔。',
  accent: {
    icon: 'bg-rose-50 text-rose-700',
    badge: 'bg-rose-100 text-rose-800',
  },
  why: '走路是每天都會發生、也最容易持續的運動。把步頻與落地品質顧好，膝蓋與足底才不會提早抗議。',
  principle: [
    '走路分成支撐期（單腳承重）與擺盪期（另一腳往前）。問題通常出在支撐期。',
    '步頻比步幅重要。跨大步會讓腳跟變成煞車，衝擊往上傳到膝蓋與下背。',
    '單腳支撐時骨盆要保持水平，靠的是臀部外側的臀中肌。',
    '落地緩衝靠膝蓋微彎與足弓，不是靠鞋底的厚度。',
  ],
  anatomy: {
    headline: '移動的肌肉分工',
    summary:
      '臀大肌與小腿負責推進，股四頭肌承接體重，臀中肌在單腳支撐時固定骨盆。核心與豎脊肌不直接產生位移，但沒有它們，每一步的力量都會漏掉一部分。',
    muscles: [
      {
        id: 'gluteal',
        name: '臀大肌',
        latin: 'Gluteus Maximus',
        role: 'target',
        note: '支撐期伸髖，把身體往前送。',
      },
      {
        id: 'quadriceps',
        name: '股四頭肌',
        latin: 'Quadriceps',
        role: 'target',
        note: '承接體重並伸直膝蓋。',
      },
      {
        id: 'calves',
        name: '小腿三頭肌',
        latin: 'Gastrocnemius / Soleus',
        role: 'target',
        note: '前腳掌推離地面，是步行的主要推進力。',
      },
      {
        id: 'hamstring',
        name: '膕繩肌',
        latin: 'Hamstrings',
        role: 'synergist',
        note: '協助伸髖，並在擺盪期減速小腿。',
      },
      {
        id: 'adductor',
        name: '內收大肌',
        latin: 'Adductor Magnus',
        role: 'synergist',
        note: '協助伸髖，穩定大腿位置。',
      },
      {
        id: 'abductors',
        name: '臀中肌',
        latin: 'Gluteus Medius',
        role: 'stabilizer',
        note: '單腳支撐時固定骨盆，避免骨盆下沉。',
      },
      {
        id: 'abs',
        name: '腹直肌',
        latin: 'Rectus Abdominis',
        role: 'stabilizer',
        note: '維持軀幹直立，減少左右晃動。',
      },
      {
        id: 'obliques',
        name: '腹斜肌',
        latin: 'Obliques',
        role: 'stabilizer',
        note: '配合擺臂產生輕微軀幹旋轉。',
      },
      {
        id: 'lower-back',
        name: '豎脊肌',
        latin: 'Erector Spinae',
        role: 'stabilizer',
        note: '維持腰椎中立，避免走路時塌腰。',
      },
    ],
  },
  technique: {
    startCues: [
      '站直、視線看向前方約 5 公尺。',
      '肩膀放鬆、手臂自然下垂。',
      '先求穩定的節奏，再求速度。',
    ],
    phases: [
      {
        step: '01',
        title: '站姿預備',
        subtitle: '身體直立、重心在足中',
        points: [
          '雙腳與髖同寬，腳尖朝前。',
          '肋骨不外翻，肩膀不往前捲。',
          '眼睛看向前方，不低頭看腳。',
        ],
      },
      {
        step: '02',
        title: '腳跟著地',
        subtitle: '溫和接觸、不要重踩',
        points: [
          '腳跟先接觸地面，膝蓋保持微彎。',
          '落地點在身體前方不遠處，不要跨大步。',
          '腳掌迅速從腳跟過渡到足中。',
        ],
      },
      {
        step: '03',
        title: '支撐期',
        subtitle: '單腳承接體重',
        points: [
          '骨盆保持水平，不往支撐腳那一側掉。',
          '足弓微微撐起，避免足底內側塌陷。',
          '身體重心平順通過支撐腳上方。',
        ],
      },
      {
        step: '04',
        title: '推蹬',
        subtitle: '前腳掌把地面推遠',
        points: [
          '小腿與臀部一起出力，不是只墊腳尖。',
          '推蹬結束時腳踝自然伸展。',
          '不要刻意用力蹬地，保持節奏即可。',
        ],
      },
      {
        step: '05',
        title: '擺盪',
        subtitle: '放鬆往前帶',
        points: [
          '髖部帶動大腿向前，膝蓋自然彎曲。',
          '腳掌離地不高，避免多餘的抬腿。',
          '手臂與對側腿同步擺動。',
        ],
      },
    ],
    note: '走路時可以默數步頻。多數人加快步頻後，跨大步與腳跟重落地的問題會自然減少，膝蓋也比較舒服。',
  },
  feeling: [
    '腳步聲小，落地輕。',
    '單腳支撐時骨盆保持水平，不會左右晃。',
    '還能說出完整句子，代表強度在中等地帶。',
    '小腿沒有先緊繃，臀部有微微出力。',
  ],
  dose: [
    { label: '每週總量', value: '150 分鐘', hint: '中等強度；或 75 分鐘高強度' },
    { label: '單次時間', value: '10 分鐘以上', hint: '分段累計也有效，不必一次走完' },
    { label: '每日步數', value: '7,000–8,000 步', hint: '8,000 步相較 4,000 步，全因死亡率低約一半' },
  ],
  levels: [
    {
      level: 'L1',
      title: '扶牆抬腿',
      dosage: '每側 20 下 × 3 組',
      focus: '單腳站立穩定，先建立髖部控制。',
    },
    {
      level: 'L2',
      title: '原地踏步',
      dosage: '10 分鐘',
      focus: '在安全環境練習重心轉移。',
    },
    {
      level: 'L3',
      title: '直線走路',
      dosage: '15–20 分鐘',
      focus: '步幅穩定、落地輕柔。',
    },
    {
      level: 'L4',
      title: '快走',
      dosage: '30 分鐘',
      focus: '提高步頻，維持可對話的呼吸。',
    },
    {
      level: 'L5',
      title: '慢跑',
      dosage: '20 分鐘',
      focus: '落地點在身體正下方，步頻輕快。',
    },
  ],
  errors: [
    {
      title: '錯誤一：跨大步',
      summary: '刻意把腳跨到身體前方很遠，腳跟先著地形成煞車。',
      harms: ['衝擊力直接往上傳到膝蓋與下背。', '步頻下降，走路效率變差。'],
      fix: '把步幅縮小、步頻加快，落地點靠近身體正下方。',
    },
    {
      title: '錯誤二：低頭駝背',
      summary: '視線盯著地面，胸椎彎曲、肩膀前捲。',
      harms: ['頸部與上背緊繃。', '胸腔壓迫，呼吸效率下降。'],
      fix: '視線看向前方約 5 公尺，肩膀往後下方收。',
    },
    {
      title: '錯誤三：只靠小腿發力',
      summary: '臀部沒有參與，推進全靠墊腳尖。',
      harms: ['小腿與足底筋膜容易疲勞。', '膝蓋與髖部沒有分擔力量。'],
      fix: '走路時感覺臀部微微收緊，讓推蹬從髖部開始。',
    },
    {
      title: '錯誤四：骨盆左右擺動',
      summary: '單腳支撐時骨盆往另一側掉，臀中肌沒有穩定住。',
      harms: ['髖部與下背容易痠痛。', '長期可能影響膝蓋排列。'],
      fix: '先練扶牆抬腿與單腳站立，把臀中肌的穩定練回來。',
    },
  ],
  checklist: {
    do: [
      '腳跟先著地，平順過渡到足中。',
      '步頻穩定，落地點靠近身體。',
      '視線前方，肩膀放鬆。',
      '單腳支撐時骨盆保持水平。',
      '手臂與對側腿自然擺動。',
    ],
    dont: [
      '刻意跨大步。',
      '低頭看腳或滑手機。',
      '腳跟重重踩地。',
      '只靠小腿墊腳尖推進。',
      '疲勞時硬撐，讓動作變形。',
    ],
  },
  safety: [
    '步行或跑步時出現胸悶、頭暈或膝蓋刺痛，立即停止。',
    '足底筋膜炎、膝關節或髖關節疼痛期間，先降低時間與強度。',
    '戶外步行請選擇安全路線，夜間穿著反光衣物。',
    '本內容為一般運動知識，不能取代醫療建議。',
  ],
  nextStep: {
    title: '下一步：把快走排進每天',
    detail: '每天 10 分鐘快走，一週就有 70 分鐘。剩下 80 分鐘用週末補，比一次走很久更容易持續。',
  },
  sources: ['hhs2018', 'saintmaurice2020', 'tudorlocke2004', 'heiderscheit2011'],
};

export const PATTERN_ARTICLES: Record<KnowledgePatternId, PatternArticle> = {
  push: PUSH_ARTICLE,
  pull: PULL_ARTICLE,
  squat: SQUAT_ARTICLE,
  hinge: HINGE_ARTICLE,
  locomotion: LOCOMOTION_ARTICLE,
};

export const ARTICLE_ID_BY_PATTERN: Partial<Record<MovementPattern, KnowledgePatternId>> = {
  push: 'push',
  pull: 'pull',
  squat: 'squat',
  hinge: 'hinge',
  lunge: 'squat',
  cardio: 'locomotion',
};
