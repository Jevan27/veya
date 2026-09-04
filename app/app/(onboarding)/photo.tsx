import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { OnboardingHeader } from '../../features/onboarding/components/OnboardingHeader';
import { ProfilePhotoPicker } from '../../features/onboarding/components/ProfilePhotoPicker';
import { AuthButton } from '../../features/auth/components/AuthButton';
import { useOnboarding } from '../../features/onboarding/context/OnboardingContext';

export default function PhotoScreen() {
  const router = useRouter();
  const { photoUri, setPhoto, setPhotoUri } = useOnboarding();

  const handleContinue = () => {
    router.push('/(onboarding)/preview');
  };

  const handleSkip = () => {
    setPhoto(null, null);
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
              title="Add a photo people will recognize."
              subtitle="A profile photo makes your Veya easier to recognize when connecting for the first time."
              currentStep={3}
              totalSteps={4}
              onBack={handleBack}
            />

            <ProfilePhotoPicker
              photoUri={photoUri}
              onPhotoSelected={setPhoto}
            />
          </View>

          <View style={styles.footer}>
            <AuthButton
              title="Continue"
              onPress={handleContinue}
              style={styles.primaryButton}
            />

            {!photoUri && (
              <TouchableOpacity
                onPress={handleSkip}
                style={styles.skipButton}
                accessibilityRole="button"
                accessibilityLabel="Skip adding photo"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.skipText}>Skip for now</Text>
              </TouchableOpacity>
            )}
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
    paddingTop: 24,
  },
  primaryButton: {
    backgroundColor: '#111111',
  },
  skipButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginTop: 8,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B6B6B',
  },
});
