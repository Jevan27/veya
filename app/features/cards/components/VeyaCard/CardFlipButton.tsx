import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Animated,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

export interface CardFlipButtonProps {
  isFlipped: boolean;
  onFlip: () => void;
  primaryColor?: string;
}

export const CardFlipButton: React.FC<CardFlipButtonProps> = ({
  isFlipped,
  onFlip,
  primaryColor = '#111111',
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(isFlipped ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(rotateAnim, {
      toValue: isFlipped ? 1 : 0,
      friction: 7,
      tension: 50,
      useNativeDriver: true,
    }).start();
  }, [isFlipped, rotateAnim]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.92,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const iconSpin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Pressable
          onPress={onFlip}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.iconButton}
          accessibilityRole="button"
          accessibilityLabel="Flip card"
          accessibilityHint="Flips between company brand and personal contact details"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Animated.View style={{ transform: [{ rotate: iconSpin }] }}>
            <Feather name="refresh-cw" size={17} color="#0F172A" />
          </Animated.View>
        </Pressable>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    // Soft premium shadow
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
});
