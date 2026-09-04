import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { AuthButton } from '../../features/auth/components/AuthButton';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { useOnboarding } from '../../features/onboarding/context/OnboardingContext';

export default function CompleteScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { fullName } = useOnboarding();

  const handle = (fullName || user?.name || user?.email?.split('@')[0] || 'card')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

  const shareUrl = `veya.app/${handle}`;

  const handleGoToDashboard = () => {
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Success Badge */}
        <View style={styles.header}>
          <View style={styles.successCircle}>
            <Feather name="check" size={28} color="#111111" />
          </View>
          <Text style={styles.headline}>You're ready to connect.</Text>
          <Text style={styles.supportingText}>
            Your digital business card is live and ready to share anywhere.
          </Text>
        </View>

        {/* Shareable Card Box */}
        <View style={styles.shareCard}>
          {/* QR Code Placeholder Box */}
          <View style={styles.qrContainer}>
            <View style={styles.qrBox}>
              <Feather name="grid" size={72} color="#111111" />
              <View style={styles.qrBadge}>
                <Text style={styles.qrBadgeText}>QR READY</Text>
              </View>
            </View>
          </View>

          {/* Shareable URL Badge */}
          <View style={styles.urlContainer}>
            <Feather name="link-2" size={16} color="#6B6B6B" />
            <Text style={styles.urlText} numberOfLines={1}>
              {shareUrl}
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.footer}>
          <AuthButton
            title="Go to dashboard"
            onPress={handleGoToDashboard}
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
    paddingTop: 32,
    paddingBottom: 24,
    maxWidth: 440,
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    width: '100%',
  },
  successCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FAFAFA',
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  headline: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.7,
    color: '#111111',
    marginBottom: 8,
    textAlign: 'center',
  },
  supportingText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#6B6B6B',
    textAlign: 'center',
    maxWidth: 320,
  },
  shareCard: {
    width: '100%',
    backgroundColor: '#FAFAFA',
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginVertical: 20,
  },
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  qrBox: {
    width: 140,
    height: 140,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  qrBadge: {
    position: 'absolute',
    bottom: 8,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  qrBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B6B6B',
    letterSpacing: 0.5,
  },
  urlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    width: '100%',
    justifyContent: 'center',
  },
  urlText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111111',
    letterSpacing: -0.2,
  },
  footer: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#111111',
  },
});
