import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { OnboardingHeader } from '../../features/onboarding/components/OnboardingHeader';
import { CardStyleSelector } from '../../features/onboarding/components/CardStyleSelector';
import { AuthButton } from '../../features/auth/components/AuthButton';
import { useOnboarding } from '../../features/onboarding/context/OnboardingContext';

export default function StyleScreen() {
  const router = useRouter();
  const { backgroundStyle, setBackgroundStyle } = useOnboarding();

  const handleContinue = () => {
    router.push('/(onboarding)/preview');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View>
            <OnboardingHeader
              title="Choose your card style."
              subtitle="Pick a visual background style for your card. You can customize colors and styles anytime."
              currentStep={4}
              totalSteps={5}
              onBack={handleBack}
            />

            <CardStyleSelector
              selectedStyle={backgroundStyle}
              onSelectStyle={setBackgroundStyle}
            />
          </View>

          <View style={styles.footer}>
            <AuthButton
              title="Continue"
              onPress={handleContinue}
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
  footer: {
    width: '100%',
    paddingTop: 16,
  },
  primaryButton: {
    backgroundColor: '#111111',
  },
});
