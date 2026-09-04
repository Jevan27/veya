import React from 'react';
import { Stack } from 'expo-router';
import { OnboardingProvider } from '../../features/onboarding/context/OnboardingContext';

export default function OnboardingLayout() {
  return (
    <OnboardingProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#FFFFFF' },
          animation: 'fade',
        }}
      />
    </OnboardingProvider>
  );
}
