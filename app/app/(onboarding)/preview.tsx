import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { OnboardingHeader } from '../../features/onboarding/components/OnboardingHeader';
import { CardPreview } from '../../features/onboarding/components/CardPreview';
import { AuthButton } from '../../features/auth/components/AuthButton';
import { useOnboarding } from '../../features/onboarding/context/OnboardingContext';

export default function PreviewScreen() {
  const router = useRouter();
  const {
    fullName,
    role,
    company,
    photoUri,
    phoneNumber,
    country,
    backgroundStyle,
    completeOnboarding,
    isSaving,
    error,
  } = useOnboarding();

  const handleCreateVeya = async () => {
    try {
      await completeOnboarding();
      router.replace('/(onboarding)/complete');
    } catch (err) {
      console.warn('[PreviewScreen] Failed to complete onboarding:', err);
      Alert.alert(
        'Setup Error',
        'We encountered an issue finalizing your profile. Please check your network and try again.',
      );
    }
  };

  const handleBack = () => {
    router.back();
  };

  const formattedPhone = phoneNumber.trim()
    ? `${country.dialCode} ${phoneNumber.trim()}`
    : undefined;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View>
            <OnboardingHeader
              title="Your Veya is taking shape."
              subtitle="Here is how your digital business card appears to anyone you connect with."
              currentStep={5}
              totalSteps={5}
              onBack={handleBack}
            />

            {/* Error Banner if any */}
            {!!error && (
              <View style={styles.errorBanner} accessibilityRole="alert">
                <Text style={styles.errorBannerText}>{error}</Text>
              </View>
            )}

            {/* Live Reactive Card Preview */}
            <CardPreview
              fullName={fullName}
              role={role}
              company={company}
              photoUri={photoUri}
              phoneNumber={formattedPhone}
              backgroundStyle={backgroundStyle}
            />
          </View>

          <View style={styles.footer}>
            <AuthButton
              title="Create my Veya"
              loadingTitle="Creating your Veya..."
              loading={isSaving}
              onPress={handleCreateVeya}
              style={styles.primaryButton}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
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
  errorBanner: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  errorBannerText: {
    fontSize: 13,
    color: '#DC2626',
    fontWeight: '500',
  },
  footer: {
    width: '100%',
    paddingTop: 20,
  },
  primaryButton: {
    backgroundColor: '#111111',
  },
});
