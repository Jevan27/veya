/**
 * Geometric Background Style Color Palette Generator
 *
 * Dynamically derives soft, translucent geometric plane colors and opacities
 * based on the user's selected Primary Accent Color (`primaryColor`)
 * and adapted to the card background theme (`isDark`).
 */

export interface GeometricPalette {
  /** Primary tint for dominant geometric planes */
  primaryTint: string;
  /** Secondary tint for overlapping/offset planes */
  secondaryTint: string;
  /** Ambient bottom lighting glow */
  ambientGlow: string;
  /** Whether the underlying surface is perceptually dark */
  isDark: boolean;
  /** Base opacity for the ambient bottom wash */
  ambientOpacity: number;
  /** Opacity for primary background plane */
  plane1Opacity: number;
  /** Opacity for prominent triangular plane */
  plane2Opacity: number;
  /** Opacity for central sweeping polygon */
  plane3Opacity: number;
  /** Opacity for right-side facet plane */
  plane4Opacity: number;
  /** Opacity for foreground crystal facets */
  plane5Opacity: number;
}

interface RgbColor {
  r: number;
  g: number;
  b: number;
}

interface HslColor {
  h: number;
  s: number;
  l: number;
}

function hexToRgb(hex?: string): RgbColor {
  if (!hex) return { r: 17, g: 17, b: 17 };
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (clean.length !== 6) {
    return { r: 17, g: 17, b: 17 };
  }
  return {
    r: parseInt(clean.substring(0, 2), 16),
    g: parseInt(clean.substring(2, 4), 16),
    b: parseInt(clean.substring(4, 6), 16),
  };
}

function rgbToHsl(r: number, g: number, b: number): HslColor {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    switch (max) {
      case rNorm:
        h = ((gNorm - bNorm) / delta + (gNorm < bNorm ? 6 : 0)) * 60;
        break;
      case gNorm:
        h = ((bNorm - rNorm) / delta + 2) * 60;
        break;
      case bNorm:
        h = ((rNorm - gNorm) / delta + 4) * 60;
        break;
    }
  }

  return { h, s, l };
}

function hslToHex(h: number, s: number, l: number): string {
  const normalizedH = ((h % 360) + 360) % 360;
  const normalizedS = Math.max(0, Math.min(1, s));
  const normalizedL = Math.max(0, Math.min(1, l));

  const c = (1 - Math.abs(2 * normalizedL - 1)) * normalizedS;
  const x = c * (1 - Math.abs(((normalizedH / 60) % 2) - 1));
  const m = normalizedL - c / 2;

  let rNorm = 0;
  let gNorm = 0;
  let bNorm = 0;

  if (normalizedH < 60) {
    rNorm = c;
    gNorm = x;
    bNorm = 0;
  } else if (normalizedH < 120) {
    rNorm = x;
    gNorm = c;
    bNorm = 0;
  } else if (normalizedH < 180) {
    rNorm = 0;
    gNorm = c;
    bNorm = x;
  } else if (normalizedH < 240) {
    rNorm = 0;
    gNorm = x;
    bNorm = c;
  } else if (normalizedH < 300) {
    rNorm = x;
    gNorm = 0;
    bNorm = c;
  } else {
    rNorm = c;
    gNorm = 0;
    bNorm = x;
  }

  const toHex = (n: number) => {
    const val = Math.round((n + m) * 255);
    return val.toString(16).padStart(2, '0');
  };

  return `#${toHex(rNorm)}${toHex(gNorm)}${toHex(bNorm)}`;
}

/**
 * Dynamically derives the Geometric background palette from the user's selected `primaryColor`.
 */
export function getGeometricPalette(
  primaryColor = '#111111',
  isDark = false
): GeometricPalette {
  const rgb = hexToRgb(primaryColor);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  let primaryTint: string;
  let secondaryTint: string;
  let ambientGlow: string;

  if (hsl.s > 0.12) {
    // Chromatic primary accent color (Royal Blue, Purple, Emerald, Rose, Amber, Cyan, etc.)
    const baseHue = hsl.h;
    if (isDark) {
      primaryTint = hslToHex(baseHue, Math.min(1, hsl.s * 1.1), 0.65);
      secondaryTint = hslToHex(baseHue + 12, Math.min(1, hsl.s * 0.95), 0.72);
      ambientGlow = hslToHex(baseHue, Math.min(1, hsl.s), 0.55);
    } else {
      primaryTint = primaryColor;
      secondaryTint = hslToHex(baseHue + 10, Math.min(1, hsl.s * 0.9), Math.max(0.4, hsl.l * 0.9));
      ambientGlow = primaryColor;
    }
  } else {
    // Neutral / Monochromatic primary accent color (Pure Black, Obsidian, Slate, etc.)
    if (isDark) {
      primaryTint = '#94A3B8';
      secondaryTint = '#CBD5E1';
      ambientGlow = '#64748B';
    } else {
      primaryTint = '#1E293B';
      secondaryTint = '#334155';
      ambientGlow = '#0F172A';
    }
  }

  return {
    primaryTint,
    secondaryTint,
    ambientGlow,
    isDark,
    ambientOpacity: isDark ? 0.14 : 0.08,
    plane1Opacity: isDark ? 0.13 : 0.09,
    plane2Opacity: isDark ? 0.18 : 0.14,
    plane3Opacity: isDark ? 0.10 : 0.07,
    plane4Opacity: isDark ? 0.15 : 0.11,
    plane5Opacity: isDark ? 0.08 : 0.05,
  };
}
