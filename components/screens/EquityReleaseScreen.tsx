'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import { SectionHeader, StatTile } from '@/components/ui/Primitives';
import { NumberField } from '@/components/ui/Fields';
import { fmtCurrency, CURRENCIES } from '@/lib/finance';
import { AppState } from '@/lib/useAppState';

export default function EquityReleaseScreen({ app }: { app: AppState }) {
  const { mortgage, currency } = app;
  const [projectedValue, setProjectedValue] = useState(Math.round(mortgage.currentValue * 1.15));
  const [maxLTV, setMaxLTV] = useState(60);

  const currentEquity = mortgage.currentValue - mortgage.balance;
  const futureEquity = projectedValue - mortgage.balance;
  const maxAccessible = Math.max(0, projectedValue * (maxLTV / 100) - mortgage.balance);

  return (
    <div className="px-4 pt-4 pb-24">
      <SectionHeader eyebrow="Equity Tools" title="Equity Release Simulator" />

      <Card className="!bg-[var(--color-highlight-bg)] !border-gold-light">
        <div className="text-[12.5px] text-ink-soft leading-relaxed">
          This is an educational simulation only, not financial advice. Equity release and further borrowing depend on lender criteria,
          fees, and your personal circumstances — always speak to a qualified, regulated adviser before making decisions.
        </div>
      </Card>

      <Card>
        <div className="text-[13px] font-bold text-teal mb-3">Projected Future Property Value</div>
        <NumberField label="If your property grows to..." prefix={CURRENCIES[currency].symbol} value={projectedValue} onChange={setProjectedValue} step={5000} />
        <div className="text-xs text-ink-soft">Current value: {fmtCurrency(mortgage.currentValue, currency)}</div>
      </Card>

      <Card>
        <div className="text-[13px] font-bold text-teal mb-3">Maximum Lender Loan-to-Value Assumption</div>
        <input type="range" min={40} max={75} step={5} value={maxLTV} onChange={(e) => setMaxLTV(parseInt(e.target.value))} />
        <div className="font-display text-center font-bold mt-1.5">{maxLTV}% of property value</div>
      </Card>

      <Card navy>
        <div className="flex flex-wrap gap-4 mb-1.5">
          <StatTile label="Current equity" value={fmtCurrency(currentEquity, currency)} accent="var(--color-gold-light)" />
          <StatTile label="Equity at projected value" value={fmtCurrency(futureEquity, currency)} accent="var(--color-gold-light)" />
        </div>
        <div className="border-t border-white/15 mt-2.5 pt-3">
          <div className="text-xs opacity-75 uppercase tracking-wide font-semibold">Potentially Accessible</div>
          <div className="font-display text-[28px] font-bold text-gold-light mt-1">{fmtCurrency(maxAccessible, currency)}</div>
        </div>
      </Card>
    </div>
  );
}
