/**
 * 全站引用文獻。
 *
 * 規則：
 * 1. 作者、標題、期刊、卷期頁、DOI、PMID 一律照英文原文，不翻譯、不改寫。
 * 2. `zh` 只放一句給畫面用的白話結論，不放進文獻欄位。
 * 3. 每筆都要有查核日期，查不到 DOI 或 PMID 的文獻不收。
 * 4. 美國指引為骨架，國際同儕審閱期刊為血肉，`country` 標國別。
 */

export type SourceKind = 'guideline' | 'meta' | 'rct' | 'review' | 'consensus';

export interface Source {
  id: string;
  /** ISO 3166-1 alpha-2，用於標註國別 */
  country: string;
  kind: SourceKind;
  authors: string;
  title: string;
  /** 期刊全名；書籍或指引留空，改用 publisher */
  journal?: string;
  publisher?: string;
  year: number;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  pmid?: string;
  url?: string;
  /** 查核日期（YYYY-MM-DD） */
  checked: string;
  /** 一句話白話結論，只給畫面用 */
  zh: string;
}

/** 文獻查核日期，全站共用 */
export const SOURCE_CHECKED = '2026-11-14';

export const SOURCES: Record<string, Source> = {
  acsm2018: {
    id: 'acsm2018',
    country: 'US',
    kind: 'guideline',
    authors: 'American College of Sports Medicine.',
    title: "ACSM's Guidelines for Exercise Testing and Prescription. 11th ed.",
    publisher: 'Wolters Kluwer',
    year: 2018,
    checked: SOURCE_CHECKED,
    zh: '柔軟度訓練每週 2–3 次，每個動作 10–30 秒、2–4 組，單一肌群累計 60 秒。',
  },
  hhs2018: {
    id: 'hhs2018',
    country: 'US',
    kind: 'guideline',
    authors: 'U.S. Department of Health and Human Services.',
    title: 'Physical Activity Guidelines for Americans. 2nd ed.',
    publisher: 'U.S. Department of Health and Human Services',
    year: 2018,
    url: 'https://health.gov/our-work/nutrition-physical-activity/physical-activity-guidelines',
    checked: SOURCE_CHECKED,
    zh: '成人每週至少 150 分鐘中等強度有氧，加上 2 次肌力訓練；伸展與活動度屬補充項目。',
  },
  wiewelhove2019: {
    id: 'wiewelhove2019',
    country: 'DE',
    kind: 'meta',
    authors:
      'Wiewelhove T, Döweling A, Schneider C, Hottenrott L, Meyer T, Kellmann M, Pfeiffer M, Ferrauti A.',
    title: 'A Meta-Analysis of the Effects of Foam Rolling on Performance and Recovery.',
    journal: 'Frontiers in Physiology',
    year: 2019,
    volume: '10',
    pages: '376',
    doi: '10.3389/fphys.2019.00376',
    pmid: '31024339',
    checked: SOURCE_CHECKED,
    zh: '滾筒對柔軟度有小幅幫助、對痠痛感有中等幫助，對肌力與跳躍幾乎沒有影響。',
  },
  hofer2026: {
    id: 'hofer2026',
    country: 'AT',
    kind: 'rct',
    authors: 'Hofer J, Behm DG, Nakamura M, Konrad A.',
    title:
      'Acute Structural, Functional, and Biochemical Responses to a High- and Low-Volume Foam Rolling Exercise on the Hamstring Muscles: A Randomized Controlled Trial.',
    journal: 'Sports (Basel)',
    year: 2026,
    volume: '14',
    issue: '8',
    pages: '354',
    doi: '10.3390/sports14080354',
    pmid: '42646892',
    checked: SOURCE_CHECKED,
    zh: '每側滾 2 分鐘與滾 10 分鐘，活動度、肌力、肌肉硬度沒有差別，滾久不會更好。',
  },
  nakamura2021: {
    id: 'nakamura2021',
    country: 'JP',
    kind: 'rct',
    authors: 'Nakamura M, Onuma R, Kiyono R, Yasaka K, Sato S, Yahata K, Fukaya T, Konrad A.',
    title:
      'The Acute and Prolonged Effects of Different Durations of Foam Rolling on Range of Motion, Muscle Stiffness, and Muscle Strength.',
    journal: 'Journal of Sports Science and Medicine',
    year: 2021,
    volume: '20',
    issue: '1',
    pages: '62-68',
    doi: '10.52082/jssm.2021.62',
    pmid: '33707988',
    checked: SOURCE_CHECKED,
    zh: '滾 30 秒沒有效果，累計 90 秒以上才有效；效果 30 分鐘後消失。',
  },
  couture2015: {
    id: 'couture2015',
    country: 'US',
    kind: 'rct',
    authors: 'Couture G, Karlik D, Glass SC, Hatzel BM.',
    title: 'The Effect of Foam Rolling Duration on Hamstring Range of Motion.',
    journal: 'The Open Orthopaedics Journal',
    year: 2015,
    volume: '9',
    pages: '450-455',
    doi: '10.2174/1874325001509010450',
    pmid: '26587061',
    checked: SOURCE_CHECKED,
    zh: '總時間只有 2 分鐘、壓力又不夠時，膝關節活動度沒有改善。',
  },
  fauris2021: {
    id: 'fauris2021',
    country: 'ES',
    kind: 'rct',
    authors:
      'Fauris P, López-de-Celis C, Canet-Vintró M, Martin JC, Llurda-Almuzara L, Rodríguez-Sanz J, Labata-Lezaun N, Simon M, Pérez-Bellmunt A.',
    title:
      'Does Self-Myofascial Release Cause a Remote Hamstring Stretching Effect Based on Myofascial Chains? A Randomized Controlled Trial.',
    journal: 'International Journal of Environmental Research and Public Health',
    year: 2021,
    volume: '18',
    issue: '23',
    pages: '12356',
    doi: '10.3390/ijerph182312356',
    pmid: '34886078',
    checked: SOURCE_CHECKED,
    zh: '滾腳底、小腿或腰背，都能連帶改善大腿後側柔軟度；一半的效果在前 2 分鐘出現。',
  },
  grabow2017: {
    id: 'grabow2017',
    country: 'DE',
    kind: 'rct',
    authors: 'Grabow L, Young JD, Byrne JM, Granacher U, Behm DG.',
    title: 'Unilateral Rolling of the Foot did not Affect Non-Local Range of Motion or Balance.',
    journal: 'Journal of Sports Science and Medicine',
    year: 2017,
    volume: '16',
    issue: '2',
    pages: '209-218',
    pmid: '28630574',
    checked: SOURCE_CHECKED,
    zh: '只滾單腳腳底 3 次 × 60 秒，同側與對側的踝背屈、坐姿體前彎都沒有顯著變化。',
  },
  grabow2018: {
    id: 'grabow2018',
    country: 'DE',
    kind: 'rct',
    authors: 'Grabow L, Young JD, Alcock LR, Quigley PJ, Byrne JM, Granacher U, Škarabot J, Behm DG.',
    title:
      'Higher Quadriceps Roller Massage Forces Do Not Amplify Range-of-Motion Increases nor Impair Strength and Jump Performance.',
    journal: 'Journal of Strength and Conditioning Research',
    year: 2018,
    volume: '32',
    issue: '11',
    pages: '3059-3069',
    doi: '10.1519/JSC.0000000000001906',
    pmid: '30152808',
    checked: SOURCE_CHECKED,
    zh: '痛感 3.9 分、6.2 分、8.2 分三種壓力，活動度增加幅度相同，力量與跳躍不受影響。',
  },
  macdonald2013: {
    id: 'macdonald2013',
    country: 'CA',
    kind: 'rct',
    authors: 'MacDonald GZ, Penney MD, Mullaley ME, Cuconato AL, Drake CD, Behm DG, Button DC.',
    title:
      'An Acute Bout of Self-Myofascial Release Increases Range of Motion Without a Subsequent Decrease in Muscle Activation or Force.',
    journal: 'Journal of Strength and Conditioning Research',
    year: 2013,
    volume: '27',
    issue: '3',
    pages: '812-821',
    doi: '10.1519/JSC.0b013e31825c2bc1',
    pmid: '22580977',
    checked: SOURCE_CHECKED,
    zh: '滾筒後活動度增加，肌肉活化與出力沒有下降，運動前使用不會讓你變弱。',
  },
  beardsley2015: {
    id: 'beardsley2015',
    country: 'GB',
    kind: 'review',
    authors: 'Beardsley C, Škarabot J.',
    title: 'Effects of self-myofascial release: A systematic review.',
    journal: 'Journal of Bodywork and Movement Therapies',
    year: 2015,
    volume: '19',
    issue: '4',
    pages: '747-758',
    doi: '10.1016/j.jbmt.2015.08.007',
    pmid: '26592233',
    checked: SOURCE_CHECKED,
    zh: '急性使用可增加柔軟度、降低痠痛，不影響表現；長期是否真的改變柔軟度，證據仍有衝突。',
  },
  curran2008: {
    id: 'curran2008',
    country: 'US',
    kind: 'rct',
    authors: 'Curran PF, Fiore RD, Crisco JJ.',
    title: 'A comparison of the pressure exerted on soft tissue by 2 myofascial rollers.',
    journal: 'Journal of Sport Rehabilitation',
    year: 2008,
    volume: '17',
    issue: '4',
    pages: '432-442',
    doi: '10.1123/jsr.17.4.432',
    pmid: '19160916',
    checked: SOURCE_CHECKED,
    zh: '不同滾筒壓在軟組織上的壓力不同，太軟的滾筒壓力不足。',
  },
  cheatham2015: {
    id: 'cheatham2015',
    country: 'US',
    kind: 'review',
    authors: 'Cheatham SW, Kolber MJ, Cain M, Lee M.',
    title:
      'The Effects of Self-Myofascial Release Using a Foam Roll or Roller Massager on Joint Range of Motion, Muscle Recovery, and Performance: A Systematic Review.',
    journal: 'International Journal of Sports Physical Therapy',
    year: 2015,
    volume: '10',
    issue: '6',
    pages: '827-838',
    pmid: '26618062',
    checked: SOURCE_CHECKED,
    zh: '滾筒可短暫增加關節活動度、減輕運動後痠痛，對運動表現沒有負面影響。',
  },
  ratamess2009: {
    id: 'ratamess2009',
    country: 'US',
    kind: 'guideline',
    authors: 'American College of Sports Medicine.',
    title:
      'American College of Sports Medicine position stand. Progression models in resistance training for healthy adults.',
    journal: 'Medicine and Science in Sports and Exercise',
    year: 2009,
    volume: '41',
    issue: '3',
    pages: '687-708',
    doi: '10.1249/MSS.0b013e3181915670',
    pmid: '19204579',
    checked: SOURCE_CHECKED,
    zh: '新手每個動作 8–12 下、2–3 組，組間休息 2–3 分鐘；同一肌群每週 2–3 次，中間隔 48 小時。',
  },
  cogley2005: {
    id: 'cogley2005',
    country: 'US',
    kind: 'rct',
    authors:
      'Cogley RM, Archambault TA, Fibeger JF, Koverman MM, Youdas JW, Hollman JH.',
    title:
      'Comparison of muscle activation using various hand positions during the push-up exercise.',
    journal: 'Journal of Strength and Conditioning Research',
    year: 2005,
    volume: '19',
    issue: '3',
    pages: '628-633',
    doi: '10.1519/15094.1',
    pmid: '16095413',
    checked: SOURCE_CHECKED,
    zh: '伏地挺身的手掌位置會改變參與比例：寬握胸大肌較多，窄握三頭肌較多。',
  },
  kibler2010: {
    id: 'kibler2010',
    country: 'US',
    kind: 'review',
    authors: 'Kibler WB, Sciascia A.',
    title: 'Current concepts: scapular dyskinesis.',
    journal: 'British Journal of Sports Medicine',
    year: 2010,
    volume: '44',
    issue: '5',
    pages: '300-305',
    doi: '10.1136/bjsm.2009.058834',
    pmid: '19996329',
    checked: SOURCE_CHECKED,
    zh: '肩胛骨的位置與動作控制會改變肩關節的空間；推與拉之前先把肩胛骨穩住。',
  },
  lusk2010: {
    id: 'lusk2010',
    country: 'US',
    kind: 'rct',
    authors: 'Lusk SJ, Hale BD, Russell DM.',
    title:
      'Grip width and forearm orientation effects on muscle activity during the lat pull-down.',
    journal: 'Journal of Strength and Conditioning Research',
    year: 2010,
    volume: '24',
    issue: '7',
    pages: '1895-1900',
    doi: '10.1519/JSC.0b013e3181ddb0ab',
    pmid: '20543740',
    checked: SOURCE_CHECKED,
    zh: '滑輪下拉的握距與前臂方向會改變背部與二頭的參與，沒有單一握距適合所有人。',
  },
  youdas2010: {
    id: 'youdas2010',
    country: 'US',
    kind: 'rct',
    authors:
      'Youdas JW, Amundson CL, Cicero KS, Hahn JJ, Harezlak DT, Hollman JH.',
    title:
      'Surface electromyographic activation patterns and elbow joint motion during a pull-up, chin-up, or perfect-pullup rotational exercise.',
    journal: 'Journal of Strength and Conditioning Research',
    year: 2010,
    volume: '24',
    issue: '12',
    pages: '3404-3414',
    doi: '10.1519/JSC.0b013e3181f1598c',
    pmid: '21068680',
    checked: SOURCE_CHECKED,
    zh: '引體向上與反握引體的手臂參與比例不同，背闊肌在各種版本都明顯參與。',
  },
  schoenfeld2010: {
    id: 'schoenfeld2010',
    country: 'US',
    kind: 'review',
    authors: 'Schoenfeld BJ.',
    title:
      'Squatting kinematics and kinetics and their application to exercise performance.',
    journal: 'Journal of Strength and Conditioning Research',
    year: 2010,
    volume: '24',
    issue: '12',
    pages: '3497-3506',
    doi: '10.1519/JSC.0b013e3181bac2d7',
    pmid: '20182386',
    checked: SOURCE_CHECKED,
    zh: '蹲的深度與站距會改變髖、膝、踝的力矩分配；在可控制範圍內蹲深，負荷由髖與膝分擔。',
  },
  hartmann2013: {
    id: 'hartmann2013',
    country: 'DE',
    kind: 'review',
    authors: 'Hartmann H, Wirth K, Klusemann M.',
    title:
      'Analysis of the load on the knee joint and vertebral column with changes in squatting depth and weight load.',
    journal: 'Sports Medicine',
    year: 2013,
    volume: '43',
    issue: '10',
    pages: '993-1008',
    doi: '10.1007/s40279-013-0073-6',
    pmid: '23821469',
    checked: SOURCE_CHECKED,
    zh: '蹲得越深，膝與腰椎的力矩越大；目前證據顯示健康的人在正確技術下深蹲不增加膝關節傷害。',
  },
  fry2003: {
    id: 'fry2003',
    country: 'US',
    kind: 'rct',
    authors: 'Fry AC, Smith JC, Schilling BK.',
    title: 'Effect of knee position on hip and knee torques during the barbell squat.',
    journal: 'Journal of Strength and Conditioning Research',
    year: 2003,
    volume: '17',
    issue: '4',
    pages: '629-633',
    doi: '10.1519/1533-4287(2003)017<0629:EOKPOH>2.0.CO;2',
    pmid: '14636100',
    checked: SOURCE_CHECKED,
    zh: '限制膝蓋不能超過腳尖，會把力矩轉移到髖與下背；讓膝蓋自然前移可分散負荷。',
  },
  caterisano2002: {
    id: 'caterisano2002',
    country: 'US',
    kind: 'rct',
    authors: 'Caterisano A, Moss RF, Pellinger TK, Woodruff K, Lewis VC, Booth W, Khadra T.',
    title:
      'The effect of back squat depth on the EMG activity of 4 superficial hip and thigh muscles.',
    journal: 'Journal of Strength and Conditioning Research',
    year: 2002,
    volume: '16',
    issue: '3',
    pages: '428-432',
    pmid: '12173958',
    checked: SOURCE_CHECKED,
    zh: '蹲得越深，臀大肌的參與越多；半蹲對臀部的刺激小於深蹲。',
  },
  hackett2013: {
    id: 'hackett2013',
    country: 'AU',
    kind: 'review',
    authors: 'Hackett DA, Chow CM.',
    title:
      'The Valsalva maneuver: its effect on intra-abdominal pressure and safety issues during resistance exercise.',
    journal: 'Journal of Strength and Conditioning Research',
    year: 2013,
    volume: '27',
    issue: '8',
    pages: '2338-2345',
    doi: '10.1519/JSC.0b013e31827de07d',
    pmid: '23222073',
    checked: SOURCE_CHECKED,
    zh: '憋氣用力可提高腹內壓、穩定軀幹，但會同時升高血壓；有心血管問題的人不適用。',
  },
  swinton2011: {
    id: 'swinton2011',
    country: 'GB',
    kind: 'rct',
    authors: 'Swinton PA, Stewart A, Agouris I, Keogh JW, Lloyd R.',
    title:
      'A biomechanical analysis of straight and hexagonal barbell deadlifts using submaximal loads.',
    journal: 'Journal of Strength and Conditioning Research',
    year: 2011,
    volume: '25',
    issue: '7',
    pages: '2000-2009',
    doi: '10.1519/JSC.0b013e3181e73f87',
    pmid: '21659894',
    checked: SOURCE_CHECKED,
    zh: '六角槓硬舉的重量更靠近身體，髖與膝的力矩都比傳統硬舉小。',
  },
  bengtsson2018: {
    id: 'bengtsson2018',
    country: 'SE',
    kind: 'review',
    authors: 'Bengtsson V, Berglund L, Aasa U.',
    title:
      'Narrative review of injuries in powerlifting with special reference to their association to the squat, bench press and deadlift.',
    journal: 'BMJ Open Sport & Exercise Medicine',
    year: 2018,
    volume: '4',
    issue: '1',
    pages: 'e000382',
    doi: '10.1136/bmjsem-2018-000382',
    pmid: '30057777',
    checked: SOURCE_CHECKED,
    zh: '健力的傷害率不高，多為肌肉拉傷與肌腱過度使用；下背、肩、膝是常見部位，負荷管理比動作本身更關鍵。',
  },
  saintmaurice2020: {
    id: 'saintmaurice2020',
    country: 'US',
    kind: 'review',
    authors:
      'Saint-Maurice PF, Troiano RP, Bassett DR Jr, Graubard BI, Carlson SA, Shiroma EJ, Fulton JE, Matthews CE.',
    title: 'Association of Daily Step Count and Step Intensity With Mortality Among US Adults.',
    journal: 'JAMA',
    year: 2020,
    volume: '323',
    issue: '12',
    pages: '1151-1160',
    doi: '10.1001/jama.2020.1382',
    pmid: '32207799',
    checked: SOURCE_CHECKED,
    zh: '每天 8,000 步相較 4,000 步，全因死亡率低約一半；調整總步數後，步數強度沒有額外好處。',
  },
  tudorlocke2004: {
    id: 'tudorlocke2004',
    country: 'US',
    kind: 'review',
    authors: 'Tudor-Locke C, Bassett DR Jr.',
    title: 'How many steps/day are enough? Preliminary pedometer indices for public health.',
    journal: 'Sports Medicine',
    year: 2004,
    volume: '34',
    issue: '1',
    pages: '1-8',
    doi: '10.2165/00007256-200434010-00001',
    pmid: '14715035',
    checked: SOURCE_CHECKED,
    zh: '成人每日步數分級：少於 5,000 步久坐、7,500–9,999 步稍活躍、10,000 步以上活躍。',
  },
  heiderscheit2011: {
    id: 'heiderscheit2011',
    country: 'US',
    kind: 'rct',
    authors: 'Heiderscheit BC, Chumanov ES, Michalski MP, Wille CM, Ryan MB.',
    title: 'Effects of step rate manipulation on joint mechanics during running.',
    journal: 'Medicine and Science in Sports and Exercise',
    year: 2011,
    volume: '43',
    issue: '2',
    pages: '296-302',
    doi: '10.1249/MSS.0b013e3181ebedf4',
    pmid: '20581720',
    checked: SOURCE_CHECKED,
    zh: '跑步時把步頻提高 5–10%，髖與膝的負荷下降，落地位置更靠近身體。',
  },
  garber2011: {
    id: 'garber2011',
    country: 'US',
    kind: 'guideline',
    authors:
      'Garber CE, Blissmer B, Deschenes MR, Franklin BA, Lamonte MJ, Lee IM, Nieman DC, Swain DP; American College of Sports Medicine.',
    title:
      'American College of Sports Medicine position stand. Quantity and quality of exercise for developing and maintaining cardiorespiratory, musculoskeletal, and neuromotor fitness in apparently healthy adults: guidance for prescribing exercise.',
    journal: 'Medicine and Science in Sports and Exercise',
    year: 2011,
    volume: '43',
    issue: '7',
    pages: '1334-1359',
    doi: '10.1249/MSS.0b013e318213fefb',
    pmid: '21694556',
    checked: SOURCE_CHECKED,
    zh: '柔軟度每週 2–3 次，每個動作 10–30 秒、2–4 組，單一肌群累計 60 秒；靜態伸展在肌肉溫暖時效果最好。',
  },
  oba2026: {
    id: 'oba2026',
    country: 'JP',
    kind: 'meta',
    authors: 'Oba K, Matsuo S, Nakamura M, Nakao G, Fukaya T, Mizuno T, Takeuchi K.',
    title:
      'Moderating Effects of Individual Characteristics and the Target Lower Limb Muscle Group on Flexibility Adaptations to Chronic Static Stretching in Healthy Individuals: A Systematic Review and Meta-Analysis of Randomized Controlled Trials.',
    journal: 'Sports Medicine - Open',
    year: 2026,
    volume: '12',
    issue: '1',
    pages: '95',
    doi: '10.1186/s40798-026-01066-1',
    pmid: '42435098',
    checked: SOURCE_CHECKED,
    zh: '79 篇隨機對照試驗、3,287 人：慢性靜態伸展對下肢柔軟度有中等效果，年齡、性別、訓練程度與肌群都沒有明顯影響。',
  },
  behm2011: {
    id: 'behm2011',
    country: 'CA',
    kind: 'review',
    authors: 'Behm DG, Chaouachi A.',
    title: 'A review of the acute effects of static and dynamic stretching on performance.',
    journal: 'European Journal of Applied Physiology',
    year: 2011,
    volume: '111',
    issue: '11',
    pages: '2633-2651',
    doi: '10.1007/s00421-011-1879-2',
    pmid: '21373870',
    checked: SOURCE_CHECKED,
    zh: '運動前做超過 60 秒的靜態伸展，會短暫降低力量與爆發力；動態暖身不影響表現。',
  },
  lasala2021: {
    id: 'lasala2021',
    country: 'US',
    kind: 'rct',
    authors: 'LaSala TT, Run-Kowzun T, Figueroa M.',
    title: 'The effect of a Hatha Yoga practice on hamstring flexibility.',
    journal: 'Journal of Bodywork and Movement Therapies',
    year: 2021,
    volume: '28',
    pages: '439-449',
    doi: '10.1016/j.jbmt.2021.06.012',
    pmid: '34776176',
    checked: SOURCE_CHECKED,
    zh: '7 週哈達瑜伽（每週 2 次、每次 110 分鐘）讓腿後腱活動度平均增加約 4 度。',
  },
  sharma2026: {
    id: 'sharma2026',
    country: 'IN',
    kind: 'review',
    authors: 'Sharma S, Bhandari SS, Malhotra V, Kuppusamy M, Kumar S, Dhakal M.',
    title:
      'Yoga and its risks: A systematic review of adverse events reported in case reports and case series.',
    journal: 'Journal of Integrative Medicine',
    year: 2026,
    volume: '24',
    issue: '5',
    pages: '667-682',
    doi: '10.1016/j.joim.2026.07.001',
    pmid: '42471295',
    checked: SOURCE_CHECKED,
    zh: '84 例瑜伽不良事件中，肌肉骨骼傷害占 40%，頭倒立是最常被指出的動作（18%），54% 的個案本身有潛在風險因子。',
  },
  li2026: {
    id: 'li2026',
    country: 'CN',
    kind: 'meta',
    authors: 'Li T, Wen Q, Zhang L.',
    title:
      'Is yoga more beneficial than exercise-based interventions for patients with chronic low back pain? A systematic review and meta-analysis.',
    journal: 'Frontiers in Medicine',
    year: 2026,
    volume: '13',
    pages: '1792208',
    doi: '10.3389/fmed.2026.1792208',
    pmid: '42058410',
    checked: SOURCE_CHECKED,
    zh: '慢性下背痛患者做瑜伽，疼痛與失能程度與一般運動相當；身體功能與情緒的優勢證據仍有限。',
  },
};

export type SourceId = keyof typeof SOURCES;

/** 期刊式引用字串，例如 J Sports Sci Med. 2021;20(1):62-68. */
export function citationLocator(source: Source): string {
  if (!source.journal) {
    const publisher = source.publisher ? `${source.publisher}. ` : '';
    return `${publisher}${source.year}.`;
  }
  const volumePart = source.volume ? `${source.year};${source.volume}` : String(source.year);
  const issuePart = source.issue ? `(${source.issue})` : '';
  const pagePart = source.pages ? `:${source.pages}` : '';
  return `${source.journal}. ${volumePart}${issuePart}${pagePart}.`;
}

/** 一行完整引用：作者、標題、期刊卷期頁 */
export function citationLine(source: Source): string {
  return `${source.authors} ${source.title} ${citationLocator(source)}`;
}

/** 對外連結，優先 DOI，其次 PubMed，最後官網 */
export function citationLink(source: Source): string | null {
  if (source.doi) return `https://doi.org/${source.doi}`;
  if (source.pmid) return `https://pubmed.ncbi.nlm.nih.gov/${source.pmid}/`;
  return source.url ?? null;
}
