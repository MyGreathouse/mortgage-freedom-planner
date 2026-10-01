export interface Mortgage {
  balance: number;
  purchasePrice: number;
  currentValue: number;
  deposit: number;
  rate: number;
  type: 'fixed' | 'variable' | 'tracker';
  termYears: number;
  remainingYears: number;
  monthlyPayment: number;
  frequency: 'monthly' | 'fourweekly' | 'weekly';
  startDate: string;
}

export interface Goal {
  id: number;
  title: string;
  done: boolean;
}

export interface CalculatorSettings {
  monthlyOverpayEnabled: boolean;
  monthlyOverpayAmount: number;
  lumpSumEnabled: boolean;
  lumpSumAmount: number;
}

export const DEFAULT_CALCULATOR_SETTINGS: CalculatorSettings = {
  monthlyOverpayEnabled: false,
  monthlyOverpayAmount: 100,
  lumpSumEnabled: false,
  lumpSumAmount: 1000
};

export interface RepaymentTicks {
  /** Absolute month numbers (1-based, from mortgage start) ticked as an actual monthly overpayment made */
  months: number[];
  /** Year numbers (1-based) ticked as an actual annual lump sum made */
  years: number[];
}

export const DEFAULT_REPAYMENT_TICKS: RepaymentTicks = {
  months: [],
  years: []
};

export type TabId =
  | 'setup'
  | 'calc'
  | 'wealth'
  | 'more'
  | 'compare'
  | 'goals'
  | 'wealthbuilder'
  | 'equityrelease'
  | 'rentalcalc'
  | 'education'
  | 'notifications'
  | 'export'
  | 'repaymenttracker';

export const DEFAULT_MORTGAGE: Mortgage = {
  balance: 180000,
  purchasePrice: 220000,
  currentValue: 250000,
  deposit: 40000,
  rate: 5.2,
  type: 'fixed',
  termYears: 25,
  remainingYears: 22,
  monthlyPayment: 1080,
  frequency: 'monthly',
  startDate: '2023-01-01'
};

export const DEFAULT_GOALS: Goal[] = [
  { id: 1, title: 'Become mortgage-free before 50', done: false },
  { id: 2, title: 'Build £100,000 equity', done: false }
];
