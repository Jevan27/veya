import { useState, useEffect, useMemo, useCallback } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { UserDto, SocialLinkDto, CardBackgroundStyle } from '@veya/shared';
import { EditCardData, EditCardTab } from '../types/card-form.types';
import { formatCardPhone } from '../utils/phone-format';

interface UseCardFormOptions {
  visible: boolean;
  cardData: EditCardData;
  onSave: (updatedData: EditCardData) => Promise<void> | void;
  onSuccess: () => void;
}

const ALLOWED_LOGO_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export function useCardForm({ visible, cardData, onSave, onSuccess }: UseCardFormOptions) {
  const [name, setName] = useState(cardData.name);
  const [role, setRole] = useState(cardData.role);
  const [company, setCompany] = useState(cardData.company);
  const [slogan, setSlogan] = useState(cardData.slogan);
  const [phoneNumber, setPhoneNumber] = useState(cardData.phoneNumber);
  const [email, setEmail] = useState(cardData.email);
  const [location, setLocation] = useState(cardData.location);
  const [website, setWebsite] = useState(cardData.website);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(cardData.avatarUrl);
  const [companyLogoUrl, setCompanyLogoUrl] = useState<string | null>(cardData.companyLogoUrl);
  const [primaryColor, setPrimaryColor] = useState(cardData.primaryColor || '#111111');
  const [cardBackgroundColor, setCardBackgroundColor] = useState(cardData.cardBackgroundColor || '#FFFFFF');
  const [fontFamily, setFontFamily] = useState(cardData.fontFamily || 'inter');
  const [backgroundStyle, setBackgroundStyle] = useState<CardBackgroundStyle>(cardData.backgroundStyle || 'minimal');
  const [socialLinks, setSocialLinks] = useState<SocialLinkDto[]>(cardData.socialLinks || []);
  const [activeTab, setActiveTab] = useState<EditCardTab>('personal');
  const [isSaving, setIsSaving] = useState(false);

  // Sync state when modal opens with latest cardData
  useEffect(() => {
    if (visible) {
      setActiveTab('personal');
      setName(cardData.name);
      setRole(cardData.role);
      setCompany(cardData.company);
      setSlogan(cardData.slogan);
      setPhoneNumber(cardData.phoneNumber);
      setEmail(cardData.email);
      setLocation(cardData.location);
      setWebsite(cardData.website);
      setAvatarUrl(cardData.avatarUrl);
      setCompanyLogoUrl(cardData.companyLogoUrl);
      setPrimaryColor(cardData.primaryColor || '#111111');
      setCardBackgroundColor(cardData.cardBackgroundColor || '#FFFFFF');
      setFontFamily(cardData.fontFamily || 'inter');
      setBackgroundStyle(cardData.backgroundStyle || 'minimal');
      setSocialLinks(cardData.socialLinks || []);
    }
  }, [visible, cardData]);

  // Derived initials for fallback avatar
  const initials = useMemo(() => {
    return (
      name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0].toUpperCase())
        .join('') || 'V'
    );
  }, [name]);

  const handlePickAvatar = useCallback(async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission required', 'Access to your photo library is required to choose a profile photo.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        const asset = result.assets[0];
        if (asset.fileSize && asset.fileSize > MAX_IMAGE_SIZE) {
          Alert.alert('File too large', 'Please choose an image under 5MB.');
          return;
        }
        setAvatarUrl(asset.uri);
      }
    } catch (err) {
      console.warn('[EditCard] Avatar picker error:', err);
    }
  }, []);

  const handlePickCompanyLogo = useCallback(async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission required', 'Access to your photo library is required to choose a company logo.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        const asset = result.assets[0];
        if (asset.fileSize && asset.fileSize > MAX_IMAGE_SIZE) {
          Alert.alert('File too large', 'Please choose an image under 5MB.');
          return;
        }
        const ext = asset.uri.split('.').pop()?.toLowerCase();
        if (ext && !ALLOWED_LOGO_EXTENSIONS.includes(ext)) {
          Alert.alert('Invalid format', 'Only image files (JPG, PNG, WebP, SVG, GIF) are allowed.');
          return;
        }
        setCompanyLogoUrl(asset.uri);
      }
    } catch (err) {
      console.warn('[EditCard] Company logo picker error:', err);
    }
  }, []);

  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true);
      await onSave({
        name,
        role,
        company,
        slogan,
        phoneNumber: formatCardPhone(phoneNumber, ''),
        email,
        location,
        website,
        avatarUrl,
        companyLogoUrl,
        primaryColor,
        cardBackgroundColor,
        fontFamily,
        backgroundStyle,
        socialLinks,
      });
      onSuccess();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Could not save card changes. Please try again.';
      Alert.alert('Save Error', errorMessage);
    } finally {
      setIsSaving(false);
    }
  }, [
    name,
    role,
    company,
    slogan,
    phoneNumber,
    email,
    location,
    website,
    avatarUrl,
    companyLogoUrl,
    primaryColor,
    cardBackgroundColor,
    fontFamily,
    backgroundStyle,
    socialLinks,
    onSave,
    onSuccess,
  ]);

  // Mock user for live preview
  const previewUser: UserDto = useMemo(
    () => ({
      id: 'preview',
      name,
      role,
      company,
      phoneNumber: formatCardPhone(phoneNumber, ''),
      email,
      avatarUrl,
      onboardingCompleted: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }),
    [name, role, company, phoneNumber, email, avatarUrl]
  );

  return {
    formState: {
      name,
      role,
      company,
      slogan,
      phoneNumber,
      email,
      location,
      website,
      avatarUrl,
      companyLogoUrl,
      primaryColor,
      cardBackgroundColor,
      fontFamily,
      backgroundStyle,
      socialLinks,
    },
    setters: {
      setName,
      setRole,
      setCompany,
      setSlogan,
      setPhoneNumber,
      setEmail,
      setLocation,
      setWebsite,
      setAvatarUrl,
      setCompanyLogoUrl,
      setPrimaryColor,
      setCardBackgroundColor,
      setFontFamily,
      setBackgroundStyle,
      setSocialLinks,
    },
    activeTab,
    setActiveTab,
    isSaving,
    initials,
    previewUser,
    handlePickAvatar,
    handlePickCompanyLogo,
    handleSave,
  };
}
