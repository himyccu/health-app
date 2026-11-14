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
import {
  BREATHING_STEPS,
  DEADLIFT_DO,
  DEADLIFT_DONT,
  DEADLIFT_ERRORS,
  DEADLIFT_INTRO,
  DEADLIFT_MUSCLES,
  DEADLIFT_PHASES,
  IMAGE_CREDITS,
  SAFETY_NOTES,
} from './weightlifting';
import correctImage from '../assets/weightlifting/deadlift-correct.jpg';
import startImage from '../assets/weightlifting/deadlift-start.jpg';
import techniqueImage from '../assets/weightlifting/deadlift-technique.jpg';
import musclesImage from '../assets/weightlifting/deadlift-muscles.jpg';

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

export interface ArticleImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface ArticleComparison {
  image: string;
  imageAlt: string;
  correctTitle: string;
  correctSummary: string;
  wrongTitle: string;
  wrongSummary: string;
  wrongPoints: string[];
  spineDiagram?: boolean;
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
  hero?: ArticleImage;
  anatomy: {
    headline: string;
    summary: string;
    image?: ArticleImage;
    kinesiology: string[];
    muscles: MuscleInvolvement[];
    extraMuscles?: string;
    groups?: { group: string; muscles: string; role: string }[];
    whyWorth?: string;
  };
  technique: {
    image?: ArticleImage;
    startCues?: string[];
    phases: ArticlePhase[];
    breathing?: { title: string; description: string }[];
    coachNote?: string;
    warning?: string;
  };
  levels: ArticleLevel[];
  errors: ArticleError[];
  comparison?: ArticleComparison;
  checklist: { do: string[]; dont: string[] };
  safety: string[];
  credits?: string;
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
    '推，是把重量從身體前方推離。伏地挺身、胸推屬於水平推，肩推屬於垂直推。看起來是手臂在動，實際上是肩胛骨先穩定、軀幹先撐住，手臂才有穩定的平台可以出力。',
  accent: {
    icon: 'bg-sky-50 text-sky-700',
    badge: 'bg-sky-100 text-sky-800',
  },
  anatomy: {
    headline: '推的肌肉分工',
    summary:
      '胸大肌負責水平內收，三角肌前束與三頭肌接手完成推的末段，前鋸肌讓肩胛骨貼著胸廓滑動。核心與臀部把身體變成一塊板子，力量才不會在半途漏掉。',
    kinesiology: [
      '水平推：肩關節水平內收 ＋ 肘伸展，肩胛骨前伸。',
      '垂直推：肩關節屈曲／外展 ＋ 肘伸展，肩胛骨上旋。',
      '手肘與軀幹夾角約 45 度，能降低肩關節前側壓力。',
      '推到底時肩胛骨可以自然前伸，但不要聳肩。',
    ],
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
    whyWorth:
      '推的力量直接影響日常的「推門、撐起身體、把東西放上高處」。先把肩胛與核心的穩定建立起來，再增加重量，肩膀才不會先抗議。',
  },
  technique: {
    startCues: [
      '手掌在肩膀正下方或略寬，指尖朝前。',
      '收緊核心與臀部，頭、背、臀、腳跟成一直線。',
      '肩膀離開耳朵，先把肩胛骨穩定住再開始。',
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
        title: '下降（離心）',
        subtitle: '吸氣、控制速度',
        points: [
          '手肘沿著與軀幹約 45 度的方向彎曲。',
          '胸口下降至離地約一個拳頭，不需要貼地。',
          '全程 2 秒以上，讓肌肉真正承受張力。',
        ],
      },
      {
        step: '03',
        title: '推起（向心）',
        subtitle: '吐氣、腳掌推地',
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
    coachNote:
      '推的品質取決於「肩胛穩定」而不是「手有沒有力」。如果每次推完都是脖子與肩膀痠，先降一個難度，把肩胛控制練回來。',
  },
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
      fix: '手肘與軀幹維持約 45 度，從上方看像一個箭頭而不是 T 字。',
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
    '本內容為運動知識參考，不能取代現場教練指導或醫療建議。',
  ],
};

