'use client';

import Card from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/Primitives';
import { AppState } from '@/lib/useAppState';

const STAGES = [
  { n: 1, title: 'First Home Ownership', desc: 'You own your home and are making regular repayments — the foundation of everything that follows.' },
  { n: 2, title: 'Build Equity', desc: "Pay down debt and let property value grow, widening the gap between what you owe and what it's worth." },
  { n: 3, title: 'Use Equity Strategically', desc: 'Explore remortgaging or further advances to release some equity for other financial goals.' },
  { n: 4, title: 'Acquire Investment Property', desc: 'Use released equity as a deposit on a second property to start generating rental income.' },
  { n: 5, title: 'Build a Property Portfolio', desc: 'Repeat and scale — using equity and rental income to grow a portfolio over time.' }
];

export default function PropertyWealthBuilderScreen({ app }: { app: AppState }) {
  const { mortgage } = app;
  const equity = mortgage.currentValue - mortgage.balance;
  const equityPct = mortgage.currentValue ? (equity / mortgage.currentValue) * 100 : 0;

  let currentStage = 1;
  if (equityPct > 15) currentStage = 2;
  if (equityPct > 30) currentStage = 3;
  if (equityPct > 45) currentStage = 4;
  if (equityPct > 60) currentStage = 5;

  return (
    <div className="px-4 pt-4 pb-24">
      <SectionHeader eyebrow="Property Wealth Builder" title="Your Growth Roadmap" />

      <Card navy>
        <div className="text-xs tracking-wide uppercase opacity-75 font-semibold">You Are Currently At</div>
        <div className="font-display text-2xl font-bold text-gold-light my-1.5">
          Stage {currentStage} · {STAGES[currentStage - 1].title}
        </div>
        <div className="text-[13px] opacity-85">Based on {equityPct.toFixed(0)}% equity in your current property</div>
      </Card>

      <div className="relative pl-7">
        <div className="absolute left-[9px] top-1.5 bottom-1.5 w-0.5 bg-line" />
        {STAGES.map((s) => {
          const active = s.n === currentStage;
          const complete = s.n < currentStage;
          return (
            <div key={s.n} className="relative mb-4">
              <div
                className="absolute -left-7 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold border-2"
                style={{
                  background: complete ? 'var(--color-teal)' : active ? 'var(--color-gold)' : '#fff',
                  borderColor: complete ? 'var(--color-teal)' : active ? 'var(--color-gold)' : 'var(--color-line)',
                  color: complete || active ? '#fff' : 'var(--color-ink-soft)'
                }}
              >
                {complete ? '✓' : s.n}
              </div>
              <Card
                className={['!mb-0', active ? 'shadow-[0_2px_10px_rgba(201,162,75,0.25)]' : ''].join(' ')}
                style={{ borderColor: active ? 'var(--color-gold)' : 'var(--color-line)' }}
              >
                <div
                  className="font-bold text-sm mb-1"
                  style={{ color: active ? 'var(--color-navy)' : complete ? 'var(--color-teal)' : 'var(--color-ink-soft)' }}
                >
                  Stage {s.n} · {s.title}
                </div>
                <div className="text-[12.5px] text-ink-soft leading-relaxed">{s.desc}</div>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
