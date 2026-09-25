'use client';

import { useRef, useState } from 'react';
import Card from '@/components/ui/Card';
import { ProgressBar, SectionHeader, StatTile } from '@/components/ui/Primitives';
import { ChevronIcon, CloseIcon, EditIcon, PlusIcon } from '@/components/ui/Icons';
import { buildPaymentBreakdown, fmtCurrency, monthsToYM } from '@/lib/finance';
import { goalSuggestion } from '@/lib/goalSuggestions';
import { AppState } from '@/lib/useAppState';

export default function WealthScreen({ app }: { app: AppState }) {
  const { mortgage, goals, currency, addGoal, toggleGoal, renameGoal, removeGoal } = app;
  const [selectedGoalId, setSelectedGoalId] = useState<number | null>(null);
  const [editingGoalId, setEditingGoalId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [newGoalText, setNewGoalText] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);

  const equity = mortgage.currentValue - mortgage.balance;
  const equityPct = mortgage.currentValue ? (equity / mortgage.currentValue) * 100 : 0;
  const debtPaidPct = mortgage.purchasePrice
    ? Math.min(100, ((mortgage.purchasePrice - mortgage.deposit - mortgage.balance) / (mortgage.purchasePrice - mortgage.deposit)) * 100)
    : 0;
  const propertyGain = mortgage.currentValue - mortgage.purchasePrice;

  const rateFactor = Math.max(0, Math.min(25, (7 - mortgage.rate) * 4));
  const equityFactor = Math.max(0, Math.min(35, equityPct * 0.5));
  const progressFactor = Math.max(0, Math.min(25, debtPaidPct * 0.35));
  const termFactor = Math.max(0, Math.min(15, (mortgage.termYears - mortgage.remainingYears) * 1.2));
  const score = Math.min(100, Math.round(rateFactor + equityFactor + progressFactor + termFactor));

  const breakdown = buildPaymentBreakdown(mortgage.balance, mortgage.rate, mortgage.monthlyPayment);
  const capitalPctOfPayment = mortgage.monthlyPayment > 0 ? (breakdown.firstMonth.capitalPortion / mortgage.monthlyPayment) * 100 : 0;
  const breakdownMilestones = breakdown.milestones.filter(
    (m, i) => m.month === 1 || m.month % 60 === 0 || i === breakdown.milestones.length - 1
  );

  function startEdit(id: number, title: string) {
    setEditingGoalId(id);
    setEditValue(title);
    setSelectedGoalId(null);
    setTimeout(() => editInputRef.current?.focus(), 0);
  }
  function saveEdit(id: number) {
    renameGoal(id, editValue);
    setEditingGoalId(null);
  }
  function handleAdd() {
    if (!newGoalText.trim()) return;
    addGoal(newGoalText);
    setNewGoalText('');
  }

  return (
    <div className="px-4 pt-4 pb-24">
      <SectionHeader eyebrow="Wealth Impact" title="Your Dashboard" />

      <Card className="text-center">
        <div className="text-xs tracking-wide uppercase text-ink-soft font-semibold">Mortgage Freedom Score</div>
        <div className="font-display text-[48px] font-bold text-gold my-2 animate-countIn">
          {score}
          <span className="text-xl text-ink-soft">/100</span>
        </div>
        <ProgressBar pct={score} />
        <div className="text-xs text-ink-soft mt-2">Based on rate, equity position, repayment progress and term reduction</div>
      </Card>

      <Card>
        <div className="text-[13px] font-bold text-teal mb-3">Mortgage Reduction</div>
        <div className="flex flex-wrap gap-4 mb-2.5">
          <StatTile label="Original debt" value={fmtCurrency(mortgage.purchasePrice - mortgage.deposit, currency)} />
          <StatTile label="Current balance" value={fmtCurrency(mortgage.balance, currency)} />
          <StatTile label="% paid off" value={`${debtPaidPct.toFixed(1)}%`} accent="var(--color-teal)" />
        </div>
        <ProgressBar pct={debtPaidPct} color="var(--color-teal)" />
      </Card>

      <Card>
        <div className="text-[13px] font-bold text-teal mb-1">Where Your Payment Goes</div>
        <div className="text-[11.5px] text-ink-soft mb-3">Based on your current balance, rate, and monthly payment as entered in Profile</div>

        {breakdown.negativeAmortization ? (
          <div className="text-[12.5px] text-brand-red leading-relaxed bg-[#FBEFEA] border border-[#E3B9A5] rounded-lg p-3">
            Your current monthly payment doesn&apos;t fully cover the interest being charged, so none of it is reducing your balance yet.
            Double-check your rate and payment amount in Profile, or consider increasing your payment.
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-4 mb-3">
              <StatTile label="Goes to interest" value={fmtCurrency(breakdown.firstMonth.interestPortion, currency)} accent="#B3452E" />
              <StatTile label="Goes to capital" value={fmtCurrency(breakdown.firstMonth.capitalPortion, currency)} accent="var(--color-teal)" />
            </div>
            <ProgressBar pct={capitalPctOfPayment} color="var(--color-teal)" />
            <div className="text-xs text-ink-soft mt-2 mb-3">{capitalPctOfPayment.toFixed(1)}% of this payment reduces what you owe</div>

            <div className="bg-[#FAF9F6] rounded-lg p-3 text-[12px] text-ink-soft leading-relaxed space-y-1">
              <div>
                Monthly interest rate: {mortgage.rate}% ÷ 12 = <strong className="text-navy">{breakdown.monthlyRatePct.toFixed(3)}%</strong>
              </div>
              <div>
                Interest charged: {fmtCurrency(mortgage.balance, currency)} × {breakdown.monthlyRatePct.toFixed(3)}% ={' '}
                <strong className="text-navy">{fmtCurrency(breakdown.firstMonth.interestPortion, currency)}</strong>
              </div>
              <div>
                Capital repayment: {fmtCurrency(mortgage.monthlyPayment, currency)} − {fmtCurrency(breakdown.firstMonth.interestPortion, currency)} ={' '}
                <strong className="text-navy">{fmtCurrency(breakdown.firstMonth.capitalPortion, currency)}</strong>
              </div>
            </div>

            <div className="text-[13px] font-bold text-teal mt-4 mb-1">How This Changes Over Time</div>
            <div className="text-[12px] text-ink-soft leading-relaxed mb-3">
              Because your balance drops a little each month, the bank charges slightly less interest next time — so a little more of the
              same payment goes toward capital, and a little less toward interest. Here&apos;s how that split shifts over the years ahead:
            </div>
            <div className="overflow-x-auto -mx-1">
              <table className="w-full text-[11px] border-collapse">
                <thead>
                  <tr>
                    <th className="text-left font-bold text-gold-light bg-navy px-2 py-1.5">Year</th>
                    <th className="text-right font-bold text-gold-light bg-navy px-2 py-1.5">Interest</th>
                    <th className="text-right font-bold text-gold-light bg-navy px-2 py-1.5">Capital</th>
                    <th className="text-right font-bold text-gold-light bg-navy px-2 py-1.5">% Capital</th>
                  </tr>
                </thead>
                <tbody>
                  {breakdownMilestones.map((m, i) => (
                    <tr key={m.month} className={i % 2 === 0 ? 'bg-[#FAF9F6]' : 'bg-white'}>
                      <td className="px-2 py-1.5 border border-line font-bold text-navy">Y{m.year}</td>
                      <td className="px-2 py-1.5 border border-line text-right">{fmtCurrency(m.interestPortion, currency)}</td>
                      <td className="px-2 py-1.5 border border-line text-right">{fmtCurrency(m.capitalPortion, currency)}</td>
                      <td className="px-2 py-1.5 border border-line text-right text-teal font-bold">
                        {((m.capitalPortion / (m.interestPortion + m.capitalPortion)) * 100).toFixed(0)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {breakdown.monthsToPayOff && (
              <div className="text-[11.5px] text-ink-soft mt-2.5 italic">
                At this payment amount held flat, your balance would clear in around {monthsToYM(breakdown.monthsToPayOff)}.
              </div>
            )}
          </>
        )}
      </Card>

      <Card>
        <div className="text-[13px] font-bold text-teal mb-3">Equity Growth</div>
        <div className="flex flex-wrap gap-4 mb-2.5">
          <StatTile label="Property value" value={fmtCurrency(mortgage.currentValue, currency)} />
          <StatTile label="Mortgage" value={fmtCurrency(mortgage.balance, currency)} />
          <StatTile label="Equity" value={fmtCurrency(equity, currency)} accent="var(--color-gold)" />
        </div>
        <ProgressBar pct={equityPct} />
        <div className="text-xs text-ink-soft mt-2">
          Property has {propertyGain >= 0 ? 'gained' : 'lost'} {fmtCurrency(Math.abs(propertyGain), currency)} in value since purchase.
        </div>
      </Card>

      <Card>
        <div className="text-[13px] font-bold text-teal mb-1">Goals Progress</div>
        <div className="text-[11.5px] text-ink-soft mb-2">
          Tap the box to mark complete · tap a goal for a wealth-growing suggestion · use the pencil to rename or the × to remove
        </div>

        {goals.length === 0 && <div className="text-[13px] text-ink-soft mb-2.5">No goals yet — add one below.</div>}

        {goals.map((g) => {
          const selected = selectedGoalId === g.id;
          const editing = editingGoalId === g.id;
          return (
            <div
              key={g.id}
              onClick={() => !editing && setSelectedGoalId(selected ? null : g.id)}
              className={[
                'flex items-center gap-2 p-2 -mx-2 rounded-lg transition-colors',
                editing ? '' : 'cursor-pointer',
                selected ? 'bg-[var(--color-highlight-bg)]' : 'border-b border-line'
              ].join(' ')}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleGoal(g.id);
                }}
                className="w-[18px] h-[18px] rounded-[5px] border-2 flex-shrink-0"
                style={{ borderColor: g.done ? 'var(--color-teal)' : 'var(--color-line)', background: g.done ? 'var(--color-teal)' : 'transparent' }}
              />
              {editing ? (
                <>
                  <input
                    ref={editInputRef}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit(g.id);
                      if (e.key === 'Escape') setEditingGoalId(null);
                    }}
                    className="flex-1 border-[1.5px] border-gold rounded-lg px-2 py-1.5 text-sm outline-none text-navy font-semibold"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      saveEdit(g.id);
                    }}
                    className="border-0 bg-teal text-white rounded-md px-2.5 py-1.5 text-xs font-bold flex-shrink-0"
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <div className={['flex-1 text-sm', g.done ? 'text-ink-soft line-through' : 'text-navy'].join(' ')}>{g.title}</div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startEdit(g.id, g.title);
                    }}
                    className="text-ink-soft p-1 flex-shrink-0"
                    aria-label="Rename goal"
                  >
                    <EditIcon />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeGoal(g.id);
                      if (selectedGoalId === g.id) setSelectedGoalId(null);
                    }}
                    className="text-ink-soft p-1 flex-shrink-0"
                    aria-label="Remove goal"
                  >
                    <CloseIcon />
                  </button>
                  <div className={['text-ink-soft flex-shrink-0 transition-transform', selected ? 'rotate-90' : ''].join(' ')}>
                    <ChevronIcon />
                  </div>
                </>
              )}
            </div>
          );
        })}

        <div className="flex gap-2 mt-3">
          <input
            value={newGoalText}
            onChange={(e) => setNewGoalText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Add a goal..."
            className="flex-1 border-[1.5px] border-line rounded-[10px] px-3 py-2.5 text-sm outline-none focus:border-gold transition-colors"
          />
          <button onClick={handleAdd} className="px-4 rounded-[10px] border-0 bg-navy text-white font-bold flex items-center gap-1">
            <PlusIcon />
          </button>
        </div>

        {selectedGoalId &&
          (() => {
            const sel = goals.find((g) => g.id === selectedGoalId);
            if (!sel) return null;
            return (
              <div className="mt-3 p-3.5 rounded-xl bg-gradient-to-br from-teal to-teal-light text-white animate-fadeUp">
                <div className="text-[11px] tracking-wide uppercase opacity-85 font-bold mb-1.5">Suggestion for &ldquo;{sel.title}&rdquo;</div>
                <div className="text-[13.5px] leading-relaxed">{goalSuggestion(sel.title, mortgage, currency)}</div>
              </div>
            );
          })()}
      </Card>
    </div>
  );
}
