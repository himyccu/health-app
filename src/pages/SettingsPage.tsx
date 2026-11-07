import { useState } from 'react';
import {
  Activity,
  ArrowUpRight,
  BookOpen,
  Calendar,
  Ruler,
  Save,
  ShieldCheck,
  Trash2,
  User,
  Weight,
} from 'lucide-react';
import type { ActivityLevel, Gender, Profile } from '../types';
import { ACTIVITY_OPTIONS, calcBmr, calcTdee, getActivityOption, isProfileComplete } from '../lib/health';
import { TFDA_META } from '../lib/tfdaMeta';
import { PageHeader } from '../components/PageHeader';
import { SectionHeading } from '../components/SectionHeading';

interface SettingsPageProps {
  profile: Profile;
  onSave: (profile: Profile) => void;
  onShowDisclaimer: () => void;
  onReset: () => void;
  onGoHome: () => void;
}

export function SettingsPage({
  profile,
  onSave,
  onShowDisclaimer,
  onReset,
  onGoHome,
}: SettingsPageProps) {
  // 首次使用時（數值為 0）輸入欄位保持空白，避免使用者誤以為是別人留下的資料。
  const toInput = (value: number) => (value > 0 ? String(value) : '');
  const [gender, setGender] = useState<Gender>(profile.gender);
  const [ageInput, setAgeInput] = useState(() => toInput(profile.age));
  const [heightInput, setHeightInput] = useState(() => toInput(profile.height));
  const [weightInput, setWeightInput] = useState(() => toInput(profile.weight));
  const [activity, setActivity] = useState<ActivityLevel>(profile.activity);
  const [error, setError] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const isFreshProfile = !isProfileComplete(profile);

  const age = Number(ageInput);
  const height = Number(heightInput);
  const weight = Number(weightInput);

  const isDraftValid =
    Number.isFinite(age) &&
    age >= 1 &&
    age <= 120 &&
    Number.isFinite(height) &&
    height >= 80 &&
    height <= 250 &&
    Number.isFinite(weight) &&
    weight >= 20 &&
    weight <= 300;

  const draftProfile: Profile = { gender, age, height, weight, activity };
  const previewBmr = isDraftValid ? calcBmr(draftProfile) : null;
  const previewTdee = isDraftValid ? calcTdee(draftProfile) : null;

  const handleSave = () => {
    if (!Number.isFinite(age) || age < 1 || age > 120) {
      setError('生理年齡請填寫 1 至 120 歲之間。');
      return;
    }
    if (!Number.isFinite(height) || height < 80 || height > 250) {
      setError('身高請填寫 80 至 250 公分之間。');
      return;
    }
    if (!Number.isFinite(weight) || weight < 20 || weight > 300) {
      setError('體重請填寫 20 至 300 公斤之間。');
      return;
    }

    setError(null);
    onSave({
      gender,
      age: Math.round(age),
      height: Math.round(height),
      weight: Math.round(weight * 10) / 10,
      activity,
    });
  };

  return (
    <div>
      <PageHeader
        eyebrow="SETTINGS"
        title="設定與生理數據"
        description="建立你的健康基準，所有計算都會跟著更新。"
        onHome={onGoHome}
      />

      {isFreshProfile && (
        <section className="mb-4 rounded-[24px] border border-plum-200 bg-gradient-to-br from-plum-50 to-white p-4">
          <p className="text-[11px] font-black tracking-[0.16em] text-plum-600">GET STARTED</p>
          <p className="mt-1 text-base font-black text-plum-950">第 1 步：建立基本資料</p>
          <p className="mt-1 text-[13px] leading-6 text-slate-500">
            填寫下面的年齡、身高與體重，儲存後再到「動能」開始步行，最後回「首頁」查看累積紀錄。
          </p>
        </section>
      )}

      <section className="rounded-[26px] border border-amber-100 bg-white p-4 shadow-sm shadow-amber-900/5">
        <SectionHeading
          icon={User}
          title={isFreshProfile ? '步驟 1｜生理數據' : '生理數據'}
          subtitle="用於計算 BMI、BMR、TDEE 與營養目標"
        />

        <div className="mt-4 space-y-3">
          {isFreshProfile && (
            <p className="rounded-xl border border-plum-200 bg-plum-50 px-3 py-2 text-[13px] leading-relaxed text-plum-800">
              填寫以下資料，作為 BMI、代謝與熱量計算的基準。
            </p>
          )}
          <div>
            <p className="mb-1.5 text-xs font-bold text-slate-500">生理性別</p>
            <div className="grid grid-cols-2 gap-2" role="group" aria-label="生理性別">
              {[
                { value: 'female' as const, label: '女性' },
                { value: 'male' as const, label: '男性' },
              ].map((option) => {
                const selected = gender === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setGender(option.value)}
                    className={`h-12 rounded-2xl border text-base font-black transition active:scale-[0.98] ${
                      selected
                        ? 'border-plum-900 bg-plum-900 text-white shadow-md shadow-plum-900/20'
                        : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-plum-200 hover:bg-plum-50'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="block" htmlFor="profile-age">
            <span className="mb-1.5 block text-xs font-bold text-slate-500">生理年齡</span>
            <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 transition focus-within:border-plum-900 focus-within:bg-white">
              <Calendar className="ml-3.5 h-4 w-4 shrink-0 text-slate-400" />
              <input
                id="profile-age"
                type="number"
                inputMode="numeric"
                min={1}
                max={120}
                placeholder="請輸入年齡"
                value={ageInput}
                onChange={(event) => setAgeInput(event.target.value)}
                className="h-12 w-full min-w-0 bg-transparent px-2.5 text-lg font-bold text-slate-900 outline-none"
              />
              <span className="pr-3.5 text-xs font-bold text-slate-400">歲</span>
            </div>
          </label>

          <div className="grid grid-cols-2 gap-2.5">
            <label className="block" htmlFor="profile-height">
              <span className="mb-1.5 block text-xs font-bold text-slate-500">身高</span>
              <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 transition focus-within:border-plum-900 focus-within:bg-white">
                <Ruler className="ml-3 h-4 w-4 shrink-0 text-slate-400" />
                <input
                  id="profile-height"
                  type="number"
                  inputMode="decimal"
                  min={80}
                  max={250}
                  placeholder="請輸入身高"
                  value={heightInput}
                  onChange={(event) => setHeightInput(event.target.value)}
                  className="h-12 w-full min-w-0 bg-transparent px-2 text-lg font-bold text-slate-900 outline-none"
                />
                <span className="pr-3 text-xs font-bold text-slate-400">cm</span>
              </div>
            </label>

            <label className="block" htmlFor="profile-weight">
              <span className="mb-1.5 block text-xs font-bold text-slate-500">體重</span>
              <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 transition focus-within:border-plum-900 focus-within:bg-white">
                <Weight className="ml-3 h-4 w-4 shrink-0 text-slate-400" />
                <input
                  id="profile-weight"
                  type="number"
                  inputMode="decimal"
                  min={20}
                  max={300}
                  step={0.1}
                  placeholder="請輸入體重"
                  value={weightInput}
                  onChange={(event) => setWeightInput(event.target.value)}
                  className="h-12 w-full min-w-0 bg-transparent px-2 text-lg font-bold text-slate-900 outline-none"
                />
                <span className="pr-3 text-xs font-bold text-slate-400">kg</span>
              </div>
            </label>
          </div>

          <div>
            <div className="mb-1.5 flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-slate-400" />
              <p className="text-xs font-bold text-slate-500">日常活動強度</p>
            </div>
            <div className="space-y-2" role="radiogroup" aria-label="日常活動強度">
              {ACTIVITY_OPTIONS.map((option) => {
                const selected = activity === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setActivity(option.value)}
                    className={`flex w-full items-center justify-between gap-2 rounded-2xl border p-3 text-left transition active:scale-[0.99] ${
                      selected
                        ? 'border-plum-900 bg-plum-50/80 ring-1 ring-plum-900'
                        : 'border-slate-200 bg-white hover:border-plum-200 hover:bg-plum-50/40'
                    }`}
                  >
                    <span className="flex min-w-0 items-start gap-2.5">
                      <span
                        className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${
                          selected ? 'border-plum-900' : 'border-slate-300'
                        }`}
                      >
                        {selected && <span className="h-2.5 w-2.5 rounded-full bg-plum-900" />}
                      </span>
                      <span className="min-w-0">
                        <span
                          className={`block text-sm font-black ${
                            selected ? 'text-plum-900' : 'text-slate-800'
                          }`}
                        >
                          {option.label}
                        </span>
                        <span className="mt-0.5 block text-xs leading-snug text-slate-400">
                          {option.hint}
                        </span>
                      </span>
                    </span>
                    <span className="shrink-0 rounded-full bg-white px-2 py-1 text-[10px] font-bold text-slate-400 shadow-sm">
                      ×{option.factor}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              目前選擇：{getActivityOption(activity).label}（活動係數{' '}
              {getActivityOption(activity).factor}）
            </p>
          </div>
        </div>

        {error && (
          <p
            role="alert"
            className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700"
          >
            {error}
          </p>
        )}

        <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-plum-50 p-3">
          <div>
            <p className="text-[11px] font-bold text-plum-600">預估 BMR</p>
            <p className="mt-0.5 text-lg font-black leading-none text-plum-900 tabular-nums">
              {previewBmr !== null ? previewBmr.toLocaleString() : '—'}
              <span className="ml-1 text-[10px] font-bold text-plum-500">kcal</span>
            </p>
          </div>
          <div>
            <p className="text-[11px] font-bold text-plum-600">預估 TDEE</p>
            <p className="mt-0.5 text-lg font-black leading-none text-plum-900 tabular-nums">
              {previewTdee !== null ? previewTdee.toLocaleString() : '—'}
              <span className="ml-1 text-[10px] font-bold text-plum-500">kcal</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="mt-3 flex h-12 w-full items-center justify-center gap-1.5 rounded-2xl bg-plum-900 text-base font-black text-white shadow-lg shadow-plum-900/20 transition hover:bg-plum-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum-900 active:scale-[0.99]"
        >
          <Save className="h-4 w-4" />
          儲存設定
        </button>

      </section>

      <section className="mt-4 rounded-[26px] border border-plum-100 bg-white p-4 shadow-sm shadow-amber-900/5">
        <div className="flex items-start justify-between gap-2">
          <SectionHeading
            icon={BookOpen}
            title="衛福部資料來源"
            subtitle="飲食指南、健康體位與食品營養資料"
          />
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-black text-emerald-700">
            <ShieldCheck className="h-3 w-3" />
            已同意
          </span>
        </div>

        <div className="mt-3 rounded-2xl bg-plum-50/70 p-3.5">
          <ul className="space-y-2 text-xs leading-relaxed text-slate-600">
            <li className="flex gap-1.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-plum-800" />
              <span>
                衛生福利部國民健康署
                <a
                  href="https://www.hpa.gov.tw"
                  target="_blank"
                  rel="noreferrer"
                  className="ml-0.5 inline-flex items-center gap-0.5 font-bold text-plum-800 underline underline-offset-2"
                >
                  官方網站
                  <ArrowUpRight className="h-3 w-3" />
                </a>
                《每日飲食指南手冊》
              </span>
            </li>
            <li className="flex gap-1.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-plum-800" />
              <span>衛生福利部成人健康體位定義（BMI 18.5–24 為正常範圍）</span>
            </li>
            <li className="flex gap-1.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-plum-800" />
              <span>
                食品藥物管理署
                <a
                  href={TFDA_META.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-0.5 inline-flex items-center gap-0.5 font-bold text-plum-800 underline underline-offset-2"
                >
                  《{TFDA_META.title}》
                  <ArrowUpRight className="h-3 w-3" />
                </a>
                （資料集 {TFDA_META.datasetId}
                {TFDA_META.modifiedDate ? `，更新於 ${TFDA_META.modifiedDate}` : ''}）
              </span>
            </li>
          </ul>
        </div>

        <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 p-3.5">
          <p className="flex items-center gap-1.5 text-xs font-black text-amber-800">
            <ShieldCheck className="h-4 w-4" />
            完整免責聲明
          </p>
          <p className="mt-2 text-xs font-medium leading-6 text-slate-700">
            本應用程式所提供之健康資訊、營養建議及身體組成標準僅供參考，不能取代專業醫療診斷、建議或治療。在做出任何醫療決定前，務必要諮詢合格的醫療專業人員。
          </p>
        </div>

        <button
          type="button"
          onClick={onShowDisclaimer}
          className="mt-3 flex h-11 w-full items-center justify-center gap-1.5 rounded-xl border border-plum-200 bg-white text-sm font-bold text-plum-900 transition hover:bg-plum-50 active:scale-[0.99]"
        >
          查看完整聲明與資料來源
        </button>
      </section>

      <section className="mt-4 rounded-[26px] border border-amber-100 bg-white p-4 shadow-sm shadow-amber-900/5">
        <SectionHeading
          icon={ShieldCheck}
          title="資料與隱私"
          subtitle="無帳號、無後端，資料只留在這台裝置"
        />

        <ul className="mt-3 space-y-2 text-xs leading-relaxed text-slate-500">
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
            這個 App 沒有帳號、沒有後端。把網址分享給別人，對方只會看到自己的空白資料，不會看到你的步數、體重或飲食紀錄。
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
            GPS 定位只用來計算步行距離。座標不會上傳、不會儲存，App 設計者也不會取得你的位置。
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
            生理數據、步數、運動與飲食紀錄皆儲存在這台裝置的瀏覽器 localStorage。
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
            食物搜尋與營養計算都在本機完成，不會上傳任何個人紀錄。
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
            同一台裝置的不同瀏覽器、或不同裝置之間資料不會自動同步；清除瀏覽器資料後也無法復原。
          </li>
        </ul>

        <button
          type="button"
          onClick={() => setShowResetConfirm(true)}
          className="mt-3 flex h-11 w-full items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 text-sm font-bold text-rose-700 transition hover:bg-rose-100 active:scale-[0.99]"
        >
          <Trash2 className="h-4 w-4" />
          清除所有本機資料
        </button>
      </section>

      <p className="mt-5 text-center text-[11px] font-medium leading-relaxed text-slate-400">
        Hayley 的健康管家 · v1.0
        <br />
        健康數據僅供參考，不能取代專業醫療建議
      </p>

      {showResetConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onClick={() => setShowResetConfirm(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reset-title"
            className="animate-fade-up w-full max-w-sm rounded-[26px] bg-white p-5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-rose-600">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 id="reset-title" className="mt-3 text-lg font-black text-slate-900">
              清除所有本機資料？
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
              這會刪除生理數據、步數紀錄、餐點紀錄與免責聲明同意狀態，且無法復原。
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="h-11 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600 transition hover:bg-slate-50"
              >
                取消
              </button>
              <button
                type="button"
                onClick={onReset}
                className="h-11 rounded-xl bg-rose-600 text-sm font-black text-white transition hover:bg-rose-700 active:scale-[0.98]"
              >
                確認清除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
