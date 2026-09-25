'use client';

import { useMemo } from 'react';
import Card from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/Primitives';
import { BuildingIcon, ChartIcon, GoalIcon, SparkIcon, TrendIcon } from '@/components/ui/Icons';
import { fmtCurrency, simulateMortgage } from '@/lib/finance';
import { AppState } from '@/lib/useAppState';

export default function NotificationsScreen({ app }: { app: AppState }) {
  const { mortgage, currency } = app;
  const equity = mortgage.currentValue - mortgage.balance;
  const termMonths = mortgage.remainingYears * 12;

  const { daysPerHundred, yearlyInterestSaved } = useMemo(() => {
    const monthlySim = simulateMortgage({ balance: mortgage.balance, annualRate: mortgage.rate, termMonths, monthlyOverpay: 100 });
    const baseline = simulateMortgage({ balance: mortgage.balance, annualRate: mortgage.rate, termMonths });
    return {
      daysPerHundred: Math.round((baseline.months - monthlySim.months) * 30.4),
      yearlyInterestSaved: Math.round((baseline.totalInterest - monthlySim.totalInterest) / mortgage.remainingYears)
    };
  }, [mortgage, termMonths]);

  const notifications = [
    { Icon: SparkIcon, text: `A ${fmtCurrency(100, currency)}/month overpayment would reduce your mortgage term by roughly ${daysPerHundred} days.` },
    { Icon: TrendIcon, text: `Keeping that pace could save around ${fmtCurrency(yearlyInterestSaved, currency)} in interest this year.` },
    { Icon: ChartIcon, text: `Your current equity stands at ${fmtCurrency(equity, currency)} — check the Wealth tab for your full progress.` },
    { Icon: GoalIcon, text: `Review your Financial Goals tab to see how close you are to your next milestone.` },
    { Icon: BuildingIcon, text: `Rate or income change? Revisit the Calculator to see how it shifts your mortgage-free date.` }
  ];

  return (
    <div className="px-4 pt-4 pb-24">
      <SectionHeader eyebrow="Motivation" title="Notifications" />
      <div className="text-[12.5px] text-ink-soft mb-3.5 leading-relaxed">
        Illustrative examples based on your current profile — a live app would refresh these as your balance and payments change.
      </div>
      {notifications.map((n, i) => (
        <Card key={i} className="flex gap-3 items-start !p-3.5">
          <div className="w-[34px] h-[34px] rounded-[9px] bg-[var(--color-highlight-bg)] text-gold flex items-center justify-center flex-shrink-0">
            <n.Icon size={17} />
          </div>
          <div className="text-[13.5px] text-navy leading-relaxed pt-1.5">{n.text}</div>
        </Card>
      ))}
    </div>
  );
}
