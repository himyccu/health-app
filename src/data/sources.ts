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
