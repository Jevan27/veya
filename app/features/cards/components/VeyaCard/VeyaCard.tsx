import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Alert,
  PanResponder,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { UserDto, SocialLinkDto, CardBackgroundStyle } from '@veya/shared';
import { isDarkColor } from '../../utils/card-colors';
import { useCardClipboard } from '../../hooks/useCardClipboard';
import { useCardShare } from '../../hooks/useCardShare';
import { CardModal } from './CardModal';
import { CardFrontFace } from './CardFrontFace';
import { CardBackFace } from './CardBackFace';
import { useCardFont } from '../../fonts/useCardFont';
import { formatCardPhone } from '../../utils/phone-format';
import { getPublicCardWebUrl } from '../../utils/card-url';

export interface VeyaCardProps {
  user: UserDto | null;
  /** Optional custom address override (default falls back to user or preset) */
  address?: string;
  /** Optional custom website override (default falls back to veya.app) */
  website?: string;
  /** Optional company slogan displayed on the front of the card */
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
  /** Controlled flipped state (false = front/company, true = back/contact) */
  isFlipped?: boolean;
  /** Callback when card flips */
  onFlip?: (isFlipped: boolean) => void;
  /** Whether the card is published/public. If false, shows private state */
  isPublished?: boolean;
  /** Optional callback to toggle privacy from within the card */
  onTogglePrivacy?: () => void;
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
  isFlipped: isFlippedProp,
  onFlip,
  isPublished = true,
  onTogglePrivacy,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Internal flip state (controlled if isFlippedProp is provided, otherwise local state)
  const [internalFlipped, setInternalFlipped] = useState(false);
  const isFlipped = isFlippedProp !== undefined ? isFlippedProp : internalFlipped;

  // 3D Flip animation value (0deg = Front, ±180deg = Back)
  const flipAnim = useRef(new Animated.Value(isFlipped ? 180 : 0)).current;
  const currentAngleRef = useRef(isFlipped ? 180 : 0);

  // Synchronize when isFlipped changes externally (e.g. from flip button)
  useEffect(() => {
    const isTargetFlipped = isFlipped;
    const isCurrentAtBack = Math.abs(currentAngleRef.current) >= 90;

    if (isTargetFlipped !== isCurrentAtBack) {
      if (isTargetFlipped) {
        // External flip to Back: default left-to-right (0 -> 180)
        flipAnim.setValue(0);
        Animated.spring(flipAnim, {
          toValue: 180,
          friction: 8,
          tension: 12,
          useNativeDriver: true,
        }).start();
        currentAngleRef.current = 180;
      } else {
        // External flip to Front: animate back to 0
        Animated.spring(flipAnim, {
          toValue: 0,
          friction: 8,
          tension: 12,
          useNativeDriver: true,
        }).start();
        currentAngleRef.current = 0;
      }
    }
  }, [isFlipped, flipAnim]);

  /**
   * Directional flip trigger based on swipe direction:
   * - Swipe Left (dx < 0): turns left-to-right (angle increases towards +180 or 0)
   * - Swipe Right (dx > 0): turns right-to-left (angle decreases towards -180 or 0)
   */
  const triggerFlipDirection = useCallback(
    (direction: 'left-to-right' | 'right-to-left') => {
      const isCurrentlyFlipped = isFlipped;
      const nextFlipped = !isCurrentlyFlipped;

      if (!isCurrentlyFlipped) {
        // Currently on Front (angle 0)
        if (direction === 'left-to-right') {
          // Swipe Left -> turn left-to-right (0 -> 180)
          flipAnim.setValue(0);
          Animated.spring(flipAnim, {
            toValue: 180,
            friction: 8,
            tension: 12,
            useNativeDriver: true,
          }).start();
          currentAngleRef.current = 180;
        } else {
          // Swipe Right -> turn right-to-left (0 -> -180)
          flipAnim.setValue(0);
          Animated.spring(flipAnim, {
            toValue: -180,
            friction: 8,
            tension: 12,
            useNativeDriver: true,
          }).start();
          currentAngleRef.current = -180;
        }
      } else {
        // Currently on Back (angle was 180 or -180)
        if (direction === 'left-to-right') {
          // Swipe Left -> turn left-to-right back to Front (-180 -> 0)
          flipAnim.setValue(-180);
          Animated.spring(flipAnim, {
            toValue: 0,
            friction: 8,
            tension: 12,
            useNativeDriver: true,
          }).start();
          currentAngleRef.current = 0;
        } else {
          // Swipe Right -> turn right-to-left back to Front (180 -> 0)
          flipAnim.setValue(180);
          Animated.spring(flipAnim, {
            toValue: 0,
            friction: 8,
            tension: 12,
            useNativeDriver: true,
          }).start();
          currentAngleRef.current = 0;
        }
      }

      if (onFlip) {
        onFlip(nextFlipped);
      }
      setInternalFlipped(nextFlipped);
    },
    [isFlipped, flipAnim, onFlip]
  );

