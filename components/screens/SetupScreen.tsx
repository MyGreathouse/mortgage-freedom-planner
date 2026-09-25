'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/Primitives';
import { NumberField, SelectField, DateField } from '@/components/ui/Fields';
import { fmtCurrency, CURRENCIES } from '@/lib/finance';
import { THEMES } from '@/lib/themes';
import { AppState } from '@/lib/useAppState';

export default function SetupScreen({ app }: { app: AppState }) {
  const { mortgage, updateMortgageField, currency, setCurrency, theme, setTheme } = app;
  const [savedFlash, setSavedFlash] = useState(false);

  const equity = mortgage.currentValue - mortgage.balance;
  const equityPct = mortgage.currentValue ? (equity / mortgage.currentValue) * 100 : 0;

  function flashSaved() {
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1400);
  }

  return (
    <div className="px-4 pt-4 pb-24">
      <SectionHeader eyebrow="Your Profile" title="Mortgage Setup" />

      <Card>
        <div className="text-[13px] font-bold text-teal mb-3">Preferences</div>
        <SelectField
          label="Preferred currency"
          value={currency}
          onChange={setCurrency}
          options={Object.keys(CURRENCIES).map((code) => ({
            value: code,
            label: `${CURRENCIES[code].symbol} — ${CURRENCIES[code].name} (${code})`
          }))}
        />

        <div className="text-xs font-semibold text-ink-soft mb-2 mt-1">Appearance</div>
        <div className="grid grid-cols-2 gap-2.5">
          {THEMES.map((t) => {
            const active = theme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={[
                  'text-left rounded-xl border-[1.5px] px-3 py-2.5 transition-colors',
                  active ? 'border-gold bg-[var(--color-highlight-bg)]' : 'border-line bg-white'
                ].join(' ')}
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="w-4 h-4 rounded-full border border-white shadow-sm" style={{ background: t.swatch.navy }} />
                  <span className="w-4 h-4 rounded-full border border-white shadow-sm -ml-2.5" style={{ background: t.swatch.gold }} />
                  <span className="w-4 h-4 rounded-full border border-white shadow-sm -ml-2.5" style={{ background: t.swatch.teal }} />
                  {active && <span className="ml-auto text-gold font-bold text-xs">✓</span>}
                </div>
                <div className="text-[12.5px] font-bold text-navy leading-tight">{t.label}</div>
                <div className="text-[11px] text-ink-soft mt-0.5 leading-tight">{t.description}</div>
              </button>
            );
          })}
        </div>
      </Card>

      <Card navy>
        <div className="text-xs tracking-wide uppercase opacity-70 font-semibold">Current Equity</div>
        <div className="font-display text-[34px] font-bold text-gold-light my-1.5">{fmtCurrency(equity, currency)}</div>
        <div className="text-[13px] opacity-85">
          {equityPct.toFixed(1)}% of property value · {fmtCurrency(mortgage.currentValue, currency)} home
        </div>
      </Card>

      <Card>
        <div className="text-[13px] font-bold text-teal mb-3">Property</div>
        <NumberField label="Original purchase price" prefix={CURRENCIES[currency].symbol} value={mortgage.purchasePrice} onChange={(v) => updateMortgageField('purchasePrice', v)} step={1000} />
        <NumberField label="Current property value" prefix={CURRENCIES[currency].symbol} value={mortgage.currentValue} onChange={(v) => updateMortgageField('currentValue', v)} step={1000} />
        <NumberField label="Deposit paid" prefix={CURRENCIES[currency].symbol} value={mortgage.deposit} onChange={(v) => updateMortgageField('deposit', v)} step={500} />
      </Card>

      <Card>
        <div className="text-[13px] font-bold text-teal mb-3">Mortgage</div>
        <NumberField label="Total mortgage balance" prefix={CURRENCIES[currency].symbol} value={mortgage.balance} onChange={(v) => updateMortgageField('balance', v)} step={500} />
        <NumberField label="Interest rate" suffix="%" value={mortgage.rate} onChange={(v) => updateMortgageField('rate', v)} step={0.05} />
        <SelectField
          label="Mortgage type"
          value={mortgage.type}
          onChange={(v) => updateMortgageField('type', v)}
          options={[
            { value: 'fixed', label: 'Fixed rate' },
            { value: 'variable', label: 'Variable rate' },
            { value: 'tracker', label: 'Tracker' }
          ]}
        />
        <div className="flex gap-3">
          <div className="flex-1">
            <NumberField label="Original term (yrs)" value={mortgage.termYears} onChange={(v) => updateMortgageField('termYears', v)} />
          </div>
          <div className="flex-1">
            <NumberField label="Remaining term (yrs)" value={mortgage.remainingYears} onChange={(v) => updateMortgageField('remainingYears', v)} />
          </div>
        </div>
        <NumberField label="Current monthly repayment" prefix={CURRENCIES[currency].symbol} value={mortgage.monthlyPayment} onChange={(v) => updateMortgageField('monthlyPayment', v)} step={10} />
        <SelectField
          label="Payment frequency"
          value={mortgage.frequency}
          onChange={(v) => updateMortgageField('frequency', v)}
          options={[
            { value: 'monthly', label: 'Monthly' },
            { value: 'fourweekly', label: 'Every 4 weeks' },
            { value: 'weekly', label: 'Weekly' }
          ]}
        />
        <DateField label="Mortgage start date" value={mortgage.startDate} onChange={(v) => updateMortgageField('startDate', v)} />
      </Card>

      <button
        onClick={flashSaved}
        className="w-full py-[15px] rounded-xl border-0 bg-gold text-navy font-bold text-[15px] shadow-goldGlow transition-transform active:scale-[0.98]"
      >
        {savedFlash ? 'Saved ✓' : 'Save Mortgage Profile'}
      </button>
      <p className="text-[11.5px] text-ink-soft text-center mt-2">Changes save automatically as you type.</p>
    </div>
  );
}
