import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Path,
  Rect,
  Circle,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  G,
} from 'react-native-svg';
import { CardBackgroundStyle, DOT_FADE_POINTS, getGeometricPalette } from '@veya/shared';

interface CardBackgroundAccentProps {
  styleName?: CardBackgroundStyle | null;
  primaryColor?: string;
  cardBackgroundColor?: string;
  isDarkBg?: boolean;
}

export const CardBackgroundAccent: React.FC<CardBackgroundAccentProps> = ({
  styleName = 'minimal',
  primaryColor = '#111111',
  cardBackgroundColor: _cardBackgroundColor = '#FFFFFF',
  isDarkBg = false,
}) => {
  const activeStyle = styleName || 'minimal';
  const geomPalette = getGeometricPalette(primaryColor, isDarkBg);

  return (
    <View style={styles.container} pointerEvents="none">
      {activeStyle === 'minimal' && (
        <Svg width="100%" height="100%" viewBox="0 0 360 210" fill="none" preserveAspectRatio="xMaxYMin slice">
          <Defs>
            {/* Top-right expansive ambient lighting gradient */}
            <RadialGradient id="minimalAmbient" cx="100%" cy="0%" r="75%">
              <Stop offset="0%" stopColor={primaryColor} stopOpacity={isDarkBg ? 0.18 : 0.09} />
              <Stop offset="50%" stopColor={primaryColor} stopOpacity={isDarkBg ? 0.06 : 0.03} />
              <Stop offset="100%" stopColor={primaryColor} stopOpacity={0} />
            </RadialGradient>

            {/* Gentle tonal soft-radius curve gradient */}
            <LinearGradient id="minimalCurveGrad" x1="100%" y1="0%" x2="40%" y2="80%">
              <Stop offset="0%" stopColor={primaryColor} stopOpacity={isDarkBg ? 0.16 : 0.08} />
              <Stop offset="60%" stopColor={primaryColor} stopOpacity={isDarkBg ? 0.04 : 0.02} />
              <Stop offset="100%" stopColor={primaryColor} stopOpacity={0} />
            </LinearGradient>

            {/* Bottom-right corner subtle depth radial gradient */}
            <RadialGradient id="minimalBottomGlow" cx="100%" cy="100%" r="55%">
              <Stop offset="0%" stopColor={primaryColor} stopOpacity={isDarkBg ? 0.12 : 0.05} />
              <Stop offset="100%" stopColor={primaryColor} stopOpacity={0} />
            </RadialGradient>
          </Defs>

          {/* 1. Large soft-radius ambient wash in top-right corner */}
          <Rect x="120" y="0" width="240" height="210" fill="url(#minimalAmbient)" />

          {/* 2. Layered large soft-radius curved form around perimeter */}
          <Path
            d="M200 0C245 15 285 45 320 85C345 115 355 145 360 160V0H200Z"
            fill="url(#minimalCurveGrad)"
          />

          {/* 3. Extremely subtle hairline contour stroke for precision luxury finish */}
          <Path
            d="M230 0C270 20 305 55 335 100C350 125 358 150 360 170"
            stroke={primaryColor}
            strokeOpacity={isDarkBg ? 0.14 : 0.07}
            strokeWidth="1"
            strokeLinecap="round"
          />

          {/* 4. Second outer gentle contour arc */}
          <Path
            d="M280 0C310 18 335 45 360 85"
            stroke={primaryColor}
            strokeOpacity={isDarkBg ? 0.10 : 0.05}
            strokeWidth="0.8"
            strokeLinecap="round"
          />

          {/* 5. Peripheral soft depth in bottom-right corner, preserving clean center */}
          <Circle
            cx="360"
            cy="210"
            r="120"
            fill="url(#minimalBottomGlow)"
          />
        </Svg>
      )}

      {activeStyle === 'flow' && (
        <Svg width="100%" height="100%" viewBox="0 0 360 210" fill="none" preserveAspectRatio="none">
          <Defs>
            {/* Ambient liquid lighting glow centered at upper right */}
            <RadialGradient id="flowAmbient" cx="90%" cy="15%" r="70%">
              <Stop offset="0%" stopColor={primaryColor} stopOpacity={isDarkBg ? 0.22 : 0.12} />
              <Stop offset="55%" stopColor={primaryColor} stopOpacity={isDarkBg ? 0.06 : 0.03} />
              <Stop offset="100%" stopColor={primaryColor} stopOpacity={0} />
            </RadialGradient>

            {/* Primary deep flowing ribbon gradient */}
            <LinearGradient id="flowRibbon1" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={primaryColor} stopOpacity={isDarkBg ? 0.36 : 0.24} />
              <Stop offset="45%" stopColor={primaryColor} stopOpacity={isDarkBg ? 0.18 : 0.12} />
              <Stop offset="80%" stopColor={primaryColor} stopOpacity={isDarkBg ? 0.06 : 0.03} />
              <Stop offset="100%" stopColor={primaryColor} stopOpacity={0} />
            </LinearGradient>

            {/* Secondary interlocking ribbon gradient */}
            <LinearGradient id="flowRibbon2" x1="100%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={primaryColor} stopOpacity={isDarkBg ? 0.28 : 0.18} />
              <Stop offset="50%" stopColor={primaryColor} stopOpacity={isDarkBg ? 0.12 : 0.07} />
              <Stop offset="100%" stopColor={primaryColor} stopOpacity={0} />
            </LinearGradient>

            {/* Outer flank ribbon crest gradient */}
            <LinearGradient id="flowRibbon3" x1="0%" y1="100%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor={primaryColor} stopOpacity={isDarkBg ? 0.20 : 0.12} />
              <Stop offset="65%" stopColor={primaryColor} stopOpacity={isDarkBg ? 0.08 : 0.04} />
              <Stop offset="100%" stopColor={primaryColor} stopOpacity={0} />
            </LinearGradient>

            {/* Lower perimeter undulating counter-wave gradient */}
            <LinearGradient id="flowBottomRibbon" x1="0%" y1="100%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor={primaryColor} stopOpacity={isDarkBg ? 0.16 : 0.09} />
              <Stop offset="70%" stopColor={primaryColor} stopOpacity={isDarkBg ? 0.04 : 0.02} />
              <Stop offset="100%" stopColor={primaryColor} stopOpacity={0} />
            </LinearGradient>
          </Defs>

          {/* 1. Ambient lighting glow */}
          <Rect x="100" y="0" width="260" height="210" fill="url(#flowAmbient)" />

          {/* 2. Deep primary flowing ribbon curve */}
          <Path
            d="M135 0C185 28 218 16 258 50C302 86 328 64 360 84V0H135Z"
            fill="url(#flowRibbon1)"
          />

          {/* 3. Interlocking secondary ribbon wave */}
          <Path
            d="M185 0C225 40 262 24 300 66C332 98 346 132 360 148V0H185Z"
            fill="url(#flowRibbon2)"
          />

          {/* 4. Outer flank ribbon crest */}
          <Path
            d="M235 0C270 34 305 72 330 115C346 142 355 168 360 182V0H235Z"
            fill="url(#flowRibbon3)"
          />

          {/* 5. Liquid crest highlight stroke */}
          <Path
            d="M155 0C200 30 235 20 275 55C315 90 338 76 360 98"
            stroke={primaryColor}
            strokeOpacity={isDarkBg ? 0.22 : 0.14}
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
          />

          {/* 6. Lower perimeter counter-wave grounding the diagonal traverse */}
          <Path
            d="M0 168C48 154 92 192 145 182C192 174 235 196 275 210H0V168Z"
            fill="url(#flowBottomRibbon)"
          />
          <Path
            d="M0 182C44 172 78 198 126 192C168 186 208 202 240 210"
            stroke={primaryColor}
            strokeOpacity={isDarkBg ? 0.15 : 0.08}
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
          />
        </Svg>
      )}

      {activeStyle === 'glass' && (
        <Svg width="100%" height="100%" viewBox="0 0 360 210" fill="none" preserveAspectRatio="none">
          <Defs>
            {/* Ambient refractive glow in upper right corner */}
            <RadialGradient id="glassAmbient" cx="85%" cy="20%" r="65%">
              <Stop offset="0%" stopColor={primaryColor} stopOpacity={isDarkBg ? 0.20 : 0.10} />
              <Stop offset="60%" stopColor={primaryColor} stopOpacity={isDarkBg ? 0.05 : 0.02} />
              <Stop offset="100%" stopColor={primaryColor} stopOpacity={0} />
            </RadialGradient>

            {/* Primary floating glass panel fill */}
            <LinearGradient id="glassPanelGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={isDarkBg ? '#FFFFFF' : primaryColor} stopOpacity={isDarkBg ? 0.15 : 0.12} />
              <Stop offset="40%" stopColor={primaryColor} stopOpacity={isDarkBg ? 0.10 : 0.06} />
              <Stop offset="100%" stopColor={primaryColor} stopOpacity={isDarkBg ? 0.03 : 0.01} />
            </LinearGradient>

            {/* Secondary overlapping glass panel fill */}
            <LinearGradient id="glassPanelGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={isDarkBg ? '#FFFFFF' : primaryColor} stopOpacity={isDarkBg ? 0.18 : 0.14} />
              <Stop offset="50%" stopColor={primaryColor} stopOpacity={isDarkBg ? 0.08 : 0.04} />
              <Stop offset="100%" stopColor={primaryColor} stopOpacity={0} />
            </LinearGradient>

            {/* Refractive beveled border gradient */}
            <LinearGradient id="glassBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={isDarkBg ? '#FFFFFF' : primaryColor} stopOpacity={isDarkBg ? 0.35 : 0.25} />
              <Stop offset="45%" stopColor={primaryColor} stopOpacity={isDarkBg ? 0.15 : 0.10} />
              <Stop offset="100%" stopColor={isDarkBg ? primaryColor : '#FFFFFF'} stopOpacity={isDarkBg ? 0.04 : 0.05} />
            </LinearGradient>

            {/* Specular glass highlight reflection gradient */}
            <LinearGradient id="glassSheenGrad" x1="0%" y1="0%" x2="100%" y2="60%">
              <Stop offset="0%" stopColor={isDarkBg ? '#FFFFFF' : primaryColor} stopOpacity={isDarkBg ? 0.22 : 0.18} />
              <Stop offset="50%" stopColor={primaryColor} stopOpacity={isDarkBg ? 0.08 : 0.04} />
              <Stop offset="100%" stopColor={primaryColor} stopOpacity={0} />
            </LinearGradient>
          </Defs>

          {/* 1. Ambient refractive glow backdrop */}
          <Rect x="120" y="0" width="240" height="210" fill="url(#glassAmbient)" />

          {/* 2. Primary floating frosted glass slab */}
          <Rect
            x="200"
            y="14"
            width="146"
            height="182"
            rx="20"
            fill="url(#glassPanelGrad1)"
            stroke="url(#glassBorderGrad)"
            strokeWidth="1.2"
          />

          {/* 3. Secondary overlapping glass panel (creating depth & optical refraction) */}
          <Rect
            x="165"
            y="-15"
            width="130"
            height="110"
            rx="22"
            transform="rotate(12 165 -15)"
            fill="url(#glassPanelGrad2)"
            stroke="url(#glassBorderGrad)"
            strokeWidth="1"
          />

          {/* 4. Specular glass highlight reflection across top edge */}
          <Path
            d="M216 15H330C339 15 345 21 345 30V48L216 15Z"
            fill="url(#glassSheenGrad)"
          />

          {/* 5. Minimal lower-left translucent glass pill anchor */}
          <Rect
            x="-15"
            y="172"
            width="85"
            height="50"
            rx="16"
            fill="url(#glassPanelGrad1)"
            stroke="url(#glassBorderGrad)"
            strokeWidth="0.8"
          />
        </Svg>
      )}

      {activeStyle === 'geometric' && (
        <Svg width="100%" height="100%" viewBox="0 0 360 210" fill="none" preserveAspectRatio="none">
          <Defs>
            {/* Ambient bottom atmospheric wash */}
            <RadialGradient id="geoAmbient" cx="50%" cy="100%" r="65%">
              <Stop offset="0%" stopColor={geomPalette.ambientGlow} stopOpacity={geomPalette.ambientOpacity} />
              <Stop offset="100%" stopColor={geomPalette.ambientGlow} stopOpacity={0} />
            </RadialGradient>

            {/* Facet Plane 1 Gradient (Wide lower backdrop) */}
            <LinearGradient id="geoPlane1" x1="0%" y1="50%" x2="70%" y2="100%">
              <Stop offset="0%" stopColor={geomPalette.primaryTint} stopOpacity={geomPalette.plane1Opacity * 1.2} />
              <Stop offset="100%" stopColor={geomPalette.secondaryTint} stopOpacity={geomPalette.plane1Opacity * 0.4} />
            </LinearGradient>

            {/* Facet Plane 2 Gradient (Prominent ascending triangular plane) */}
            <LinearGradient id="geoPlane2" x1="20%" y1="0%" x2="80%" y2="100%">
              <Stop offset="0%" stopColor={geomPalette.secondaryTint} stopOpacity={geomPalette.plane2Opacity * 1.1} />
              <Stop offset="100%" stopColor={geomPalette.primaryTint} stopOpacity={geomPalette.plane2Opacity * 0.3} />
            </LinearGradient>

            {/* Facet Plane 3 Gradient (Central sweeping polygon) */}
            <LinearGradient id="geoPlane3" x1="40%" y1="0%" x2="60%" y2="100%">
              <Stop offset="0%" stopColor={geomPalette.primaryTint} stopOpacity={geomPalette.plane3Opacity * 1.3} />
              <Stop offset="100%" stopColor={geomPalette.secondaryTint} stopOpacity={geomPalette.plane3Opacity * 0.4} />
            </LinearGradient>

            {/* Facet Plane 4 Gradient (Right-side ascending facet) */}
            <LinearGradient id="geoPlane4" x1="100%" y1="0%" x2="30%" y2="100%">
              <Stop offset="0%" stopColor={geomPalette.secondaryTint} stopOpacity={geomPalette.plane4Opacity * 1.2} />
              <Stop offset="100%" stopColor={geomPalette.primaryTint} stopOpacity={geomPalette.plane4Opacity * 0.3} />
            </LinearGradient>

            {/* Facet Plane 5 Gradient (Far-right grounding plane) */}
            <LinearGradient id="geoPlane5" x1="50%" y1="0%" x2="50%" y2="100%">
              <Stop offset="0%" stopColor={geomPalette.primaryTint} stopOpacity={geomPalette.plane5Opacity * 1.4} />
              <Stop offset="100%" stopColor={geomPalette.secondaryTint} stopOpacity={geomPalette.plane5Opacity * 0.2} />
            </LinearGradient>
          </Defs>

          {/* 1. Ambient bottom lighting wash */}
          <Rect x="0" y="90" width="360" height="120" fill="url(#geoAmbient)" />

          {/* 2. Plane 1: Wide lower backdrop polygon */}
          <Path
            d="M0 160L55 125L165 145L290 130L360 152V210H0Z"
            fill="url(#geoPlane1)"
          />

          {/* 3. Plane 2: Prominent ascending triangular facet (lower left to center) */}
          <Path
            d="M10 210L85 130L160 195L40 210Z"
            fill="url(#geoPlane2)"
          />

          {/* 4. Plane 3: Low-angled crystalline facet in bottom left */}
          <Path
            d="M0 185L50 145L115 195L25 210H0Z"
            fill={geomPalette.primaryTint}
            fillOpacity={geomPalette.plane3Opacity}
          />

          {/* 5. Plane 4: Central sweeping translucent polygon */}
          <Path
            d="M65 210L145 125L245 160L205 210Z"
            fill="url(#geoPlane3)"
          />

          {/* 6. Plane 5: Lower-center overlapping diamond facet */}
          <Path
            d="M115 210L185 155L265 210Z"
            fill={geomPalette.secondaryTint}
            fillOpacity={geomPalette.plane5Opacity}
          />

          {/* 7. Plane 6: Right-center ascending facet plane */}
          <Path
            d="M175 210L265 135L360 165V210H255Z"
            fill="url(#geoPlane4)"
          />

          {/* 8. Plane 7: Far-right corner grounding plane */}
          <Path
            d="M280 210L360 148V210Z"
            fill="url(#geoPlane5)"
          />
        </Svg>
      )}

      {activeStyle === 'organic' && (
        <Svg width="100%" height="100%" viewBox="0 0 360 210" fill="none" preserveAspectRatio="none">
          <Defs>
            {/* Ambient organic fluid wash in upper right */}
            <RadialGradient id="organicField" cx="85%" cy="20%" r="70%">
              <Stop offset="0%" stopColor={primaryColor} stopOpacity={isDarkBg ? 0.22 : 0.12} />
              <Stop offset="60%" stopColor={primaryColor} stopOpacity={isDarkBg ? 0.06 : 0.03} />
              <Stop offset="100%" stopColor={primaryColor} stopOpacity={0} />
            </RadialGradient>

            {/* Primary organic pebble gradient */}
            <RadialGradient id="organicPebble1" cx="75%" cy="30%" r="60%">
              <Stop offset="0%" stopColor={primaryColor} stopOpacity={isDarkBg ? 0.28 : 0.16} />
              <Stop offset="55%" stopColor={primaryColor} stopOpacity={isDarkBg ? 0.12 : 0.06} />
              <Stop offset="100%" stopColor={primaryColor} stopOpacity={0} />
            </RadialGradient>

            {/* Secondary interlocking organic droplet gradient */}
            <RadialGradient id="organicPebble2" cx="80%" cy="20%" r="50%">
              <Stop offset="0%" stopColor={primaryColor} stopOpacity={isDarkBg ? 0.20 : 0.11} />
              <Stop offset="60%" stopColor={primaryColor} stopOpacity={isDarkBg ? 0.06 : 0.03} />
              <Stop offset="100%" stopColor={primaryColor} stopOpacity={0} />
            </RadialGradient>

            {/* Lower perimeter grounding organic curve gradient */}
            <RadialGradient id="organicBottom" cx="20%" cy="90%" r="50%">
              <Stop offset="0%" stopColor={primaryColor} stopOpacity={isDarkBg ? 0.16 : 0.08} />
              <Stop offset="70%" stopColor={primaryColor} stopOpacity={isDarkBg ? 0.04 : 0.02} />
              <Stop offset="100%" stopColor={primaryColor} stopOpacity={0} />
            </RadialGradient>
          </Defs>

          {/* 1. Ambient organic fluid wash */}
          <Rect x="120" y="0" width="240" height="210" fill="url(#organicField)" />

          {/* 2. Primary sculpted river pebble / liquid contour */}
          <Path
            d="M175 0C205 28 222 56 250 72C285 92 332 82 360 66V0H175Z"
            fill="url(#organicPebble1)"
          />

          {/* 3. Secondary overlapping organic fluid form */}
          <Path
            d="M235 0C255 26 282 44 312 50C338 55 352 46 360 36V0H235Z"
            fill="url(#organicPebble2)"
          />

          {/* 4. Graceful organic contour wave */}
          <Path
            d="M150 0C185 36 212 74 254 94C296 114 336 102 360 120"
            stroke={primaryColor}
            strokeOpacity={isDarkBg ? 0.18 : 0.10}
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
          />

          {/* 5. Secondary inner harmonic contour ripple */}
          <Path
            d="M205 0C232 28 262 58 302 70C332 78 348 70 360 78"
            stroke={primaryColor}
            strokeOpacity={isDarkBg ? 0.12 : 0.06}
            strokeWidth="0.8"
            strokeLinecap="round"
            fill="none"
          />

          {/* 6. Lower perimeter natural counter-contour */}
          <Path
            d="M0 160C36 154 64 178 84 192C102 204 112 208 122 210H0V160Z"
            fill="url(#organicBottom)"
          />
          <Path
            d="M0 174C30 168 54 188 74 200C90 208 102 210 112 210"
            stroke={primaryColor}
            strokeOpacity={isDarkBg ? 0.14 : 0.07}
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
          />

          {/* 7. Floating organic satellite pebble */}
          <Circle
            cx="338"
            cy="150"
            r="12"
            fill={primaryColor}
            fillOpacity={isDarkBg ? 0.10 : 0.05}
          />
        </Svg>
      )}

      {activeStyle === 'dot-fade' && (
        <Svg width="100%" height="100%" viewBox="0 0 360 210" fill="none" preserveAspectRatio="none">
          <Defs>
            {/* Ambient upper-left soft glow */}
            <RadialGradient id="dotFadeGlowUL" cx="0%" cy="0%" r="65%">
              <Stop offset="0%" stopColor={primaryColor} stopOpacity={isDarkBg ? 0.16 : 0.08} />
              <Stop offset="100%" stopColor={primaryColor} stopOpacity={0} />
            </RadialGradient>

            {/* Ambient bottom-right soft glow */}
            <RadialGradient id="dotFadeGlowBR" cx="100%" cy="100%" r="70%">
              <Stop offset="0%" stopColor={primaryColor} stopOpacity={isDarkBg ? 0.18 : 0.09} />
              <Stop offset="100%" stopColor={primaryColor} stopOpacity={0} />
            </RadialGradient>
          </Defs>

          {/* 1. Ambient lighting washes in both diagonal corners */}
          <Rect x="0" y="0" width="180" height="130" fill="url(#dotFadeGlowUL)" />
          <Rect x="180" y="80" width="180" height="130" fill="url(#dotFadeGlowBR)" />

          {/* 2. Dual-corner halftone dissolving dot field (198 dots) */}
          <G fill={primaryColor}>
            {DOT_FADE_POINTS.map((pt, idx) => (
              <Circle
                key={idx}
                cx={pt.x}
                cy={pt.y}
                r={pt.r}
                fillOpacity={isDarkBg ? pt.opDark : pt.opLight}
              />
            ))}
          </G>
        </Svg>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    overflow: 'hidden',
    zIndex: 0,
  },
});
