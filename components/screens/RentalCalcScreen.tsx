'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/Primitives';
import { NumberField } from '@/components/ui/Fields';
import { fmtCurrency, CURRENCIES } from '@/lib/finance';
import { AppState } from '@/lib/useAppState';

export default function RentalCalcScreen({ app }: { app: AppState }) {
  const { currency } = app;
  const [purchasePrice, setPurchasePrice] = useState(180000);
  const [depositPct, setDepositPct] = useState(25);
  const [rentalIncome, setRentalIncome] = useState(950);
  const [rate, setRate] = useState(5.8);
  const [maintenancePct, setMaintenancePct] = useState(10);
  const [insurance, setInsurance] = useState(35);

  const deposit = purchasePrice * (depositPct / 100);
  const loanAmount = purchasePrice - deposit;
  const monthlyMortgageCost = loanAmount * (rate / 100 / 12);
  const maintenanceCost = rentalIncome * (maintenancePct / 100);
  const totalCosts = monthlyMortgageCost + maintenanceCost + insurance;
  const cashFlow = rentalIncome - totalCosts;
  const positive = cashFlow >= 0;

  return (
    <div className="px-4 pt-4 pb-24">
      <SectionHeader eyebrow="Property Wealth" title="Rental Property Calculator" />

      <Card>
        <div className="text-[13px] font-bold text-teal mb-3">Purchase</div>
        <NumberField label="Purchase price" prefix={CURRENCIES[currency].symbol} value={purchasePrice} onChange={setPurchasePrice} step={1000} />
        <div className="mb-3.5">
          <div className="text-xs font-semibold text-ink-soft mb-1.5">
            Deposit ({depositPct}%) · {fmtCurrency(deposit, currency)}
          </div>
          <input type="range" min={10} max={50} step={5} value={depositPct} onChange={(e) => setDepositPct(parseInt(e.target.value))} />
        </div>
        <NumberField label="Buy-to-let mortgage rate" suffix="%" value={rate} onChange={setRate} step={0.1} />
      </Card>

      <Card>
        <div className="text-[13px] font-bold text-teal mb-3">Income &amp; Costs</div>
        <NumberField label="Expected monthly rental income" prefix={CURRENCIES[currency].symbol} value={rentalIncome} onChange={setRentalIncome} step={25} />
        <div className="mb-3.5">
          <div className="text-xs font-semibold text-ink-soft mb-1.5">
            Maintenance allowance ({maintenancePct}%) · {fmtCurrency(maintenanceCost, currency)}/mo
          </div>
          <input type="range" min={0} max={25} step={1} value={maintenancePct} onChange={(e) => setMaintenancePct(parseInt(e.target.value))} />
        </div>
        <NumberField label="Landlord insurance" prefix={CURRENCIES[currency].symbol} value={insurance} onChange={setInsurance} step={5} />
      </Card>

      <Card className={positive ? '!bg-gradient-to-br !from-teal !to-teal-light !text-white !border-0' : '!bg-gradient-to-br !from-brand-red !to-[#8f3620] !text-white !border-0'}>
        <div className="text-xs tracking-wide uppercase opacity-80 font-semibold">Estimated Monthly Cash Flow</div>
        <div className="font-display text-[32px] font-bold my-1.5">{fmtCurrency(cashFlow, currency)}</div>
        <div className="text-[12.5px] opacity-90 leading-relaxed">
          Rent {fmtCurrency(rentalIncome, currency)} − mortgage cost {fmtCurrency(monthlyMortgageCost, currency)} − maintenance{' '}
          {fmtCurrency(maintenanceCost, currency)} − insurance {fmtCurrency(insurance, currency)}
        </div>
      </Card>
      <p className="text-[11.5px] text-ink-soft mt-2.5 leading-relaxed">
        Educational estimate only — excludes letting agent fees, void periods, tax, and other costs. Buy-to-let mortgages and rental
        investing carry risk; seek regulated advice.
      </p>
    </div>
  );
}