const PULL_ARTICLE: PatternArticle = {
  id: 'pull',
  eyebrow: 'PULL PATTERN',
  title: '拉：水平拉與垂直拉',
  englishTitle: 'Horizontal & Vertical Pull',
  subtitle: '背部、二頭與肩胛控制的離心技巧',
  intro:
    '拉，是把自己或重量往身體帶。划船屬於水平拉，引體向上與滑輪下拉屬於垂直拉。拉的力量從肩胛開始：先讓肩胛下沉後縮，手肘才有穩定的軌道，背闊肌才真的參與。',
  accent: {
    icon: 'bg-emerald-50 text-emerald-700',
    badge: 'bg-emerald-100 text-emerald-800',
  },
  anatomy: {
    headline: '拉的肌肉分工',
    summary:
      '背闊肌是垂直拉的主力，菱形肌與中下斜方負責把肩胛骨往後收，二頭肌與前臂完成屈肘與握持。核心在這裡的角色是「不讓身體晃動」，因為一旦擺盪，背部就少做很多事。',
    kinesiology: [
      '水平拉：肩關節水平伸展 ＋ 肘屈曲，肩胛骨後縮。',
      '垂直拉：肩關節內收／伸展 ＋ 肘屈曲，肩胛骨下壓。',
      '啟動順序是「肩胛先動、手肘再跟」，不是反過來。',
      '離心（回放）至少 2 秒，是背部訓練最容易忽略的一半。',
    ],
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
    whyWorth:
      '拉的力量平衡了推，也決定站姿好不好看。現代人長時間低頭、圓肩，先把背側練回來，比一直練胸更能改善體態。',
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
        title: '離心回放',
        subtitle: '慢、穩、不放手',
        points: [
          '用 2–3 秒把重量放回起始位置。',
          '回放時保持張力，不要讓配重直接撞擊。',
          '肩膀不完全放鬆，下一組才接得上。',
        ],
      },
    ],
    coachNote:
      '如果拉完是手臂先痠、背部沒感覺，先降低重量，把「肩胛下壓」這個第一步做確實，再慢慢加回來。',
  },
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
      focus: '垂直拉的第一步，控制離心速度。',
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
      summary: '放手讓重量快速上升，離心階段完全沒有張力。',
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
    '本內容為運動知識參考，不能取代現場教練指導或醫療建議。',
  ],
};

const SQUAT_ARTICLE: PatternArticle = {
  id: 'squat',
  eyebrow: 'SQUAT PATTERN',
  title: '蹲：下肢推與膝髖協調',
  englishTitle: 'Squat Pattern',
  subtitle: '股四頭、臀肌與足踝活動度的整合',
  intro:
    '蹲，是髖、膝、踝三個關節同時彎曲再伸直。蹲得深不深，取決於踝關節活動度與髖部控制，不是「膝蓋能不能超過腳尖」。先把腳掌踩穩，膝蓋自然會跟著腳尖走。',
  accent: {
    icon: 'bg-amber-50 text-amber-700',
    badge: 'bg-amber-100 text-amber-800',
  },
  anatomy: {
    headline: '蹲的肌肉分工',
    summary:
      '股四頭肌負責伸膝，臀大肌與內收大肌負責伸髖，小腿穩定腳踝。核心的工作是建立腹壓，讓軀幹在負重下維持剛性；臀中肌則控制膝蓋方向，避免往內夾。',
    kinesiology: [
      '髖關節屈曲再伸展，是蹲起的主要動力。',
      '膝關節屈曲再伸展，股四頭肌負責最後一段伸直。',
      '踝關節背屈不足時，身體會用腳跟離地或骨盆後傾代償。',
      '膝蓋與腳尖同向，能分散膝關節壓力。',
    ],
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
        note: '讓胸口保持打開，槓鈴或重量不往前掉。',
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
    whyWorth:
      '蹲是從椅子站起來、上廁所、撿地上東西的基礎能力。把蹲練好，膝蓋與下背在日常活動中會輕鬆很多。',
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
          '停半秒確認穩定，不需要彈震反彈。',
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
    coachNote:
      '每個人的髖關節構造不同，蹲的深度本來就不一樣。只要腳跟不離地、骨盆不後傾，就是你目前最好的深度。',
  },
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
    '負重深蹲請使用深蹲架與安全槓，並由教練確認動作。',
    '本內容為運動知識參考，不能取代現場教練指導或醫療建議。',
  ],
};

