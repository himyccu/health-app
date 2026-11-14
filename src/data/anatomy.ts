import type { ExerciseAnatomy, MuscleInvolvement, MuscleRole } from '../types';

/**
 * 動作解剖資料
 *
 * 肌肉角色沿用 ExRx.net 的三層分類：
 * - target（主要）：直接產生動作的肌群
 * - synergist（協同）：協助主要肌群完成動作
 * - stabilizer（穩定）：固定關節與軀幹，讓力量能順利傳導
 *
 * 人體圖層（react-body-highlighter）沒有前鋸肌、旋轉肌袖、髂腰肌等獨立部位，
 * 這些肌肉以文字補述，圖上則以最接近的部位呈現。
 */

export const MUSCLE_ROLE_LABELS: Record<MuscleRole, string> = {
  target: '主要肌群',
  synergist: '協同肌群',
  stabilizer: '穩定肌群',
};

export const MUSCLE_ROLE_ORDER: MuscleRole[] = ['target', 'synergist', 'stabilizer'];

const muscular = (
  id: MuscleInvolvement['id'],
  name: string,
  latin: string,
  role: MuscleRole,
  note: string,
): MuscleInvolvement => ({ id, name, latin, role, note });

export const EXERCISE_ANATOMY: Record<string, ExerciseAnatomy> = {
  walk: {
    classification: { utility: '基礎', mechanics: '多關節全身', force: '交替推蹬' },
    jointActions: [
      { joint: '髖關節', action: '伸展（推進）與屈曲（擺腿）' },
      { joint: '膝關節', action: '伸展與屈曲' },
      { joint: '踝關節', action: '蹠屈推離與背屈緩衝' },
      { joint: '肩關節', action: '前後擺動' },
    ],
    muscles: [
      muscular('gluteal', '臀大肌', 'Gluteus Maximus', 'target', '支撐期伸髖，把身體往前送。'),
      muscular('quadriceps', '股四頭肌', 'Quadriceps', 'target', '承接體重並伸直膝蓋。'),
      muscular('calves', '小腿三頭肌', 'Gastrocnemius / Soleus', 'target', '前腳掌推離地面，是步行的主要推進力。'),
      muscular('hamstring', '膕繩肌', 'Hamstrings', 'synergist', '協助伸髖，並在擺盪期減速小腿。'),
      muscular('adductor', '內收大肌', 'Adductor Magnus', 'synergist', '協助伸髖，穩定大腿位置。'),
      muscular('abs', '腹直肌', 'Rectus Abdominis', 'stabilizer', '維持軀幹直立，減少左右晃動。'),
      muscular('obliques', '腹斜肌', 'Obliques', 'stabilizer', '配合擺臂產生輕微軀幹旋轉。'),
      muscular('abductors', '臀中肌', 'Gluteus Medius', 'stabilizer', '單腳支撐時固定骨盆，避免骨盆下沉。'),
      muscular('lower-back', '豎脊肌', 'Erector Spinae', 'stabilizer', '維持腰椎中立。'),
    ],
    regressions: ['原地踏步', '扶牆原地踏步', '縮短步行時間至 10 分鐘'],
    progressions: ['快走', '上坡步行', '負重背包步行'],
    coachNote: '步行看起來輕鬆，但單腳支撐時骨盆必須保持水平；臀部無力的人容易出現骨盆左右擺動。',
  },

  'brisk-walk': {
    classification: { utility: '基礎', mechanics: '多關節全身', force: '交替推蹬' },
    jointActions: [
      { joint: '髖關節', action: '伸展與屈曲，幅度大於一般步行' },
      { joint: '膝關節', action: '伸展與屈曲' },
      { joint: '踝關節', action: '蹠屈推離與背屈緩衝' },
      { joint: '肘關節', action: '屈曲約 90 度並前後擺動' },
    ],
    muscles: [
      muscular('gluteal', '臀大肌', 'Gluteus Maximus', 'target', '速度加快後，伸髖出力明顯增加。'),
      muscular('quadriceps', '股四頭肌', 'Quadriceps', 'target', '支撐體重、控制膝蓋彎曲。'),
      muscular('calves', '小腿三頭肌', 'Gastrocnemius / Soleus', 'target', '推蹬力量比慢走更大。'),
      muscular('hamstring', '膕繩肌', 'Hamstrings', 'synergist', '協助伸髖與控制擺腿。'),
      muscular('adductor', '內收大肌', 'Adductor Magnus', 'synergist', '協助伸髖。'),
      muscular('abs', '腹直肌', 'Rectus Abdominis', 'stabilizer', '固定軀幹，讓擺臂帶動前進。'),
      muscular('obliques', '腹斜肌', 'Obliques', 'stabilizer', '控制軀幹旋轉。'),
      muscular('abductors', '臀中肌', 'Gluteus Medius', 'stabilizer', '單腳支撐時穩定骨盆。'),
      muscular('lower-back', '豎脊肌', 'Erector Spinae', 'stabilizer', '保持身體直立不駝背。'),
    ],
    regressions: ['一般速度步行', '分段快走（快 3 分、慢 2 分）'],
    progressions: ['上坡快走', '負重快走', '快走與慢跑交替'],
    coachNote: '快走不是把步幅拉大，而是提高步頻；跨大步會讓腳跟變成煞車，膝蓋負擔反而上升。',
  },

  jog: {
    classification: { utility: '基礎', mechanics: '多關節全身', force: '交替推蹬' },
    jointActions: [
      { joint: '髖關節', action: '伸展推進與屈曲擺腿' },
      { joint: '膝關節', action: '屈曲吸震與伸展推蹬' },
      { joint: '踝關節', action: '蹠屈推離、背屈準備落地' },
      { joint: '軀幹', action: '抗旋轉與抗側屈' },
    ],
    muscles: [
      muscular('gluteal', '臀大肌', 'Gluteus Maximus', 'target', '每次推蹬的主要動力來源。'),
      muscular('quadriceps', '股四頭肌', 'Quadriceps', 'target', '落地時吸震、推蹬時伸膝。'),
      muscular('hamstring', '膕繩肌', 'Hamstrings', 'target', '擺盪期末端減速小腿，並協助伸髖。'),
      muscular('calves', '小腿三頭肌', 'Gastrocnemius / Soleus', 'target', '前腳掌落地與離地的主要緩衝與推進。'),
      muscular('adductor', '內收大肌', 'Adductor Magnus', 'synergist', '協助伸髖，穩定大腿。'),
      muscular('abs', '腹直肌', 'Rectus Abdominis', 'stabilizer', '維持骨盆與軀幹的穩定。'),
      muscular('obliques', '腹斜肌', 'Obliques', 'stabilizer', '抵抗跑步時的軀幹旋轉。'),
      muscular('abductors', '臀中肌', 'Gluteus Medius', 'stabilizer', '單腳支撐期防止骨盆下沉與膝蓋內夾。'),
      muscular('lower-back', '豎脊肌', 'Erector Spinae', 'stabilizer', '保持軀幹微微前傾但不塌腰。'),
    ],
    regressions: ['快走', '跑走交替（跑 1 分、走 2 分）', '縮短距離至 1 公里'],
    progressions: ['連續慢跑 20 分鐘', '間歇跑', '上坡跑'],
    coachNote: '落地點盡量落在身體正下方。跨大步會讓腳跟先著地，形成煞車力，衝擊直接往上傳到膝蓋與下背。',
  },

  cycling: {
    classification: { utility: '基礎', mechanics: '多關節下肢', force: '推與拉' },
    jointActions: [
      { joint: '髖關節', action: '屈曲與伸展' },
      { joint: '膝關節', action: '屈曲與伸展' },
      { joint: '踝關節', action: '蹠屈下壓、背屈回勾' },
    ],
    muscles: [
      muscular('quadriceps', '股四頭肌', 'Quadriceps', 'target', '踩踏前段伸膝的主力。'),
      muscular('gluteal', '臀大肌', 'Gluteus Maximus', 'target', '髖伸展帶動踏板通過下方。'),
      muscular('calves', '小腿三頭肌', 'Gastrocnemius / Soleus', 'target', '穩定腳踝，完成踩踏末段。'),
      muscular('hamstring', '膕繩肌', 'Hamstrings', 'synergist', '踩踏後段協助屈膝與上提。'),
      muscular('abs', '腹直肌', 'Rectus Abdominis', 'stabilizer', '支撐上半身，減少下背壓力。'),
      muscular('lower-back', '豎脊肌', 'Erector Spinae', 'stabilizer', '維持軀幹前傾時的脊柱中立。'),
      muscular('forearm', '前臂肌群', 'Forearm', 'stabilizer', '握把手穩定上半身。'),
    ],
    regressions: ['低阻力短程騎乘', '室內飛輪 10 分鐘'],
    progressions: ['增加阻力', '爬坡間歇', '延長騎乘時間至 45 分鐘'],
    coachNote: '坐墊高度以「踩到最低點時膝蓋微彎」為準。坐墊太低會讓膝蓋彎曲過多，是騎車膝痛最常見的原因。',
  },

  'jump-rope': {
    classification: { utility: '輔助', mechanics: '多關節全身', force: '推（下肢）' },
    jointActions: [
      { joint: '踝關節', action: '蹠屈起跳與背屈落地緩衝' },
      { joint: '膝關節', action: '小幅屈曲吸震' },
      { joint: '髖關節', action: '小幅度伸展' },
      { joint: '腕關節', action: '屈伸轉動跳繩' },
    ],
    muscles: [
      muscular('calves', '小腿三頭肌', 'Gastrocnemius / Soleus', 'target', '連續起跳與落地的核心肌群。'),
      muscular('quadriceps', '股四頭肌', 'Quadriceps', 'target', '落地時控制膝蓋彎曲。'),
      muscular('gluteal', '臀大肌', 'Gluteus Maximus', 'synergist', '協助髖伸展，讓跳躍更有力。'),
      muscular('hamstring', '膕繩肌', 'Hamstrings', 'synergist', '協助伸髖與穩定膝關節。'),
      muscular('forearm', '前臂肌群', 'Forearm', 'synergist', '手腕轉繩，控制繩速。'),
      muscular('abs', '腹直肌', 'Rectus Abdominis', 'stabilizer', '維持軀幹直立，避免跳躍時前傾。'),
      muscular('obliques', '腹斜肌', 'Obliques', 'stabilizer', '穩定軀幹，減少左右晃動。'),
      muscular('lower-back', '豎脊肌', 'Erector Spinae', 'stabilizer', '保持脊柱中立。'),
    ],
    regressions: ['無繩空跳', '原地小跳（腳不離地太多）', '每次 30 秒'],
    progressions: ['連續跳 3 分鐘', '單腳跳', '雙迴旋（Double Under）'],
    coachNote: '跳繩的高度只需要讓繩子通過，不必跳到膝蓋抬高。落地越輕、膝蓋微彎，對小腿與足底越友善。',
  },

  swimming: {
    classification: { utility: '基礎', mechanics: '多關節全身', force: '拉' },
    jointActions: [
      { joint: '肩關節', action: '屈曲、伸展與內收（划水）' },
      { joint: '肘關節', action: '屈曲抓水、伸展推水' },
      { joint: '軀幹', action: '沿長軸旋轉' },
      { joint: '髖膝踝', action: '交替打水' },
    ],
    muscles: [
      muscular('upper-back', '背闊肌、大圓肌', 'Latissimus Dorsi / Teres Major', 'target', '划水的主要動力，把身體往前拉。'),
      muscular('chest', '胸大肌', 'Pectoralis Major', 'target', '協助肩內收與推水。'),
      muscular('triceps', '三頭肌', 'Triceps Brachii', 'target', '推水末段伸直手肘。'),
      muscular('front-deltoids', '三角肌前束', 'Anterior Deltoid', 'synergist', '手臂前伸入水與划水起始。'),
      muscular('biceps', '二頭肌', 'Biceps Brachii', 'synergist', '恢復期屈肘，讓手臂回到前方。'),
      muscular('forearm', '前臂肌群', 'Forearm', 'synergist', '划水時保持手掌對水。'),
      muscular('abs', '腹直肌', 'Rectus Abdominis', 'stabilizer', '維持身體成一條水平線。'),
      muscular('obliques', '腹斜肌', 'Obliques', 'stabilizer', '控制軀幹旋轉。'),
      muscular('lower-back', '豎脊肌', 'Erector Spinae', 'stabilizer', '避免換氣時腰部下沉。'),
      muscular('gluteal', '臀大肌', 'Gluteus Maximus', 'stabilizer', '穩定髖部，讓下半身貼近水面。'),
    ],
    regressions: ['浮板打水 25 公尺', '短距離 25 公尺划手', '使用夾腿浮球'],
    progressions: ['連續 400 公尺', '降低划手次數（提高效率）', '加入間歇訓練'],
    coachNote: '換氣是轉頭不是抬頭。抬頭會讓髖部下沉，身體截面變大，阻力也跟著增加。',
  },

  'jumping-jack': {
    classification: { utility: '輔助', mechanics: '多關節全身', force: '推（下肢）' },
    jointActions: [
      { joint: '髖關節', action: '外展與內收' },
      { joint: '肩關節', action: '外展與內收' },
      { joint: '膝關節', action: '落地時小幅屈曲' },
      { joint: '踝關節', action: '蹠屈起跳' },
    ],
    muscles: [
      muscular('calves', '小腿三頭肌', 'Gastrocnemius / Soleus', 'target', '連續起跳的主要動力。'),
      muscular('quadriceps', '股四頭肌', 'Quadriceps', 'target', '落地時控制膝蓋。'),
      muscular('front-deltoids', '三角肌前束', 'Anterior Deltoid', 'target', '把手臂舉到頭頂。'),
      muscular('abductors', '臀中肌', 'Gluteus Medius', 'synergist', '雙腳開合時帶動髖外展。'),
      muscular('gluteal', '臀大肌', 'Gluteus Maximus', 'synergist', '協助起跳與穩定髖部。'),
      muscular('abs', '腹直肌', 'Rectus Abdominis', 'stabilizer', '固定軀幹，避免跳躍時彎腰。'),
      muscular('obliques', '腹斜肌', 'Obliques', 'stabilizer', '穩定軀幹。'),
      muscular('lower-back', '豎脊肌', 'Erector Spinae', 'stabilizer', '維持脊柱中立。'),
    ],
    regressions: ['只做手部動作（不跳）', '單邊開合、左右輪流', '每次 30 秒'],
    progressions: ['連續 3 分鐘', '開合跳接深蹲', '負重背心開合跳'],
    coachNote: '落地時膝蓋微彎、用前腳掌著地。膝蓋打直又重落地，是這個動作最常見的傷害來源。',
  },

  squat: {
    classification: { utility: '基礎', mechanics: '多關節', force: '推（下肢）' },
    jointActions: [
      { joint: '髖關節', action: '屈曲與伸展' },
      { joint: '膝關節', action: '屈曲與伸展' },
      { joint: '踝關節', action: '背屈與蹠屈' },
    ],
    muscles: [
      muscular('quadriceps', '股四頭肌', 'Quadriceps', 'target', '伸膝的主要肌群，負責站起來的末段。'),
      muscular('gluteal', '臀大肌', 'Gluteus Maximus', 'target', '伸髖的主力，決定蹲起的爆發力。'),
      muscular('adductor', '內收大肌', 'Adductor Magnus', 'synergist', '在髖伸展時提供大量協助。'),
      muscular('hamstring', '膕繩肌', 'Hamstrings', 'synergist', '協助伸髖並穩定膝關節。'),
      muscular('calves', '小腿三頭肌', 'Gastrocnemius / Soleus', 'synergist', '穩定腳踝，控制重心。'),
      muscular('abs', '腹直肌', 'Rectus Abdominis', 'stabilizer', '建立腹壓，保護腰椎。'),
      muscular('obliques', '腹斜肌', 'Obliques', 'stabilizer', '維持軀幹剛性。'),
      muscular('lower-back', '豎脊肌', 'Erector Spinae', 'stabilizer', '保持脊柱中立，不圓背。'),
      muscular('upper-back', '背部肌群', 'Upper Back', 'stabilizer', '讓胸口保持打開、槓鈴穩定。'),
      muscular('abductors', '臀中肌', 'Gluteus Medius', 'stabilizer', '控制膝蓋方向，避免內夾。'),
    ],
    regressions: ['椅子深蹲（碰到椅子就站起）', '箱式深蹲', '扶牆深蹲'],
    progressions: ['負重深蹲', '前蹲舉', '保加利亞分腿蹲'],
    coachNote: '蹲的深度以「骨盆不後傾、腳跟不離地」為界。每個人的髖關節活動度不同，不必和別人比誰蹲得低。',
  },

  'split-squat': {
    classification: { utility: '基礎', mechanics: '多關節', force: '推（下肢）' },
    jointActions: [
      { joint: '前腳髖關節', action: '屈曲與伸展' },
      { joint: '前腳膝關節', action: '屈曲與伸展' },
      { joint: '後腳髖關節', action: '伸展' },
      { joint: '踝關節', action: '背屈與蹠屈' },
    ],
    muscles: [
      muscular('quadriceps', '股四頭肌', 'Quadriceps', 'target', '前腳伸膝，主要承重。'),
      muscular('gluteal', '臀大肌', 'Gluteus Maximus', 'target', '前腳伸髖，後腳協助穩定。'),
      muscular('hamstring', '膕繩肌', 'Hamstrings', 'synergist', '穩定膝關節與髖部。'),
      muscular('adductor', '內收大肌', 'Adductor Magnus', 'synergist', '協助伸髖，控制骨盆位置。'),
      muscular('calves', '小腿三頭肌', 'Gastrocnemius / Soleus', 'synergist', '前腳踝穩定、後腳前腳掌支撐。'),
      muscular('abductors', '臀中肌', 'Gluteus Medius', 'stabilizer', '保持骨盆水平，不左右傾倒。'),
      muscular('abs', '腹直肌', 'Rectus Abdominis', 'stabilizer', '維持軀幹直立。'),
      muscular('obliques', '腹斜肌', 'Obliques', 'stabilizer', '抵抗骨盆旋轉。'),
      muscular('lower-back', '豎脊肌', 'Erector Spinae', 'stabilizer', '維持脊柱中立。'),
    ],
    regressions: ['扶椅分腿蹲', '縮短前後步距', '後腳膝蓋不碰地'],
    progressions: ['保加利亞分腿蹲', '負重分腿蹲', '前腳墊高'],
    coachNote: '分腿蹲比雙腳深蹲更考驗單腳穩定。前後步距太近會讓前膝壓力變大，太遠則重心容易跑到後腳。',
  },

  deadlift: {
    classification: { utility: '基礎', mechanics: '多關節', force: '拉' },
    jointActions: [
      { joint: '髖關節', action: '伸展（主導）' },
      { joint: '膝關節', action: '伸展（起始推蹬）' },
      { joint: '踝關節', action: '蹠屈' },
      { joint: '肩胛骨', action: '穩定下壓，維持槓鈴貼近身體' },
      { joint: '肘關節', action: '等長收縮（握住槓鈴）' },
    ],
    muscles: [
      muscular('gluteal', '臀大肌', 'Gluteus Maximus', 'target', '伸髖的主要引擎，把髖部推到站直。'),
      muscular('hamstring', '膕繩肌', 'Hamstrings', 'target', '伸髖並穩定膝關節，感受度最明顯的後側肌群。'),
      muscular('lower-back', '豎脊肌', 'Erector Spinae', 'synergist', '等長收縮維持脊柱中立，抵抗屈曲。'),
      muscular('quadriceps', '股四頭肌', 'Quadriceps', 'synergist', '起槓時推蹬地面。'),
      muscular('upper-back', '背闊肌', 'Latissimus Dorsi', 'synergist', '把槓鈴拉近身體，減少下背力臂。'),
      muscular('forearm', '前臂握力', 'Forearm Flexors', 'synergist', '握住槓鈴，讓力量傳導不中斷。'),
      muscular('trapezius', '斜方肌', 'Trapezius', 'stabilizer', '固定肩胛，避免拉起時聳肩或掉肩。'),
      muscular('abs', '腹直肌', 'Rectus Abdominis', 'stabilizer', '建立腹壓，形成保護脊柱的氣墊。'),
      muscular('obliques', '腹斜肌', 'Obliques', 'stabilizer', '提供全向的核心剛性。'),
      muscular('calves', '小腿三頭肌', 'Gastrocnemius / Soleus', 'stabilizer', '穩定腳踝與足弓。'),
    ],
    regressions: ['臀橋', '輕重量羅馬尼亞硬舉', '壺鈴硬舉'],
    progressions: ['傳統硬舉加重', '相撲硬舉', '單腳羅馬尼亞硬舉'],
    coachNote: '硬舉是髖主導的動作，不是用手把槓鈴拉起來。起槓前先建立腹壓、夾緊背闊肌，再推蹬地面。',
  },

  'glute-bridge': {
    classification: { utility: '輔助', mechanics: '多關節', force: '推（髖）' },
    jointActions: [
      { joint: '髖關節', action: '伸展' },
      { joint: '膝關節', action: '等長屈曲（腳掌踩地）' },
      { joint: '踝關節', action: '背屈維持腳掌貼地' },
    ],
    muscles: [
      muscular('gluteal', '臀大肌', 'Gluteus Maximus', 'target', '把髖部推高，是唯一的主角。'),
      muscular('hamstring', '膕繩肌', 'Hamstrings', 'target', '協助伸髖，離心控制下降。'),
      muscular('adductor', '內收大肌', 'Adductor Magnus', 'synergist', '協助伸髖。'),
      muscular('abs', '腹直肌', 'Rectus Abdominis', 'stabilizer', '固定骨盆，避免用下背拱起。'),
      muscular('obliques', '腹斜肌', 'Obliques', 'stabilizer', '防止骨盆左右傾斜。'),
      muscular('lower-back', '豎脊肌', 'Erector Spinae', 'stabilizer', '維持腰椎穩定，不代償伸展。'),
    ],
    regressions: ['骨盆時鐘（小幅前後傾）', '雙腳靠近臀部的臀橋'],
    progressions: ['單腳臀橋', '負重臀橋', '臀推（Hip Thrust）'],
    coachNote: '頂點是「髖伸直」而不是「腰拱起來」。若做完是下背痠而不是臀部痠，代表發力位置跑掉了。',
  },

  'push-up': {
    classification: { utility: '基礎', mechanics: '多關節', force: '推' },
    jointActions: [
      { joint: '肩關節', action: '水平內收與屈曲' },
      { joint: '肘關節', action: '屈曲與伸展' },
      { joint: '肩胛骨', action: '前伸與後縮' },
      { joint: '軀幹', action: '抗伸展（維持一直線）' },
    ],
    muscles: [
      muscular('chest', '胸大肌', 'Pectoralis Major', 'target', '把上臂帶向身體中線，是水平推的主力。'),
      muscular('triceps', '三頭肌', 'Triceps Brachii', 'target', '伸直手肘，完成推起的末段。'),
      muscular('front-deltoids', '三角肌前束', 'Anterior Deltoid', 'target', '協助肩屈曲與水平內收。'),
      muscular('abs', '腹直肌', 'Rectus Abdominis', 'stabilizer', '避免腰部下沉。'),
      muscular('obliques', '腹斜肌', 'Obliques', 'stabilizer', '防止身體左右晃動。'),
      muscular('lower-back', '豎脊肌', 'Erector Spinae', 'stabilizer', '與核心共同維持軀幹剛性。'),
      muscular('gluteal', '臀大肌', 'Gluteus Maximus', 'stabilizer', '夾臀讓骨盆不塌。'),
      muscular('quadriceps', '股四頭肌', 'Quadriceps', 'stabilizer', '大腿出力，讓膝蓋離地。'),
    ],
    extraMuscles:
      '前鋸肌（Serratus Anterior）負責肩胛骨前伸與貼合胸廓，圖層沒有獨立部位，以背部呈現；旋轉肌袖則負責穩定肩關節。',
    regressions: ['牆壁伏地挺身', '上斜伏地挺身（桌沿）', '跪姿伏地挺身'],
    progressions: ['標準伏地挺身', '腳抬高伏地挺身', '負重伏地挺身'],
    coachNote: '手肘與軀幹約 45 度，不是完全外張。外張成 90 度會讓肩關節前側承受較大壓力。',
  },

  'pull-up': {
    classification: { utility: '基礎', mechanics: '多關節', force: '拉' },
    jointActions: [
      { joint: '肩關節', action: '內收與伸展' },
      { joint: '肘關節', action: '屈曲' },
      { joint: '肩胛骨', action: '下壓與後縮' },
    ],
    muscles: [
      muscular('upper-back', '背闊肌', 'Latissimus Dorsi', 'target', '把上臂往身體拉，是垂直拉的主力。'),
      muscular('biceps', '二頭肌', 'Biceps Brachii', 'target', '屈肘，讓胸口靠近橫桿。'),
      muscular('back-deltoids', '三角肌後束', 'Posterior Deltoid', 'synergist', '協助肩伸展。'),
      muscular('trapezius', '中下斜方肌', 'Trapezius', 'synergist', '肩胛下壓與後縮，讓背部先啟動。'),
      muscular('forearm', '前臂握力', 'Forearm Flexors', 'synergist', '握住橫桿，維持張力。'),
      muscular('abs', '腹直肌', 'Rectus Abdominis', 'stabilizer', '避免身體前後擺盪。'),
      muscular('obliques', '腹斜肌', 'Obliques', 'stabilizer', '控制軀幹旋轉。'),
      muscular('lower-back', '豎脊肌', 'Erector Spinae', 'stabilizer', '維持身體穩定不塌腰。'),
    ],
    extraMuscles: '大圓肌與菱形肌（圖層歸在背部）同樣參與下拉與肩胛後縮。',
    regressions: ['彈力帶輔助引體', '斜身引體（Inverted Row）', '離心引體（跳上去慢慢下降）'],
    progressions: ['標準引體向上', '負重引體', '寬握引體'],
    coachNote: '先下壓肩胛骨再彎手肘。直接用手臂拉，會讓二頭先累，背部反而沒有參與。',
  },

  'lat-pulldown': {
    classification: { utility: '基礎', mechanics: '多關節', force: '拉' },
    jointActions: [
      { joint: '肩關節', action: '內收' },
      { joint: '肘關節', action: '屈曲' },
      { joint: '肩胛骨', action: '下壓與後縮' },
    ],
    muscles: [
      muscular('upper-back', '背闊肌', 'Latissimus Dorsi', 'target', '把手肘往身體側面帶，是下拉的主力。'),
      muscular('biceps', '二頭肌', 'Biceps Brachii', 'target', '屈肘完成動作。'),
      muscular('back-deltoids', '三角肌後束', 'Posterior Deltoid', 'synergist', '協助肩內收。'),
      muscular('trapezius', '中下斜方肌', 'Trapezius', 'synergist', '肩胛下壓與後縮。'),
      muscular('forearm', '前臂握力', 'Forearm Flexors', 'synergist', '握住握把。'),
      muscular('abs', '腹直肌', 'Rectus Abdominis', 'stabilizer', '固定軀幹，避免大幅後仰借力。'),
      muscular('lower-back', '豎脊肌', 'Erector Spinae', 'stabilizer', '維持坐姿穩定。'),
    ],
    extraMuscles: '大圓肌、菱形肌與肱橈肌同樣參與下拉動作。',
    regressions: ['彈力帶下拉', '輕重量滑輪下拉', '單手下拉'],
    progressions: ['增加重量', '引體向上', '慢速離心下拉'],
    coachNote: '回放時保持張力，讓重量慢慢上升。直接放手讓配重撞擊，會失去訓練效果也容易受傷。',
  },

  'shoulder-press': {
    classification: { utility: '基礎', mechanics: '多關節', force: '推' },
    jointActions: [
      { joint: '肩關節', action: '屈曲與外展' },
      { joint: '肘關節', action: '伸展' },
      { joint: '肩胛骨', action: '上旋與上提' },
    ],
    muscles: [
      muscular('front-deltoids', '三角肌前束', 'Anterior Deltoid', 'target', '把手臂往上推的主要肌群。'),
      muscular('triceps', '三頭肌', 'Triceps Brachii', 'target', '伸直手肘，完成推舉末段。'),
      muscular('trapezius', '斜方肌上束', 'Trapezius', 'synergist', '上旋肩胛骨，讓手臂舉得更高。'),
      muscular('upper-back', '背部肌群', 'Upper Back', 'stabilizer', '穩定肩胛，避免推到一半掉肩。'),
      muscular('abs', '腹直肌', 'Rectus Abdominis', 'stabilizer', '避免肋骨外翻與腰部代償。'),
      muscular('obliques', '腹斜肌', 'Obliques', 'stabilizer', '穩定軀幹，抵抗側向偏移。'),
      muscular('lower-back', '豎脊肌', 'Erector Spinae', 'stabilizer', '維持站姿的脊柱中立。'),
      muscular('gluteal', '臀大肌', 'Gluteus Maximus', 'stabilizer', '夾臀讓骨盆穩定，力量不下漏。'),
    ],
    extraMuscles: '三角肌中束（圖層未獨立）負責肩外展；旋轉肌袖穩定肩關節。',
    regressions: ['坐姿啞鈴肩推', '地雷管推（Landmine Press）', '輕重量單手推'],
    progressions: ['站姿肩推', '單手肩推', '負重肩推'],
    coachNote: '推起時讓頭部自然讓出空間，手臂在耳朵旁而不是身體前方。腰不要為了推上去而過度後仰。',
  },

  'dumbbell-row': {
    classification: { utility: '基礎', mechanics: '多關節', force: '拉' },
    jointActions: [
      { joint: '肩關節', action: '伸展與水平外展後拉' },
      { joint: '肘關節', action: '屈曲' },
      { joint: '肩胛骨', action: '後縮' },
    ],
    muscles: [
      muscular('upper-back', '背闊肌、菱形肌', 'Latissimus Dorsi / Rhomboids', 'target', '把肩胛骨往後收，手肘往後帶。'),
      muscular('trapezius', '中下斜方肌', 'Trapezius', 'target', '肩胛後縮與下壓。'),
      muscular('back-deltoids', '三角肌後束', 'Posterior Deltoid', 'synergist', '協助肩水平伸展。'),
      muscular('biceps', '二頭肌', 'Biceps Brachii', 'synergist', '屈肘，讓重量靠近身體。'),
      muscular('forearm', '前臂握力', 'Forearm Flexors', 'synergist', '握住啞鈴。'),
      muscular('abs', '腹直肌', 'Rectus Abdominis', 'stabilizer', '固定軀幹，避免身體旋轉。'),
      muscular('obliques', '腹斜肌', 'Obliques', 'stabilizer', '抵抗旋轉，讓背部保持水平。'),
      muscular('lower-back', '豎脊肌', 'Erector Spinae', 'stabilizer', '維持俯身時的脊柱中立。'),
      muscular('hamstring', '膕繩肌', 'Hamstrings', 'stabilizer', '支撐髖部彎曲的姿勢。'),
    ],
    regressions: ['三點支撐划船（單手扶椅）', '彈力帶坐姿划船', '輕重量划船'],
    progressions: ['單手加重划船', '俯身槓鈴划船', '暫停式划船'],
    coachNote: '手肘貼近身體往後拉，像把肩胛骨夾起來。身體旋轉借力會讓背闊肌少做很多事。',
  },

  plank: {
    classification: { utility: '基礎', mechanics: '多關節等長', force: '穩定' },
    jointActions: [
      { joint: '軀幹', action: '抗伸展與抗側屈（等長）' },
      { joint: '肩關節', action: '屈曲支撐（等長）' },
      { joint: '髖關節', action: '伸展（等長）' },
    ],
    muscles: [
      muscular('abs', '腹直肌、腹橫肌', 'Rectus Abdominis / Transversus', 'target', '抵抗腰部下沉，維持軀幹一直線。'),
      muscular('obliques', '腹斜肌', 'Obliques', 'target', '防止骨盆左右晃動。'),
      muscular('gluteal', '臀大肌', 'Gluteus Maximus', 'synergist', '夾臀幫助骨盆後傾，減少下背壓力。'),
      muscular('quadriceps', '股四頭肌', 'Quadriceps', 'synergist', '大腿出力，讓膝蓋離地。'),
      muscular('front-deltoids', '三角肌前束', 'Anterior Deltoid', 'stabilizer', '支撐上半身重量。'),
      muscular('triceps', '三頭肌', 'Triceps Brachii', 'stabilizer', '穩定手肘，維持前臂支撐。'),
      muscular('lower-back', '豎脊肌', 'Erector Spinae', 'stabilizer', '與核心共同維持脊柱中立。'),
      muscular('trapezius', '斜方肌', 'Trapezius', 'stabilizer', '穩定肩胛，避免整個人往肩膀塌。'),
    ],
    regressions: ['膝蓋著地棒式', '上斜棒式（手扶桌沿）', '每次 10–15 秒'],
    progressions: ['側棒式', '抬手棒式', '負重棒式'],
    coachNote: '棒式比的是「撐得穩」，不是「撐得久」。一旦腰部開始下沉，就該休息，硬撐反而傷下背。',
  },

  'dead-bug': {
    classification: { utility: '輔助', mechanics: '多關節等長', force: '穩定' },
    jointActions: [
      { joint: '軀幹', action: '抗伸展（等長）' },
      { joint: '髖關節', action: '屈曲與伸展控制' },
      { joint: '肩關節', action: '屈曲（等長）' },
    ],
    muscles: [
      muscular('abs', '腹直肌、腹橫肌', 'Rectus Abdominis / Transversus', 'target', '讓下背貼地，抵抗四肢延伸帶來的張力。'),
      muscular('obliques', '腹斜肌', 'Obliques', 'target', '對側手腳延伸時抵抗旋轉。'),
      muscular('quadriceps', '股四頭肌', 'Quadriceps', 'synergist', '控制伸腿的速度。'),
      muscular('lower-back', '豎脊肌', 'Erector Spinae', 'stabilizer', '維持腰椎貼近地面。'),
      muscular('gluteal', '臀大肌', 'Gluteus Maximus', 'stabilizer', '穩定骨盆，避免拱腰。'),
    ],
    regressions: ['雙手扶膝、單腳點地', '只做單腳延伸', '縮小延伸幅度'],
    progressions: ['對側手腳同時延伸', '彈力帶加阻力', '負重死蟲式'],
    coachNote: '下背一離地就代表幅度太大了。把動作做小、做慢，效果比追大幅度更好。',
  },

  yoga: {
    classification: { utility: '輔助', mechanics: '多關節活動度', force: '穩定與伸展' },
    jointActions: [
      { joint: '髖關節', action: '屈曲、伸展與外展' },
      { joint: '脊柱', action: '屈曲、伸展與旋轉' },
      { joint: '肩關節', action: '屈曲與外展' },
    ],
    muscles: [
      muscular('abs', '腹直肌', 'Rectus Abdominis', 'target', '在平衡與扭轉姿勢中穩定軀幹。'),
      muscular('gluteal', '臀大肌', 'Gluteus Maximus', 'target', '支撐站姿與後彎動作。'),
      muscular('hamstring', '膕繩肌', 'Hamstrings', 'target', '前彎與伸展時的主要伸展部位。'),
      muscular('quadriceps', '股四頭肌', 'Quadriceps', 'synergist', '弓箭步與站姿的支撐。'),
      muscular('upper-back', '背部肌群', 'Upper Back', 'synergist', '維持後彎與扭轉時的胸腔打開。'),
      muscular('obliques', '腹斜肌', 'Obliques', 'stabilizer', '控制扭轉幅度。'),
      muscular('lower-back', '豎脊肌', 'Erector Spinae', 'stabilizer', '保護腰椎，避免過度後彎。'),
      muscular('calves', '小腿三頭肌', 'Gastrocnemius / Soleus', 'stabilizer', '站姿平衡時穩定腳踝。'),
    ],
    regressions: ['溫和伸展序列', '使用瑜伽磚與抱枕', '縮短停留時間'],
    progressions: ['流動序列（Vinyasa）', '單腳平衡姿勢', '進階後彎'],
    coachNote: '伸展到「緊但可以呼吸」就好。憋氣或疼痛代表超過目前活動度，先退回一點。',
  },

  stretch: {
    classification: { utility: '輔助', mechanics: '單關節伸展', force: '伸展' },
    jointActions: [
      { joint: '髖關節', action: '屈曲（被動伸展後側）' },
      { joint: '膝關節', action: '伸展' },
      { joint: '踝關節', action: '背屈' },
    ],
    muscles: [
      muscular('hamstring', '膕繩肌', 'Hamstrings', 'target', '前彎時被拉長的主要肌群。'),
      muscular('calves', '小腿三頭肌', 'Gastrocnemius / Soleus', 'target', '小腿伸展時的主要目標。'),
      muscular('abs', '腹直肌', 'Rectus Abdominis', 'stabilizer', '維持呼吸與軀幹穩定。'),
      muscular('lower-back', '豎脊肌', 'Erector Spinae', 'stabilizer', '控制前彎幅度，避免腰椎過度屈曲。'),
    ],
    regressions: ['縮小伸展幅度', '屈膝伸展', '每次 10 秒'],
    progressions: ['延長至 30–45 秒', 'PNF 伸展', '加入對側收縮'],
    coachNote: '靜態伸展放在運動後或獨立時段。運動前做長時間靜態伸展，反而會短暫降低出力。',
  },
};

export function getExerciseAnatomy(exerciseId: string): ExerciseAnatomy | null {
  return EXERCISE_ANATOMY[exerciseId] ?? null;
}
