import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

interface CardWaveAccentProps {
  primaryColor?: string;
}

export const CardWaveAccent: React.FC<CardWaveAccentProps> = ({ primaryColor = '#111111' }) => {
  return (
    <View style={styles.svgCornerWrapper} pointerEvents="none">
      <Svg width={140} height={110} viewBox="0 0 140 110" fill="none">
        <Defs>
          <LinearGradient id="veyaWave" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={primaryColor} stopOpacity={0.45} />
            <Stop offset="50%" stopColor={primaryColor} stopOpacity={0.3} />
            <Stop offset="100%" stopColor={primaryColor} stopOpacity={0.15} />
          </LinearGradient>
        </Defs>
        <Path
          d="M30 0C65 15 85 45 105 55C125 65 135 40 140 30V0H30Z"
          fill="url(#veyaWave)"
        />
        <Path
          d="M75 0C98 22 110 52 140 68V0H75Z"
          fill={primaryColor}
          fillOpacity={0.25}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  svgCornerWrapper: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 140,
    height: 110,
    zIndex: 0,
  },
});
