'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/Primitives';
import { CloseIcon } from '@/components/ui/Icons';
import { AppState } from '@/lib/useAppState';

const SUGGESTIONS = [
  'Become mortgage-free before age 50',
  'Build £100,000 equity',
  'Buy second property',
  'Generate rental income',
  'Retire earlier'
];

export default function GoalsScreen({ app }: { app: AppState }) {
  const { goals, addGoal, toggleGoal, removeGoal } = app;
  const [text, setText] = useState('');

  function handleAdd(title?: string) {
    const t = title ?? text;
    if (!t.trim()) return;
    addGoal(t);
    if (!title) setText('');
  }

  return (
    <div className="px-4 pt-4 pb-24">
      <SectionHeader eyebrow="Financial Goals" title="What Are You Building?" />

      <Card>
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Add a goal..."
            className="flex-1 border-[1.5px] border-line rounded-[10px] px-3 py-2.5 text-sm outline-none focus:border-gold transition-colors"
          />
          <button onClick={() => handleAdd()} className="px-4 rounded-[10px] border-0 bg-navy text-white font-bold">
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => handleAdd(s)}
              className="text-xs px-2.5 py-1.5 rounded-full border border-line bg-[#FCFBF9] text-ink-soft"
            >
              + {s}
            </button>
          ))}
        </div>
      </Card>

      {goals.map((g) => (
        <Card key={g.id} className="flex items-center gap-3 !p-3.5">
          <button
            onClick={() => toggleGoal(g.id)}
            className="w-[22px] h-[22px] rounded-md border-2 flex-shrink-0"
            style={{ borderColor: g.done ? 'var(--color-teal)' : 'var(--color-line)', background: g.done ? 'var(--color-teal)' : 'transparent' }}
          />
          <div className={['flex-1 text-sm font-semibold', g.done ? 'text-ink-soft line-through' : 'text-navy'].join(' ')}>{g.title}</div>
          <button onClick={() => removeGoal(g.id)} className="text-ink-soft border-0 bg-transparent">
            <CloseIcon />
          </button>
        </Card>
      ))}
    </div>
  );
}
