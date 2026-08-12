import { converter } from 'culori';

const toOklch = converter('oklch');

export const SCALE_STEPS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'] as const;
export type ScaleStep = (typeof SCALE_STEPS)[number];

// Lightness per step mirrors the shape of the existing hand-tuned palettes in index.css.
const LIGHTNESS: Record<ScaleStep, number> = {
  '50': 0.95, '100': 0.89, '200': 0.82, '300': 0.74, '400': 0.67,
  '500': 0.61, '600': 0.54, '700': 0.47, '800': 0.40, '900': 0.33, '950': 0.26,
};

// Chroma peaks around the mid tones and tapers toward white/black, relative to the base color's chroma.
const CHROMA_MULTIPLIER: Record<ScaleStep, number> = {
  '50': 0.12, '100': 0.28, '200': 0.45, '300': 0.65, '400': 0.85,
  '500': 1.0, '600': 0.9, '700': 0.78, '800': 0.68, '900': 0.58, '950': 0.45,
};

// Small hue drift toward the darker end, matching the reference palettes.
const HUE_SHIFT: Record<ScaleStep, number> = {
  '50': -2, '100': -2, '200': -2, '300': -2, '400': 0,
  '500': 0, '600': 2, '700': 2, '800': 4, '900': 4, '950': 6,
};

/** Converts a hex color into an 11-step OKLCH scale, formatted as "L C H" strings
 * matching the CSS custom property format already used in index.css. */
export function generateScale(hex: string): Record<ScaleStep, string> {
  const base = toOklch(hex);
  const baseC = base?.c ?? 0.15;
  const baseH = base?.h ?? 0;

  const scale = {} as Record<ScaleStep, string>;

  for (const step of SCALE_STEPS) {
    const l = LIGHTNESS[step];
    const c = baseC * CHROMA_MULTIPLIER[step];
    const h = baseH + HUE_SHIFT[step];
    scale[step] = `${l.toFixed(3)} ${c.toFixed(3)} ${h.toFixed(1)}`;
  }

  return scale;
}
