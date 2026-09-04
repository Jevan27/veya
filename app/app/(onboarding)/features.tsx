import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { OnboardingHeader } from '../../features/onboarding/components/OnboardingHeader';
import { AuthButton } from '../../features/auth/components/AuthButton';

interface FeatureItem {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  description: string;
}

const FEATURES: FeatureItem[] = [
  {
    icon: 'user-check',
    title: 'Share your identity',
    description: 'Create one professional profile with your essential information.',
  },
  {
    icon: 'share-2',
    title: 'Share anywhere',
    description: 'Use your Veya link or QR code at events, online, or in person.',
  },
  {
    icon: 'download',
    title: 'Save contacts instantly',
    description: 'Let people save your contact details directly to their phone.',
  },
  {
    icon: 'refresh-cw',
    title: 'Keep it up to date',
    description: 'Change your information anytime without reprinting anything.',
  },
];

export default function FeaturesScreen() {
  const router = useRouter();

  const handleContinue = () => {
    router.push('/(onboarding)/objective');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <OnboardingHeader
          title="Everything people need to connect with you."
          subtitle="One modern profile that works for every encounter."
          currentStep={1}
          totalSteps={3}
          onBack={handleBack}
        />

        {/* Feature List */}
        <ScrollView
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        >
          {FEATURES.map((item, index) => (
            <View key={index} style={styles.featureRow}>
              <View style={styles.iconBox}>
                <Feather name={item.icon} size={20} color="#111111" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
              </View>
            </View>
          ))}
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
  listContainer: {
    paddingVertical: 12,
    gap: 20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111111',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: '#6B6B6B',
    letterSpacing: -0.1,
  },
  footer: {
    width: '100%',
    paddingTop: 12,
  },
  primaryButton: {
    backgroundColor: '#111111',
  },
});
