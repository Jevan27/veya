import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { OnboardingHeader } from '../../features/onboarding/components/OnboardingHeader';
import { AuthInput } from '../../features/auth/components/AuthInput';
import { AuthButton } from '../../features/auth/components/AuthButton';
import { useOnboarding } from '../../features/onboarding/context/OnboardingContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { fullName, setFullName } = useOnboarding();
  const [error, setError] = useState<string | null>(null);

  const handleContinue = () => {
    const trimmed = fullName.trim();
    if (!trimmed) {
      setError('Please enter your full name');
      return;
    }
    setError(null);
    router.push('/(onboarding)/professional');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <View>
              <OnboardingHeader
                title="Let's create your profile."
                subtitle="This information will become the foundation of your Veya identity."
                currentStep={1}
                totalSteps={4}
                onBack={handleBack}
              />

              <AuthInput
                label="Full name"
                placeholder="Your full name (e.g. Alex Morgan)"
                value={fullName}
                onChangeText={(text) => {
                  setFullName(text);
                  if (error) setError(null);
                }}
                autoCapitalize="words"
                autoCorrect={false}
                autoFocus
                error={error}
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
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
    paddingTop: 24,
  },
  primaryButton: {
    backgroundColor: '#111111',
  },
});
