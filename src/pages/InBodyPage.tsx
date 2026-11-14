import { useState } from 'react';
import { ArrowLeft, Info, Plus, Save, Sparkles, Trash2 } from 'lucide-react';
import type { BodyCompositionEntry, Profile } from '../types';
import { dateKey } from '../lib/storage';
import {
  addBodyComposition,
  deleteBodyComposition,
  loadBodyCompositions,
} from '../lib/bodyCompositionStorage';
import {
  STATUS_TEXT,
  evaluateBodyComposition,
  symmetryText,
} from '../lib/bodyComposition';
import type { Status } from '../lib/bodyComposition';
import { GUIDE_ORDER, GUIDES } from '../data/guides';
import type { GuideId } from '../data/guides';
import { PageHeader } from '../components/PageHeader';
import { SectionHeading } from '../components/SectionHeading';
import { SegmentFigure } from '../components/SegmentFigure';

interface InBodyPageProps {
  profile: Profile;
  onBack: () => void;
  onGoHome: () => void;
  onNotify: (message: string) => void;
  onOpenGuide: (guideId: GuideId) => void;
}

interface FieldConfig {
  key: string;
  label: string;
  unit: string;
  step: string;
  placeholder?: string;
}

const REQUIRED_FIELDS: FieldConfig[] = [
  { key: 'weight', label: '體重', unit: 'kg', step: '0.1', placeholder: '例 62.4' },
  { key: 'skeletalMuscle', label: '骨骼肌重', unit: 'kg', step: '0.1', placeholder: '例 26.8' },
  { key: 'bodyFatMass', label: '體脂肪重', unit: 'kg', step: '0.1', placeholder: '例 18.2' },
  { key: 'bodyFatPercent', label: '體脂肪率', unit: '%', step: '0.1', placeholder: '例 29.2' },
  { key: 'visceralFatLevel', label: '內臟脂肪等級', unit: '級', step: '1', placeholder: '1–20' },
  { key: 'bmr', label: '基礎代謝率', unit: 'kcal', step: '1', placeholder: '例 1280' },
];

const MUSCLE_FIELDS: FieldConfig[] = [
  { key: 'muscleRightArm', label: '右臂', unit: 'kg', step: '0.1' },
  { key: 'muscleLeftArm', label: '左臂', unit: 'kg', step: '0.1' },
  { key: 'muscleTrunk', label: '軀幹', unit: 'kg', step: '0.1' },
  { key: 'muscleRightLeg', label: '右腿', unit: 'kg', step: '0.1' },
  { key: 'muscleLeftLeg', label: '左腿', unit: 'kg', step: '0.1' },
];

const FAT_FIELDS: FieldConfig[] = [
  { key: 'fatRightArm', label: '右臂', unit: 'kg', step: '0.1' },
  { key: 'fatLeftArm', label: '左臂', unit: 'kg', step: '0.1' },
  { key: 'fatTrunk', label: '軀幹', unit: 'kg', step: '0.1' },
  { key: 'fatRightLeg', label: '右腿', unit: 'kg', step: '0.1' },
  { key: 'fatLeftLeg', label: '左腿', unit: 'kg', step: '0.1' },
];

const ADVANCED_FIELDS: FieldConfig[] = [
  { key: 'waistHipRatio', label: '腰臀比', unit: '', step: '0.01', placeholder: '例 0.88' },
  { key: 'visceralFatArea', label: '內臟脂肪面積', unit: 'cm²', step: '1', placeholder: '例 92' },
  { key: 'ecwTbw', label: 'ECW/TBW', unit: '', step: '0.001', placeholder: '例 0.381' },
  { key: 'inbodyScore', label: 'InBody 分數', unit: '分', step: '1', placeholder: '0–100' },
  { key: 'bodyAge', label: '身體年齡', unit: '歲', step: '1', placeholder: '例 38' },
];

const STATUS_STYLE: Record<Status, string> = {
  normal: 'bg-emerald-50 text-emerald-700',
  low: 'bg-sky-50 text-sky-700',
  high: 'bg-amber-50 text-amber-800',
  veryHigh: 'bg-rose-50 text-rose-700',
  none: 'bg-slate-100 text-slate-500',
};

function emptyForm(): Record<string, string> {
  const values: Record<string, string> = { date: dateKey() };
  [...REQUIRED_FIELDS, ...MUSCLE_FIELDS, ...FAT_FIELDS, ...ADVANCED_FIELDS].forEach((field) => {
    values[field.key] = '';
  });
  return values;
}

