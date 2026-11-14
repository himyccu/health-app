import { GOLF_CLUBS, GOLF_CLUB_NOTE } from '../../data/sports/golf';

/**
 * 球桿分類圖。
 *
 * 只寫類別、常見球桿與用途，不寫距離數字：距離取決於揮桿速度，
 * 沒有放諸四海皆準的標準值。
 */
export function ClubChart() {
  return (
    <div className="min-w-0">
      <ul className="space-y-2.5">
        {GOLF_CLUBS.map((group) => (
          <li
            key={group.group}
            className="min-w-0 rounded-2xl border border-slate-100 bg-white p-3.5"
          >
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <p className="min-w-0 text-[16px] font-black text-slate-900">{group.group}</p>
              <p className="min-w-0 break-anywhere text-[13px] font-bold text-plum-500">
                {group.english}
              </p>
            </div>

            <dl className="mt-2 space-y-1.5">
              <div className="flex gap-2">
                <dt className="w-[4.5em] shrink-0 text-[13px] font-bold text-slate-400">常見球桿</dt>
                <dd className="min-w-0 flex-1 break-anywhere text-[13px] leading-6 text-slate-600">
                  {group.clubs}
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-[4.5em] shrink-0 text-[13px] font-bold text-slate-400">主要用途</dt>
                <dd className="min-w-0 flex-1 break-anywhere text-[13px] leading-6 text-slate-600">
                  {group.use}
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-[4.5em] shrink-0 text-[13px] font-bold text-slate-400">初學建議</dt>
                <dd className="min-w-0 flex-1 break-anywhere text-[13px] leading-6 text-slate-600">
                  {group.note}
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>

      <p className="mt-3 rounded-2xl bg-plum-50/70 px-3.5 py-3 text-[13px] leading-6 text-plum-900">
        {GOLF_CLUB_NOTE}
      </p>
    </div>
  );
}
