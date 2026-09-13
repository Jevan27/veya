import React, { useState, useRef, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { UserDto, SocialLinkDto, CardBackgroundStyle } from '@veya/shared';
import { isDarkColor } from '../../utils/card-colors';
import { useCardClipboard } from '../../hooks/useCardClipboard';
import { useCardShare } from '../../hooks/useCardShare';
import { CardBackgroundAccent } from './CardBackgroundAccent';
import { CardHeader } from './CardHeader';
import { CardContactGrid } from './CardContactGrid';
import { CardModal } from './CardModal';
import { useCardFont } from '../../fonts/useCardFont';
import { formatCardPhone } from '../../utils/phone-format';
import { getPublicCardWebUrl } from '../../utils/card-url';

export interface VeyaCardProps {
  user: UserDto | null;
  /** Optional custom address override (default falls back to user or preset) */
  address?: string;
  /** Optional custom website override (default falls back to veya.app) */
  website?: string;
  /** Optional company slogan displayed vertically on the right side of the card */
  slogan?: string | string[] | null;
  /** Optional custom card URL */
  cardUrl?: string;
  /** Optional social media profile links */
  socialLinks?: SocialLinkDto[] | null;
  /** Optional custom press handler (if not provided, opens the QR modal) */
  onPress?: () => void;
  /** Optional callback when tapping the Edit button in the modal */
  onEdit?: () => void;
  /** Optional company logo image URI */
  companyLogoUrl?: string | null;
  /** Optional primary accent color (defaults to #111111) */
  primaryColor?: string;
  /** Optional card background color (defaults to #FFFFFF) */
  cardBackgroundColor?: string;
  /** Optional custom font family identifier (e.g. 'inter', 'playfair-display', 'poppins', etc.) */
  fontFamily?: string | null;
  /** Optional background visual composition style */
  backgroundStyle?: CardBackgroundStyle | null;
  /** If true, disables modal and scales down for compact preview */
  isPreviewMode?: boolean;
}

export const VeyaCard: React.FC<VeyaCardProps> = ({
  user,
  address = 'Caloocan, Metro Manila\nPhilippines',
  website = 'www.veya.app',
  slogan,
  cardUrl: customCardUrl,
  socialLinks,
  onPress,
  onEdit,
  companyLogoUrl,
  primaryColor = '#111111',
  cardBackgroundColor = '#FFFFFF',
  fontFamily: customFontFamily,
  backgroundStyle = 'minimal',
  isPreviewMode = false,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Dynamically resolve custom card typography font
  const { fontFamily: activeFontFamily } = useCardFont(customFontFamily);

  // Press animation value
  const scaleAnim = useRef(new Animated.Value(1)).current;
  // Toast animation value
  const toastAnim = useRef(new Animated.Value(0)).current;
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Snapshot ref attached to the business card container
  const cardSnapshotRef = useRef<View>(null);

  // Extracted hooks
  const { showCopyFeedback, copyToClipboard } = useCardClipboard();
  const { isDownloading, shareCard, downloadCardPng } = useCardShare();

  const triggerToast = useCallback(() => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    setShowToast(true);
    Animated.spring(toastAnim, {
      toValue: 1,
      friction: 7,
      tension: 80,
      useNativeDriver: true,
    }).start();

    toastTimeoutRef.current = setTimeout(() => {
      Animated.timing(toastAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowToast(false));
    }, 3000);
  }, [toastAnim]);

  const cardUrl = customCardUrl || getPublicCardWebUrl(user?.id);
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=12&data=${encodeURIComponent(
    cardUrl
  )}`;

  const displayName = user?.name?.trim() || 'Jevan Campillos';
  const displayRole = user?.role?.trim() || 'Full-Stack Developer';
  const displayCompany = user?.company?.trim() || 'Veya';
  const displayPhone = formatCardPhone(user?.phoneNumber);
  const displayEmail = user?.email?.trim() || 'jevan@veya.app';

  // Optional slogan lines for the right side of the card
  const sloganLines = useMemo(() => {
    if (typeof slogan === 'string') {
      return slogan.split('\n').map((s) => s.trim()).filter(Boolean);
    }
    if (Array.isArray(slogan)) {
      return slogan.map((s) => s.trim()).filter(Boolean);
    }
    return null;
  }, [slogan]);

  // Extract up to 2 initials for fallback avatar
  const initials = useMemo(() => {
    return (
      displayName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0].toUpperCase())
        .join('') || 'V'
    );
  }, [displayName]);

  const handleEdit = useCallback(() => {
    setShowModal(false);
    if (onEdit) {
      onEdit();
    } else {
      Alert.alert(
        'Edit Card',
        'Go to the Settings tab to edit your profile, photo, role, and card information.'
      );
    }
  }, [onEdit]);

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 0.985,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  const handleCardPress = useCallback(() => {
    if (isPreviewMode) return;
    if (onPress) {
      onPress();
    } else {
      setShowModal(true);
    }
  }, [isPreviewMode, onPress]);

  const handleShareAction = useCallback(() => {
    shareCard(displayName, cardUrl);
  }, [shareCard, displayName, cardUrl]);

  const handleCopyLinkAction = useCallback(() => {
    copyToClipboard(cardUrl);
  }, [copyToClipboard, cardUrl]);

  const handleDownloadPngAction = useCallback(() => {
    downloadCardPng(
      cardSnapshotRef,
      {
        name: displayName,
        role: displayRole,
        company: displayCompany,
        sloganLines,
        phone: displayPhone,
        email: displayEmail,
        address,
        website,
        initials,
        primaryColor,
        cardBackgroundColor,
      },
      triggerToast
    );
  }, [
    downloadCardPng,
    displayName,
    displayRole,
    displayCompany,
    sloganLines,
    displayPhone,
    displayEmail,
    address,
    website,
    initials,
    primaryColor,
    cardBackgroundColor,
    triggerToast,
  ]);

  const isDarkBg = isDarkColor(cardBackgroundColor);

  return (
    <>
      <Animated.View
        style={[
          styles.cardWrapper,
          isPreviewMode && { marginVertical: 4 },
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <View
          ref={cardSnapshotRef}
          collapsable={false}
          style={styles.snapshotContainer}
        >
          <Pressable
            onPress={handleCardPress}
            onPressIn={isPreviewMode ? undefined : handlePressIn}
            onPressOut={isPreviewMode ? undefined : handlePressOut}
            style={[
              styles.cardContainer,
              {
                backgroundColor: cardBackgroundColor,
                borderColor: isDarkBg ? 'rgba(255, 255, 255, 0.14)' : '#EEF2F6',
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Digital business card. Tap to view QR code and sharing options."
          >
            {/* Visual Background Composition Style */}
            <CardBackgroundAccent
              styleName={backgroundStyle}
              primaryColor={primaryColor}
              cardBackgroundColor={cardBackgroundColor}
              isDarkBg={isDarkBg}
            />

            {/* UPPER SECTION: IDENTITY */}
            <CardHeader
              displayName={displayName}
              displayRole={displayRole}
              displayCompany={displayCompany}
              avatarUrl={user?.avatarUrl}
              initials={initials}
              companyLogoUrl={companyLogoUrl}
              sloganLines={sloganLines}
              primaryColor={primaryColor}
              isDarkBg={isDarkBg}
              fontFamily={activeFontFamily}
            />

            {/* Subtle Horizontal Divider */}
            <View
              style={[
                styles.divider,
                { backgroundColor: isDarkBg ? 'rgba(255, 255, 255, 0.12)' : '#F1F5F9' },
              ]}
            />

            {/* LOWER SECTION: 2x2 CONTACT GRID */}
            <CardContactGrid
              phone={displayPhone}
              email={displayEmail}
              address={address}
              website={website}
              primaryColor={primaryColor}
              isDarkBg={isDarkBg}
              fontFamily={activeFontFamily}
              socialLinks={socialLinks}
            />
          </Pressable>
        </View>
      </Animated.View>

      {/* QR & SHARE MODAL (Disabled in preview mode) */}
      {!isPreviewMode && (
        <CardModal
          visible={showModal}
          onClose={() => setShowModal(false)}
          cardUrl={cardUrl}
          qrCodeUrl={qrCodeUrl}
          socialLinks={socialLinks}
          onEdit={handleEdit}
          onShare={handleShareAction}
          onCopyLink={handleCopyLinkAction}
          showCopyFeedback={showCopyFeedback}
          onDownloadPng={handleDownloadPngAction}
          isDownloading={isDownloading}
          showToast={showToast}
          toastAnim={toastAnim}
        />
      )}

      {/* BOTTOM TOAST (Root fallback): "Image Saved!" */}
      {!isPreviewMode && showToast && !showModal && (
        <Animated.View
          style={[
            styles.bottomToastContainer,
            {
              opacity: toastAnim,
              transform: [
                {
                  translateY: toastAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [24, 0],
                  }),
                },
              ],
            },
          ]}
          pointerEvents="none"
        >
          <View style={styles.toastIconWrapper}>
            <Feather name="check" size={13} color="#FFFFFF" strokeWidth={3} />
          </View>
          <Text style={styles.toastText}>Image Saved!</Text>
        </Animated.View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    // 1.72:1 landscape aspect ratio
    aspectRatio: 1.72,
    marginVertical: 12,
  },
  cardContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 14,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'space-between',
    // Premium soft elevation
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 4,
  },
  snapshotContainer: {
    flex: 1,
  },
  bottomToastContainer: {
    position: 'absolute',
    bottom: 28,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 9999,
  },
  toastIconWrapper: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});
