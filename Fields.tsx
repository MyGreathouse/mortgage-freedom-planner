'use client';

import { ChangeEvent, FocusEvent, useEffect, useRef, useState } from 'react';
import { CloseIcon } from '@/components/ui/Icons';

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
  // Keeps its own text while the field is focused, so it can sit genuinely empty
  // mid-edit instead of snapping back to "0" the instant every digit is deleted —
  // that snap-back was the actual cause of the "last 0 won't delete" issue.
  const [text, setText] = useState(String(value));
  const isFocused = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  // True only right after the × button is tapped — keeps the field blank even
  // after tapping away, until the person actually types a new figure. Backspacing
  // to empty by hand doesn't set this, so that case still safely reverts on blur.
  const clearedManually = useRef(false);

  // Stay in sync with the real value whenever it changes from elsewhere (e.g. a
  // reset, or another field recalculating it) — but never while this field itself
  // is being actively edited, or every keystroke would get overwritten.
  useEffect(() => {
    if (!isFocused.current) {
      setText(String(value));
      clearedManually.current = false;
    }
  }, [value]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    // Allow these transient states while typing: empty, a lone minus, or a
    // trailing decimal point (e.g. "12.") — none of these should force a commit yet.
    if (raw === '' || raw === '-' || raw === '.' || raw === '-.') {
      setText(raw);
      return;
    }
    const parsed = parseFloat(raw);
    if (!isNaN(parsed)) {
      setText(raw);
      onChange(parsed);
      clearedManually.current = false;
    }
  }

  function handleFocus(e: FocusEvent<HTMLInputElement>) {
    isFocused.current = true;
    // One tap selects the whole preloaded figure, so typing immediately replaces
    // it — no manual deleting needed at all for the common case. A field left
    // blank by the × button has nothing to select, so this is a no-op there.
    e.target.select();
  }

  function handleBlur() {
    isFocused.current = false;
    if (clearedManually.current) return; // stay blank until something new is typed
    // Leaving the field empty or mid-way through typing (e.g. just "-") commits
    // back to a real number rather than staying invalid.
    if (text === '' || text === '-' || text === '.' || text === '-.' || isNaN(parseFloat(text))) {
      setText(String(value));
    } else {
      setText(String(parseFloat(text)));
    }
  }

  function handleClear() {
    // An explicit clear is a decisive action, unlike backspacing mid-edit — it
    // commits to 0 right away (so the rest of the app has a real number to work
    // with) but keeps the field itself blank, even after tapping away, until a
    // new figure is actually typed in.
    setText('');
    onChange(0);
    clearedManually.current = true;
    inputRef.current?.focus();
  }

  const showClear = text !== '';

  return (
    <label className="block mb-3.5">
      <div className="text-xs font-semibold text-ink-soft mb-1.5">{label}</div>
      <div className="flex items-center border-[1.5px] border-line rounded-[10px] px-3 py-2.5 bg-[var(--color-field-bg)] focus-within:border-gold transition-colors">
        {prefix && <span className="text-ink-soft font-semibold mr-1.5">{prefix}</span>}
        <input
          ref={inputRef}
          type="number"
          inputMode="decimal"
          value={text}
          step={step}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="border-0 outline-none bg-transparent w-full text-[15px] text-ink font-semibold"
        />
        {suffix && <span className="text-ink-soft font-semibold ml-1.5 mr-1">{suffix}</span>}
        {showClear && (
          <button
            type="button"
            onClick={handleClear}
            onMouseDown={(e) => e.preventDefault()}
            aria-label={`Clear ${label}`}
            className="text-ink-soft flex-shrink-0 ml-1.5 p-0.5 -mr-1 rounded-full hover:bg-black/5 active:bg-black/10 transition-colors"
          >
            <CloseIcon size={13} />
          </button>
        )}
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
        className="w-full border-[1.5px] border-line rounded-[10px] px-3 py-2.5 bg-[var(--color-field-bg)] text-[15px] text-ink font-semibold outline-none focus:border-gold transition-colors"
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
        className="w-full border-[1.5px] border-line rounded-[10px] px-3 py-2.5 bg-[var(--color-field-bg)] text-[15px] text-ink font-semibold outline-none focus:border-gold transition-colors"
      />
    </label>
  );
}
