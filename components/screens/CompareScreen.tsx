'use client';

import { useMemo, useState } from 'react';
import Card from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/Primitives';
import { fmtCurrency, monthsToYM, simulateMortgage } from '@/lib/finance';
import { AppState } from '@/lib/useAppState';

export default function CompareScreen({ app }: { app: AppState }) {
  const { mortgage, currency } = app;
  const [monthlyExtra, setMonthlyExtra] = useState(200);
  const [investReturn, setInvestReturn] = useState(6);
  const termMonths = mortgage.remainingYears * 12;

  const overpaySim = useMemo(
    () => simulateMortgage({ balance: mortgage.balance, annualRate: mortgage.rate, termMonths, monthlyOverpay: monthlyExtra }),
    [mortgage, termMonths, monthlyExtra]
  );
  const baseline = useMemo(
    () => simulateMortgage({ balance: mortgage.balance, annualRate: mortgage.rate, termMonths }),
    [mortgage, termMonths]
  );
  const interestSaved = baseline.totalInterest - overpaySim.totalInterest;

  const r = investReturn / 100 / 12;
  const n = termMonths;
  const investFV = r === 0 ? monthlyExtra * n : monthlyExtra * ((Math.pow(1 + r, n) - 1) / r);

  return (
    <div className="px-4 pt-4 pb-24">
      <SectionHeader eyebrow="Decision Tool" title="Overpay vs Invest" />

      <Card>
        <div className="text-[13px] font-bold text-teal mb-3">Extra money available</div>
        <input type="range" min={0} max={1000} step={10} value={monthlyExtra} onChange={(e) => setMonthlyExtra(parseInt(e.target.value))} />
        <div className="font-display text-center font-bold mt-1.5">{fmtCurrency(monthlyExtra, currency)}/month</div>
      </Card>

      <Card>
        <div className="text-[13px] font-bold text-teal mb-3">Assumed investment return</div>
        <input type="range" min={0} max={12} step={0.5} value={investReturn} onChange={(e) => setInvestReturn(parseFloat(e.target.value))} />
        <div className="font-display text-center font-bold mt-1.5">{investReturn}% / year</div>
        <div className="text-xs text-ink-soft mt-1.5">Educational estimate only — investment returns are not guaranteed and can fall as well as rise.</div>
      </Card>

      <div className="flex gap-3 mb-4">
        <Card className="flex-1 !mb-0">
          <div className="text-xs font-bold text-teal mb-1.5">OPTION A · OVERPAY</div>
          <div className="font-display text-xl font-bold text-navy">{fmtCurrency(interestSaved, currency)}</div>
          <div className="text-xs text-ink-soft">interest saved, guaranteed</div>
          <div className="text-xs text-ink-soft mt-2">Risk: none · Time saved: {monthsToYM(baseline.months - overpaySim.months)}</div>
        </Card>
        <Card className="flex-1 !mb-0">
          <div className="text-xs font-bold text-gold mb-1.5">OPTION B · INVEST</div>
          <div className="font-display text-xl font-bold text-navy">{fmtCurrency(investFV, currency)}</div>
          <div className="text-xs text-ink-soft">potential value, not guaranteed</div>
          <div className="text-xs text-ink-soft mt-2">Risk: market-dependent</div>
        </Card>
      </div>

      <Card>
        <div className="text-[13px] font-bold text-teal mb-3">Option C · Split Strategy</div>
        <div className="text-[13px] text-ink-soft leading-relaxed">
          Many homeowners split extra funds — for example, half toward overpayments for guaranteed interest savings, half invested for
          long-term growth. Try adjusting the sliders above to compare each pound&apos;s impact before deciding on a split.
        </div>
      </Card>
    </div>
  );
}
