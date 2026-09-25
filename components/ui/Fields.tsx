'use client';

import { ChangeEvent } from 'react';

export function NumberField({
  label,
  value,
  onChange,
  prefix,
  suffix,
  step = 1
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
  step?: number;
}) {
  return (
    <label className="block mb-3.5">
      <div className="text-xs font-semibold text-ink-soft mb-1.5">{label}</div>
      <div className="flex items-center border-[1.5px] border-line rounded-[10px] px-3 py-2.5 bg-[#FCFBF9] focus-within:border-gold transition-colors">
        {prefix && <span className="text-ink-soft font-semibold mr-1.5">{prefix}</span>}
        <input
          type="number"
          inputMode="decimal"
          value={value}
          step={step}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(parseFloat(e.target.value) || 0)}
          className="border-0 outline-none bg-transparent w-full text-[15px] text-navy font-semibold"
        />
        {suffix && <span className="text-ink-soft font-semibold ml-1.5">{suffix}</span>}
      </div>
    </label>
  );
}

export function SelectField<T extends string>({
  label,
  value,
  onChange,
  options
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <label className="block mb-3.5">
      <div className="text-xs font-semibold text-ink-soft mb-1.5">{label}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full border-[1.5px] border-line rounded-[10px] px-3 py-2.5 bg-[#FCFBF9] text-[15px] text-navy font-semibold outline-none focus:border-gold transition-colors"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function DateField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block mb-3.5">
      <div className="text-xs font-semibold text-ink-soft mb-1.5">{label}</div>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-[1.5px] border-line rounded-[10px] px-3 py-2.5 bg-[#FCFBF9] text-[15px] text-navy font-semibold outline-none focus:border-gold transition-colors"
      />
    </label>
  );
}
