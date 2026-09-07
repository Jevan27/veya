import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { AuthButton } from '../../features/auth/components/AuthButton';
import { useOnboarding } from '../../features/onboarding/context/OnboardingContext';

export default function WelcomeScreen() {
  const router = useRouter();
  const { skipOnboarding } = useOnboarding();

  const handleGetStarted = () => {
    router.push('/(onboarding)/features');
  };

  const handleSkip = async () => {
    await skipOnboarding();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Brand Bar */}
        <View style={styles.topBar}>
          <View style={styles.brandRow}>
            <View style={styles.brandBadge}>
              <Text style={styles.brandBadgeText}>V</Text>
            </View>
            <Text style={styles.brandName}>veya</Text>
          </View>

          <TouchableOpacity
            onPress={handleSkip}
            accessibilityRole="button"
            accessibilityLabel="Skip onboarding"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Center Visual Minimal Graphic */}
        <View style={styles.centerGraphic}>
          <View style={styles.iconCircleOuter}>
            <View style={styles.iconCircleInner}>
              <Feather name="credit-card" size={40} color="#111111" />
            </View>
          </View>
          <View style={styles.graphicBadge}>
            <Feather name="user" size={14} color="#111111" />
            <Text style={styles.graphicBadgeText}>Digital Identity</Text>
          </View>
        </View>

        {/* Headline & Body Text */}
        <View style={styles.content}>
          <Text style={styles.headline}>
            Your digital identity,{'\n'}always ready to share.
          </Text>
          <Text style={styles.supportingText}>
            Veya gives you one simple place to share who you are, what you do, and how people can reach you.
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.footer}>
          <AuthButton
            title="Get started"
            onPress={handleGetStarted}
            style={styles.primaryButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    maxWidth: 440,
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandBadge: {
    width: 28,
    height: 28,
    borderRadius: 7,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandBadgeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  brandName: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.8,
    color: '#111111',
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B6B6B',
  },
  centerGraphic: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
  },
  iconCircleOuter: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FAFAFA',
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleInner: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  graphicBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginTop: -16,
  },
  graphicBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111111',
  },
  content: {
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  headline: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.8,
    color: '#111111',
    lineHeight: 38,
    marginBottom: 12,
  },
  supportingText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#6B6B6B',
    letterSpacing: -0.2,
  },
  footer: {
    width: '100%',
  },
  primaryButton: {
    backgroundColor: '#111111',
  },
});
