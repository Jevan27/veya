import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { OnboardingHeader } from '../../features/onboarding/components/OnboardingHeader';
import { AuthButton } from '../../features/auth/components/AuthButton';

interface FlowStep {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  caption: string;
}

const FLOW_STEPS: FlowStep[] = [
  {
    icon: 'users',
    title: 'Business Meeting',
    caption: 'You meet a colleague or client in person or online.',
  },
  {
    icon: 'maximize',
    title: 'QR Code or Link',
    caption: 'Share your card in one scan without requiring any app.',
  },
  {
    icon: 'credit-card',
    title: 'Veya Profile',
    caption: 'They instantly see who you are, what you do, and your work.',
  },
  {
    icon: 'check-circle',
    title: 'Save Contact',
    caption: 'Your phone, email, and social profiles save directly to their contacts.',
  },
];

export default function ObjectiveScreen() {
  const router = useRouter();

  const handleContinue = () => {
    router.push('/(onboarding)/profile');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <OnboardingHeader
          title="Networking shouldn't end with a piece of paper."
          subtitle="Traditional cards get lost or discarded. Veya turns that moment into a lasting connection."
          currentStep={2}
          totalSteps={3}
          onBack={handleBack}
        />

        {/* Step-by-step Flow Visualizer */}
        <ScrollView
          contentContainerStyle={styles.flowContainer}
          showsVerticalScrollIndicator={false}
        >
          {FLOW_STEPS.map((step, idx) => {
            const isLast = idx === FLOW_STEPS.length - 1;
            return (
              <View key={idx} style={styles.stepBlock}>
                <View style={styles.leftColumn}>
                  <View style={styles.stepDot}>
                    <Feather name={step.icon} size={16} color="#111111" />
                  </View>
                  {!isLast && <View style={styles.connectingLine} />}
                </View>

                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepCaption}>{step.caption}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* Footer Action */}
        <View style={styles.footer}>
          <AuthButton
            title="Continue"
            onPress={handleContinue}
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
  flowContainer: {
    paddingVertical: 8,
  },
  stepBlock: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  leftColumn: {
    alignItems: 'center',
    width: 36,
  },
  stepDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FAFAFA',
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  connectingLine: {
    width: 1.5,
    height: 44,
    backgroundColor: '#E8E8E8',
    marginVertical: 2,
  },
  stepContent: {
    flex: 1,
    paddingBottom: 24,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111111',
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  stepCaption: {
    fontSize: 13,
    lineHeight: 18,
    color: '#6B6B6B',
  },
  footer: {
    width: '100%',
    paddingTop: 12,
  },
  primaryButton: {
    backgroundColor: '#111111',
  },
});