function entryToForm(entry: BodyCompositionEntry): Record<string, string> {
  const text = (value: number) => (value > 0 ? String(value) : '');
  return {
    date: entry.date,
    weight: text(entry.weight),
    skeletalMuscle: text(entry.skeletalMuscle),
    bodyFatMass: text(entry.bodyFatMass),
    bodyFatPercent: text(entry.bodyFatPercent),
    visceralFatLevel: text(entry.visceralFatLevel),
    bmr: text(entry.bmr),
    muscleRightArm: text(entry.segmentMuscle.rightArm),
    muscleLeftArm: text(entry.segmentMuscle.leftArm),
    muscleTrunk: text(entry.segmentMuscle.trunk),
    muscleRightLeg: text(entry.segmentMuscle.rightLeg),
    muscleLeftLeg: text(entry.segmentMuscle.leftLeg),
    fatRightArm: text(entry.segmentFat.rightArm),
    fatLeftArm: text(entry.segmentFat.leftArm),
    fatTrunk: text(entry.segmentFat.trunk),
    fatRightLeg: text(entry.segmentFat.rightLeg),
    fatLeftLeg: text(entry.segmentFat.leftLeg),
    waistHipRatio: text(entry.waistHipRatio),
    visceralFatArea: text(entry.visceralFatArea),
    ecwTbw: text(entry.ecwTbw),
    inbodyScore: text(entry.inbodyScore),
    bodyAge: text(entry.bodyAge),
  };
}

function formToEntry(values: Record<string, string>, existingId?: string): BodyCompositionEntry {
  const num = (key: string) => {
    const value = Number(values[key]);
    return Number.isFinite(value) && value > 0 ? value : 0;
  };
  return {
    id: existingId ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    date: values.date || dateKey(),
    createdAt: new Date().toISOString(),
    weight: num('weight'),
    skeletalMuscle: num('skeletalMuscle'),
    bodyFatMass: num('bodyFatMass'),
    bodyFatPercent: num('bodyFatPercent'),
    visceralFatLevel: num('visceralFatLevel'),
    bmr: num('bmr'),
    segmentMuscle: {
      rightArm: num('muscleRightArm'),
      leftArm: num('muscleLeftArm'),
      trunk: num('muscleTrunk'),
      rightLeg: num('muscleRightLeg'),
      leftLeg: num('muscleLeftLeg'),
    },
    segmentFat: {
      rightArm: num('fatRightArm'),
      leftArm: num('fatLeftArm'),
      trunk: num('fatTrunk'),
      rightLeg: num('fatRightLeg'),
      leftLeg: num('fatLeftLeg'),
    },
    waistHipRatio: num('waistHipRatio'),
    visceralFatArea: num('visceralFatArea'),
    ecwTbw: num('ecwTbw'),
    inbodyScore: num('inbodyScore'),
    bodyAge: num('bodyAge'),
  };
}

