import { useState } from 'react';
import {
  Activity,
  ArrowRight,
  ChevronRight,
  Flame,
  Heart,
  Info,
  Pencil,
  Scale,
  Sparkles,
} from 'lucide-react';
import type { Profile } from '../types';
import {
  BMI_CATEGORIES,
  calcBmi,
  calcBmr,
  calcTdee,
  getActivityOption,
  getBmiCategory,
  getCalorieSuggestions,
  getIdealWeightRange,
  isProfileComplete,
} from '../lib/health';
import { loadBodyCompositions } from '../lib/bodyCompositionStorage';
import type { GuideId } from '../data/guides';
import { PageHeader } from '../components/PageHeader';
import { SectionHeading } from '../components/SectionHeading';
import { InBodyPage } from './InBodyPage';

interface HealthPageProps {
  profile: Profile;
  onNotify: (message: string) => void;
  onOpenGuide: (guideId: GuideId) => void;
  onOpenSettings: () => void;
  onGoHome: () => void;
}

const GAUGE_SEGMENTS = [
  { id: 'underweight', label: '過輕', range: '< 18.5', width: 17.5, className: 'bg-sky-300' },
  { id: 'normal', label: '正常', range: '18.5–24', width: 27.5, className: 'bg-emerald-400' },
  { id: 'overweight', label: '過重', range: '24–27', width: 15, className: 'bg-amber-400' },
  { id: 'obese', label: '肥胖', range: '≥ 27', width: 40, className: 'bg-rose-400' },
];

function gaugePercent(value: number): number {
  return Math.min(100, Math.max(0, ((value - 15) / 20) * 100));
}

