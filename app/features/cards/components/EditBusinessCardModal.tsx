import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Animated,
  PanResponder,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { VeyaBusinessCard } from './VeyaBusinessCard';
import { UserDto } from '@veya/shared';

export interface EditBusinessCardData {
  name: string;
  role: string;
  company: string;
  slogan: string;
  phoneNumber: string;
  email: string;
  location: string;
  website: string;
  avatarUrl: string | null;
  companyLogoUrl: string | null;
  primaryColor: string;
  cardBackgroundColor: string;
}

export interface EditBusinessCardModalProps {
  visible: boolean;
  onClose: () => void;
  cardData: EditBusinessCardData;
  onSave: (updatedData: EditBusinessCardData) => Promise<void> | void;
}

const PRIMARY_COLORS = [
  { name: 'Pure Black', hex: '#111111' },
  { name: 'Indigo', hex: '#4F46E5' },
  { name: 'Royal Blue', hex: '#2563EB' },
  { name: 'Sky Cyan', hex: '#0284C7' },
  { name: 'Emerald', hex: '#059669' },
  { name: 'Purple', hex: '#7C3AED' },
  { name: 'Rose', hex: '#E11D48' },
  { name: 'Amber', hex: '#D97706' },
  { name: 'Slate Gray', hex: '#64748B' },
  { name: 'Obsidian', hex: '#0F172A' },
];

const BACKGROUND_COLORS = [
  { name: 'Pure White', hex: '#FFFFFF', isDark: false },
  { name: 'Cool Slate', hex: '#F8FAFC', isDark: false },
  { name: 'Warm Cream', hex: '#FAF8F5', isDark: false },
  { name: 'Obsidian Black', hex: '#0F172A', isDark: true },
  { name: 'Midnight Navy', hex: '#0B132B', isDark: true },
  { name: 'Deep Indigo', hex: '#1E1B4B', isDark: true },
  { name: 'Pure Black', hex: '#000000', isDark: true },
];

