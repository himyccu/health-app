import { Activity, Dumbbell, Heart, Settings, Utensils, type LucideIcon } from 'lucide-react';
import type { TabId } from '../types';

interface TabMeta {
  id: TabId;
  label: string;
  icon: LucideIcon;
}

const TABS: TabMeta[] = [
  { id: 'activity', label: '動能', icon: Activity },
  { id: 'exercise', label: '運動', icon: Dumbbell },
  { id: 'health', label: '健康', icon: Heart },
  { id: 'nutrition', label: '飲食', icon: Utensils },
  { id: 'settings', label: '設定', icon: Settings },
];

interface BottomNavProps {
  activeTab: TabId;
  onChange: (tab: TabId) => void;
}

export function BottomNav({ activeTab, onChange }: BottomNavProps) {
  return (
    <nav
      aria-label="主要導覽"
      className="shrink-0 border-t border-amber-200/80 bg-white/95 px-2 pb-[calc(env(safe-area-inset-bottom)+0.4rem)] pt-2 backdrop-blur"
    >
      <div className="grid grid-cols-5">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              className="group flex flex-col items-center rounded-2xl px-1 py-1 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum-900"
            >
              <span
                className={`grid h-10 w-12 place-items-center rounded-2xl transition-all ${
                  isActive
                    ? 'bg-plum-900 text-amber-50 shadow-md shadow-plum-900/25'
                    : 'text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-600'
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
              </span>
              <span
                className={`mt-0.5 text-[11px] font-bold tracking-wide ${
                  isActive ? 'text-plum-900' : 'text-slate-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
