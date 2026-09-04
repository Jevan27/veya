import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AuthHeader } from '../../features/auth/components/AuthHeader';
import { AuthInput } from '../../features/auth/components/AuthInput';
import { AuthButton } from '../../features/auth/components/AuthButton';
import { authApi } from '../../services/api/auth.api';

export default function ForgotPasswordScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  const validate = (): boolean => {
    setEmailError(null);
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setEmailError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSendResetLink = async () => {
    if (!validate() || isLoading) return;

    setIsLoading(true);
    setSubmittedMessage(null);
    try {
      const res = await authApi.forgotPassword({ email: email.trim() });
      setSubmittedMessage(res.message);
    } catch {
      // Safe fallback message
      setSubmittedMessage(
        'If an account with this email exists, a password reset link has been sent.',
      );
    } finally {
      setIsLoading(false);
    }
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
          <AuthHeader
            title="Reset password"
            subtitle="Enter your email to receive password reset instructions."
          />

          {!!submittedMessage ? (
            <View style={styles.successCard}>
              <Text style={styles.successTitle}>Check your inbox</Text>
              <Text style={styles.successText}>{submittedMessage}</Text>
              <Text style={styles.devNote}>
                Note: In development, email delivery is logged to the server console.
              </Text>
              <AuthButton
                title="Back to sign in"
                onPress={() => router.push('/(auth)/login')}
                style={styles.backButton}
              />
            </View>
          ) : (
            <>
              <AuthInput
                label="Email"
                placeholder="you@example.com"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (emailError) setEmailError(null);
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                error={emailError}
              />

              <AuthButton
                title="Send reset link"
                loadingTitle="Sending link..."
                loading={isLoading}
                onPress={handleSendResetLink}
                style={styles.submitButton}
              />

              <View style={styles.footer}>
                <TouchableOpacity
                  onPress={() => router.push('/(auth)/login')}
                  accessibilityRole="button"
                  accessibilityLabel="Return to sign in"
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={styles.footerLink}>Back to sign in</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
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
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    justifyContent: 'center',
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  submitButton: {
    marginTop: 4,
    marginBottom: 24,
  },
  footer: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingVertical: 12,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111111',
  },
  successCard: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 8,
  },
  successText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#6B6B6B',
    textAlign: 'center',
    marginBottom: 12,
  },
  devNote: {
    fontSize: 12,
    color: '#A1A1A1',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 20,
  },
  backButton: {
    width: '100%',
  },
});
