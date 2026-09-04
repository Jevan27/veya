import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AuthHeader } from '../../features/auth/components/AuthHeader';
import { AuthInput } from '../../features/auth/components/AuthInput';
import { AuthButton } from '../../features/auth/components/AuthButton';
import { SocialButton } from '../../features/auth/components/SocialButton';
import { useAuth } from '../../features/auth/hooks/useAuth';

export default function SignupScreen() {
  const router = useRouter();
  const { register, isLoading, error: authError, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  const validate = (): boolean => {
    let isValid = true;
    setEmailError(null);
    setPasswordError(null);
    setConfirmError(null);
    clearError();

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmError('Please confirm your password');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmError('Passwords do not match');
      isValid = false;
    }

    return isValid;
  };

  const handleSignUp = async () => {
    if (!validate() || isLoading) return;

    try {
      await register({
        email: email.trim(),
        password,
      });
      router.replace('/(onboarding)/welcome');
    } catch {
      // Error is surfaced via AuthContext
    }
  };

  const handleGoogleSignUp = () => {
    Alert.alert(
      'Google Sign-Up',
      'Google OAuth registration will be available in an upcoming release.',
      [{ text: 'OK' }],
    );
  };

  const handleTermsPress = () => {
    Alert.alert(
      'Terms of Service',
      'By using Veya, you agree to our standard terms of service, acceptable use policies, and service agreements.',
      [{ text: 'Close' }],
    );
  };

  const handlePrivacyPress = () => {
    Alert.alert(
      'Privacy Policy',
      'Veya values your privacy and protects your personal data with enterprise-grade encryption.',
      [{ text: 'Close' }],
    );
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
          <View style={styles.contentWrapper}>
            <AuthHeader
              title="Create an account"
              subtitle="Get started with your email and password. You will personalize your profile next."
            />

            {/* Global Auth Error Alert */}
            {!!authError && (
              <View style={styles.errorBanner} accessibilityRole="alert">
                <Text style={styles.errorBannerText}>{authError}</Text>
              </View>
            )}

            <View style={styles.formContainer}>
              <AuthInput
                label="Email"
                placeholder="name@work-email.com"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (emailError) setEmailError(null);
                  if (authError) clearError();
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                error={emailError}
              />

              <AuthInput
                label="Password"
                placeholder="At least 8 characters"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (passwordError) setPasswordError(null);
                  if (authError) clearError();
                }}
                isPassword
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="new-password"
                error={passwordError}
              />

              <AuthInput
                label="Confirm password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (confirmError) setConfirmError(null);
                  if (authError) clearError();
                }}
                isPassword
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="new-password"
                error={confirmError}
              />

              {/* Primary Create Account Button */}
              <AuthButton
                title="Create account"
                loadingTitle="Creating account..."
                loading={isLoading}
                onPress={handleSignUp}
                style={styles.signUpButton}
              />

              {/* Minimal Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Continue with Google below Create Account Button */}
              <SocialButton
                onPress={handleGoogleSignUp}
                text="Continue with Google"
                style={styles.googleButton}
              />

              {/* Terms and Privacy Policy notice */}
              <View style={styles.legalContainer}>
                <Text style={styles.legalText}>
                  By creating an account, you agree to our{' '}
                  <Text style={styles.legalLink} onPress={handleTermsPress}>
                    Terms of Service
                  </Text>
                  {' '}and{' '}
                  <Text style={styles.legalLink} onPress={handlePrivacyPress}>
                    Privacy Policy
                  </Text>
                  .
                </Text>
              </View>
            </View>

            {/* Bottom Switch to Sign-In */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity
                onPress={() => router.push('/(auth)/login')}
                accessibilityRole="button"
                accessibilityLabel="Sign in to your account"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.footerLink}>Sign in</Text>
              </TouchableOpacity>
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
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 36,
    justifyContent: 'center',
  },
  contentWrapper: {
    maxWidth: 440,
    width: '100%',
    alignSelf: 'center',
  },
  formContainer: {
    width: '100%',
  },
  errorBanner: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  errorBannerText: {
    fontSize: 13,
    color: '#DC2626',
    fontWeight: '500',
    lineHeight: 18,
  },
  signUpButton: {
    marginTop: 6,
    marginBottom: 4,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  googleButton: {
    marginBottom: 20,
  },
  legalContainer: {
    paddingHorizontal: 8,
    marginBottom: 28,
  },
  legalText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#6B7280',
    textAlign: 'center',
  },
  legalLink: {
    color: '#111827',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    marginTop: 8,
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
});
