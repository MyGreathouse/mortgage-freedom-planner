'use client';

import { useEffect, useState } from 'react';
import { useAppState } from '@/lib/useAppState';
import { TabId } from '@/lib/types';
import { ChevronIcon, HomeIcon, CalcIcon, ChartIcon, BuildIcon, SparkIcon } from '@/components/ui/Icons';

import SetupScreen from '@/components/screens/SetupScreen';
import CalculatorScreen from '@/components/screens/CalculatorScreen';
import WealthScreen from '@/components/screens/WealthScreen';
import MoreScreen from '@/components/screens/MoreScreen';
import CompareScreen from '@/components/screens/CompareScreen';
import GoalsScreen from '@/components/screens/GoalsScreen';
import PropertyWealthBuilderScreen from '@/components/screens/PropertyWealthBuilderScreen';
import EquityReleaseScreen from '@/components/screens/EquityReleaseScreen';
import RentalCalcScreen from '@/components/screens/RentalCalcScreen';
import EducationScreen from '@/components/screens/EducationScreen';
import NotificationsScreen from '@/components/screens/NotificationsScreen';
import ExportScreen from '@/components/screens/ExportScreen';
import RepaymentTrackerScreen from '@/components/screens/RepaymentTrackerScreen';

const TABS: { id: TabId; label: string; Icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: 'setup', label: 'Profile', Icon: HomeIcon },
  { id: 'calc', label: 'Calculator', Icon: CalcIcon },
  { id: 'wealth', label: 'Wealth', Icon: ChartIcon },
  { id: 'more', label: 'More', Icon: BuildIcon }
];

const SUB_SCREENS: TabId[] = [
  'compare',
  'goals',
  'wealthbuilder',
  'equityrelease',
  'rentalcalc',
  'education',
  'notifications',
  'export',
  'repaymenttracker'
];

export default function AppShell() {
  const app = useAppState();
  const [tab, setTab] = useState<TabId>('setup');
  const [animKey, setAnimKey] = useState(0);

  // Apply the selected theme to the document root so CSS variables in globals.css switch instantly
  useEffect(() => {
    if (app.theme && app.theme !== 'classic') {
      document.documentElement.setAttribute('data-theme', app.theme);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [app.theme]);

  function navigate(next: TabId) {
    if (next === tab) return;
    setTab(next);
    setAnimKey((k) => k + 1);
  }

  const isSubScreen = SUB_SCREENS.includes(tab);

  if (!app.hydrated) {
    return (
      <div className="max-w-[480px] mx-auto min-h-screen bg-canvas flex items-center justify-center">
        <div className="text-ink-soft text-sm animate-pulse">Loading your plan…</div>
      </div>
    );
  }

  return (
    <div className="max-w-[480px] mx-auto min-h-screen bg-canvas relative">
      <div
        className="bg-navy flex items-center justify-between sticky top-0 z-20"
        style={{ padding: '18px 16px 14px', paddingTop: 'calc(18px + var(--safe-top))' }}
      >
        <div className="flex items-center gap-2.5">
          {isSubScreen && (
            <button onClick={() => navigate('more')} className="bg-transparent border-0 text-white rotate-180 p-0" aria-label="Back">
              <ChevronIcon className="text-white" />
            </button>
          )}
          <div className="w-[30px] h-[30px] rounded-lg bg-gold flex items-center justify-center">
            <SparkIcon size={16} className="text-navy" />
          </div>
          <div>
            <div className="font-display text-white font-bold text-base leading-none">Mortgage Freedom Planner</div>
            <div className="text-gold-light text-[10.5px] tracking-wide mt-0.5">Your path to property wealth</div>
          </div>
        </div>
      </div>

      <div key={animKey} className="animate-fadeUp">
        {tab === 'setup' && <SetupScreen app={app} />}
        {tab === 'calc' && <CalculatorScreen app={app} />}
        {tab === 'wealth' && <WealthScreen app={app} />}
        {tab === 'more' && <MoreScreen onNavigate={navigate} />}
        {tab === 'compare' && <CompareScreen app={app} />}
        {tab === 'goals' && <GoalsScreen app={app} />}
        {tab === 'wealthbuilder' && <PropertyWealthBuilderScreen app={app} />}
        {tab === 'equityrelease' && <EquityReleaseScreen app={app} />}
        {tab === 'rentalcalc' && <RentalCalcScreen app={app} />}
        {tab === 'education' && <EducationScreen />}
        {tab === 'notifications' && <NotificationsScreen app={app} />}
        {tab === 'export' && <ExportScreen app={app} />}
        {tab === 'repaymenttracker' && <RepaymentTrackerScreen app={app} />}
      </div>

      {!isSubScreen && (
        <div
          className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-line flex justify-around z-30"
          style={{ padding: '8px 4px calc(8px + var(--safe-bottom))' }}
        >
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => navigate(t.id)}
                className="bg-transparent border-0 flex flex-col items-center gap-0.5 py-1 px-2.5 transition-transform active:scale-95"
              >
                <t.Icon size={20} className={active ? 'text-gold' : 'text-[#A3ACBE]'} />
                <span className={['text-[10.5px]', active ? 'text-navy font-bold' : 'text-[#A3ACBE] font-medium'].join(' ')}>{t.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
