'use client';

import { useMemo } from 'react';
import Card from '@/components/ui/Card';
import { ProgressBar, SectionHeader, StatTile } from '@/components/ui/Primitives';
import { addMonths, fmtCurrency, fmtMonthYear, monthsElapsedSince, monthsToYM, simulateMortgage } from '@/lib/finance';
import { AppState } from '@/lib/useAppState';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function RepaymentTrackerScreen({ app }: { app: AppState }) {
  const { mortgage, currency, calculatorSettings, repaymentTicks, toggleMonthTick, toggleYearTick, resetRepaymentTicks } = app;
  const { monthlyOverpayEnabled, monthlyOverpayAmount, lumpSumEnabled, lumpSumAmount } = calculatorSettings;

  const termMonths = mortgage.remainingYears * 12;
  const anyEnabled = monthlyOverpayEnabled || lumpSumEnabled;

  const monthsTickedSet = useMemo(() => new Set(repaymentTicks.months), [repaymentTicks.months]);
  const yearsTickedSet = useMemo(() => new Set(repaymentTicks.years), [repaymentTicks.years]);

  const monthsTickedCount = repaymentTicks.months.filter((m) => m >= 1 && m <= termMonths).length;
  const yearsTickedCount = repaymentTicks.years.filter((y) => y >= 1 && y <= mortgage.remainingYears).length;

  const actualExtraPaid = (monthlyOverpayEnabled ? monthsTickedCount * monthlyOverpayAmount : 0) + (lumpSumEnabled ? yearsTickedCount * lumpSumAmount : 0);
  const planTotalExtra = (monthlyOverpayEnabled ? termMonths * monthlyOverpayAmount : 0) + (lumpSumEnabled ? mortgage.remainingYears * lumpSumAmount : 0);
  const progressPct = planTotalExtra > 0 ? (actualExtraPaid / planTotalExtra) * 100 : 0;

  const calendarMonthsElapsed = monthsElapsedSince(mortgage.startDate, termMonths);
  const calendarYearsElapsed = Math.min(mortgage.remainingYears, Math.floor(calendarMonthsElapsed / 12));
  const monthsPaceDelta = monthsTickedCount - calendarMonthsElapsed;
  const yearsPaceDelta = yearsTickedCount - calendarYearsElapsed;

  const strategy = useMemo(
    () =>
      simulateMortgage({
        balance: mortgage.balance,
        annualRate: mortgage.rate,
        termMonths,
        monthlyOverpay: monthlyOverpayEnabled ? monthlyOverpayAmount : 0,
        lumpSum: lumpSumEnabled ? lumpSumAmount : 0,
        lumpFrequencyMonths: 12
      }),
    [mortgage, termMonths, monthlyOverpayEnabled, monthlyOverpayAmount, lumpSumEnabled, lumpSumAmount]
  );
  const strategyFreeDate = addMonths(mortgage.startDate, strategy.months);

  function paceLabel(delta: number, unit: 'months' | 'years') {
    if (delta === 0) return `Right on pace`;
    if (delta > 0) return `${delta} ${unit === 'months' ? (delta === 1 ? 'month' : 'months') : delta === 1 ? 'year' : 'years'} ahead of pace`;
    return `${Math.abs(delta)} ${unit === 'months' ? (Math.abs(delta) === 1 ? 'month' : 'months') : Math.abs(delta) === 1 ? 'year' : 'years'} behind pace`;
  }

  function handleReset() {
    if (window.confirm('Reset every ticked box on this tracker? This cannot be undone.')) {
      resetRepaymentTicks();
    }
  }

  return (
    <div className="px-4 pt-4 pb-24">
      <SectionHeader eyebrow="Stay Accountable" title="Repayment Tracker" />

      {!anyEnabled && (
        <Card className="!bg-[var(--color-highlight-bg)] !border-gold-light">
          <div className="text-[13px] text-navy leading-relaxed font-semibold mb-1">No overpayment plan active yet</div>
          <div className="text-[12.5px] text-ink-soft leading-relaxed">
            Go to the Calculator tab and tick "Add an extra monthly overpayment" or "Add a one-off lump sum" to set an amount — this tracker
            will then let you log each real payment as it happens.
          </div>
        </Card>
      )}

      {anyEnabled && (
        <>
          <Card navy>
            <div className="text-xs tracking-wide uppercase opacity-75 font-semibold mb-2.5">Your Real Progress</div>
            <div className="flex flex-wrap gap-4 mb-3">
              <StatTile label="Ticked so far" value={fmtCurrency(actualExtraPaid, currency)} accent="var(--color-gold-light)" />
              <StatTile label="Plan total" value={fmtCurrency(planTotalExtra, currency)} accent="var(--color-gold-light)" />
            </div>
            <ProgressBar pct={progressPct} color="var(--color-gold)" />
            <div className="text-xs opacity-85 mt-2">{progressPct.toFixed(1)}% of your full plan ticked off</div>
            <div className="border-t border-white/15 mt-3 pt-3 text-[12.5px] opacity-90 leading-relaxed">
              If you keep this pace going for the rest of the term, you&apos;re on track for{' '}
              <strong className="text-gold-light">{fmtMonthYear(strategyFreeDate)}</strong> — {monthsToYM(strategy.months)} total, saving{' '}
              <strong className="text-gold-light">{fmtCurrency(strategy.totalInterest, currency)}</strong> less in interest than the baseline.
            </div>
          </Card>

          {monthlyOverpayEnabled && (
            <Card>
              <div className="flex items-center justify-between mb-1">
                <div className="text-[13px] font-bold text-teal">Monthly Overpayment Tracker</div>
                <div className="text-[11px] text-ink-soft">{fmtCurrency(monthlyOverpayAmount, currency)} per box</div>
              </div>
              <div className={['text-[11px] font-semibold mb-3', monthsPaceDelta < 0 ? 'text-brand-red' : 'text-teal'].join(' ')}>
                {monthsTickedCount} of {termMonths} months ticked · {paceLabel(monthsPaceDelta, 'months')}
              </div>
              <div className="overflow-x-auto -mx-1">
                <table className="border-collapse text-[9px] min-w-full">
                  <thead>
                    <tr>
                      <th className="sticky left-0 bg-navy text-gold-light px-1.5 py-1 text-left font-semibold">Yr</th>
                      {MONTH_LABELS.map((m) => (
                        <th key={m} className="bg-navy text-gold-light px-1 py-1 font-semibold">
                          {m}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: mortgage.remainingYears }, (_, yi) => yi + 1).map((year) => (
                      <tr key={year} className={year % 2 === 0 ? 'bg-[#FAF9F6]' : ''}>
                        <td className="sticky left-0 bg-[#EEF1F6] font-bold text-navy px-1.5 py-1 border border-line text-left">Y{year}</td>
                        {MONTH_LABELS.map((_, mi) => {
                          const absMonth = (year - 1) * 12 + mi + 1;
                          const ticked = monthsTickedSet.has(absMonth);
                          return (
                            <td key={mi} className="border border-line p-0 text-center">
                              <button
                                onClick={() => toggleMonthTick(absMonth)}
                                className="w-full h-full min-w-[20px] min-h-[20px] flex items-center justify-center"
                                aria-label={`Year ${year} ${MONTH_LABELS[mi]}`}
                              >
                                <span
                                  className="w-3 h-3 rounded-sm border inline-block"
                                  style={{
                                    borderColor: ticked ? 'var(--color-navy)' : 'var(--color-line)',
                                    background: ticked ? 'var(--color-navy)' : '#fff'
                                  }}
                                />
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-[10.5px] text-ink-soft mt-2 italic">Swipe sideways to see all months. Tick a box the moment that overpayment clears.</div>
            </Card>
          )}

          {lumpSumEnabled && (
            <Card>
              <div className="flex items-center justify-between mb-1">
                <div className="text-[13px] font-bold text-teal">Annual Lump Sum Tracker</div>
                <div className="text-[11px] text-ink-soft">{fmtCurrency(lumpSumAmount, currency)} per box</div>
              </div>
              <div className={['text-[11px] font-semibold mb-3', yearsPaceDelta < 0 ? 'text-brand-red' : 'text-teal'].join(' ')}>
                {yearsTickedCount} of {mortgage.remainingYears} years ticked · {paceLabel(yearsPaceDelta, 'years')}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: mortgage.remainingYears }, (_, yi) => yi + 1).map((year) => {
                  const ticked = yearsTickedSet.has(year);
                  return (
                    <button
                      key={year}
                      onClick={() => toggleYearTick(year)}
                      className={[
                        'flex items-center gap-1.5 rounded-lg px-2 py-2 border text-left',
                        ticked ? 'bg-[var(--color-highlight-bg)] border-gold' : 'bg-[#FAF9F6] border-line'
                      ].join(' ')}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-sm border flex-shrink-0"
                        style={{ borderColor: ticked ? 'var(--color-gold)' : 'var(--color-line)', background: ticked ? 'var(--color-gold)' : '#fff' }}
                      />
                      <span className="text-[10.5px] font-bold text-navy">Y{year}</span>
                    </button>
                  );
                })}
              </div>
            </Card>
          )}

          <button
            onClick={handleReset}
            className="w-full py-3 rounded-xl border-[1.5px] border-line bg-white text-ink-soft font-bold text-[13px] mt-1"
          >
            Reset All Ticks
          </button>
          <p className="text-[11px] text-ink-soft text-center mt-2 leading-relaxed">
            Every tick is saved automatically, same as the rest of your plan.
          </p>
        </>
      )}
    </div>
  );
}
