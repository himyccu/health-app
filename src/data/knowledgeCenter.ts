import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Footprints,
  MoveDown,
  PersonStanding,
  type LucideIcon,
} from 'lucide-react';
import hingeThumbnail from '../assets/weightlifting/deadlift-correct.jpg';

export type KnowledgePatternId = 'push' | 'pull' | 'squat' | 'hinge' | 'locomotion';

export interface KnowledgeCard {
  id: KnowledgePatternId;
  shortLabel: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  badge: string;
  status: 'available' | 'comingSoon';
  icon: LucideIcon;
  thumbnail?: string;
  thumbnailAlt?: string;
  readMoreLabel: string;
  accent: {
    icon: string;
    badge: string;
  };
  tip?: string;
}

/**
 * 運動知識庫的固定插槽。
 * 之後新增姿勢時，只要補上 thumbnail、status 與文案即可沿用同一張卡片版型。
 */
export const KNOWLEDGE_CARDS: KnowledgeCard[] = [
  {
    id: 'push',
    shortLabel: '推',
    eyebrow: 'PUSH PATTERN',
    title: '推：水平推與垂直推',
    subtitle: '胸、肩、三頭與肩胛穩定的發力順序。',
    badge: '準備中',
    status: 'comingSoon',
    icon: ArrowUpFromLine,
    readMoreLabel: '即將推出',
    accent: {
      icon: 'bg-sky-50 text-sky-700',
      badge: 'bg-sky-100 text-sky-800',
    },
  },
  {
    id: 'pull',
    shortLabel: '拉',
    eyebrow: 'PULL PATTERN',
    title: '拉：水平拉與垂直拉',
    subtitle: '背部、二頭與肩胛控制的離心技巧。',
    badge: '準備中',
    status: 'comingSoon',
    icon: ArrowDownToLine,
    readMoreLabel: '即將推出',
    accent: {
      icon: 'bg-emerald-50 text-emerald-700',
      badge: 'bg-emerald-100 text-emerald-800',
    },
  },
  {
    id: 'squat',
    shortLabel: '蹲',
    eyebrow: 'SQUAT PATTERN',
    title: '蹲：下肢推與膝髖協調',
    subtitle: '股四頭、臀肌與足踝活動度的整合。',
    badge: '準備中',
    status: 'comingSoon',
    icon: PersonStanding,
    readMoreLabel: '即將推出',
    accent: {
      icon: 'bg-amber-50 text-amber-700',
      badge: 'bg-amber-100 text-amber-800',
    },
  },
  {
    id: 'hinge',
    shortLabel: '髖',
    eyebrow: 'HINGE PATTERN',
    title: '髖：硬拉與髖鉸鏈',
    subtitle: '臀腿後側動力鏈、脊柱中立與腹壓。',
    badge: '已上線',
    status: 'available',
    icon: MoveDown,
    thumbnail: hingeThumbnail,
    thumbnailAlt: '硬拉標準起始姿勢示範',
    readMoreLabel: '閱讀教學',
    accent: {
      icon: 'bg-plum-50 text-plum-700',
      badge: 'bg-plum-900 text-amber-100',
    },
    tip: '先求脊柱中立，再求重量進步。',
  },
  {
    id: 'locomotion',
    shortLabel: '移動',
    eyebrow: 'LOCOMOTION',
    title: '移動：走路、跑步與動態穩定',
    subtitle: '步態、落地緩衝與單腳穩定的基礎。',
    badge: '準備中',
    status: 'comingSoon',
    icon: Footprints,
    readMoreLabel: '即將推出',
    accent: {
      icon: 'bg-rose-50 text-rose-700',
      badge: 'bg-rose-100 text-rose-800',
    },
  },
];