export function HealthPage({
  profile,
  onNotify,
  onOpenGuide,
  onOpenSettings,
  onGoHome,
}: HealthPageProps) {
  const [view, setView] = useState<'main' | 'inbody'>('main');

  if (view === 'inbody') {
    return (
      <InBodyPage
        profile={profile}
        onBack={() => setView('main')}
        onGoHome={onGoHome}
        onNotify={onNotify}
        onOpenGuide={onOpenGuide}
      />
    );
  }

  // 首次使用（尚未建立生理數據）時，不顯示任何預設的計算數字。
  if (!isProfileComplete(profile)) {
    return (
      <div>
        <PageHeader
          title="健康指數"
          description="BMI、BMR、TDEE 與理想體重。"
          onHome={onGoHome}
        />
        <section className="rounded-[28px] border border-amber-100 bg-white p-6 text-center shadow-sm shadow-amber-900/5">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-plum-50 text-plum-700">
            <Sparkles className="h-6 w-6" strokeWidth={2.2} />
          </div>
          <h3 className="mt-3 text-lg font-black text-slate-900">建立你的生理數據</h3>
          <p className="mx-auto mt-2 max-w-[17rem] text-[15px] leading-relaxed text-slate-500">
            填寫身高、體重與年齡，就能看到 BMI、基礎代謝與每日熱量建議。
          </p>
          <button
            type="button"
            onClick={onOpenSettings}
            className="mt-5 inline-flex h-11 items-center gap-1.5 rounded-2xl bg-plum-900 px-6 text-[15px] font-black text-white shadow-lg shadow-plum-900/20 transition hover:bg-plum-800 active:scale-[0.98]"
          >
            <Pencil className="h-4 w-4" />
            前往設定我的生理數據
          </button>
        </section>
      </div>
    );
  }

  const bmiRaw = calcBmi(profile.weight, profile.height);
  const bmi = Math.round(bmiRaw * 100) / 100;
  const category = getBmiCategory(bmiRaw);
  const bmr = calcBmr(profile);
  const tdee = calcTdee(profile);
  const activity = getActivityOption(profile.activity);
  const ideal = getIdealWeightRange(profile.height);
  const suggestions = getCalorieSuggestions(profile);
  const markerPercent = gaugePercent(bmiRaw);

  // 體脂、肌肉、節段、內臟脂肪只在「身體組成」頁呈現，健康頁只放摘要。
  const latestBody = loadBodyCompositions()[0] ?? null;

  return (
    <div>
      <PageHeader
        title="健康指數"
        description="BMI、BMR、TDEE 與理想體重。"
        onHome={onGoHome}
      />

      <section className="overflow-hidden rounded-[28px] border border-amber-100 bg-gradient-to-br from-rose-50/60 via-white to-white p-5 shadow-sm shadow-amber-900/5">
        <SectionHeading
          icon={Heart}
          title="BMI 身體質量指數"
          subtitle="衛生福利部成人健康體位標準"
        />

        <div className="mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-slate-400">你的 BMI</p>
            <p className="mt-0.5 text-5xl font-black leading-none tracking-tight text-plum-900 tabular-nums">
              {bmi.toFixed(1)}
            </p>
            <p className="mt-1.5 text-[13px] font-medium text-slate-500">
              {profile.height} cm · {profile.weight} kg
            </p>
          </div>
          <div className="min-w-0 shrink-0 text-left sm:text-right">
            <span
              className={`inline-block rounded-full px-4 py-2 text-[15px] font-black ${category.badgeClass}`}
            >
              {category.label}
            </span>
            <p className="mt-1.5 text-[13px] font-semibold text-slate-400">{category.rangeLabel}</p>
          </div>
        </div>

        <div className="mt-5">
          <div className="relative h-3">
            <div className="flex h-full overflow-hidden rounded-full">
              {GAUGE_SEGMENTS.map((segment) => (
                <div
                  key={segment.id}
                  className={segment.className}
                  style={{ width: `${segment.width}%` }}
                />
              ))}
            </div>
            <div
              className="absolute top-1/2 z-10 h-[18px] w-[18px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-plum-900 shadow-md shadow-plum-900/30"
              style={{ left: `clamp(9px, ${markerPercent}%, calc(100% - 9px))` }}
              title={`BMI ${bmi.toFixed(1)}`}
            />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
            {GAUGE_SEGMENTS.map((segment) => (
              <div key={segment.id} className="rounded-xl bg-slate-50 px-2 py-1.5">
                <div className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 shrink-0 rounded-full ${segment.className}`} />
                  <span className="text-[13px] font-bold text-slate-600">{segment.label}</span>
                </div>
                <p className="mt-0.5 text-[13px] font-semibold text-slate-400">{segment.range}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={`mt-4 rounded-2xl border p-3.5 ${category.softClass}`}>
          <p className={`text-[15px] font-bold leading-relaxed ${category.textClass}`}>
            {category.advice}
          </p>
        </div>
      </section>

      <div className="mt-3 grid grid-cols-2 gap-2.5">
        <div className="rounded-2xl border border-amber-100 bg-white p-3.5 shadow-sm shadow-amber-900/5">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-orange-50 text-orange-500">
            <Flame className="h-4 w-4" strokeWidth={2.4} />
          </div>
          <p className="mt-2 text-[13px] font-bold text-slate-400">基礎代謝率 BMR</p>
          <p className="mt-0.5 flex items-baseline gap-1">
            <span className="text-2xl font-black leading-none text-slate-900 tabular-nums">
              {bmr.toLocaleString()}
            </span>
            <span className="text-[13px] font-bold text-slate-400">kcal/日</span>
          </p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-slate-400">
            身體靜止時維持生命所需
          </p>
        </div>

        <div className="rounded-2xl border border-amber-100 bg-white p-3.5 shadow-sm shadow-amber-900/5">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-plum-50 text-plum-700">
            <Activity className="h-4 w-4" strokeWidth={2.4} />
          </div>
          <p className="mt-2 text-[13px] font-bold text-slate-400">每日總消耗 TDEE</p>
          <p className="mt-0.5 flex items-baseline gap-1">
            <span className="text-2xl font-black leading-none text-slate-900 tabular-nums">
              {tdee.toLocaleString()}
            </span>
            <span className="text-[13px] font-bold text-slate-400">kcal/日</span>
          </p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-slate-400">
            {activity.label} · 活動係數 {activity.factor}
          </p>
        </div>
      </div>

      <section className="mt-4 rounded-[24px] border border-plum-100 bg-white p-4 shadow-sm shadow-plum-900/5">
        <SectionHeading
          icon={Sparkles}
          title="身體組成"
          subtitle={latestBody ? `最新量測 ${latestBody.date}` : '依 InBody 報告填寫'}
        />

        {latestBody ? (
          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="min-w-0 rounded-2xl bg-rose-50 px-2.5 py-3">
              <p className="text-[13px] font-bold text-rose-700">體脂肪率</p>
              <p className="mt-1 flex flex-wrap items-baseline gap-0.5 text-[18px] font-black leading-none tabular-nums text-rose-900">
                {latestBody.bodyFatPercent.toFixed(1)}
                <span className="text-[13px] font-bold text-rose-600">%</span>
              </p>
            </div>
            <div className="min-w-0 rounded-2xl bg-emerald-50 px-2.5 py-3">
              <p className="text-[13px] font-bold text-emerald-700">骨骼肌重</p>
              <p className="mt-1 flex flex-wrap items-baseline gap-0.5 text-[18px] font-black leading-none tabular-nums text-emerald-900">
                {latestBody.skeletalMuscle.toFixed(1)}
                <span className="text-[13px] font-bold text-emerald-600">kg</span>
              </p>
            </div>
            <div className="min-w-0 rounded-2xl bg-amber-50 px-2.5 py-3">
              <p className="text-[13px] font-bold text-amber-700">內臟脂肪</p>
              <p className="mt-1 flex flex-wrap items-baseline gap-0.5 text-[18px] font-black leading-none tabular-nums text-amber-900">
                {latestBody.visceralFatLevel}
                <span className="text-[13px] font-bold text-amber-600">級</span>
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-3 rounded-2xl bg-slate-50 px-4 py-3.5 text-[15px] leading-relaxed text-slate-500">
            還沒有身體組成紀錄。填入 InBody 報告的數值後，會顯示體脂、肌肉、節段與內臟脂肪判讀。
          </p>
        )}

        <button
          type="button"
          onClick={() => setView('inbody')}
          className="mt-3 flex min-h-12 w-full items-center justify-between gap-2 rounded-2xl bg-plum-900 px-4 text-left text-[16px] font-black text-white shadow-lg shadow-plum-900/20 transition hover:bg-plum-800 active:scale-[0.99]"
        >
          {latestBody ? '查看身體組成判讀' : '記錄身體組成'}
          <ChevronRight className="h-5 w-5 shrink-0" />
        </button>
      </section>

      <section className="mt-4 rounded-[24px] border border-amber-100 bg-white p-4 shadow-sm shadow-amber-900/5">
        <SectionHeading
          icon={Scale}
          title="體位與熱量目標"
          subtitle="依目前身高、體重與活動量估算"
        />

        <div className="mt-3 rounded-2xl bg-plum-50 p-4">
          <p className="text-[13px] font-bold text-plum-700">理想體重範圍</p>
          <p className="mt-1 flex items-baseline gap-1.5">
            <span className="text-3xl font-black leading-none text-plum-900 tabular-nums">
              {ideal ? `${ideal.min}–${ideal.max}` : '—'}
            </span>
            <span className="text-[15px] font-black text-plum-700">kg</span>
          </p>
          <p className="mt-1.5 text-[13px] font-medium text-plum-700/80">
            對應 BMI 18.5 至 24 的正常範圍
          </p>
        </div>

        <div className="mt-2 grid grid-cols-3 gap-2">
          {[
            { label: '維持體重', value: suggestions.maintain, tone: 'bg-slate-50 text-slate-700' },
            { label: '溫和減脂', value: suggestions.lose, tone: 'bg-emerald-50 text-emerald-700' },
            { label: '增加體重', value: suggestions.gain, tone: 'bg-amber-50 text-amber-800' },
          ].map((item) => (
            <div key={item.label} className={`rounded-2xl p-2.5 ${item.tone}`}>
              <p className="text-[13px] font-bold opacity-80">{item.label}</p>
              <p className="mt-1 text-lg font-black leading-none tabular-nums">
                {item.value.toLocaleString()}
              </p>
              <p className="mt-1 text-[13px] font-bold opacity-60">kcal / 日</p>
            </div>
          ))}
        </div>

        <p className="mt-2.5 text-[13px] leading-relaxed text-slate-400">
          熱量建議以 TDEE 加減 300 kcal 估算，實際需求會因個人代謝與生活型態而異。
        </p>
      </section>

      <section className="mt-4 rounded-[24px] border border-amber-100 bg-white p-4 shadow-sm shadow-amber-900/5">
        <SectionHeading
          icon={Info}
          title="成人健康體位標準"
          subtitle="衛生福利部國民健康署定義"
        />

        <div className="mt-3 space-y-2">
          {BMI_CATEGORIES.map((item) => {
            const isCurrent = item.id === category.id;
            return (
              <div
                key={item.id}
                className={`flex items-center justify-between gap-2 rounded-2xl border px-3.5 py-2.5 ${
                  isCurrent ? item.softClass : 'border-slate-100 bg-slate-50/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`h-2.5 w-2.5 rounded-full ${item.barClass}`} />
                  <span
                    className={`text-[15px] font-black ${
                      isCurrent ? item.textClass : 'text-slate-600'
                    }`}
                  >
                    {item.label}
                  </span>
                  {isCurrent && (
                    <span className="rounded-full bg-white/80 px-2 py-0.5 text-[13px] font-black text-slate-600 shadow-sm">
                      目前
                    </span>
                  )}
                </div>
                <span className="text-[13px] font-bold text-slate-500">{item.rangeLabel}</span>
              </div>
            );
          })}
        </div>

        <p className="mt-3 text-[13px] leading-relaxed text-slate-400">
          BMI 僅為初步篩檢工具，無法區分肌肉與脂肪比例；兒童、孕婦、運動員及高齡者應由專業人員另行評估。
        </p>
      </section>

      <button
        type="button"
        onClick={onOpenSettings}
        className="mt-4 flex w-full items-center justify-between rounded-2xl border border-plum-100 bg-white px-4 py-3.5 text-left shadow-sm transition hover:bg-plum-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum-900 active:scale-[0.99]"
      >
        <span className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-plum-900 text-amber-200">
            <Pencil className="h-4 w-4" />
          </span>
          <span>
            <span className="block text-[15px] font-black text-slate-900">更新生理數據</span>
            <span className="block text-[13px] text-slate-500">身高或體重改變時重新計算</span>
          </span>
        </span>
        <ArrowRight className="h-5 w-5 text-slate-400" />
      </button>
    </div>
  );
}
