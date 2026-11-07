import { useState } from 'react';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Footprints,
  Heart,
  MapPin,
  Ruler,
  ShieldCheck,
  Sparkles,
  User,
  Weight,
  X,
} from 'lucide-react';
import type { ActivityLevel, Gender, Profile } from '../types';
import { ACTIVITY_OPTIONS, getActivityOption } from '../lib/health';

interface OnboardingWizardProps {
  profile: Profile;
  onSave: (profile: Profile) => void;
  onClose: () => void;
  onStartWalking: () => void;
}

const STEPS = ['安心開始', '基本資料', '完成設定'];

export function OnboardingWizard({
  profile,
  onSave,
  onClose,
  onStartWalking,
}: OnboardingWizardProps) {
  const [step, setStep] = useState(0);
  const [gender, setGender] = useState<Gender>(profile.gender);
  const [ageInput, setAgeInput] = useState(() => (profile.age > 0 ? String(profile.age) : ''));
  const [heightInput, setHeightInput] = useState(() =>
    profile.height > 0 ? String(profile.height) : '',
  );
  const [weightInput, setWeightInput] = useState(() =>
    profile.weight > 0 ? String(profile.weight) : '',
  );
  const [activity, setActivity] = useState<ActivityLevel>(profile.activity);
  const [error, setError] = useState<string | null>(null);

  const age = Number(ageInput);
  const height = Number(heightInput);
  const weight = Number(weightInput);

  const handleSave = () => {
    if (!Number.isFinite(age) || age < 1 || age > 120) {
      setError('請填寫 1 至 120 歲之間的生理年齡。');
      return;
    }
    if (!Number.isFinite(height) || height < 80 || height > 250) {
      setError('請填寫 80 至 250 公分之間的身高。');
      return;
    }
    if (!Number.isFinite(weight) || weight < 20 || weight > 300) {
      setError('請填寫 20 至 300 公斤之間的體重。');
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
    setStep(2);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/60 backdrop-blur-sm sm:items-center sm:p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
        className="animate-fade-up flex max-h-[94dvh] w-full max-w-md flex-col overflow-hidden rounded-t-[32px] bg-[#fcfaff] shadow-2xl shadow-slate-950/30 sm:rounded-[32px]"
      >
        <div className="shrink-0 border-b border-slate-100 bg-white/90 px-4 pb-3 pt-4 backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-plum-900 text-amber-200">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[10px] font-black tracking-[0.16em] text-plum-600">
                  STEP {step + 1} OF 3
                </p>
                <p className="text-sm font-black text-slate-900">{STEPS[step]}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="關閉使用引導"
              className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-3 flex gap-1.5" aria-hidden="true">
            {STEPS.map((label, index) => (
              <span
                key={label}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  index <= step ? 'bg-plum-900' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="no-scrollbar flex-1 overflow-y-auto px-5 py-5">
          {step === 0 && (
            <div className="animate-fade-up">
              <div className="flex flex-col items-center text-center">
                <div className="grid h-20 w-20 place-items-center rounded-full bg-plum-50 text-plum-800 shadow-lg shadow-plum-900/10 ring-4 ring-white">
                  <Heart className="h-9 w-9" strokeWidth={1.8} />
                </div>
                <p className="mt-4 text-[11px] font-black tracking-[0.2em] text-plum-600">
                  WELCOME
                </p>
                <h2
                  id="onboarding-title"
                  className="mt-1 font-serif text-2xl font-black leading-snug tracking-wide text-plum-950"
                >
                  一步一步
                  <br />
                  把健康走成日常
                </h2>
                <p className="mt-2.5 max-w-[19rem] text-sm leading-6 text-slate-500">
                  先花一分鐘建立基本資料，之後的步數、距離與熱量，都會依你的身體數據計算。
                </p>
              </div>

              <div className="mt-5 space-y-2.5">
                <Highlight
                  icon={ShieldCheck}
                  title="沒有帳號，也不收集資料"
                  description="不用註冊，開發者不會取得你的姓名或聯絡方式。"
                />
                <Highlight
                  icon={MapPin}
                  title="GPS 只在手機內運算"
                  description="座標不會上傳、不會儲存，只用來計算步行距離。"
                />
                <Highlight
                  icon={Heart}
                  title="所有紀錄都留在這台裝置"
                  description="換裝置或分享網址，別人也看不到你的資料。"
                />
              </div>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-plum-900 text-base font-black text-white shadow-lg shadow-plum-900/20 transition hover:bg-plum-800 active:scale-[0.99]"
              >
                開始設定
                <ArrowRight className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-1.5 w-full rounded-xl py-2.5 text-sm font-bold text-slate-400 transition hover:bg-slate-50 hover:text-slate-600"
              >
                先逛逛首頁
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="animate-fade-up">
              <h2 id="onboarding-title" className="text-xl font-black text-slate-900">
                建立你的健康基準
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                這些資料只用來計算 BMI、代謝與熱量，不會離開你的手機。
              </p>

              <div className="mt-4 space-y-3.5">
                <div>
                  <p className="mb-1.5 flex items-center gap-1.5 text-sm font-black text-slate-700">
                    <User className="h-4 w-4 text-plum-500" />
                    生理性別
                  </p>
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

                <Field
                  id="onboarding-age"
                  label="生理年齡"
                  icon={CalendarDays}
                  unit="歲"
                  value={ageInput}
                  onChange={setAgeInput}
                  placeholder="請輸入年齡"
                  min={1}
                  max={120}
                />

                <div className="grid grid-cols-2 gap-2.5">
                  <Field
                    id="onboarding-height"
                    label="身高"
                    icon={Ruler}
                    unit="cm"
                    value={heightInput}
                    onChange={setHeightInput}
                    placeholder="請輸入身高"
                    min={80}
                    max={250}
                  />
                  <Field
                    id="onboarding-weight"
                    label="體重"
                    icon={Weight}
                    unit="kg"
                    value={weightInput}
                    onChange={setWeightInput}
                    placeholder="請輸入體重"
                    min={20}
                    max={300}
                    step={0.1}
                  />
                </div>

                <div>
                  <p className="mb-1.5 flex items-center gap-1.5 text-sm font-black text-slate-700">
                    <Activity className="h-4 w-4 text-plum-500" />
                    日常活動強度
                  </p>
                  <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="日常活動強度">
                    {ACTIVITY_OPTIONS.map((option) => {
                      const selected = activity === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          onClick={() => setActivity(option.value)}
                          className={`rounded-2xl border px-3 py-2.5 text-left transition active:scale-[0.98] ${
                            selected
                              ? 'border-plum-900 bg-plum-50 ring-1 ring-plum-900'
                              : 'border-slate-200 bg-white hover:border-plum-200 hover:bg-plum-50/50'
                          }`}
                        >
                          <span
                            className={`block text-sm font-black ${
                              selected ? 'text-plum-900' : 'text-slate-700'
                            }`}
                          >
                            {option.label}
                          </span>
                          <span className="mt-0.5 block text-[11px] leading-snug text-slate-400">
                            {option.hint}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                    目前選擇：{getActivityOption(activity).label}。之後可在設定中修改。
                  </p>
                </div>
              </div>

              {error && (
                <p
                  role="alert"
                  className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700"
                >
                  {error}
                </p>
              )}

              <button
                type="button"
                onClick={handleSave}
                className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-plum-900 text-base font-black text-white shadow-lg shadow-plum-900/20 transition hover:bg-plum-800 active:scale-[0.99]"
              >
                儲存並繼續
                <ArrowRight className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => setStep(0)}
                className="mt-1.5 flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-bold text-slate-400 transition hover:bg-slate-50 hover:text-slate-600"
              >
                <ArrowLeft className="h-4 w-4" />
                上一步
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-up">
              <div className="flex flex-col items-center text-center">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-700 ring-8 ring-emerald-50">
                  <Check className="h-8 w-8" strokeWidth={3} />
                </div>
                <h2 id="onboarding-title" className="mt-4 text-2xl font-black text-slate-900">
                  設定完成
                </h2>
                <p className="mt-1.5 max-w-[19rem] text-sm leading-6 text-slate-500">
                  你的專屬健康基準已建立。接下來，從今天的第一段步行開始吧。
                </p>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2">
                <SummaryItem label="生理性別" value={gender === 'female' ? '女性' : '男性'} />
                <SummaryItem label="年齡" value={`${Math.round(age)} 歲`} />
                <SummaryItem label="身高" value={`${Math.round(height)} cm`} />
                <SummaryItem label="體重" value={`${weight} kg`} />
              </div>
              <div className="mt-2 rounded-2xl bg-plum-50 px-3.5 py-3">
                <p className="text-xs font-bold text-plum-600">日常活動強度</p>
                <p className="mt-0.5 text-sm font-black text-plum-900">
                  {getActivityOption(activity).label}
                </p>
              </div>

              <div className="mt-4 space-y-2 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-3.5">
                <p className="flex items-center gap-2 text-sm font-black text-emerald-900">
                  <ShieldCheck className="h-4 w-4" />
                  接下來你可以
                </p>
                <p className="flex items-start gap-2 text-[13px] leading-6 text-emerald-900/80">
                  <Footprints className="mt-0.5 h-4 w-4 shrink-0" />
                  到「動能」頁按開始步行，GPS 會自動記錄距離與時間。
                </p>
                <p className="flex items-start gap-2 text-[13px] leading-6 text-emerald-900/80">
                  <Activity className="mt-0.5 h-4 w-4 shrink-0" />
                  到「運動」頁記錄訓練，或閱讀硬拉教學。
                </p>
              </div>

              <button
                type="button"
                onClick={onStartWalking}
                className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-plum-900 text-base font-black text-white shadow-lg shadow-plum-900/20 transition hover:bg-plum-800 active:scale-[0.99]"
              >
                <Footprints className="h-5 w-5" />
                開始步行記錄
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-1.5 w-full rounded-xl py-2.5 text-sm font-bold text-slate-400 transition hover:bg-slate-50 hover:text-slate-600"
              >
                回到首頁
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface HighlightProps {
  icon: typeof ShieldCheck;
  title: string;
  description: string;
}

function Highlight({ icon: Icon, title, description }: HighlightProps) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-white p-3.5">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-plum-50 text-plum-700">
        <Icon className="h-5 w-5" strokeWidth={2.2} />
      </span>
      <div>
        <p className="text-sm font-black text-slate-900">{title}</p>
        <p className="mt-0.5 text-[13px] leading-5 text-slate-500">{description}</p>
      </div>
    </div>
  );
}

interface FieldProps {
  id: string;
  label: string;
  icon: typeof Ruler;
  unit: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  min: number;
  max: number;
  step?: number;
}

function Field({
  id,
  label,
  icon: Icon,
  unit,
  value,
  onChange,
  placeholder,
  min,
  max,
  step,
}: FieldProps) {
  return (
    <label className="block" htmlFor={id}>
      <span className="mb-1.5 flex items-center gap-1.5 text-sm font-black text-slate-700">
        <Icon className="h-4 w-4 text-plum-500" />
        {label}
      </span>
      <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 transition focus-within:border-plum-900 focus-within:bg-white">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-12 w-full min-w-0 bg-transparent px-3.5 text-lg font-bold text-slate-900 outline-none placeholder:text-sm placeholder:font-medium placeholder:text-slate-400"
        />
        <span className="pr-3.5 text-xs font-bold text-slate-400">{unit}</span>
      </div>
    </label>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white px-3.5 py-3 ring-1 ring-slate-100">
      <p className="text-xs font-bold text-slate-400">{label}</p>
      <p className="mt-0.5 text-lg font-black leading-none text-slate-900 tabular-nums">{value}</p>
    </div>
  );
}
