'use client';

import { useMemo } from 'react';
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Card from '@/components/ui/Card';
import { Chip, SectionHeader, StatTile } from '@/components/ui/Primitives';
import { addMonths, fmtCurrency, fmtMonthYear, monthsToYM, simulateMortgage } from '@/lib/finance';
import { AppState } from '@/lib/useAppState';

function ToggleRow({
  checked,
  onChange,
  label
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-2.5 bg-[var(--color-highlight-bg)] border border-gold-light rounded-lg px-3 py-2.5 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 accent-navy flex-shrink-0"
      />
      <span className="text-[12.5px] text-navy font-semibold leading-snug">{label}</span>
    </label>
  );
}

function formatSavedTime(d: Date): string {
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function CalculatorScreen({ app }: { app: AppState }) {
  const { mortgage, currency, calculatorSettings, updateCalculatorSettings, lastSavedAt } = app;
  const { monthlyOverpayEnabled, monthlyOverpayAmount, lumpSumEnabled, lumpSumAmount } = calculatorSettings;

  const effectiveMonthlyOverpay = monthlyOverpayEnabled ? monthlyOverpayAmount : 0;
  const effectiveLumpSum = lumpSumEnabled ? lumpSumAmount : 0;
  const lumpFreq = 12;

  const termMonths = mortgage.remainingYears * 12;

  const baseline = useMemo(
    () => simulateMortgage({ balance: mortgage.balance, annualRate: mortgage.rate, termMonths }),
    [mortgage, termMonths]
  );
  const strategy = useMemo(
    () =>
      simulateMortgage({
        balance: mortgage.balance,
        annualRate: mortgage.rate,
        termMonths,
        monthlyOverpay: effectiveMonthlyOverpay,
        lumpSum: effectiveLumpSum,
        lumpFrequencyMonths: lumpFreq
      }),
    [mortgage, termMonths, effectiveMonthlyOverpay, effectiveLumpSum]
  );

  const monthsSaved = baseline.months - strategy.months;
  const interestSaved = baseline.totalInterest - strategy.totalInterest;
  const baselineFreeDate = addMonths(mortgage.startDate, baseline.months);
  const strategyFreeDate = addMonths(mortgage.startDate, strategy.months);
  const anyActive = monthlyOverpayEnabled || lumpSumEnabled;

  const chartData = useMemo(() => {
    const maxLen = Math.max(baseline.schedule.length, strategy.schedule.length);
    const out: { month: number; original: number; strategy: number }[] = [];
    for (let i = 0; i < maxLen; i++) {
      out.push({
        month: strategy.schedule[i]?.month ?? baseline.schedule[i]?.month ?? 0,
        original: baseline.schedule[i]?.balance ?? 0,
        strategy: strategy.schedule[i]?.balance ?? 0
      });
    }
    return out;
  }, [baseline, strategy]);

  const quickAmounts = [25, 50, 100, 250, 500, 1000];
  const quickLumps = [500, 1000, 5000, 10000];

  return (
    <div className="px-4 pt-4 pb-24">
      <SectionHeader eyebrow="Freedom Calculator" title="Test a Strategy" />

      <Card>
        <div className="text-[13px] font-bold text-teal mb-3">Extra Monthly Overpayment</div>
        <ToggleRow
          checked={monthlyOverpayEnabled}
          onChange={(v) => updateCalculatorSettings('monthlyOverpayEnabled', v)}
          label="Add an extra monthly overpayment on top of my normal payment"
        />
        {monthlyOverpayEnabled && (
          <div className="mt-3.5 animate-fadeUp">
            <div className="flex flex-wrap gap-1.5 mb-3">
              {quickAmounts.map((a) => (
                <Chip key={a} active={monthlyOverpayAmount === a} onClick={() => updateCalculatorSettings('monthlyOverpayAmount', a)}>
                  +{fmtCurrency(a, currency)}
                </Chip>
              ))}
            </div>
            <input
              type="range"
              min={0}
              max={2000}
              step={10}
              value={monthlyOverpayAmount}
              onChange={(e) => updateCalculatorSettings('monthlyOverpayAmount', parseInt(e.target.value))}
            />
            <div className="font-display text-center font-bold text-navy mt-1.5">+{fmtCurrency(monthlyOverpayAmount, currency)}/month</div>
          </div>
        )}
      </Card>

      <Card>
        <div className="text-[13px] font-bold text-teal mb-3">Annual Lump Sum</div>
        <ToggleRow
          checked={lumpSumEnabled}
          onChange={(v) => updateCalculatorSettings('lumpSumEnabled', v)}
          label="Add a one-off lump sum payment once per year"
        />
        {lumpSumEnabled && (
          <div className="mt-3.5 animate-fadeUp">
            <div className="flex flex-wrap gap-1.5 mb-3">
              {quickLumps.map((a) => (
                <Chip key={a} variant="teal" active={lumpSumAmount === a} onClick={() => updateCalculatorSettings('lumpSumAmount', a)}>
                  {fmtCurrency(a, currency)}
                </Chip>
              ))}
            </div>
            <input
              type="range"
              min={0}
              max={20000}
              step={250}
              value={lumpSumAmount}
              onChange={(e) => updateCalculatorSettings('lumpSumAmount', parseInt(e.target.value))}
            />
            <div className="font-display text-center font-bold text-navy mt-1.5">{fmtCurrency(lumpSumAmount, currency)} once per year</div>
          </div>
        )}
      </Card>

      <Card navy>
        <div className="text-xs tracking-wide uppercase opacity-75 font-semibold mb-2.5">
          {anyActive ? 'Result of This Strategy' : 'No extra payments added yet'}
        </div>
        {!anyActive && (
          <div className="text-[13px] opacity-80 mb-3 leading-relaxed">
            Tick a box above and enter an amount to see how it changes your mortgage-free date.
          </div>
        )}
        <div className="flex flex-wrap gap-4 mb-3">
          <StatTile label="Time saved" value={monthsToYM(monthsSaved)} accent="var(--color-gold-light)" />
          <StatTile label="Interest saved" value={fmtCurrency(interestSaved, currency)} accent="var(--color-gold-light)" />
        </div>
        <div className="h-[180px] -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
              <XAxis dataKey="month" hide />
              <YAxis hide domain={[0, 'dataMax']} />
              <Tooltip
                formatter={(value: number, name: string) => [fmtCurrency(value, currency), name === 'original' ? 'Without strategy' : 'With strategy']}
                labelFormatter={(m) => `Month ${m}`}
                contentStyle={{ background: 'var(--color-navy)', border: 'none', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: 'var(--color-gold-light)' }}
              />
              <Line type="monotone" dataKey="original" stroke="var(--color-muted-line)" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="strategy" stroke="var(--color-gold-light)" strokeWidth={2.5} dot={false} animationDuration={400} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-between text-xs opacity-85 mt-1.5">
          <span>Original: {fmtMonthYear(baselineFreeDate)}</span>
          <span className="text-gold-light font-bold">New: {fmtMonthYear(strategyFreeDate)}</span>
        </div>
      </Card>

      <Card>
        <div className="font-display text-base font-bold mb-1.5 text-navy">
          &ldquo;You have gained {monthsToYM(monthsSaved)} of financial freedom.&rdquo;
        </div>
        <div className="text-[13px] text-ink-soft leading-relaxed">
          Mortgage-free date moves from {fmtMonthYear(baselineFreeDate)} to{' '}
          <strong className="text-teal">{fmtMonthYear(strategyFreeDate)}</strong>, keeping {fmtCurrency(interestSaved, currency)} in your pocket
          instead of the bank&apos;s.
        </div>
      </Card>

      <div className="text-[11px] text-ink-soft text-center mt-1">
        {lastSavedAt ? `✓ Saved automatically at ${formatSavedTime(lastSavedAt)}` : 'Your strategy settings save automatically as you change them.'}
      </div>
    </div>
  );
}
