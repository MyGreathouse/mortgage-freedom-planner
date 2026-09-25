'use client';

import { useMemo } from 'react';
import Card from '@/components/ui/Card';
import { ProgressBar, SectionHeader, StatTile } from '@/components/ui/Primitives';
import { addMonths, fmtCurrency, fmtMonthYear, monthsElapsedSince, monthsToYM, simulateMortgage } from '@/lib/finance';
import { AppState } from '@/lib/useAppState';

const MONTH_LABELS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

function TickBox({ ticked, jan }: { ticked: boolean; jan?: boolean }) {
  return (
    <span
      className="w-4 h-4 rounded-[3px] border-[1.5px] inline-flex items-center justify-center flex-shrink-0"
      style={{
        borderColor: ticked ? (jan ? '#b3781a' : 'var(--color-navy)') : 'var(--color-navy)',
        background: ticked ? (jan ? '#b3781a' : 'var(--color-navy)') : '#fff'
      }}
    >
      {ticked && (
        <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
          <path d="M1.5 5.2L4 7.7L8.5 2.3" stroke="var(--color-gold-light)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );
}

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
            Go to the Calculator tab and tick &quot;Add an extra monthly overpayment&quot; or &quot;Add a one-off lump sum&quot; to set an
            amount — this tracker will then let you log each real payment as it happens.
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
              <div className="flex items-center justify-between mb-1 flex-wrap gap-1">
                <div className="text-[13px] font-bold text-navy">
                  Monthly Savings Tracker — <span className="text-teal">{fmtCurrency(monthlyOverpayAmount, currency)}</span> per box
                </div>
              </div>
              <div className={['text-[11px] font-semibold mb-3', monthsPaceDelta < 0 ? 'text-brand-red' : 'text-teal'].join(' ')}>
                {monthsTickedCount} of {termMonths} months ticked · {paceLabel(monthsPaceDelta, 'months')}
              </div>
              <div className="overflow-x-auto -mx-4 px-4">
                <table className="border-collapse text-[10px] w-full">
                  <thead>
                    <tr>
                      <th className="sticky left-0 z-10 bg-navy text-gold-light px-2 py-1.5 text-left font-bold uppercase text-[9.5px]">
                        Year
                      </th>
                      {MONTH_LABELS.map((m) => (
                        <th key={m} className="bg-navy text-gold-light px-1 py-1.5 font-bold text-[9px] text-center">
                          {m}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: mortgage.remainingYears }, (_, yi) => yi + 1).map((year) => (
                      <tr key={year} className={year % 2 === 0 ? 'bg-[#FAF9F6]' : 'bg-white'}>
                        <td className="sticky left-0 z-10 bg-[#EEF1F6] font-bold text-navy px-2 py-1 border border-line text-left text-[10.5px]">
                          Y{year}
                        </td>
                        {MONTH_LABELS.map((_, mi) => {
                          const absMonth = (year - 1) * 12 + mi + 1;
                          const ticked = monthsTickedSet.has(absMonth);
                          const isJan = mi === 0;
                          return (
                            <td
                              key={mi}
                              className="border border-line p-0 text-center"
                              style={isJan && !ticked ? { background: 'var(--color-highlight-bg)' } : undefined}
                            >
                              <button
                                onClick={() => toggleMonthTick(absMonth)}
                                className="w-full h-full min-w-[26px] min-h-[26px] flex items-center justify-center"
                                aria-label={`Year ${year} ${MONTH_LABELS[mi]}`}
                              >
                                <TickBox ticked={ticked} jan={isJan} />
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
              <div className="text-[13px] font-bold text-navy mb-1">
                January Injection Tracker — <span className="text-teal">{fmtCurrency(lumpSumAmount, currency)}</span> per box
              </div>
              <div className={['text-[11px] font-semibold mb-3', yearsPaceDelta < 0 ? 'text-brand-red' : 'text-teal'].join(' ')}>
                {yearsTickedCount} of {mortgage.remainingYears} years ticked · {paceLabel(yearsPaceDelta, 'years')}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: mortgage.remainingYears }, (_, yi) => yi + 1).map((year) => {
                  const ticked = yearsTickedSet.has(year);
                  return (
                    <button
                      key={year}
                      onClick={() => toggleYearTick(year)}
                      className={[
                        'flex items-center gap-1.5 rounded-md px-2 py-2 border text-left',
                        ticked ? 'bg-[var(--color-highlight-bg)] border-gold' : 'bg-[#FAF9F6] border-line'
                      ].join(' ')}
                    >
                      <TickBox ticked={ticked} />
                      <span className="text-[10.5px] font-bold text-navy">Year {year}</span>
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
            Tick a box the moment that payment clears in real life. Every input on this page — your ticks, currency, and amounts — is saved
            automatically and restored the next time you open this tool.
          </p>
        </>
      )}
    </div>
  );
}
