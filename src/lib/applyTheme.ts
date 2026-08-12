import type { CSSProperties } from 'react';
import { generateScale, SCALE_STEPS } from './colorScale';

/** Builds inline CSS custom properties overriding the primary/accent scales for a
 * single subtree, given the event's chosen base colors. Returns {} when no custom
 * color was set, so the global :root defaults apply unchanged. */
export function getThemeStyle(primaryColor?: string | null, accentColor?: string | null): CSSProperties {
  const style: Record<string, string> = {};

  if (primaryColor) {
    const scale = generateScale(primaryColor);
    for (const step of SCALE_STEPS) {
      style[`--primary-${step}`] = scale[step];
    }
  }

  if (accentColor) {
    const scale = generateScale(accentColor);
    for (const step of SCALE_STEPS) {
      style[`--accent-${step}`] = scale[step];
    }
  }

  return style as CSSProperties;
}
