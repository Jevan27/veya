/**
 * Determines whether a given hex color is perceptually dark based on standard luminance.
 */
export function isDarkColor(hexColor?: string): boolean {
  if (!hexColor) return false;
  const hex = hexColor.replace('#', '');
  if (hex.length !== 6) return false;
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
}

export interface PrimaryColorPreset {
  name: string;
  hex: string;
}

export interface BackgroundColorPreset {
  name: string;
  hex: string;
  isDark: boolean;
}

export const PRIMARY_COLORS: PrimaryColorPreset[] = [
  { name: 'Pure Black', hex: '#111111' },
  { name: 'Indigo', hex: '#4F46E5' },
  { name: 'Royal Blue', hex: '#2563EB' },
  { name: 'Sky Cyan', hex: '#0284C7' },
  { name: 'Emerald', hex: '#059669' },
  { name: 'Purple', hex: '#7C3AED' },
  { name: 'Rose', hex: '#E11D48' },
  { name: 'Amber', hex: '#D97706' },
  { name: 'Slate Gray', hex: '#64748B' },
  { name: 'Obsidian', hex: '#0F172A' },
];

export const BACKGROUND_COLORS: BackgroundColorPreset[] = [
  { name: 'Pure White', hex: '#FFFFFF', isDark: false },
  { name: 'Cool Slate', hex: '#F8FAFC', isDark: false },
  { name: 'Warm Cream', hex: '#FAF8F5', isDark: false },
  { name: 'Obsidian Black', hex: '#0F172A', isDark: true },
  { name: 'Midnight Navy', hex: '#0B132B', isDark: true },
  { name: 'Pure Black', hex: '#000000', isDark: true },
];
