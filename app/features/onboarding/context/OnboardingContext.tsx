import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { usersApi } from '../../../services/api/users.api';
import { useAuth } from '../../auth/hooks/useAuth';
import { CountryItem, DEFAULT_COUNTRY } from '../constants/countries';

export interface OnboardingContextValue {
  fullName: string;
  setFullName: (name: string) => void;
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  country: CountryItem;
  setCountry: (country: CountryItem) => void;
  company: string;
  setCompany: (company: string) => void;
  role: string;
  setRole: (role: string) => void;
  photoUri: string | null;
  photoBase64: string | null;
  setPhoto: (uri: string | null, base64?: string | null) => void;
  setPhotoUri: (uri: string | null) => void;
  isSaving: boolean;
  error: string | null;
  clearError: () => void;
  completeOnboarding: () => Promise<void>;
  skipOnboarding: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateUser } = useAuth();

  const [fullName, setFullName] = useState<string>(user?.name || '');
  const [phoneNumber, setPhoneNumber] = useState<string>(user?.phoneNumber || '');
  const [country, setCountry] = useState<CountryItem>(DEFAULT_COUNTRY);
  const [company, setCompany] = useState<string>(user?.company || '');
  const [role, setRole] = useState<string>(user?.role || '');
  const [photoUri, setPhotoUri] = useState<string | null>(user?.avatarUrl || null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const setPhoto = useCallback((uri: string | null, base64?: string | null) => {
    setPhotoUri(uri);
    setPhotoBase64(base64 || null);
  }, []);

  const completeOnboarding = useCallback(async () => {
    setIsSaving(true);
    setError(null);
    try {
      let finalAvatarUrl = photoUri;

      // Upload to Cloudflare R2 if a new local photo was selected
      if (photoBase64) {
        try {
          const uploadRes = await usersApi.uploadProfilePhotoBase64(photoBase64);
          finalAvatarUrl = uploadRes.avatarUrl;
          setPhotoUri(uploadRes.avatarUrl);
        } catch (uploadErr) {
          console.warn('[OnboardingContext] Base64 upload to R2 failed:', uploadErr);
        }
      } else if (photoUri && !photoUri.startsWith('http://') && !photoUri.startsWith('https://')) {
        try {
          const uploadRes = await usersApi.uploadProfilePhoto(photoUri);
          finalAvatarUrl = uploadRes.avatarUrl;
          setPhotoUri(uploadRes.avatarUrl);
        } catch (uploadErr) {
          console.warn('[OnboardingContext] XHR upload to R2 failed:', uploadErr);
        }
      }

      const trimmedPhone = phoneNumber.trim();
      const formattedPhone = trimmedPhone ? `${country.dialCode} ${trimmedPhone}` : undefined;

      await usersApi.updateProfile({
        name: fullName.trim(),
        company: company.trim() || undefined,
        role: role.trim() || undefined,
        avatarUrl: finalAvatarUrl || undefined,
        phoneNumber: formattedPhone,
      });

      const response = await usersApi.completeOnboarding();
      updateUser(response.user);
    } catch (err) {
      console.warn('[OnboardingContext] Error completing onboarding:', err);
      const msg = err instanceof Error ? err.message : 'Failed to save profile. Please try again.';
      setError(msg);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [fullName, phoneNumber, country, company, role, photoUri, photoBase64, updateUser]);

  const skipOnboarding = useCallback(async () => {
    setIsSaving(true);
    setError(null);
    try {
      const response = await usersApi.completeOnboarding();
      updateUser(response.user);
    } catch (err) {
      console.warn('[OnboardingContext] Error skipping onboarding:', err);
    } finally {
      setIsSaving(false);
    }
  }, [updateUser]);

  const value = useMemo(
    () => ({
      fullName,
      setFullName,
      phoneNumber,
      setPhoneNumber,
      country,
      setCountry,
      company,
      setCompany,
      role,
      setRole,
      photoUri,
      photoBase64,
      setPhoto,
      setPhotoUri,
      isSaving,
      error,
      clearError,
      completeOnboarding,
      skipOnboarding,
    }),
    [
      fullName,
      phoneNumber,
      country,
      company,
      role,
      photoUri,
      photoBase64,
      setPhoto,
      isSaving,
      error,
      clearError,
      completeOnboarding,
      skipOnboarding,
    ],
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
};

export function useOnboarding(): OnboardingContextValue {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
