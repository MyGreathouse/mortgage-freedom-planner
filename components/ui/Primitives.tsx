export function StatTile({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="flex-1 min-w-[130px]">
      <div className="text-[11px] tracking-wide uppercase text-ink-soft font-semibold">{label}</div>
      <div className="font-display text-[22px] font-bold mt-1" style={{ color: accent || 'var(--color-navy)' }}>
        {value}
      </div>
    </div>
  );
}

export function ProgressBar({ pct, color = 'var(--color-gold)' }: { pct: number; color?: string }) {
  const clamped = Math.min(100, Math.max(0, pct));
  return (
    <div className="h-2 rounded-full bg-line overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500 ease-out"
        style={{ width: `${clamped}%`, background: color }}
      />
    </div>
  );
}

export function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-4 pt-1">
      <div className="text-[11px] tracking-widest uppercase text-gold font-bold">{eyebrow}</div>
      <div className="font-display text-2xl font-bold text-navy mt-0.5">{title}</div>
    </div>
  );
}

export function Chip({
  active,
  variant = 'gold',
  onClick,
  children
}: {
  active?: boolean;
  variant?: 'gold' | 'teal';
  onClick?: () => void;
  children: React.ReactNode;
}) {
  const activeClasses =
    variant === 'gold' ? 'border-gold bg-gold text-navy' : 'border-teal bg-teal text-white';
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'px-3 py-1.5 rounded-full border-[1.5px] text-[13px] font-bold transition-colors',
        active ? activeClasses : 'border-line bg-white text-ink-soft'
      ].join(' ')}
    >
      {children}
    </button>
  );
}
