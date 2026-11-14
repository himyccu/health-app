/**
 * 運動頁「開始之前」兩篇指南的內容。
 *
 * 這裡只放文字資料，畫面由 components/GuideArticle.tsx 負責。
 * 撰寫原則：
 * 1. 只寫有依據的內容（動態暖身、負荷原則、疼痛警訊）。
 * 2. 不出現偏方、療效承諾或未經證實的說法。
 * 3. 每個步驟都要能直接照著做。
 */

export type GuideId = 'warmup' | 'safety' | 'foamRolling';

export interface GuidePoint {
  /** 粗體標題，例如「1. 原地踏步 2 分鐘」 */
  label: string;
  /** 補充說明，可省略 */
  detail?: string;
}

export interface GuideSection {
  heading: string;
  intro?: string;
  points?: GuidePoint[];
  /** 區塊結尾的提醒，會用底色標示 */
  note?: string;
}

export interface Guide {
  id: GuideId;
  title: string;
  summary: string;
  /** 預估閱讀時間（分鐘） */
  minutes: number;
  sections: GuideSection[];
  sources: string[];
}

export const GUIDES: Record<GuideId, Guide> = {
  warmup: {
    id: 'warmup',
    title: '暖身與筋膜放鬆',
    summary: '運動前 5 分鐘的動態暖身，加上三個部位的滾筒與伸展。',
    minutes: 4,
    sections: [
      {
        heading: '為什麼運動前要暖身',
        intro:
          '暖身會讓體溫與肌肉溫度上升、關節潤滑增加、神經徵召變快，動作更穩，受傷機會也會降低。',
        points: [
          {
            label: '動態暖身放在運動前',
            detail: '活動關節、原地踏步、擺腿，讓身體熱起來再進入正式動作。',
          },
          {
            label: '靜態伸展放在運動後',
            detail: '單一肌群維持 30 秒以上，會短暫降低出力，因此不建議放在運動前。',
          },
        ],
      },
      {
        heading: '5 分鐘流程',
        points: [
          { label: '1. 原地踏步或快走 2 分鐘', detail: '微微出汗、呼吸變快即可。' },
          { label: '2. 髖部繞圈 10 次 × 2 方向', detail: '手扶腰，畫圓不用太大。' },
          { label: '3. 肩部繞圈 10 次 × 2 方向', detail: '先小圈，再慢慢加大。' },
          { label: '4. 前後擺腿 10 次 × 2 腳', detail: '扶牆保持平衡，擺幅由小到大。' },
          {
            label: '5. 滾筒放鬆 90 秒',
            detail: '小腿、大腿後側各 90 秒，速度放慢。做法見〈滾筒放鬆〉。',
          },
        ],
      },
      {
        heading: '滾筒放鬆',
        intro: '運動前 30 分鐘內做，每個部位 90 秒至 2 分鐘，痛感維持 5–6 分。',
        note: '六個部位的做法、滾筒怎麼選、哪些位置不能滾，見運動頁的〈滾筒放鬆〉。',
      },
      {
        heading: '這些情況先不要做',
        points: [
          { label: '急性受傷 48 小時內', detail: '先在受傷部位冰敷與休息。' },
          { label: '靜脈曲張或皮膚有傷口', detail: '避開該部位，不要加壓。' },
          {
            label: '嚴重骨質疏鬆、懷孕',
            detail: '先諮詢醫師或物理治療師，再決定是否使用滾筒。',
          },
        ],
      },
    ],
    sources: [
      '衛生福利部國民健康署《全民身體活動指引》',
      '美國運動醫學會（ACSM）《運動測試與處方指引》',
    ],
  },
  safety: {
    id: 'safety',
    title: '運動安全',
    summary: '三個基本原則、痠痛與受傷的差別，以及必須停止的警訊。',
    minutes: 4,
    sections: [
      {
        heading: '三個基本原則',
        points: [
          {
            label: '循序負荷',
            detail: '每週訓練量（時間、次數或重量）增加不超過 10%。',
          },
          {
            label: '不憋氣',
            detail: '用力時吐氣，回到起始位置時吸氣。血壓偏高者更不可閉氣用力。',
          },
          {
            label: '先穩定再加重',
            detail: '動作能在身體不晃動的情況下完成，才增加重量或次數。',
          },
        ],
      },
      {
        heading: '痠痛與受傷的差別',
        points: [
          {
            label: '延遲性肌肉痠痛',
            detail: '運動後 24–48 小時出現，範圍分散，活動後會緩解。',
          },
          {
            label: '傷害痛',
            detail: '動作中立刻出現、集中在單點、特定角度才痛，可能伴隨腫脹或無力。',
          },
        ],
        note: '出現傷害痛就停止該動作，不要用「撐過去」處理。',
      },
      {
        heading: '立即停止並就醫的警訊',
        points: [
          { label: '胸悶、胸痛、呼吸困難' },
          { label: '頭暈、眼前發黑、冒冷汗' },
          { label: '關節腫脹、變形或無法承重' },
          { label: '麻木、無力，或劇痛持續超過 48 小時' },
        ],
      },
      {
        heading: '運動後',
        points: [
          { label: '收操 5 分鐘', detail: '慢走讓心跳慢慢下降。' },
          { label: '靜態伸展', detail: '每個肌群 30 秒 × 2 次。' },
          { label: '補水與睡眠', detail: '恢復主要發生在休息時。' },
        ],
      },
    ],
    sources: [
      '衛生福利部國民健康署《全民身體活動指引》',
      '美國運動醫學會（ACSM）《運動測試與處方指引》',
    ],
  },
  foamRolling: {
    id: 'foamRolling',
    title: '滾筒放鬆',
    summary: '六個部位由下往上，每個 90 秒至 2 分鐘，運動前 30 分鐘內做完。',
    minutes: 8,
    // 內容資料在 data/foamRolling.ts，畫面由 components/FoamRollingGuide.tsx 負責。
    sections: [],
    sources: [],
  },
};

/** 首頁與運動頁顯示的固定順序 */
export const GUIDE_ORDER: GuideId[] = ['warmup', 'safety'];

/** 運動頁「開始之前」的順序，比首頁多一篇滾筒放鬆 */
export const EXERCISE_GUIDE_ORDER: GuideId[] = ['warmup', 'safety', 'foamRolling'];
