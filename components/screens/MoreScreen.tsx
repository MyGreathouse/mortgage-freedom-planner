'use client';

import Card from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/Primitives';
import {
  BellIcon,
  BuildingIcon,
  ChecklistIcon,
  ChevronIcon,
  DownloadIcon,
  GoalIcon,
  LayersIcon,
  BookIcon,
  TrendIcon,
  UnlockIcon
} from '@/components/ui/Icons';
import { TabId } from '@/lib/types';

const ITEMS: { id: TabId; title: string; desc: string; Icon: React.ComponentType<{ size?: number }> }[] = [
  { id: 'compare', title: 'Overpay vs Invest', desc: 'Compare guaranteed savings against potential investment growth', Icon: TrendIcon },
  { id: 'goals', title: 'Financial Goals', desc: 'Set and track milestones toward mortgage freedom', Icon: GoalIcon },
  { id: 'repaymenttracker', title: 'Repayment Tracker', desc: 'Tick off real overpayments and lump sums as you make them', Icon: ChecklistIcon },
  { id: 'wealthbuilder', title: 'Property Wealth Builder', desc: 'Your roadmap from first home to a property portfolio', Icon: LayersIcon },
  { id: 'equityrelease', title: 'Equity Release Simulator', desc: 'Explore how much equity you could potentially access', Icon: UnlockIcon },
  { id: 'rentalcalc', title: 'Rental Property Calculator', desc: 'Estimate cash flow on a buy-to-let purchase', Icon: BuildingIcon },
  { id: 'education', title: 'Educational Hub', desc: 'Short lessons on mortgages, interest, and property wealth', Icon: BookIcon },
  { id: 'notifications', title: 'Notifications', desc: 'Motivational progress updates based on your profile', Icon: BellIcon },
  { id: 'export', title: 'Export Report', desc: 'Download your Mortgage Freedom Report', Icon: DownloadIcon }
];

export default function MoreScreen({ onNavigate }: { onNavigate: (tab: TabId) => void }) {
  return (
    <div className="px-4 pt-4 pb-24">
      <SectionHeader eyebrow="Explore" title="More Tools" />
      {ITEMS.map((it) => (
        <Card
          key={it.id}
          onClick={() => onNavigate(it.id)}
          className="flex items-center gap-3.5 !p-4 cursor-pointer active:scale-[0.99] transition-transform"
        >
          <div className="w-10 h-10 rounded-[10px] bg-navy text-gold-light flex items-center justify-center flex-shrink-0">
            <it.Icon size={20} />
          </div>
          <div className="flex-1">
            <div className="font-bold text-navy text-[15px]">{it.title}</div>
            <div className="text-xs text-ink-soft mt-0.5">{it.desc}</div>
          </div>
          <div className="text-ink-soft">
            <ChevronIcon />
          </div>
        </Card>
      ))}
    </div>
  );
}