  // Dynamically resolve custom card typography font
  const { fontFamily: activeFontFamily } = useCardFont(customFontFamily);

  // Press scale animation value
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

  // Optional slogan lines for the front side of the card
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

  // PanResponder for horizontal swipe gesture detection vs. tap
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_evt, gestureState) => {
          return (
            Math.abs(gestureState.dx) > 12 &&
            Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 1.4
          );
        },
        onPanResponderGrant: () => {
          if (!isPreviewMode) handlePressIn();
        },
        onPanResponderRelease: (_evt, gestureState) => {
          if (!isPreviewMode) handlePressOut();
          if (Math.abs(gestureState.dx) >= 35) {
            // Horizontal swipe gesture detected!
            if (gestureState.dx < 0) {
              // Swipe LEFT: turn right-to-left
              triggerFlipDirection('right-to-left');
            } else {
              // Swipe RIGHT: turn left-to-right
              triggerFlipDirection('left-to-right');
            }
          } else if (
            Math.abs(gestureState.dx) < 12 &&
            Math.abs(gestureState.dy) < 12
          ) {
            // Minimal movement tap -> Open modal / trigger onPress
            handleCardPress();
          }
        },
        onPanResponderTerminate: () => {
          if (!isPreviewMode) handlePressOut();
        },
      }),
    [isPreviewMode, handlePressIn, handlePressOut, triggerFlipDirection, handleCardPress]
  );

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

  // 3D rotation interpolations supporting both positive and negative rotation angles
  const frontInterpolate = flipAnim.interpolate({
    inputRange: [-180, -90, -89, 0, 89, 90, 180],
    outputRange: ['-180deg', '-90deg', '-89deg', '0deg', '89deg', '90deg', '180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [-180, -90, -89, 0, 89, 90, 180],
    outputRange: ['0deg', '90deg', '91deg', '180deg', '269deg', '270deg', '360deg'],
  });

  // Sharp opacity toggle at 90-degree midpoint in both directions
  const frontOpacity = flipAnim.interpolate({
    inputRange: [-180, -90, -89, 0, 89, 90, 180],
    outputRange: [0, 0, 1, 1, 1, 0, 0],
  });

  const backOpacity = flipAnim.interpolate({
    inputRange: [-180, -90, -89, 0, 89, 90, 180],
    outputRange: [1, 1, 0, 0, 0, 1, 1],
  });

  return (
    <>
      <Animated.View
        style={[
          styles.cardWrapper,
          isPreviewMode && { marginVertical: 4 },
          { transform: [{ scale: scaleAnim }] },
        ]}
        {...(isPreviewMode ? {} : panResponder.panHandlers)}
      >
        <View
          ref={cardSnapshotRef}
          collapsable={false}
          style={styles.snapshotContainer}
        >
          {/* FRONT FACE: COMPANY & SOCIAL LINKS */}
          <Animated.View
            style={[
              styles.cardFace,
              {
                opacity: frontOpacity,
                transform: [
                  { perspective: 1200 },
                  { rotateY: frontInterpolate },
                ],
              },
            ]}
            pointerEvents={isFlipped ? 'none' : 'auto'}
          >
            <CardFrontFace
              company={displayCompany}
              companyLogoUrl={companyLogoUrl}
              sloganLines={sloganLines}
              website={website}
              socialLinks={socialLinks}
              primaryColor={primaryColor}
              cardBackgroundColor={cardBackgroundColor}
              isDarkBg={isDarkBg}
              fontFamily={activeFontFamily}
              backgroundStyle={backgroundStyle}
            />
          </Animated.View>

          {/* BACK FACE: PERSONAL CONTACT GRID */}
          <Animated.View
            style={[
              styles.cardFace,
              styles.cardFaceBack,
              {
                opacity: backOpacity,
                transform: [
                  { perspective: 1200 },
                  { rotateY: backInterpolate },
                ],
              },
            ]}
            pointerEvents={isFlipped ? 'auto' : 'none'}
          >
            <CardBackFace
              displayName={displayName}
              displayRole={displayRole}
              displayCompany={displayCompany}
              avatarUrl={user?.avatarUrl}
              initials={initials}
              companyLogoUrl={companyLogoUrl}
              phone={displayPhone}
              email={displayEmail}
              address={address}
              website={website}
              primaryColor={primaryColor}
              cardBackgroundColor={cardBackgroundColor}
              isDarkBg={isDarkBg}
              fontFamily={activeFontFamily}
              backgroundStyle={backgroundStyle}
            />
          </Animated.View>
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
  snapshotContainer: {
    flex: 1,
    position: 'relative',
  },
  cardFace: {
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
  },
  cardFaceBack: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