export function InBodyPage({ profile, onBack, onGoHome, onNotify, onOpenGuide }: InBodyPageProps) {
  const [records, setRecords] = useState<BodyCompositionEntry[]>(() => loadBodyCompositions());
  const [editing, setEditing] = useState(() => loadBodyCompositions().length === 0);
  const [editingId, setEditingId] = useState<string | undefined>();
  const [values, setValues] = useState<Record<string, string>>(() => {
    const list = loadBodyCompositions();
    return list[0] ? entryToForm(list[0]) : emptyForm();
  });
  const [segmentTab, setSegmentTab] = useState<'muscle' | 'fat'>('muscle');

  const latest = records[0] ?? null;
  const result = latest ? evaluateBodyComposition(latest, profile) : null;

  const setValue = (key: string, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const handleNew = () => {
    setEditingId(undefined);
    setValues(emptyForm());
    setEditing(true);
  };

  const handleEdit = () => {
    if (!latest) return;
    setEditingId(latest.id);
    setValues(entryToForm(latest));
    setEditing(true);
  };

  const handleSave = () => {
    const entry = formToEntry(values, editingId);
    if (
      entry.weight <= 0 ||
      entry.skeletalMuscle <= 0 ||
      entry.bodyFatMass <= 0 ||
      entry.bodyFatPercent <= 0 ||
      entry.visceralFatLevel <= 0 ||
      entry.bmr <= 0
    ) {
      onNotify('請填寫六個必填欄位');
      return;
    }
    const next = addBodyComposition(entry);
    setRecords(next);
    setEditing(false);
    setEditingId(undefined);
    onNotify('身體組成已儲存');
  };

  const handleDelete = () => {
    if (!latest) return;
    const next = deleteBodyComposition(latest.id);
    setRecords(next);
    setEditing(next.length === 0);
    setValues(emptyForm());
    onNotify('已刪除這筆身體組成');
  };

  const fatMismatch = (() => {
    const weight = Number(values.weight);
    const fatMass = Number(values.bodyFatMass);
    const percent = Number(values.bodyFatPercent);
    if (!(weight > 0 && fatMass > 0 && percent > 0)) return 0;
    return Math.abs((fatMass / weight) * 100 - percent);
  })();

  return (
    <div>
      <PageHeader
        title="身體組成"
        description="依 InBody 報告填寫，只判讀有公開標準的項目。"
        onHome={onGoHome}
      />

      <button
        type="button"
        onClick={onBack}
        className="mb-4 inline-flex min-h-11 items-center gap-1.5 rounded-full border border-plum-100 bg-white px-3.5 text-[15px] font-black text-plum-900 shadow-sm transition hover:bg-plum-50"
      >
        <ArrowLeft className="h-4 w-4" />
        回到健康指數
      </button>

      {editing ? (
        <div className="space-y-4">
          <section className="rounded-[28px] border border-plum-100 bg-white p-5 shadow-sm shadow-plum-900/5">
            <SectionHeading icon={Plus} title="① 基本資料" subtitle="六項必填" />

            <label className="mt-4 block">
              <span className="text-[13px] font-bold text-slate-500">量測日期</span>
              <input
                type="date"
                value={values.date}
                onChange={(event) => setValue('date', event.target.value)}
                className="mt-1 h-12 w-full rounded-xl border border-slate-200 bg-white px-3 font-bold text-slate-800 focus:border-plum-900 focus:outline-none"
              />
            </label>

            <div className="mt-3 grid grid-cols-2 gap-3">
              {REQUIRED_FIELDS.map((field) => (
                <label key={field.key} className="min-w-0">
                  <span className="text-[13px] font-bold text-slate-500">{field.label}</span>
                  <span className="mt-1 flex h-12 items-center overflow-hidden rounded-xl border border-slate-200 bg-white focus-within:border-plum-900">
                    <input
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step={field.step}
                      placeholder={field.placeholder}
                      value={values[field.key]}
                      onChange={(event) => setValue(field.key, event.target.value)}
                      className="h-full min-w-0 flex-1 bg-transparent px-3 font-bold text-slate-900 placeholder:text-[13px] placeholder:font-medium placeholder:text-slate-400 focus:outline-none"
                    />
                    {field.unit && (
                      <span className="shrink-0 pr-3 text-[13px] font-bold text-slate-400">
                        {field.unit}
                      </span>
                    )}
                  </span>
                </label>
              ))}
            </div>

            {fatMismatch > 2 && (
              <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2.5 text-[13px] leading-6 text-amber-900">
                體脂肪重 ÷ 體重 × 100 與體脂肪率相差 {Math.round(fatMismatch)}%，
                請確認是否填錯欄位。仍可儲存，判讀會以你填的體脂肪率為準。
              </p>
            )}

            <p className="mt-3 flex items-start gap-1.5 text-[13px] leading-6 text-slate-400">
              <Info className="mt-0.5 h-4 w-4 shrink-0" />
              阻抗值（FR、FREQ、RA、LA…）是機器量測參數，不需要填寫，也不做判讀。
            </p>
          </section>

          <section className="rounded-[28px] border border-plum-100 bg-white p-5 shadow-sm shadow-plum-900/5">
            <SectionHeading icon={Plus} title="② 節段肌肉" subtitle="選填，填了才能算 SMI" />
            <div className="mt-4 grid grid-cols-2 gap-3">
              {MUSCLE_FIELDS.map((field) => (
                <label key={field.key} className="min-w-0">
                  <span className="text-[13px] font-bold text-slate-500">{field.label}</span>
                  <span className="mt-1 flex h-12 items-center overflow-hidden rounded-xl border border-slate-200 bg-white focus-within:border-plum-900">
                    <input
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step={field.step}
                      value={values[field.key]}
                      onChange={(event) => setValue(field.key, event.target.value)}
                      className="h-full min-w-0 flex-1 bg-transparent px-3 font-bold text-slate-900 focus:outline-none"
                    />
                    <span className="shrink-0 pr-3 text-[13px] font-bold text-slate-400">kg</span>
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] border border-plum-100 bg-white p-5 shadow-sm shadow-plum-900/5">
            <SectionHeading icon={Plus} title="③ 節段脂肪" subtitle="選填" />
            <div className="mt-4 grid grid-cols-2 gap-3">
              {FAT_FIELDS.map((field) => (
                <label key={field.key} className="min-w-0">
                  <span className="text-[13px] font-bold text-slate-500">{field.label}</span>
                  <span className="mt-1 flex h-12 items-center overflow-hidden rounded-xl border border-slate-200 bg-white focus-within:border-plum-900">
                    <input
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step={field.step}
                      value={values[field.key]}
                      onChange={(event) => setValue(field.key, event.target.value)}
                      className="h-full min-w-0 flex-1 bg-transparent px-3 font-bold text-slate-900 focus:outline-none"
                    />
                    <span className="shrink-0 pr-3 text-[13px] font-bold text-slate-400">kg</span>
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] border border-plum-100 bg-white p-5 shadow-sm shadow-plum-900/5">
            <SectionHeading icon={Sparkles} title="④ 進階數據" subtitle="選填，沒有就留空" />
            <div className="mt-4 grid grid-cols-2 gap-3">
              {ADVANCED_FIELDS.map((field) => (
                <label key={field.key} className="min-w-0">
                  <span className="text-[13px] font-bold text-slate-500">{field.label}</span>
                  <span className="mt-1 flex h-12 items-center overflow-hidden rounded-xl border border-slate-200 bg-white focus-within:border-plum-900">
                    <input
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step={field.step}
                      placeholder={field.placeholder}
                      value={values[field.key]}
                      onChange={(event) => setValue(field.key, event.target.value)}
                      className="h-full min-w-0 flex-1 bg-transparent px-3 font-bold text-slate-900 placeholder:text-[13px] placeholder:font-medium placeholder:text-slate-400 focus:outline-none"
                    />
                    {field.unit && (
                      <span className="shrink-0 pr-3 text-[13px] font-bold text-slate-400">
                        {field.unit}
                      </span>
                    )}
                  </span>
                </label>
              ))}
            </div>
          </section>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-plum-900 px-4 text-[16px] font-black text-white shadow-lg shadow-plum-900/20 transition hover:bg-plum-800 active:scale-[0.99]"
            >
              <Save className="h-5 w-5" />
              儲存並判讀
            </button>
            {records.length > 0 && (
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="min-h-12 rounded-2xl border border-slate-200 px-5 text-[16px] font-black text-slate-600 transition hover:bg-slate-50"
              >
                取消
              </button>
            )}
          </div>
        </div>
      ) : (
        latest &&
        result && (
          <div className="space-y-4">
            <section className="rounded-[28px] border border-plum-100 bg-white p-5 shadow-sm shadow-plum-900/5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-slate-400">最新量測</p>
                  <p className="mt-0.5 text-[18px] font-black text-slate-900">{latest.date}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="min-h-10 rounded-full border border-plum-200 bg-plum-50 px-3.5 text-[13px] font-black text-plum-900 transition hover:bg-plum-100"
                  >
                    編輯
                  </button>
                  <button
                    type="button"
                    onClick={handleNew}
                    className="min-h-10 rounded-full bg-plum-900 px-3.5 text-[13px] font-black text-white transition hover:bg-plum-800"
                  >
                    新增一筆
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                {[
                  { label: '體重', value: latest.weight.toFixed(1), unit: 'kg', tone: 'bg-plum-50 text-plum-900' },
                  {
                    label: '骨骼肌重',
                    value: latest.skeletalMuscle.toFixed(1),
                    unit: 'kg',
                    tone: 'bg-emerald-50 text-emerald-900',
                  },
                  {
                    label: '體脂肪率',
                    value: latest.bodyFatPercent.toFixed(1),
                    unit: '%',
                    tone: 'bg-amber-50 text-amber-900',
                  },
                  {
                    label: '內臟脂肪',
                    value: String(latest.visceralFatLevel),
                    unit: '級',
                    tone: 'bg-rose-50 text-rose-900',
                  },
                ].map((item) => (
                  <div key={item.label} className={`min-w-0 rounded-2xl px-3.5 py-3 ${item.tone}`}>
                    <p className="text-[13px] font-bold opacity-75">{item.label}</p>
                    <p className="mt-1 flex items-baseline gap-1">
                      <span className="text-[24px] font-black leading-none tabular-nums">
                        {item.value}
                      </span>
                      <span className="text-[13px] font-bold opacity-70">{item.unit}</span>
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {result.hasSegments && (
              <section className="rounded-[28px] border border-plum-100 bg-white p-5 shadow-sm shadow-plum-900/5">
                <SectionHeading icon={Sparkles} title="節段分布" subtitle="左右差與佔全身比例" />

                <div className="mt-3 grid grid-cols-2 gap-1 rounded-2xl bg-slate-100 p-1">
                  {([
                    ['muscle', '肌肉'],
                    ['fat', '脂肪'],
                  ] as const).map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setSegmentTab(id)}
                      aria-pressed={segmentTab === id}
                      className={`min-h-11 rounded-xl text-[15px] font-black transition ${
                        segmentTab === id
                          ? 'bg-plum-900 text-white shadow-sm'
                          : 'text-slate-500 hover:bg-white/70'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="mt-3">
                  <SegmentFigure
                    segments={segmentTab === 'muscle' ? result.segmentMuscle : result.segmentFat}
                    label={segmentTab === 'muscle' ? '肌肉分布（公斤）' : '脂肪分布（公斤）'}
                  />
                </div>

                <div className="mt-3 space-y-2">
                  {(segmentTab === 'muscle' ? result.segmentMuscle : result.segmentFat).map(
                    (segment) => (
                      <div
                        key={segment.key}
                        className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-2xl bg-slate-50 px-3.5 py-2.5"
                      >
                        <span className="text-[15px] font-black text-slate-800">{segment.label}</span>
                        <span className="text-[13px] font-semibold text-slate-500">
                          {segment.valueText} · {symmetryText(segment)}
                        </span>
                      </div>
                    ),
                  )}
                </div>

                <p className="mt-2 text-[13px] leading-6 text-slate-400">
                  佔比為五個部位合計的比例，屬參考值；InBody 原廠印的百分比是相對標準值，公式未公開，因此不重製。
                </p>
              </section>
            )}

            <section className="rounded-[28px] border border-plum-100 bg-white p-5 shadow-sm shadow-plum-900/5">
              <SectionHeading icon={Info} title="判讀" subtitle="每項都附標準與來源" />

              <div className="mt-4 space-y-2.5">
                {result.findings.map((finding) => (
                  <div key={finding.id} className="rounded-2xl border border-slate-100 p-3.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[15px] font-black text-slate-800">{finding.name}</span>
                      <span className="flex items-center gap-1.5">
                        <span className="text-[15px] font-black tabular-nums text-slate-900">
                          {finding.valueText}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[13px] font-black ${STATUS_STYLE[finding.status]}`}
                        >
                          {STATUS_TEXT[finding.status]}
                        </span>
                      </span>
                    </div>
                    <p className="mt-1 text-[13px] leading-6 text-slate-500">{finding.detail}</p>
                    {finding.action && (
                      <p className="mt-1 text-[13px] leading-6 text-plum-800">{finding.action}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[28px] border border-plum-100 bg-white p-5 shadow-sm shadow-plum-900/5">
              <SectionHeading icon={Info} title="建議先讀" subtitle="依判讀結果排序" />
              <div className="mt-3 space-y-2">
                {GUIDE_ORDER.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onOpenGuide(id)}
                    className="flex min-h-12 w-full items-center justify-between gap-2 rounded-2xl bg-slate-50 px-3.5 text-left text-[15px] font-black text-slate-800 transition hover:bg-plum-50"
                  >
                    {GUIDES[id].title}
                    <ArrowLeft className="h-4 w-4 rotate-180 text-plum-600" />
                  </button>
                ))}
              </div>
              <p className="mt-3 text-[13px] leading-6 text-slate-400">
                本頁不重算 InBody 分數與身體年齡、不判讀阻抗值、不對 BCM 做分級，也不提供醫療診斷。
              </p>
            </section>

            <button
              type="button"
              onClick={handleDelete}
              className="flex min-h-12 w-full items-center justify-center gap-1.5 rounded-2xl border border-rose-200 bg-white text-[15px] font-black text-rose-600 transition hover:bg-rose-50"
            >
              <Trash2 className="h-4 w-4" />
              刪除這筆紀錄
            </button>
          </div>
        )
      )}
    </div>
  );
}
