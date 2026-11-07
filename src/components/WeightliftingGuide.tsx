import { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Check,
  Dumbbell,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Wind,
  X,
} from 'lucide-react';
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
} from '../data/weightlifting';
import { SectionHeading } from './SectionHeading';
import correctImage from '../assets/weightlifting/deadlift-correct.jpg';
import setupImage from '../assets/weightlifting/deadlift-setup.jpg';
import techniqueImage from '../assets/weightlifting/deadlift-technique.jpg';
import musclesImage from '../assets/weightlifting/deadlift-muscles.jpg';

interface WeightliftingGuideProps {
  onBack: () => void;
}

type GuideTab = 'anatomy' | 'technique' | 'errors' | 'checklist';

const GUIDE_TABS: { id: GuideTab; label: string }[] = [
  { id: 'anatomy', label: '解剖' },
  { id: 'technique', label: '動作' },
  { id: 'errors', label: '錯誤' },
  { id: 'checklist', label: '檢核' },
];

export function WeightliftingGuide({ onBack }: WeightliftingGuideProps) {
  const [tab, setTab] = useState<GuideTab>('anatomy');

  return (
    <div className="animate-fade-up">
      <section className="relative overflow-hidden rounded-[30px] bg-plum-950 text-white shadow-[0_24px_50px_-30px_rgba(47,26,63,0.9)]">
        <div className="relative h-52 w-full overflow-hidden">
          <img
            src={correctImage}
            alt="硬拉標準起始姿勢示範"
            className="h-full w-full object-cover object-[center_30%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-plum-950 via-plum-950/55 to-plum-950/5" />
          <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-amber-300 px-3 py-1 text-[10px] font-black tracking-[0.14em] text-plum-950 shadow-sm">
            <Dumbbell className="h-3.5 w-3.5" />
            WEIGHTLIFTING
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-[11px] font-bold tracking-[0.18em] text-amber-200">專業知識專欄</p>
            <h2 className="mt-1 font-serif text-[28px] font-black leading-tight tracking-wide">
              舉重專欄
            </h2>
            <p className="mt-1 text-sm font-semibold text-plum-100">硬拉技術與解剖學全解析</p>
          </div>
        </div>
        <div className="px-4 pb-4 pt-3">
          <p className="text-[15px] leading-7 text-plum-100">{DEADLIFT_INTRO}</p>
        </div>
      </section>

      <div className="mt-4 grid grid-cols-4 gap-1 rounded-2xl bg-slate-100 p-1">
        {GUIDE_TABS.map((item) => {
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              aria-pressed={active}
              className={`h-10 rounded-xl text-sm font-black transition ${
                active
                  ? 'bg-plum-900 text-white shadow-sm'
                  : 'text-slate-500 hover:bg-white/70 hover:text-slate-700'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {tab === 'anatomy' && (
        <div className="animate-fade-up">
          <section className="mt-3 rounded-[26px] border border-plum-100 bg-white p-4 shadow-sm shadow-plum-900/5">
            <SectionHeading
              icon={Activity}
              title="硬拉主導肌群"
              subtitle="不是單一肌肉，而是全身後側動力鏈的協作"
            />

            <figure className="mt-3 overflow-hidden rounded-2xl border border-slate-100">
              <img
                src={musclesImage}
                alt="硬拉主要肌群解剖圖：臀大肌、膕繩肌、豎脊肌、背闊肌與股四頭肌"
                className="w-full"
              />
              <figcaption className="bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-500">
                紅色為主要發力肌群，橘色為中度參與，黃色為輔助穩定肌群。
              </figcaption>
            </figure>

            <div className="mt-3 space-y-2">
              {DEADLIFT_MUSCLES.map((item, index) => (
                <div
                  key={item.group}
                  className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-plum-900 text-[11px] font-black text-amber-100">
                      {index + 1}
                    </span>
                    <p className="text-[15px] font-black text-slate-900">{item.group}</p>
                  </div>
                  <p className="mt-1.5 text-sm font-black text-plum-800">{item.muscles}</p>
                  <p className="mt-1 text-[14px] leading-6 text-slate-600">{item.role}</p>
                </div>
              ))}
            </div>

            <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50/80 p-3.5">
              <p className="flex items-center gap-1.5 text-sm font-black text-amber-900">
                <Sparkles className="h-4 w-4" />
                為什麼值得練
              </p>
              <p className="mt-1.5 text-[14px] leading-6 text-amber-900/80">
                硬拉同時訓練後側動力鏈、軀幹穩定與握力。動作品質比重量更重要；在脊柱中立的前提下逐步增加負荷，才能把力量有效傳導到全身。
              </p>
            </div>
          </section>
        </div>
      )}

      {tab === 'technique' && (
        <div className="animate-fade-up">
          <figure className="mt-3 overflow-hidden rounded-[26px] border border-plum-100 bg-white shadow-sm">
            <img
              src={setupImage}
              alt="教練確認硬拉起始位置，足中對準槓鈴"
              className="h-48 w-full object-cover object-[center_35%]"
            />
            <figcaption className="px-4 py-3 text-[13px] leading-6 text-slate-500">
              起始位置：足中對準槓鈴正下方，臀部向後下方推，背部維持中立。
            </figcaption>
          </figure>

          <div className="mt-3 space-y-2.5">
            {DEADLIFT_PHASES.map((phase) => (
              <section
                key={phase.step}
                className="rounded-[24px] border border-slate-100 bg-white p-4 shadow-sm shadow-plum-900/5"
              >
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-plum-900 text-sm font-black text-amber-200">
                    {phase.step}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-[17px] font-black leading-tight text-slate-900">
                      {phase.title}
                    </h3>
                    <p className="mt-0.5 text-xs font-bold text-plum-600">{phase.subtitle}</p>
                  </div>
                </div>
                <ul className="mt-3 space-y-2">
                  {phase.points.map((point) => (
                    <li
                      key={point}
                      className="flex gap-2 text-[14px] leading-6 text-slate-600"
                    >
                      <Check
                        className="mt-1 h-4 w-4 shrink-0 text-emerald-600"
                        strokeWidth={3}
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <section className="mt-3 rounded-[24px] border border-sky-100 bg-sky-50/70 p-4">
            <SectionHeading
              icon={Wind}
              title="腹壓與核心建立"
              subtitle="Valsalva 呼吸法：先建立剛性，再輸出力量"
            />
            <div className="mt-3 space-y-2">
              {BREATHING_STEPS.map((item, index) => (
                <div key={item.title} className="flex gap-2.5 rounded-2xl bg-white/80 p-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sky-700 text-[11px] font-black text-white">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-black text-sky-950">{item.title}</p>
                    <p className="mt-0.5 text-[14px] leading-6 text-sky-900/75">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-2.5 flex items-start gap-1.5 text-xs leading-5 text-sky-900/70">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              初學者可先以自然呼吸搭配核心收緊；有血壓或心血管相關問題，請先諮詢醫師。
            </p>
          </section>
        </div>
      )}

      {tab === 'errors' && (
        <div className="animate-fade-up">
          <section className="mt-3 rounded-[26px] border border-plum-100 bg-white p-4 shadow-sm shadow-plum-900/5">
            <SectionHeading
              icon={ShieldAlert}
              title="正確與錯誤的對比"
              subtitle="同一個重量，脊柱排列不同，風險就完全不同"
            />

            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50/60">
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={techniqueImage}
                    alt="硬拉正確姿勢：脊柱中立、槓鈴貼近身體"
                    className="h-full w-full object-cover object-[center_40%]"
                  />
                  <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-black text-white shadow-sm">
                    <Check className="h-3 w-3" strokeWidth={3} />
                    正確
                  </span>
                </div>
                <div className="p-2.5">
                  <p className="text-[13px] font-black leading-5 text-emerald-900">
                    脊柱中立・槓鈴貼腿・肩髖同步
                  </p>
                  <p className="mt-1 text-[12px] leading-5 text-emerald-900/70">
                    力量平均分散，後側動力鏈有效參與。
                  </p>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-rose-200 bg-rose-50/60">
                <div className="grid h-36 place-items-center bg-rose-100/70 px-2">
                  <SpineComparison />
                </div>
                <div className="p-2.5">
                  <p className="text-[13px] font-black leading-5 text-rose-900">
                    圓背・預先抬腰・仰頭
                  </p>
                  <p className="mt-1 text-[12px] leading-5 text-rose-900/70">
                    剪切力集中在下背，椎間盤風險升高。
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-3.5 py-3">
              <p className="flex items-center gap-1.5 text-sm font-black text-emerald-900">
                <ShieldCheck className="h-4 w-4" />
                矯正目標
              </p>
              <p className="mt-1 text-[14px] leading-6 text-emerald-900/80">
                維持脊柱中立位（Neutral Spine），視線看向前下方約 2 公尺，讓槓鈴全程貼近身體。
              </p>
            </div>
          </section>

          <div className="mt-3 space-y-2.5">
            {DEADLIFT_ERRORS.map((error) => (
              <section
                key={error.title}
                className="rounded-[24px] border border-rose-100 bg-white p-4 shadow-sm shadow-rose-900/5"
              >
                <div className="flex items-start gap-2.5">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-rose-50 text-rose-600">
                    <AlertTriangle className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-[16px] font-black leading-tight text-slate-900">
                      {error.title}
                    </h3>
                    <p className="mt-1 text-[14px] leading-6 text-slate-600">{error.summary}</p>
                  </div>
                </div>
                <ul className="mt-2.5 space-y-1.5 rounded-2xl bg-rose-50/60 p-3">
                  {error.harms.map((harm) => (
                    <li key={harm} className="flex gap-2 text-[13px] leading-6 text-rose-900/80">
                      <X className="mt-1 h-3.5 w-3.5 shrink-0 text-rose-500" strokeWidth={3} />
                      {harm}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      )}

      {tab === 'checklist' && (
        <div className="animate-fade-up">
          <section className="mt-3 rounded-[26px] border border-plum-100 bg-white p-4 shadow-sm shadow-plum-900/5">
            <SectionHeading
              icon={ShieldCheck}
              title="硬拉訓練檢核清單"
              subtitle="每次起槓前，快速確認這幾件事"
            />

            <div className="mt-3 grid gap-2.5">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3.5">
                <p className="flex items-center gap-1.5 text-sm font-black text-emerald-900">
                  <Check className="h-4 w-4" strokeWidth={3} />
                  必做關鍵點
                </p>
                <ul className="mt-2 space-y-1.5">
                  {DEADLIFT_DO.map((item) => (
                    <li
                      key={item}
                      className="flex gap-2 text-[14px] leading-6 text-emerald-900/85"
                    >
                      <Check className="mt-1 h-4 w-4 shrink-0 text-emerald-600" strokeWidth={3} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-3.5">
                <p className="flex items-center gap-1.5 text-sm font-black text-rose-900">
                  <X className="h-4 w-4" strokeWidth={3} />
                  嚴禁錯誤
                </p>
                <ul className="mt-2 space-y-1.5">
                  {DEADLIFT_DONT.map((item) => (
                    <li key={item} className="flex gap-2 text-[14px] leading-6 text-rose-900/85">
                      <X className="mt-1 h-4 w-4 shrink-0 text-rose-500" strokeWidth={3} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="mt-3 rounded-[24px] border border-amber-200 bg-amber-50/80 p-4">
            <p className="flex items-center gap-1.5 text-sm font-black text-amber-900">
              <ShieldAlert className="h-4 w-4" />
              安全提醒
            </p>
            <ul className="mt-2 space-y-2">
              {SAFETY_NOTES.map((note) => (
                <li key={note} className="flex gap-2 text-[13px] leading-6 text-amber-900/85">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" />
                  {note}
                </li>
              ))}
            </ul>
          </section>

          <p className="mt-3 rounded-2xl bg-slate-50 px-3.5 py-3 text-[11px] leading-5 text-slate-400">
            {IMAGE_CREDITS}
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={onBack}
        className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-plum-200 bg-white text-sm font-black text-plum-900 shadow-sm transition hover:bg-plum-50 active:scale-[0.99]"
      >
        <ArrowLeft className="h-4 w-4" />
        回到運動紀錄
      </button>
    </div>
  );
}

function SpineComparison() {
  return (
    <svg viewBox="0 0 160 120" className="h-full w-full" aria-hidden="true">
      <g transform="translate(8, 8)">
        <rect x="0" y="0" width="68" height="104" rx="14" fill="#ffffff" opacity="0.85" />
        <path
          d="M34 14 C 34 40, 34 66, 34 92"
          fill="none"
          stroke="#059669"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <circle cx="34" cy="14" r="5" fill="#059669" />
        <text x="34" y="110" textAnchor="middle" fontSize="10" fontWeight="700" fill="#047857">
          中立
        </text>
      </g>
      <g transform="translate(84, 8)">
        <rect x="0" y="0" width="68" height="104" rx="14" fill="#ffffff" opacity="0.85" />
        <path
          d="M34 14 C 58 34, 10 66, 34 92"
          fill="none"
          stroke="#e11d48"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <circle cx="34" cy="14" r="5" fill="#e11d48" />
        <text x="34" y="110" textAnchor="middle" fontSize="10" fontWeight="700" fill="#be123c">
          圓背
        </text>
      </g>
    </svg>
  );
}
