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
import { RoleCombobox } from '../../features/onboarding/components/RoleCombobox';
import { AuthButton } from '../../features/auth/components/AuthButton';
import { useOnboarding } from '../../features/onboarding/context/OnboardingContext';

export default function ProfessionalScreen() {
  const router = useRouter();
  const { company, setCompany, role, setRole } = useOnboarding();
  const [roleError, setRoleError] = useState<string | null>(null);

  const handleContinue = () => {
    const trimmedRole = role.trim();
    if (!trimmedRole) {
      setRoleError('Please specify what you do or select a suggested role');
      return;
    }
    setRoleError(null);
    router.push('/(onboarding)/photo');
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
                title="Tell people what you do."
                subtitle="Your professional information helps people understand who they're connecting with."
                currentStep={2}
                totalSteps={5}
                onBack={handleBack}
              />

              {/* Role Combobox (Required, customizable) */}
              <RoleCombobox
                value={role}
                onChangeText={(text) => {
                  setRole(text);
                  if (roleError) setRoleError(null);
                }}
                error={roleError}
              />

              {/* Business / Company (Optional) */}
              <AuthInput
                label="Company / Business (optional)"
                placeholder="Where do you work or your brand name"
                value={company}
                onChangeText={setCompany}
                autoCapitalize="words"
                autoCorrect={false}
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
