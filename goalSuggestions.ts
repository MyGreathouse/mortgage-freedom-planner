import { fmtCurrency, monthsToYM, simulateMortgage } from './finance';
import { Mortgage } from './types';

function parseTargetAmount(title: string): number | null {
  const match = title.replace(/,/g, '').match(/(\d{4,})/);
  if (match) return parseFloat(match[1]);
  return null;
}

export function goalSuggestion(title: string, mortgage: Mortgage, currency: string): string {
  const t = title.toLowerCase();
  const equity = mortgage.currentValue - mortgage.balance;
  const termMonths = mortgage.remainingYears * 12;
  const baseline = simulateMortgage({ balance: mortgage.balance, annualRate: mortgage.rate, termMonths });
  const with100 = simulateMortgage({ balance: mortgage.balance, annualRate: mortgage.rate, termMonths, monthlyOverpay: 100 });
  const with200 = simulateMortgage({ balance: mortgage.balance, annualRate: mortgage.rate, termMonths, monthlyOverpay: 200 });
  const interestSaved100 = baseline.totalInterest - with100.totalInterest;
  const interestSaved200 = baseline.totalInterest - with200.totalInterest;
  const monthsSaved200 = baseline.months - with200.months;
  const sym = (n: number) => fmtCurrency(n, currency);

  if (t.includes('mortgage') && (t.includes('free') || t.includes('50') || t.includes('60'))) {
    return `Head to the Calculator tab and test a ${sym(200)}/month overpayment — at your current rate that could remove roughly ${monthsToYM(
      monthsSaved200
    )} from your term and save ${sym(interestSaved200)} in interest, bringing this goal within reach sooner.`;
  }
  if (t.includes('equity')) {
    const target = parseTargetAmount(title) || 100000;
    const gap = target - equity;
    if (gap <= 0) {
      return `You've already built ${sym(equity)} in equity — ahead of this target. Visit the Property Wealth Builder to plan your next stage, such as releasing equity or acquiring a second property.`;
    }
    return `You need roughly ${sym(gap)} more equity to hit this target. A combination of overpayments and property value growth will get you there fastest — the Calculator and Wealth Builder tabs can help you plan the route.`;
  }
  if (t.includes('second') || t.includes('portfolio')) {
    return `Building toward a second property usually starts with releasing equity from your first. Try the Equity Release Simulator to see what might realistically be accessible as your property value grows.`;
  }
  if (t.includes('rental')) {
    return `Use the Rental Property Calculator to stress-test a potential buy-to-let purchase and confirm the numbers support positive monthly cash flow before you commit.`;
  }
  if (t.includes('retire')) {
    return `Being mortgage-free is one of the biggest levers for an earlier retirement. Try the Overpay vs Invest tool to weigh paying down your mortgage against building a separate retirement pot.`;
  }
  if (t.includes('invest')) {
    return `Compare guaranteed interest savings against potential investment growth in the Overpay vs Invest tool — a split strategy often balances progress on this goal with flexibility.`;
  }
  return `Keep the momentum going — even a modest ${sym(100)}/month overpayment could save around ${sym(
    interestSaved100
  )} in interest over the life of your mortgage. Revisit the Calculator to model progress toward this goal.`;
}
