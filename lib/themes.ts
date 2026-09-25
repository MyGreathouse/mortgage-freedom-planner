export interface ThemeOption {
  id: string;
  label: string;
  description: string;
  /** Swatch preview colors, matching the actual CSS variables defined in globals.css */
  swatch: { navy: string; gold: string; teal: string };
}

export const THEMES: ThemeOption[] = [
  {
    id: 'classic',
    label: 'Classic Navy & Gold',
    description: 'The original premium banking look',
    swatch: { navy: '#0B1E3D', gold: '#C9A24B', teal: '#0F6B66' }
  },
  {
    id: 'teal-freedom',
    label: 'Teal Freedom',
    description: 'Cooler, teal-led accent',
    swatch: { navy: '#0B1E3D', gold: '#2DBDB0', teal: '#0B7A6E' }
  },
  {
    id: 'charcoal-rose',
    label: 'Charcoal & Rose',
    description: 'Warm charcoal with rose gold',
    swatch: { navy: '#2B2320', gold: '#C98A8A', teal: '#8C6B5D' }
  },
  {
    id: 'ocean-blue',
    label: 'Ocean Blue',
    description: 'Deep blue with a silver accent',
    swatch: { navy: '#0A2A4A', gold: '#7FA9CC', teal: '#2F6690' }
  }
];

export const DEFAULT_THEME_ID = 'classic';
