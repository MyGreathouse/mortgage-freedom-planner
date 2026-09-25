import { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base(props: IconProps, path: React.ReactNode) {
  const { size = 20, ...rest } = props;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...rest}>
      {path}
    </svg>
  );
}

export const HomeIcon = (p: IconProps) => base(p, <><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></>);
export const CalcIcon = (p: IconProps) => base(p, <><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="8" y1="7" x2="16" y2="7" /></>);
export const ChartIcon = (p: IconProps) => base(p, <><path d="M4 19V9" /><path d="M10 19V5" /><path d="M16 19v-7" /><path d="M22 19H2" /></>);
export const BuildIcon = (p: IconProps) => base(p, <><path d="M14 3l7 7-8.5 8.5a3 3 0 01-4.24 0 3 3 0 010-4.24L17 5" /><path d="M3 21l4-1 8.5-8.5" /></>);
export const GoalIcon = (p: IconProps) => base(p, <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></>);
export const BookIcon = (p: IconProps) => base(p, <><path d="M4 4h9a3 3 0 013 3v13a2.5 2.5 0 00-2.5-2.5H4z" /><path d="M20 4h-9a3 3 0 00-3 3v13a2.5 2.5 0 012.5-2.5H20z" /></>);
export const ChevronIcon = (p: IconProps) => base({ size: 16, ...p }, <path d="M9 18l6-6-6-6" />);
export const CloseIcon = (p: IconProps) => base({ size: 14, ...p }, <><path d="M18 6L6 18" /><path d="M6 6l12 12" /></>);
export const TrendIcon = (p: IconProps) => base(p, <><path d="M3 17l6-6 4 4 8-8" /><path d="M15 7h6v6" /></>);
export const SparkIcon = (p: IconProps) => base(p, <path d="M12 2l1.6 5.2L19 9l-5.4 1.8L12 16l-1.6-5.2L5 9l5.4-1.8z" />);
export const LayersIcon = (p: IconProps) => base(p, <><path d="M12 2l9 5-9 5-9-5 9-5z" /><path d="M3 12l9 5 9-5" /><path d="M3 17l9 5 9-5" /></>);
export const UnlockIcon = (p: IconProps) => base(p, <><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 017.8-1.3" /></>);
export const BuildingIcon = (p: IconProps) => base(p, <><rect x="5" y="3" width="14" height="18" rx="1" /><line x1="10" y1="21" x2="10" y2="17" /><line x1="14" y1="21" x2="14" y2="17" /></>);
export const BellIcon = (p: IconProps) => base(p, <><path d="M6 8a6 6 0 0112 0c0 5 2 6 2 6H4s2-1 2-6" /><path d="M10 21a2 2 0 004 0" /></>);
export const DownloadIcon = (p: IconProps) => base(p, <><path d="M12 3v12" /><path d="M7 10l5 5 5-5" /><path d="M4 21h16" /></>);
export const EditIcon = (p: IconProps) => base({ size: 14, ...p }, <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" /></>);
export const PlusIcon = (p: IconProps) => base({ size: 16, ...p }, <><path d="M12 5v14" /><path d="M5 12h14" /></>);
export const ChecklistIcon = (p: IconProps) => base(p, <><rect x="3" y="4" width="6" height="6" rx="1" /><path d="M5.5 7l1 1 2-2" /><rect x="3" y="14" width="6" height="6" rx="1" /><path d="M5.5 17l1 1 2-2" /><line x1="12" y1="7" x2="21" y2="7" /><line x1="12" y1="17" x2="21" y2="17" /></>);