export const EditBusinessCardModal: React.FC<EditBusinessCardModalProps> = ({
  visible,
  onClose,
  cardData,
  onSave,
}) => {
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
  const [activeTab, setActiveTab] = useState<'personal' | 'contact' | 'preview'>('personal');
  const [isSaving, setIsSaving] = useState(false);

  // Animated translateY for dragging down/up
  const translateY = useRef(new Animated.Value(700)).current;

  // Fade backdrop in/out together with sheet movement
  const backdropOpacity = translateY.interpolate({
    inputRange: [0, 500],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const handleDismiss = () => {
    Animated.timing(translateY, {
      toValue: 700,
      duration: 220,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 4;
      },
      onPanResponderGrant: () => {
        translateY.extractOffset();
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy < 0) {
          // Upward drag with rubber-band resistance
          translateY.setValue(gestureState.dy * 0.2);
        } else {
          // Downward drag follows finger directly
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        translateY.flattenOffset();
        // If dragged down past 100px or with downward velocity, dismiss completely
        if (gestureState.dy > 100 || gestureState.vy > 0.5) {
          Animated.timing(translateY, {
            toValue: 700,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            onClose();
          });
        } else {
          // Snap back up smoothly
          Animated.spring(translateY, {
            toValue: 0,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  // Sync state and animate sheet up when modal opens
  useEffect(() => {
    if (visible) {
      translateY.setValue(700);
      Animated.spring(translateY, {
        toValue: 0,
        friction: 9,
        tension: 45,
        useNativeDriver: true,
      }).start();

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
    }
  }, [visible, cardData]);

  // Fallback initials
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('') || 'V';

  const handlePickAvatar = async () => {
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
        if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
          Alert.alert('File too large', 'Please choose an image under 5MB.');
          return;
        }
        setAvatarUrl(asset.uri);
      }
    } catch (err) {
      console.warn('[EditCard] Avatar picker error:', err);
    }
  };

  const handlePickCompanyLogo = async () => {
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
        if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
          Alert.alert('File too large', 'Please choose an image under 5MB.');
          return;
        }
        const ext = asset.uri.split('.').pop()?.toLowerCase();
        if (ext && !['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif'].includes(ext)) {
          Alert.alert('Invalid format', 'Only image files (JPG, PNG, WebP, SVG, GIF) are allowed.');
          return;
        }
        setCompanyLogoUrl(asset.uri);
      }
    } catch (err) {
      console.warn('[EditCard] Company logo picker error:', err);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave({
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
      });
      handleDismiss();
    } catch (err: any) {
      Alert.alert('Save Error', err?.message || 'Could not save card changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Construct mock user for the live miniature preview
  const previewUser: UserDto = {
    id: 'preview',
    name,
    role,
    company,
    phoneNumber,
    email,
    avatarUrl,
    onboardingCompleted: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent
      onRequestClose={handleDismiss}
    >
      <Animated.View style={[styles.modalBackdrop, { opacity: backdropOpacity }]}>
        {/* Tap outside modal to close */}
        <TouchableWithoutFeedback onPress={handleDismiss}>
          <View style={styles.backdropDismissArea} />
        </TouchableWithoutFeedback>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardAvoid}
          pointerEvents="box-none"
        >
          <Animated.View
            style={[
              styles.sheetContainer,
              {
                transform: [{ translateY }],
              },
            ]}
          >
            {/* Top Drag Area (Drag Handle + Header) */}
            <View {...panResponder.panHandlers} style={styles.dragArea}>
              <View style={styles.dragHandleHitSlop}>
                <View style={styles.dragHandle} />
              </View>

              {/* Modal Header */}
              <View style={styles.headerRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sheetTitle}>Edit Business Card</Text>
                  <Text style={styles.sheetSubtitle}>
                    Update your information below. Changes will be reflected on your card immediately.
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={handleDismiss}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  style={styles.closeButton}
                  accessibilityLabel="Close edit modal"
                >
                  <Feather name="x" size={20} color="#0F172A" />
                </TouchableOpacity>
              </View>
            </View>

            {/* ──────────────── 3 STICKY TABS ──────────────── */}
            <View style={styles.tabBarContainer}>
              <TouchableOpacity
                style={[styles.tabButton, activeTab === 'personal' && styles.tabButtonActive]}
                onPress={() => setActiveTab('personal')}
                activeOpacity={0.75}
              >
                <Feather
                  name="user"
                  size={14}
                  color={activeTab === 'personal' ? '#FFFFFF' : '#64748B'}
                />
                <Text
                  style={[
                    styles.tabButtonText,
                    activeTab === 'personal' && styles.tabButtonTextActive,
                  ]}
                >
                  Personal
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabButton, activeTab === 'contact' && styles.tabButtonActive]}
                onPress={() => setActiveTab('contact')}
                activeOpacity={0.75}
              >
                <Feather
                  name="phone"
                  size={14}
                  color={activeTab === 'contact' ? '#FFFFFF' : '#64748B'}
                />
                <Text
                  style={[
                    styles.tabButtonText,
                    activeTab === 'contact' && styles.tabButtonTextActive,
                  ]}
                >
                  Contact
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabButton, activeTab === 'preview' && styles.tabButtonActive]}
                onPress={() => setActiveTab('preview')}
                activeOpacity={0.75}
              >
                <Feather
                  name="eye"
                  size={14}
                  color={activeTab === 'preview' ? '#FFFFFF' : '#64748B'}
                />
                <Text
                  style={[
                    styles.tabButtonText,
                    activeTab === 'preview' && styles.tabButtonTextActive,
                  ]}
                >
                  Preview & Style
                </Text>
              </TouchableOpacity>
            </View>

            {/* Scrollable Form Content */}
            <ScrollView
              style={styles.scrollArea}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* ──────────────── TAB 1: PERSONAL DETAILS ──────────────── */}
              {activeTab === 'personal' && (
                <>
                  {/* Media Uploads Row: Profile Photo & Company Logo Cards */}
                  <View style={styles.mediaRow}>
                    {/* Profile Photo Card */}
                    <TouchableOpacity
                      style={styles.mediaCard}
                      onPress={handlePickAvatar}
                      activeOpacity={0.8}
                    >
                      <View style={styles.avatarCircleWrapper}>
                        {avatarUrl ? (
                          <Image source={{ uri: avatarUrl }} style={styles.avatarCircleImage} />
                        ) : (
                          <View style={styles.avatarCircleFallback}>
                            <Text style={styles.avatarCircleInitials}>{initials}</Text>
                          </View>
                        )}
                        <View style={styles.cameraBadge}>
                          <Feather name="camera" size={12} color="#FFFFFF" />
                        </View>
                      </View>
                      <Text style={styles.mediaCardTitle}>Profile Photo</Text>
                      <Text style={styles.mediaCardSubtitle}>Tap to change</Text>
                    </TouchableOpacity>

                    {/* Company Logo Card */}
                    <TouchableOpacity
                      style={styles.mediaCard}
                      onPress={handlePickCompanyLogo}
                      activeOpacity={0.8}
                    >
                      <View style={styles.logoSquircleWrapper}>
                        {companyLogoUrl ? (
                          <Image source={{ uri: companyLogoUrl }} style={styles.logoSquircleImage} resizeMode="contain" />
                        ) : (
                          <View style={styles.logoSquircleFallback}>
                            <Text style={styles.logoLetter}>v</Text>
                          </View>
                        )}
                        <View style={styles.cameraBadge}>
                          <Feather name="camera" size={12} color="#FFFFFF" />
                        </View>
                      </View>
                      <Text style={styles.mediaCardTitle}>Company Logo</Text>
                      <Text style={styles.mediaCardSubtitle}>Tap to change</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Full Name */}
                  <View style={styles.formFieldContainer}>
                    <View style={styles.fieldLabelRow}>
                      <Feather name="user" size={15} color="#64748B" style={styles.fieldIcon} />
                      <Text style={styles.fieldLabel}>Full Name</Text>
                    </View>
                    <TextInput
                      style={styles.textInput}
                      value={name}
                      onChangeText={setName}
                      placeholder="e.g. Jevan Campillos"
                      placeholderTextColor="#94A3B8"
                      autoCapitalize="words"
                    />
                  </View>

                  {/* Job Title / Role */}
                  <View style={styles.formFieldContainer}>
                    <View style={styles.fieldLabelRow}>
                      <Feather name="briefcase" size={15} color="#64748B" style={styles.fieldIcon} />
                      <Text style={styles.fieldLabel}>Job Title / Role</Text>
                    </View>
                    <TextInput
                      style={styles.textInput}
                      value={role}
                      onChangeText={setRole}
                      placeholder="e.g. Full-Stack Developer"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>

                  {/* Company Name */}
                  <View style={styles.formFieldContainer}>
                    <View style={styles.fieldLabelRow}>
                      <Feather name="grid" size={15} color="#64748B" style={styles.fieldIcon} />
                      <Text style={styles.fieldLabel}>Company Name</Text>
                    </View>
                    <TextInput
                      style={styles.textInput}
                      value={company}
                      onChangeText={setCompany}
                      placeholder="e.g. Veya"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>

                  {/* Slogan / Tagline */}
                  <View style={styles.formFieldContainer}>
                    <View style={styles.fieldLabelRow}>
                      <Feather name="message-square" size={15} color="#64748B" style={styles.fieldIcon} />
                      <Text style={styles.fieldLabel}>Slogan / Tagline</Text>
                    </View>
                    <TextInput
                      style={styles.textInput}
                      value={slogan}
                      onChangeText={setSlogan}
                      placeholder="e.g. PEOPLE&#10;IDEAS&#10;OPPORTUNITIES&#10;CONNECTED"
                      placeholderTextColor="#94A3B8"
                      multiline
                    />
                  </View>
                </>
              )}

              {/* ──────────────── TAB 2: CONTACT DETAILS ──────────────── */}
              {activeTab === 'contact' && (
                <>
                  {/* Phone Number with Flag selector */}
                  <View style={styles.formFieldContainer}>
                    <View style={styles.fieldLabelRow}>
                      <Feather name="phone" size={15} color="#64748B" style={styles.fieldIcon} />
                      <Text style={styles.fieldLabel}>Phone Number</Text>
                    </View>
                    <View style={styles.phoneInputRow}>
                      <View style={styles.countryCodePill}>
                        <Text style={styles.flagEmoji}>🇵🇭</Text>
                        <Feather name="chevron-down" size={13} color="#64748B" style={{ marginLeft: 3 }} />
                      </View>
                      <TextInput
                        style={styles.phoneTextInput}
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        keyboardType="phone-pad"
                        placeholder="+63 912 345 6789"
                        placeholderTextColor="#94A3B8"
                      />
                    </View>
                  </View>

                  {/* Email Address */}
                  <View style={styles.formFieldContainer}>
                    <View style={styles.fieldLabelRow}>
                      <Feather name="mail" size={15} color="#64748B" style={styles.fieldIcon} />
                      <Text style={styles.fieldLabel}>Email Address</Text>
                    </View>
                    <TextInput
                      style={styles.textInput}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      placeholder="e.g. jevan@veya.app"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>

                  {/* Location */}
                  <View style={styles.formFieldContainer}>
                    <View style={styles.fieldLabelRow}>
                      <Feather name="map-pin" size={15} color="#64748B" style={styles.fieldIcon} />
                      <Text style={styles.fieldLabel}>Location</Text>
                    </View>
                    <TextInput
                      style={styles.textInput}
                      value={location}
                      onChangeText={setLocation}
                      placeholder="e.g. Caloocan, Metro Manila, Philippines"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>

                  {/* Website */}
                  <View style={styles.formFieldContainer}>
                    <View style={styles.fieldLabelRow}>
                      <Feather name="globe" size={15} color="#64748B" style={styles.fieldIcon} />
                      <Text style={styles.fieldLabel}>Website</Text>
                    </View>
                    <TextInput
                      style={styles.textInput}
                      value={website}
                      onChangeText={setWebsite}
                      keyboardType="url"
                      autoCapitalize="none"
                      placeholder="e.g. https://www.veya.app"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>
                </>
              )}

              {/* ──────────────── TAB 3: PREVIEW & STYLE ──────────────── */}
              {activeTab === 'preview' && (
                <>
                  {/* Primary Accent Color */}
                  <View style={styles.colorSectionContainer}>
                    <View style={styles.fieldLabelRow}>
                      <Feather name="droplet" size={15} color="#64748B" style={styles.fieldIcon} />
                      <Text style={styles.fieldLabel}>Primary Accent Color</Text>
                    </View>
                    <View style={styles.swatchRow}>
                      {PRIMARY_COLORS.map((c) => {
                        const isSelected = primaryColor.toLowerCase() === c.hex.toLowerCase();
                        return (
                          <TouchableOpacity
                            key={c.hex}
                            onPress={() => setPrimaryColor(c.hex)}
                            style={[
                              styles.swatchCircle,
                              { backgroundColor: c.hex },
                              isSelected && styles.swatchCircleActive,
                            ]}
                            activeOpacity={0.8}
                          >
                            {isSelected && <Feather name="check" size={13} color="#FFFFFF" strokeWidth={3} />}
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>

                  {/* Card Background Color */}
                  <View style={styles.colorSectionContainer}>
                    <View style={styles.fieldLabelRow}>
                      <Feather name="layers" size={15} color="#64748B" style={styles.fieldIcon} />
                      <Text style={styles.fieldLabel}>Card Background Color</Text>
                    </View>
                    <View style={styles.swatchRow}>
                      {BACKGROUND_COLORS.map((c) => {
                        const isSelected = cardBackgroundColor.toLowerCase() === c.hex.toLowerCase();
                        return (
                          <TouchableOpacity
                            key={c.hex}
                            onPress={() => setCardBackgroundColor(c.hex)}
                            style={[
                              styles.swatchCircle,
                              { backgroundColor: c.hex },
                              !c.isDark && styles.swatchCircleLightBorder,
                              isSelected && styles.swatchCircleActive,
                            ]}
                            activeOpacity={0.8}
                          >
                            {isSelected && (
                              <Feather
                                name="check"
                                size={13}
                                color={c.isDark ? '#FFFFFF' : '#0F172A'}
                                strokeWidth={3}
                              />
                            )}
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>

                  {/* Preview Section Header */}
                  <View style={styles.previewSectionHeader}>
                    <View>
                      <Text style={styles.previewTitle}>Live Card Preview</Text>
                      <Text style={styles.previewSubtitle}>This is how your card will look.</Text>
                    </View>
                  </View>

                  {/* Miniature Business Card Preview */}
                  <View style={styles.previewCardWrapper} pointerEvents="none">
                    <VeyaBusinessCard
                      user={previewUser}
                      address={location}
                      website={website}
                      slogan={slogan}
                      companyLogoUrl={companyLogoUrl}
                      primaryColor={primaryColor}
                      cardBackgroundColor={cardBackgroundColor}
                      isPreviewMode
                    />
                  </View>
                </>
              )}
            </ScrollView>

            {/* Bottom Sticky Action Button */}
            <View style={styles.stickyFooter}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
                disabled={isSaving}
                activeOpacity={0.85}
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  backdropDismissArea: {
    ...StyleSheet.absoluteFill,
  },
  keyboardAvoid: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '90%',
    width: '100%',
    paddingTop: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 10,
  },
  dragArea: {
    paddingTop: 4,
    paddingBottom: 2,
  },
  dragHandleHitSlop: {
    paddingTop: 6,
    paddingBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dragHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  sheetSubtitle: {
    fontSize: 12.5,
    color: '#64748B',
    marginTop: 4,
    lineHeight: 17,
  },

  /* ──────── Sticky Tabs Bar ──────── */
  tabBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    gap: 6,
  },
  tabButtonActive: {
    backgroundColor: '#111111',
    borderColor: '#111111',
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B6B6B',
  },
  tabButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  scrollArea: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },

  /* ──────── Media Row ──────── */
  mediaRow: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 14,
  },
  mediaCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    padding: 16,
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  avatarCircleWrapper: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarCircleImage: {
    width: '100%',
    height: '100%',
    borderRadius: 41,
  },
  avatarCircleFallback: {
    width: '100%',
    height: '100%',
    borderRadius: 41,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  avatarCircleInitials: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111111',
  },
  logoSquircleWrapper: {
    width: 82,
    height: 82,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#EEF2F6',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  logoSquircleImage: {
    width: 58,
    height: 58,
  },
  logoSquircleFallback: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoLetter: {
    fontSize: 28,
    fontWeight: '900',
    color: '#111111',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#111111',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  mediaCardTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 10,
  },
  mediaCardSubtitle: {
    fontSize: 11.5,
    color: '#94A3B8',
    marginTop: 2,
  },

  /* ──────── Form Fields ──────── */
  formFieldContainer: {
    marginBottom: 14,
  },
  fieldLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  fieldIcon: {
    marginRight: 6,
  },
  fieldLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#475569',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13.5,
    color: '#0F172A',
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    overflow: 'hidden',
  },
  countryCodePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 8,
    borderRightWidth: 1,
    borderRightColor: '#F1F5F9',
    height: 42,
  },
  flagEmoji: {
    fontSize: 16,
  },
  phoneTextInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13.5,
    color: '#0F172A',
  },

  /* ──────── Color Sections ──────── */
  colorSectionContainer: {
    marginBottom: 16,
  },
  swatchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 4,
  },
  swatchCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatchCircleLightBorder: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  swatchCircleActive: {
    transform: [{ scale: 1.15 }],
    borderWidth: 2.5,
    borderColor: '#111111',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  /* ──────── Preview Section ──────── */
  previewSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 6,
  },
  previewTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  previewSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  viewFullCardLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  viewFullCardText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#111111',
  },
  previewCardWrapper: {
    marginVertical: 6,
    borderRadius: 20,
    overflow: 'hidden',
  },

  /* ──────── Sticky Action Footer ──────── */
  stickyFooter: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: '#111111',
    borderRadius: 14,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
});
