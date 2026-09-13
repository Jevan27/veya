import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

export interface CardVisibilityButtonProps {
  isPublished: boolean;
  onToggle: () => void;
  isLoading?: boolean;
}

export const CardVisibilityButton: React.FC<CardVisibilityButtonProps> = ({
  isPublished,
  onToggle,
  isLoading = false,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

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

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Pressable
          onPress={onToggle}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={isLoading}
          style={[styles.iconButton, !isPublished && styles.iconButtonPrivate]}
          accessibilityRole="button"
          accessibilityLabel={isPublished ? 'Make card private' : 'Make card public'}
          accessibilityHint={
            isPublished
              ? 'Hides your card details from public viewers'
              : 'Makes your card visible to public viewers'
          }
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#0F172A" />
          ) : (
            <Feather
              name={isPublished ? 'eye' : 'eye-off'}
              size={17}
              color="#0F172A"
            />
          )}
        </Pressable>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
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
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  iconButtonPrivate: {
    backgroundColor: '#F8FAFC',
    borderColor: '#CBD5E1',
  },
});
