import React from 'react';
import { View, StyleSheet } from 'react-native';

interface QrScannerIconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

/**
 * QR Viewfinder Scanner Icon matching the exact reference:
 * - 4 rounded corner brackets (top-left, top-right, bottom-left, bottom-right)
 * - Horizontal scan laser line passing through the middle and extending slightly past the sides
 */
export const QrScannerIcon: React.FC<QrScannerIconProps> = ({
  size = 24,
  color = '#111111',
  strokeWidth = 2.5,
}) => {
  const cornerSize = Math.round(size * 0.38);
  const cornerRadius = Math.round(size * 0.18);
  const lineWidth = size + Math.round(size * 0.2); // extends slightly past both sides
  const lineHeight = strokeWidth;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Top Left Corner */}
      <View
        style={[
          styles.corner,
          styles.topLeft,
          {
            width: cornerSize,
            height: cornerSize,
            borderTopWidth: strokeWidth,
            borderLeftWidth: strokeWidth,
            borderColor: color,
            borderTopLeftRadius: cornerRadius,
          },
        ]}
      />

      {/* Top Right Corner */}
      <View
        style={[
          styles.corner,
          styles.topRight,
          {
            width: cornerSize,
            height: cornerSize,
            borderTopWidth: strokeWidth,
            borderRightWidth: strokeWidth,
            borderColor: color,
            borderTopRightRadius: cornerRadius,
          },
        ]}
      />

      {/* Horizontal Center Scan Line (extends slightly past brackets) */}
      <View
        style={[
          styles.scanLine,
          {
            width: lineWidth,
            height: lineHeight,
            backgroundColor: color,
            borderRadius: lineHeight / 2,
          },
        ]}
      />

      {/* Bottom Left Corner */}
      <View
        style={[
          styles.corner,
          styles.bottomLeft,
          {
            width: cornerSize,
            height: cornerSize,
            borderBottomWidth: strokeWidth,
            borderLeftWidth: strokeWidth,
            borderColor: color,
            borderBottomLeftRadius: cornerRadius,
          },
        ]}
      />

      {/* Bottom Right Corner */}
      <View
        style={[
          styles.corner,
          styles.bottomRight,
          {
            width: cornerSize,
            height: cornerSize,
            borderBottomWidth: strokeWidth,
            borderRightWidth: strokeWidth,
            borderColor: color,
            borderBottomRightRadius: cornerRadius,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  corner: {
    position: 'absolute',
  },
  topLeft: {
    top: 0,
    left: 0,
  },
  topRight: {
    top: 0,
    right: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
  },
  scanLine: {
    position: 'absolute',
    alignSelf: 'center',
  },
});
