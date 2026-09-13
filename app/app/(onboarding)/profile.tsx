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
import { PhoneInput } from '../../features/onboarding/components/PhoneInput';
import { useOnboarding } from '../../features/onboarding/context/OnboardingContext';

export default function ProfileScreen() {
  const router = useRouter();
  const {
    fullName,
    setFullName,
    phoneNumber,
    setPhoneNumber,
    country,
    setCountry,
  } = useOnboarding();
  const [nameError, setNameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const handleContinue = () => {
    let hasError = false;
    const trimmedName = fullName.trim();
    if (!trimmedName) {
      setNameError('Please enter your full name');
      hasError = true;
    } else {
      setNameError(null);
    }

    const trimmedPhone = phoneNumber.trim();
    if (trimmedPhone && trimmedPhone.replace(/\D/g, '').length < 6) {
      setPhoneError('Please enter a valid phone number');
      hasError = true;
    } else {
      setPhoneError(null);
    }

    if (hasError) return;

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
                totalSteps={5}
                onBack={handleBack}
              />

              <AuthInput
                label="Full name"
                placeholder="Your full name (e.g. Alex Morgan)"
                value={fullName}
                onChangeText={(text) => {
                  setFullName(text);
                  if (nameError) setNameError(null);
                }}
                autoCapitalize="words"
                autoCorrect={false}
                autoFocus
                error={nameError}
              />

              <PhoneInput
                label="Phone number"
                placeholder="Mobile number (e.g. 917 555 0192)"
                value={phoneNumber}
                onChangeText={(text) => {
                  setPhoneNumber(text);
                  if (phoneError) setPhoneError(null);
                }}
                selectedCountry={country}
                onSelectCountry={setCountry}
                error={phoneError}
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
