'use client';

import Card from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/Primitives';
import { DownloadIcon } from '@/components/ui/Icons';
import { addMonths, fmtCurrency, fmtMonthYear, monthsToYM, simulateMortgage } from '@/lib/finance';
import { AppState } from '@/lib/useAppState';

function buildReportHTML(app: AppState): string {
  const { mortgage, goals, currency } = app;
  const equity = mortgage.currentValue - mortgage.balance;
  const termMonths = mortgage.remainingYears * 12;
  const baseline = simulateMortgage({ balance: mortgage.balance, annualRate: mortgage.rate, termMonths });
  const withExtra = simulateMortgage({ balance: mortgage.balance, annualRate: mortgage.rate, termMonths, monthlyOverpay: 100 });
  const interestSaved = baseline.totalInterest - withExtra.totalInterest;
  const freeDate = addMonths(mortgage.startDate, baseline.months);
  const goalsList = goals.map((g) => `<li>${g.done ? '✓ ' : ''}${escapeHtml(g.title)}</li>`).join('');

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>My Mortgage Freedom Report</title>
  <style>
    body{font-family:Georgia,serif;color:#0B1E3D;max-width:680px;margin:40px auto;padding:0 20px;line-height:1.6;}
    h1{color:#0B1E3D;border-bottom:3px solid #C9A24B;padding-bottom:10px;}
    h2{color:#0F6B66;margin-top:32px;font-size:18px;}
    .stat{display:inline-block;margin-right:28px;margin-bottom:10px;}
    .stat .label{font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:#5B6B85;}
    .stat .value{font-size:20px;font-weight:bold;color:#0B1E3D;}
    .disclaimer{font-size:12px;color:#5B6B85;margin-top:40px;border-top:1px solid #E4E2DB;padding-top:14px;}
  </style></head><body>
  <h1>My Mortgage Freedom Report</h1>
  <p>Generated ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
  <h2>Current Position</h2>
  <div class="stat"><div class="label">Property Value</div><div class="value">${fmtCurrency(mortgage.currentValue, currency)}</div></div>
  <div class="stat"><div class="label">Mortgage Balance</div><div class="value">${fmtCurrency(mortgage.balance, currency)}</div></div>
  <div class="stat"><div class="label">Equity</div><div class="value">${fmtCurrency(equity, currency)}</div></div>
  <div class="stat"><div class="label">Interest Rate</div><div class="value">${mortgage.rate}%</div></div>
  <h2>Strategy</h2>
  <p>At your current rate and remaining term, your projected mortgage-free date is <strong>${fmtMonthYear(freeDate)}</strong>. Adding a ${fmtCurrency(
    100,
    currency
  )}/month overpayment could bring this forward and save an estimated <strong>${fmtCurrency(interestSaved, currency)}</strong> in interest over the life of the mortgage.</p>
  <h2>Savings Achieved</h2>
  <p>Total interest saved with a ${fmtCurrency(100, currency)}/month overpayment strategy: <strong>${fmtCurrency(
    interestSaved,
    currency
  )}</strong>. Time saved: <strong>${monthsToYM(baseline.months - withExtra.months)}</strong>.</p>
  <h2>Financial Goals</h2>
  <ul>${goalsList || '<li>No goals recorded yet.</li>'}</ul>
  <div class="disclaimer">This report is generated for educational and personal planning purposes only and does not constitute financial or mortgage advice. Figures are estimates based on the information entered and standard amortisation assumptions; actual lender terms may differ. Please speak to a qualified, FCA-regulated mortgage adviser before making financial decisions.</div>
  </body></html>`;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export default function ExportScreen({ app }: { app: AppState }) {
  const { mortgage, currency } = app;
  const equity = mortgage.currentValue - mortgage.balance;

  function download() {
    const html = buildReportHTML(app);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'My-Mortgage-Freedom-Report.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="px-4 pt-4 pb-24">
      <SectionHeader eyebrow="Export" title="My Mortgage Freedom Report" />

      <Card>
        <div className="text-[13px] font-bold text-teal mb-3">Report Preview</div>
        <div className="text-[13px] text-ink-soft leading-relaxed">
          Includes your current position ({fmtCurrency(mortgage.currentValue, currency)} value, {fmtCurrency(equity, currency)} equity),
          overpayment strategy summary, interest and time saved, and your financial goals — formatted as a shareable document.
        </div>
      </Card>

      <button
        onClick={download}
        className="w-full py-[15px] rounded-xl border-0 bg-gold text-navy font-bold text-[15px] shadow-goldGlow flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
      >
        <DownloadIcon /> Download Report
      </button>
      <div className="text-[11.5px] text-ink-soft mt-3 text-center">
        Downloads as an HTML file you can open, print, or save as PDF from your browser&apos;s print menu.
      </div>
    </div>
  );
}