const HINGE_ARTICLE: PatternArticle = {
  id: 'hinge',
  eyebrow: 'HINGE PATTERN',
  title: '髖：硬舉與髖鉸鏈',
  englishTitle: 'Hip Hinge & Deadlift',
  subtitle: '臀腿後側動力鏈、脊柱中立與腹壓',
  intro: DEADLIFT_INTRO,
  accent: {
    icon: 'bg-plum-50 text-plum-700',
    badge: 'bg-plum-900 text-amber-100',
  },
  hero: {
    src: correctImage,
    alt: '硬舉標準起始姿勢示範',
  },
  anatomy: {
    headline: '硬舉主導肌群',
    summary:
      '硬舉不是單一肌肉的動作，而是全身後側動力鏈的協作：臀大肌與膕繩肌負責伸髖，豎脊肌與核心維持脊柱中立，背闊肌與握力讓槓鈴貼近身體。',
    image: {
      src: musclesImage,
      alt: '硬舉主要肌群解剖圖：臀大肌、膕繩肌、豎脊肌、背闊肌與股四頭肌',
      caption: '紅色為主要發力肌群，橘色為中度參與，黃色為輔助穩定肌群。',
    },
    kinesiology: [
      '髖關節伸展是主導動作，膝關節只在起始階段協助推蹬。',
      '槓鈴越貼近身體，下背的力臂越短，壓力越小。',
      '起槓前建立腹壓，讓脊柱在負重下維持中立。',
      '頂點站直即可，不需要腰椎後仰。',
    ],
    muscles: EXERCISE_ANATOMY.deadlift.muscles,
    groups: DEADLIFT_MUSCLES,
    whyWorth:
      '硬舉同時訓練後側動力鏈、軀幹穩定與握力。動作品質比重量更重要；在脊柱中立的前提下逐步增加負荷，才能把力量有效傳導到全身。',
  },
  technique: {
    image: {
      src: startImage,
      alt: '教練確認硬舉起始位置：足中對準槓鈴、背部保持直線、雙手位於雙腿外側',
      caption: '足中對準槓鈴正下方，臀部向後推，背部維持直立，雙手握在雙腿外側。',
    },
    startCues: [
      '背部保持直線，肩膀略微超出槓鈴前側。',
      '腋下向後收緊（夾緊背闊肌）。',
      '大腿約與地面成傾斜夾角，而不是過低的深蹲位置。',
    ],
    phases: DEADLIFT_PHASES,
    breathing: BREATHING_STEPS,
    coachNote:
      '起槓前先建立腹壓、夾緊背闊肌，再推蹬地面。重量是結果，順序才是原因。',
    warning: '初學者可先以自然呼吸搭配核心收緊；有血壓或心血管相關問題，請先諮詢醫師。',
  },
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
      focus: '練習髖向後推與膕繩肌的離心控制。',
    },
    {
      level: 'L3',
      title: '壺鈴硬舉',
      dosage: '10 下 × 3 組',
      focus: '把髖鉸鏈帶到站立姿勢，重量在身體前方。',
    },
    {
      level: 'L4',
      title: '髖外展控制（Hip Airplane）',
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
  errors: DEADLIFT_ERRORS.map((error) => ({
    ...error,
    fix:
      error.title.includes('抬腰')
        ? '起槓前先把胸口抬到肩膀略在槓鈴前方，臀部自然會停在較低的位置。'
        : error.title.includes('仰頭')
          ? '視線固定在前下方約 2 公尺的地面，讓頸椎跟著胸椎走。'
          : '降低重量，先確認背部能在全程維持中立，再逐步加回負荷。',
  })),
  comparison: {
    image: techniqueImage,
    imageAlt: '硬舉正確姿勢：脊柱中立、槓鈴貼近身體',
    correctTitle: '脊柱中立・槓鈴貼腿・肩髖同步',
    correctSummary: '力量平均分散，後側動力鏈有效參與。',
    wrongTitle: '圓背・預先抬腰・仰頭',
    wrongSummary: '剪切力集中在下背，椎間盤風險升高。',
    wrongPoints: ['起始時臀部先抬高', '拉起過程仰頭', '頂峰腰椎過度後仰'],
    spineDiagram: true,
  },
  checklist: {
    do: DEADLIFT_DO,
    dont: DEADLIFT_DONT,
  },
  safety: SAFETY_NOTES,
  credits: IMAGE_CREDITS,
};

const LOCOMOTION_ARTICLE: PatternArticle = {
  id: 'locomotion',
  eyebrow: 'LOCOMOTION',
  title: '移動：走路、跑步與動態穩定',
  englishTitle: 'Locomotion',
  subtitle: '步態、落地緩衝與單腳穩定的基礎',
  intro:
    '移動是日常最常發生的動作模式：走路、快走、慢跑。步態分成支撐期與擺盪期，落地緩衝與單腳穩定決定膝蓋與足底要承受多少負擔。把走路走好，是最划算的訓練。',
  accent: {
    icon: 'bg-rose-50 text-rose-700',
    badge: 'bg-rose-100 text-rose-800',
  },
  anatomy: {
    headline: '移動的肌肉分工',
    summary:
      '臀大肌與小腿負責推進，股四頭肌承接體重，臀中肌在單腳支撐時固定骨盆。核心與豎脊肌不直接產生位移，但沒有它們，每一步的力量都會漏掉一部分。',
    kinesiology: [
      '支撐期：腳跟著地 → 足弓吸震 → 重心通過足中 → 前腳掌推離。',
      '擺盪期：髖屈曲帶腿向前，膝屈曲縮短擺長避免絆到地面。',
      '步頻比步幅更重要；跨大步會形成煞車力，往上傳到膝蓋與下背。',
      '單腳支撐時骨盆保持水平，是臀中肌最重要的工作。',
    ],
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
    whyWorth:
      '走路是最容易持續的運動。與其追求一次走很久，不如每天走一點，並且把步頻與落地品質顧好，膝蓋與足底才不會提早抗議。',
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
    coachNote:
      '走路時可以默數步頻。多數人加快步頻後，跨大步與腳跟重落地的問題會自然減少，膝蓋也比較舒服。',
  },
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
    '步行或跑步時出現胸悶、頭暈或膝蓋刺痛，請立即停止。',
    '足底筋膜炎、膝關節或髖關節疼痛期間，先降低時間與強度。',
    '戶外步行請選擇安全路線，夜間穿著反光衣物。',
    '本內容為運動知識參考，不能取代現場教練指導或醫療建議。',
  ],
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
