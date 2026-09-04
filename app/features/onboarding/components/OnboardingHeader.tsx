import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface OnboardingHeaderProps {
  title: string;
  subtitle: string;
  currentStep?: number;
  totalSteps?: number;
  onBack?: () => void;
  showBack?: boolean;
}

export const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({
  title,
  subtitle,
  currentStep,
  totalSteps,
  onBack,
  showBack = true,
}) => {
  return (
    <View style={styles.container}>
      {/* Top Nav Row: Back & Step Indicator */}
      <View style={styles.topRow}>
        {showBack && onBack ? (
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Feather name="arrow-left" size={20} color="#111111" />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}

        {currentStep && totalSteps ? (
          <View style={styles.progressContainer}>
            <Text style={styles.stepText}>
              {currentStep} / {totalSteps}
            </Text>
          </View>
        ) : null}
      </View>

      {/* Title & Subtitle */}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 28,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 36,
    marginBottom: 20,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    width: 36,
    height: 36,
  },
  progressContainer: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  stepText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B6B6B',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.6,
    color: '#111111',
    marginBottom: 8,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: '#6B6B6B',
    letterSpacing: -0.2,
  },
});
