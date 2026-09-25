'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  CalculatorSettings,
  DEFAULT_CALCULATOR_SETTINGS,
  DEFAULT_GOALS,
  DEFAULT_MORTGAGE,
  DEFAULT_REPAYMENT_TICKS,
  Goal,
  Mortgage,
  RepaymentTicks
} from './types';
import { DEFAULT_THEME_ID } from './themes';

const STORAGE_KEY = 'mfp_state_v1';

interface PersistedState {
  mortgage: Mortgage;
  goals: Goal[];
  currency: string;
  calculatorSettings?: CalculatorSettings;
  theme?: string;
  repaymentTicks?: RepaymentTicks;
}

function loadPersisted(): PersistedState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as PersistedState;
  } catch (e) {
    /* ignore corrupt storage */
  }
  return null;
}

export function useAppState() {
  const [mortgage, setMortgage] = useState<Mortgage>(DEFAULT_MORTGAGE);
  const [goals, setGoals] = useState<Goal[]>(DEFAULT_GOALS);
  const [currency, setCurrency] = useState<string>('GBP');
  const [calculatorSettings, setCalculatorSettings] = useState<CalculatorSettings>(DEFAULT_CALCULATOR_SETTINGS);
  const [theme, setTheme] = useState<string>(DEFAULT_THEME_ID);
  const [repaymentTicks, setRepaymentTicks] = useState<RepaymentTicks>(DEFAULT_REPAYMENT_TICKS);
  const [hydrated, setHydrated] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  // Load from localStorage once, on mount (client-only)
  useEffect(() => {
    const persisted = loadPersisted();
    if (persisted) {
      if (persisted.mortgage) setMortgage(persisted.mortgage);
      if (persisted.goals) setGoals(persisted.goals);
      if (persisted.currency) setCurrency(persisted.currency);
      if (persisted.calculatorSettings) setCalculatorSettings({ ...DEFAULT_CALCULATOR_SETTINGS, ...persisted.calculatorSettings });
      if (persisted.theme) setTheme(persisted.theme);
      if (persisted.repaymentTicks) setRepaymentTicks({ ...DEFAULT_REPAYMENT_TICKS, ...persisted.repaymentTicks });
    }
    setHydrated(true);
  }, []);

  // Persist on every change, after initial hydration
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ mortgage, goals, currency, calculatorSettings, theme, repaymentTicks })
      );
      setLastSavedAt(new Date());
    } catch (e) {
      /* storage unavailable — fail silently, app still works in-memory */
    }
  }, [mortgage, goals, currency, calculatorSettings, theme, repaymentTicks, hydrated]);

  const saveMortgage = useCallback((next: Mortgage) => setMortgage(next), []);
  const updateMortgageField = useCallback(<K extends keyof Mortgage>(key: K, value: Mortgage[K]) => {
    setMortgage((prev) => ({ ...prev, [key]: value }));
  }, []);

  const addGoal = useCallback((title: string) => {
    if (!title.trim()) return;
    setGoals((prev) => [...prev, { id: Date.now() + Math.random(), title: title.trim(), done: false }]);
  }, []);

  const toggleGoal = useCallback((id: number) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, done: !g.done } : g)));
  }, []);

  const renameGoal = useCallback((id: number, title: string) => {
    if (!title.trim()) return;
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, title: title.trim() } : g)));
  }, []);

  const removeGoal = useCallback((id: number) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const updateCalculatorSettings = useCallback(<K extends keyof CalculatorSettings>(key: K, value: CalculatorSettings[K]) => {
    setCalculatorSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggleMonthTick = useCallback((month: number) => {
    setRepaymentTicks((prev) => {
      const has = prev.months.includes(month);
      return { ...prev, months: has ? prev.months.filter((m) => m !== month) : [...prev.months, month] };
    });
  }, []);

  const toggleYearTick = useCallback((year: number) => {
    setRepaymentTicks((prev) => {
      const has = prev.years.includes(year);
      return { ...prev, years: has ? prev.years.filter((y) => y !== year) : [...prev.years, year] };
    });
  }, []);

  const resetRepaymentTicks = useCallback(() => {
    setRepaymentTicks(DEFAULT_REPAYMENT_TICKS);
  }, []);

  return {
    hydrated,
    lastSavedAt,
    mortgage,
    setMortgage,
    saveMortgage,
    updateMortgageField,
    goals,
    addGoal,
    toggleGoal,
    renameGoal,
    removeGoal,
    currency,
    setCurrency,
    calculatorSettings,
    updateCalculatorSettings,
    theme,
    setTheme,
    repaymentTicks,
    toggleMonthTick,
    toggleYearTick,
    resetRepaymentTicks
  };
}

export type AppState = ReturnType<typeof useAppState>;
