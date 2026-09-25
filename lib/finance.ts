export interface SchedulePoint {
  month: number;
  balance: number;
}

export interface SimulateOptions {
  balance: number;
  annualRate: number;
  termMonths: number;
  monthlyOverpay?: number;
  lumpSum?: number;
  lumpFrequencyMonths?: number;
}

export interface SimulateResult {
  months: number;
  totalInterest: number;
  schedule: SchedulePoint[];
  basePayment: number;
}

export function simulateMortgage(opts: SimulateOptions): SimulateResult {
  const { balance, annualRate, termMonths, monthlyOverpay = 0, lumpSum = 0, lumpFrequencyMonths = 12 } = opts;
  const r = annualRate / 100 / 12;
  let bal = balance;
  const basePayment = r === 0 ? balance / termMonths : (balance * r) / (1 - Math.pow(1 + r, -termMonths));
  let months = 0;
  let totalInterest = 0;
  const schedule: SchedulePoint[] = [];
  const maxMonths = termMonths + 600;

  while (bal > 0.5 && months < maxMonths) {
    months++;
    const interest = bal * r;
    const payment = basePayment + monthlyOverpay;
    let totalPrincipal = payment - interest;
    if (lumpSum > 0 && months % lumpFrequencyMonths === 0) {
      totalPrincipal += lumpSum;
    }
    if (totalPrincipal > bal) totalPrincipal = bal;
    bal -= totalPrincipal;
    totalInterest += interest;
    if (months % 12 === 0 || bal <= 0.5) {
      schedule.push({ month: months, balance: Math.max(bal, 0) });
    }
  }

  return { months, totalInterest, schedule, basePayment };
}

export function monthsToYM(m: number): string {
  const y = Math.floor(m / 12);
  const mo = m % 12;
  if (y <= 0) return `${m} mo`;
  if (mo === 0) return `${y} yr`;
  return `${y} yr ${mo} mo`;
}

export function addMonths(dateStr: string, months: number): Date {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + months);
  return d;
}

export function fmtMonthYear(date: Date): string {
  return date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
}

/** Whole calendar months elapsed between a start date string and today, clamped to [0, capAt] if given. */
export function monthsElapsedSince(dateStr: string, capAt?: number): number {
  const start = new Date(dateStr);
  const now = new Date();
  let months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
  if (now.getDate() < start.getDate()) months -= 1;
  months = Math.max(0, months);
  if (typeof capAt === 'number') months = Math.min(months, capAt);
  return months;
}

export interface CurrencyInfo {
  symbol: string;
  name: string;
}

export const CURRENCIES: Record<string, CurrencyInfo> = {
  GBP: { symbol: '£', name: 'British Pound' },
  USD: { symbol: '$', name: 'US Dollar' },
  EUR: { symbol: '€', name: 'Euro' },
  NGN: { symbol: '₦', name: 'Nigerian Naira' },
  GHS: { symbol: '₵', name: 'Ghanaian Cedi' },
  ZAR: { symbol: 'R', name: 'South African Rand' },
  CAD: { symbol: 'CA$', name: 'Canadian Dollar' },
  AUD: { symbol: 'A$', name: 'Australian Dollar' }
};

export function fmtCurrency(n: number | undefined | null, currency: string, dp = 0): string {
  const symbol = (CURRENCIES[currency] || CURRENCIES.GBP).symbol;
  if (n === undefined || n === null || isNaN(n)) return `${symbol}0`;
  const sign = n < 0 ? '-' : '';
  const abs = Math.abs(n);
  return sign + symbol + abs.toLocaleString('en-GB', { minimumFractionDigits: dp, maximumFractionDigits: dp });
}
