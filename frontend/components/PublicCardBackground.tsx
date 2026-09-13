'use client';

import React, { useId } from 'react';
import { CardBackgroundStyle, DOT_FADE_POINTS, getGeometricPalette } from '@veya/shared';

interface PublicCardBackgroundProps {
  backgroundStyle?: CardBackgroundStyle | null;
  primaryColor?: string;
  cardBackgroundColor?: string;
  isDark?: boolean;
}

export const PublicCardBackground: React.FC<PublicCardBackgroundProps> = ({
  backgroundStyle = 'minimal',
  primaryColor = '#111111',
  cardBackgroundColor: _cardBackgroundColor = '#FFFFFF',
  isDark = false,
}) => {
  const rawId = useId();
  const idPrefix = rawId.replace(/:/g, '');

  const activeStyle = backgroundStyle || 'minimal';
  const geomPalette = getGeometricPalette(primaryColor, isDark);

  return (
    <div
      className="card-background-wrapper"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'hidden',
        borderRadius: 'inherit',
      }}
      aria-hidden="true"
    >
      {activeStyle === 'minimal' && (
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 360 210"
          fill="none"
          preserveAspectRatio="xMaxYMin slice"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        >
          <defs>
            {/* Top-right expansive ambient lighting gradient */}
            <radialGradient id={`${idPrefix}-minAmbient`} cx="100%" cy="0%" r="75%">
              <stop offset="0%" stopColor={primaryColor} stopOpacity={isDark ? 0.18 : 0.09} />
              <stop offset="50%" stopColor={primaryColor} stopOpacity={isDark ? 0.06 : 0.03} />
              <stop offset="100%" stopColor={primaryColor} stopOpacity={0} />
            </radialGradient>

            {/* Gentle tonal soft-radius curve gradient */}
            <linearGradient id={`${idPrefix}-minCurveGrad`} x1="100%" y1="0%" x2="40%" y2="80%">
              <stop offset="0%" stopColor={primaryColor} stopOpacity={isDark ? 0.16 : 0.08} />
              <stop offset="60%" stopColor={primaryColor} stopOpacity={isDark ? 0.04 : 0.02} />
              <stop offset="100%" stopColor={primaryColor} stopOpacity={0} />
            </linearGradient>

            {/* Bottom-right corner subtle depth radial gradient */}
            <radialGradient id={`${idPrefix}-minBottomGlow`} cx="100%" cy="100%" r="55%">
              <stop offset="0%" stopColor={primaryColor} stopOpacity={isDark ? 0.12 : 0.05} />
              <stop offset="100%" stopColor={primaryColor} stopOpacity={0} />
            </radialGradient>
          </defs>

          {/* 1. Large soft-radius ambient wash in top-right corner */}
          <rect x="120" y="0" width="240" height="210" fill={`url(#${idPrefix}-minAmbient)`} />

          {/* 2. Layered large soft-radius curved form around perimeter */}
          <path
            d="M200 0C245 15 285 45 320 85C345 115 355 145 360 160V0H200Z"
            fill={`url(#${idPrefix}-minCurveGrad)`}
          />

          {/* 3. Extremely subtle hairline contour stroke for precision luxury finish */}
          <path
            d="M230 0C270 20 305 55 335 100C350 125 358 150 360 170"
            stroke={primaryColor}
            strokeOpacity={isDark ? 0.14 : 0.07}
            strokeWidth="1"
            strokeLinecap="round"
          />

          {/* 4. Second outer gentle contour arc */}
          <path
            d="M280 0C310 18 335 45 360 85"
            stroke={primaryColor}
            strokeOpacity={isDark ? 0.10 : 0.05}
            strokeWidth="0.8"
            strokeLinecap="round"
          />

          {/* 5. Peripheral soft depth in bottom-right corner, preserving clean center */}
          <circle
            cx="360"
            cy="210"
            r="120"
            fill={`url(#${idPrefix}-minBottomGlow)`}
          />
        </svg>
      )}

      {activeStyle === 'flow' && (
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 360 210"
          fill="none"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        >
          <defs>
            {/* Ambient liquid lighting glow centered at upper right */}
            <radialGradient id={`${idPrefix}-flwAmbient`} cx="90%" cy="15%" r="70%">
              <stop offset="0%" stopColor={primaryColor} stopOpacity={isDark ? 0.22 : 0.12} />
              <stop offset="55%" stopColor={primaryColor} stopOpacity={isDark ? 0.06 : 0.03} />
              <stop offset="100%" stopColor={primaryColor} stopOpacity={0} />
            </radialGradient>

            {/* Primary deep flowing ribbon gradient */}
            <linearGradient id={`${idPrefix}-flwRibbon1`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={primaryColor} stopOpacity={isDark ? 0.36 : 0.24} />
              <stop offset="45%" stopColor={primaryColor} stopOpacity={isDark ? 0.18 : 0.12} />
              <stop offset="80%" stopColor={primaryColor} stopOpacity={isDark ? 0.06 : 0.03} />
              <stop offset="100%" stopColor={primaryColor} stopOpacity={0} />
            </linearGradient>

            {/* Secondary interlocking ribbon gradient */}
            <linearGradient id={`${idPrefix}-flwRibbon2`} x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={primaryColor} stopOpacity={isDark ? 0.28 : 0.18} />
              <stop offset="50%" stopColor={primaryColor} stopOpacity={isDark ? 0.12 : 0.07} />
              <stop offset="100%" stopColor={primaryColor} stopOpacity={0} />
            </linearGradient>

            {/* Outer flank ribbon crest gradient */}
            <linearGradient id={`${idPrefix}-flwRibbon3`} x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={primaryColor} stopOpacity={isDark ? 0.20 : 0.12} />
              <stop offset="65%" stopColor={primaryColor} stopOpacity={isDark ? 0.08 : 0.04} />
              <stop offset="100%" stopColor={primaryColor} stopOpacity={0} />
            </linearGradient>

            {/* Lower perimeter undulating counter-wave gradient */}
            <linearGradient id={`${idPrefix}-flwBottomRibbon`} x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={primaryColor} stopOpacity={isDark ? 0.16 : 0.09} />
              <stop offset="70%" stopColor={primaryColor} stopOpacity={isDark ? 0.04 : 0.02} />
              <stop offset="100%" stopColor={primaryColor} stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* 1. Ambient lighting glow */}
          <rect x="100" y="0" width="260" height="210" fill={`url(#${idPrefix}-flwAmbient)`} />

          {/* 2. Deep primary flowing ribbon curve */}
          <path
            d="M135 0C185 28 218 16 258 50C302 86 328 64 360 84V0H135Z"
            fill={`url(#${idPrefix}-flwRibbon1)`}
          />

          {/* 3. Interlocking secondary ribbon wave */}
          <path
            d="M185 0C225 40 262 24 300 66C332 98 346 132 360 148V0H185Z"
            fill={`url(#${idPrefix}-flwRibbon2)`}
          />

          {/* 4. Outer flank ribbon crest */}
          <path
            d="M235 0C270 34 305 72 330 115C346 142 355 168 360 182V0H235Z"
            fill={`url(#${idPrefix}-flwRibbon3)`}
          />

          {/* 5. Liquid crest highlight stroke */}
          <path
            d="M155 0C200 30 235 20 275 55C315 90 338 76 360 98"
            stroke={primaryColor}
            strokeOpacity={isDark ? 0.22 : 0.14}
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
          />

          {/* 6. Lower perimeter counter-wave grounding the diagonal traverse */}
          <path
            d="M0 168C48 154 92 192 145 182C192 174 235 196 275 210H0V168Z"
            fill={`url(#${idPrefix}-flwBottomRibbon)`}
          />
          <path
            d="M0 182C44 172 78 198 126 192C168 186 208 202 240 210"
            stroke={primaryColor}
            strokeOpacity={isDark ? 0.15 : 0.08}
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      )}

      {activeStyle === 'glass' && (
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 360 210"
          fill="none"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        >
          <defs>
            {/* Ambient refractive glow in upper right corner */}
            <radialGradient id={`${idPrefix}-glsAmbient`} cx="85%" cy="20%" r="65%">
              <stop offset="0%" stopColor={primaryColor} stopOpacity={isDark ? 0.20 : 0.10} />
              <stop offset="60%" stopColor={primaryColor} stopOpacity={isDark ? 0.05 : 0.02} />
              <stop offset="100%" stopColor={primaryColor} stopOpacity={0} />
            </radialGradient>

            {/* Primary floating glass panel fill */}
            <linearGradient id={`${idPrefix}-glsPanelGrad1`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isDark ? '#FFFFFF' : primaryColor} stopOpacity={isDark ? 0.15 : 0.12} />
              <stop offset="40%" stopColor={primaryColor} stopOpacity={isDark ? 0.10 : 0.06} />
              <stop offset="100%" stopColor={primaryColor} stopOpacity={isDark ? 0.03 : 0.01} />
            </linearGradient>

            {/* Secondary overlapping glass panel fill */}
            <linearGradient id={`${idPrefix}-glsPanelGrad2`} x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isDark ? '#FFFFFF' : primaryColor} stopOpacity={isDark ? 0.18 : 0.14} />
              <stop offset="50%" stopColor={primaryColor} stopOpacity={isDark ? 0.08 : 0.04} />
              <stop offset="100%" stopColor={primaryColor} stopOpacity={0} />
            </linearGradient>

            {/* Refractive beveled border gradient */}
            <linearGradient id={`${idPrefix}-glsBorderGrad`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isDark ? '#FFFFFF' : primaryColor} stopOpacity={isDark ? 0.35 : 0.25} />
              <stop offset="45%" stopColor={primaryColor} stopOpacity={isDark ? 0.15 : 0.10} />
              <stop offset="100%" stopColor={isDark ? primaryColor : '#FFFFFF'} stopOpacity={isDark ? 0.04 : 0.05} />
            </linearGradient>

            {/* Specular glass highlight reflection gradient */}
            <linearGradient id={`${idPrefix}-glsSheenGrad`} x1="0%" y1="0%" x2="100%" y2="60%">
              <stop offset="0%" stopColor={isDark ? '#FFFFFF' : primaryColor} stopOpacity={isDark ? 0.22 : 0.18} />
              <stop offset="50%" stopColor={primaryColor} stopOpacity={isDark ? 0.08 : 0.04} />
              <stop offset="100%" stopColor={primaryColor} stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* 1. Ambient refractive glow backdrop */}
          <rect x="120" y="0" width="240" height="210" fill={`url(#${idPrefix}-glsAmbient)`} />

          {/* 2. Primary floating frosted glass slab */}
          <rect
            x="200"
            y="14"
            width="146"
            height="182"
            rx="20"
            fill={`url(#${idPrefix}-glsPanelGrad1)`}
            stroke={`url(#${idPrefix}-glsBorderGrad)`}
            strokeWidth="1.2"
          />

          {/* 3. Secondary overlapping glass panel (creating depth & optical refraction) */}
          <rect
            x="165"
            y="-15"
            width="130"
            height="110"
            rx="22"
            transform="rotate(12 165 -15)"
            fill={`url(#${idPrefix}-glsPanelGrad2)`}
            stroke={`url(#${idPrefix}-glsBorderGrad)`}
            strokeWidth="1"
          />

          {/* 4. Specular glass highlight reflection across top edge */}
          <path
            d="M216 15H330C339 15 345 21 345 30V48L216 15Z"
            fill={`url(#${idPrefix}-glsSheenGrad)`}
          />

          {/* 5. Minimal lower-left translucent glass pill anchor */}
          <rect
            x="-15"
            y="172"
            width="85"
            height="50"
            rx="16"
            fill={`url(#${idPrefix}-glsPanelGrad1)`}
            stroke={`url(#${idPrefix}-glsBorderGrad)`}
            strokeWidth="0.8"
          />
        </svg>
      )}

      {activeStyle === 'geometric' && (
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 360 210"
          fill="none"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        >
          <defs>
            {/* Ambient bottom atmospheric wash */}
            <radialGradient id={`${idPrefix}-geoAmbient`} cx="50%" cy="100%" r="65%">
              <stop offset="0%" stopColor={geomPalette.ambientGlow} stopOpacity={geomPalette.ambientOpacity} />
              <stop offset="100%" stopColor={geomPalette.ambientGlow} stopOpacity={0} />
            </radialGradient>

            {/* Facet Plane 1 Gradient (Wide lower backdrop) */}
            <linearGradient id={`${idPrefix}-geoPlane1`} x1="0%" y1="50%" x2="70%" y2="100%">
              <stop offset="0%" stopColor={geomPalette.primaryTint} stopOpacity={geomPalette.plane1Opacity * 1.2} />
              <stop offset="100%" stopColor={geomPalette.secondaryTint} stopOpacity={geomPalette.plane1Opacity * 0.4} />
            </linearGradient>

            {/* Facet Plane 2 Gradient (Prominent ascending triangular plane) */}
            <linearGradient id={`${idPrefix}-geoPlane2`} x1="20%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%" stopColor={geomPalette.secondaryTint} stopOpacity={geomPalette.plane2Opacity * 1.1} />
              <stop offset="100%" stopColor={geomPalette.primaryTint} stopOpacity={geomPalette.plane2Opacity * 0.3} />
            </linearGradient>

            {/* Facet Plane 3 Gradient (Central sweeping polygon) */}
            <linearGradient id={`${idPrefix}-geoPlane3`} x1="40%" y1="0%" x2="60%" y2="100%">
              <stop offset="0%" stopColor={geomPalette.primaryTint} stopOpacity={geomPalette.plane3Opacity * 1.3} />
              <stop offset="100%" stopColor={geomPalette.secondaryTint} stopOpacity={geomPalette.plane3Opacity * 0.4} />
            </linearGradient>

            {/* Facet Plane 4 Gradient (Right-side ascending facet) */}
            <linearGradient id={`${idPrefix}-geoPlane4`} x1="100%" y1="0%" x2="30%" y2="100%">
              <stop offset="0%" stopColor={geomPalette.secondaryTint} stopOpacity={geomPalette.plane4Opacity * 1.2} />
              <stop offset="100%" stopColor={geomPalette.primaryTint} stopOpacity={geomPalette.plane4Opacity * 0.3} />
            </linearGradient>

            {/* Facet Plane 5 Gradient (Far-right grounding plane) */}
            <linearGradient id={`${idPrefix}-geoPlane5`} x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor={geomPalette.primaryTint} stopOpacity={geomPalette.plane5Opacity * 1.4} />
              <stop offset="100%" stopColor={geomPalette.secondaryTint} stopOpacity={geomPalette.plane5Opacity * 0.2} />
            </linearGradient>
          </defs>

          {/* 1. Ambient bottom lighting wash */}
          <rect x="0" y="90" width="360" height="120" fill={`url(#${idPrefix}-geoAmbient)`} />

          {/* 2. Plane 1: Wide lower backdrop polygon */}
          <path
            d="M0 160L55 125L165 145L290 130L360 152V210H0Z"
            fill={`url(#${idPrefix}-geoPlane1)`}
          />

          {/* 3. Plane 2: Prominent ascending triangular facet (lower left to center) */}
          <path
            d="M10 210L85 130L160 195L40 210Z"
            fill={`url(#${idPrefix}-geoPlane2)`}
          />

          {/* 4. Plane 3: Low-angled crystalline facet in bottom left */}
          <path
            d="M0 185L50 145L115 195L25 210H0Z"
            fill={geomPalette.primaryTint}
            fillOpacity={geomPalette.plane3Opacity}
          />

          {/* 5. Plane 4: Central sweeping translucent polygon */}
          <path
            d="M65 210L145 125L245 160L205 210Z"
            fill={`url(#${idPrefix}-geoPlane3)`}
          />

          {/* 6. Plane 5: Lower-center overlapping diamond facet */}
          <path
            d="M115 210L185 155L265 210Z"
            fill={geomPalette.secondaryTint}
            fillOpacity={geomPalette.plane5Opacity}
          />

          {/* 7. Plane 6: Right-center ascending facet plane */}
          <path
            d="M175 210L265 135L360 165V210H255Z"
            fill={`url(#${idPrefix}-geoPlane4)`}
          />

          {/* 8. Plane 7: Far-right corner grounding plane */}
          <path
            d="M280 210L360 148V210Z"
            fill={`url(#${idPrefix}-geoPlane5)`}
          />
        </svg>
      )}

      {activeStyle === 'organic' && (
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 360 210"
          fill="none"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        >
          <defs>
            {/* Ambient organic fluid wash in upper right */}
            <radialGradient id={`${idPrefix}-orgField`} cx="85%" cy="20%" r="70%">
              <stop offset="0%" stopColor={primaryColor} stopOpacity={isDark ? 0.22 : 0.12} />
              <stop offset="60%" stopColor={primaryColor} stopOpacity={isDark ? 0.06 : 0.03} />
              <stop offset="100%" stopColor={primaryColor} stopOpacity={0} />
            </radialGradient>

            {/* Primary organic pebble gradient */}
            <radialGradient id={`${idPrefix}-orgPebble1`} cx="75%" cy="30%" r="60%">
              <stop offset="0%" stopColor={primaryColor} stopOpacity={isDark ? 0.28 : 0.16} />
              <stop offset="55%" stopColor={primaryColor} stopOpacity={isDark ? 0.12 : 0.06} />
              <stop offset="100%" stopColor={primaryColor} stopOpacity={0} />
            </radialGradient>

            {/* Secondary interlocking organic droplet gradient */}
            <radialGradient id={`${idPrefix}-orgPebble2`} cx="80%" cy="20%" r="50%">
              <stop offset="0%" stopColor={primaryColor} stopOpacity={isDark ? 0.20 : 0.11} />
              <stop offset="60%" stopColor={primaryColor} stopOpacity={isDark ? 0.06 : 0.03} />
              <stop offset="100%" stopColor={primaryColor} stopOpacity={0} />
            </radialGradient>

            {/* Lower perimeter grounding organic curve gradient */}
            <radialGradient id={`${idPrefix}-orgBottom`} cx="20%" cy="90%" r="50%">
              <stop offset="0%" stopColor={primaryColor} stopOpacity={isDark ? 0.16 : 0.08} />
              <stop offset="70%" stopColor={primaryColor} stopOpacity={isDark ? 0.04 : 0.02} />
              <stop offset="100%" stopColor={primaryColor} stopOpacity={0} />
            </radialGradient>
          </defs>

          {/* 1. Ambient organic fluid wash */}
          <rect x="120" y="0" width="240" height="210" fill={`url(#${idPrefix}-orgField)`} />

          {/* 2. Primary sculpted river pebble / liquid contour */}
          <path
            d="M175 0C205 28 222 56 250 72C285 92 332 82 360 66V0H175Z"
            fill={`url(#${idPrefix}-orgPebble1)`}
          />

          {/* 3. Secondary overlapping organic fluid form */}
          <path
            d="M235 0C255 26 282 44 312 50C338 55 352 46 360 36V0H235Z"
            fill={`url(#${idPrefix}-orgPebble2)`}
          />

          {/* 4. Graceful organic contour wave */}
          <path
            d="M150 0C185 36 212 74 254 94C296 114 336 102 360 120"
            stroke={primaryColor}
            strokeOpacity={isDark ? 0.18 : 0.10}
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
          />

          {/* 5. Secondary inner harmonic contour ripple */}
          <path
            d="M205 0C232 28 262 58 302 70C332 78 348 70 360 78"
            stroke={primaryColor}
            strokeOpacity={isDark ? 0.12 : 0.06}
            strokeWidth="0.8"
            strokeLinecap="round"
            fill="none"
          />

          {/* 6. Lower perimeter natural counter-contour */}
          <path
            d="M0 160C36 154 64 178 84 192C102 204 112 208 122 210H0V160Z"
            fill={`url(#${idPrefix}-orgBottom)`}
          />
          <path
            d="M0 174C30 168 54 188 74 200C90 208 102 210 112 210"
            stroke={primaryColor}
            strokeOpacity={isDark ? 0.14 : 0.07}
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
          />

          {/* 7. Floating organic satellite pebble */}
          <circle
            cx="338"
            cy="150"
            r="12"
            fill={primaryColor}
            fillOpacity={isDark ? 0.10 : 0.05}
          />
        </svg>
      )}

      {activeStyle === 'dot-fade' && (
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 360 210"
          fill="none"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        >
          <defs>
            {/* Dual corner ambient glows */}
            <radialGradient id={`${idPrefix}-dotFadeGlowUL`} cx="0%" cy="0%" r="65%">
              <stop offset="0%" stopColor={primaryColor} stopOpacity={isDark ? 0.16 : 0.08} />
              <stop offset="100%" stopColor={primaryColor} stopOpacity={0} />
            </radialGradient>
            <radialGradient id={`${idPrefix}-dotFadeGlowBR`} cx="100%" cy="100%" r="70%">
              <stop offset="0%" stopColor={primaryColor} stopOpacity={isDark ? 0.18 : 0.09} />
              <stop offset="100%" stopColor={primaryColor} stopOpacity={0} />
            </radialGradient>
          </defs>

          {/* Upper-left & bottom-right ambient corner washes */}
          <rect x="0" y="0" width="180" height="130" fill={`url(#${idPrefix}-dotFadeGlowUL)`} />
          <rect x="180" y="80" width="180" height="130" fill={`url(#${idPrefix}-dotFadeGlowBR)`} />

          {/* Dense dual-corner fading dot field */}
          <g fill={primaryColor}>
            {DOT_FADE_POINTS.map((pt, idx) => (
              <circle
                key={idx}
                cx={pt.x}
                cy={pt.y}
                r={pt.r}
                fillOpacity={isDark ? pt.opDark : pt.opLight}
              />
            ))}
          </g>
        </svg>
      )}
    </div>
  );
};
