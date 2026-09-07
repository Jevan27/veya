import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
  Animated,
  Share,
  Modal,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Feather } from '@expo/vector-icons';
import { UserDto } from '@veya/shared';

import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

export interface VeyaBusinessCardProps {
  user: UserDto | null;
  /** Optional custom address override (default falls back to user or preset) */
  address?: string;
  /** Optional custom website override (default falls back to veya.app) */
  website?: string;
  /** Optional company slogan displayed vertically on the right side of the card */
  slogan?: string | string[] | null;
  /** Optional custom card URL */
  cardUrl?: string;
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
  /** If true, disables modal and scales down for compact preview */
  isPreviewMode?: boolean;
}

function isDarkColor(hexColor?: string): boolean {
  if (!hexColor) return false;
  const hex = hexColor.replace('#', '');
  if (hex.length !== 6) return false;
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
}

export const VeyaBusinessCard: React.FC<VeyaBusinessCardProps> = ({
  user,
  address = 'Caloocan, Metro Manila\nPhilippines',
  website = 'www.veya.app',
  slogan,
  cardUrl: customCardUrl,
  onPress,
  onEdit,
  companyLogoUrl,
  primaryColor = '#111111',
  cardBackgroundColor = '#FFFFFF',
  isPreviewMode = false,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Press animation value
  const scaleAnim = useRef(new Animated.Value(1)).current;
  // Toast animation value
  const toastAnim = useRef(new Animated.Value(0)).current;
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Snapshot ref attached to the business card container
  const cardSnapshotRef = useRef<View>(null);

  const triggerToast = () => {
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
  };

  const cardUrl = customCardUrl || `https://veya.app/card/${user?.id || 'demo'}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=12&data=${encodeURIComponent(
    cardUrl
  )}`;

  const displayName = user?.name?.trim() || 'Jevan Campillos';
  const displayRole = user?.role?.trim() || 'Full-Stack Developer';
  const displayCompany = user?.company?.trim() || 'Veya';
  const displayPhone = user?.phoneNumber?.trim() || '+63 912 345 6789';
  const displayEmail = user?.email?.trim() || 'jevan@veya.app';

  // Optional slogan lines for the right side of the card
  const sloganLines = typeof slogan === 'string'
    ? slogan.split('\n').map((s) => s.trim()).filter(Boolean)
    : Array.isArray(slogan)
    ? slogan.map((s) => s.trim()).filter(Boolean)
    : null;

  // Extract up to 2 initials for fallback avatar
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('') || 'V';

  const handleEdit = () => {
    setShowModal(false);
    if (onEdit) {
      onEdit();
    } else {
      Alert.alert(
        'Edit Card',
        'Go to the Settings tab to edit your profile, photo, role, and card information.'
      );
    }
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.985,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const handleCardPress = () => {
    if (isPreviewMode) return;
    if (onPress) {
      onPress();
    } else {
      setShowModal(true);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        title: `${displayName} — Veya Digital Business Card`,
        message: `Connect with ${displayName} on Veya:\n${cardUrl}`,
        url: cardUrl,
      });
    } catch (err) {
      console.warn('Share card error:', err);
    }
  };

  const handleCopyLink = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(cardUrl);
      } else {
        // @ts-ignore
        const Clipboard = await import('expo-clipboard').catch(() => null);
        if (Clipboard?.setStringAsync) {
          await Clipboard.setStringAsync(cardUrl);
        }
      }
    } catch {
      // Fallback
    }

    setShowCopyFeedback(true);
    setTimeout(() => {
      setShowCopyFeedback(false);
    }, 2200);
  };

  const handleDownloadPng = async () => {
    setIsDownloading(true);
    try {
      // 1. Web browser download (captures view or draws high-res 1050x600 PNG)
      if (Platform.OS === 'web') {
        try {
          if (cardSnapshotRef.current) {
            const uri = await captureRef(cardSnapshotRef, {
              format: 'png',
              quality: 1,
            });
            const link = document.createElement('a');
            link.download = `${displayName.toLowerCase().replace(/\s+/g, '_')}_card.png`;
            link.href = uri;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            triggerToast();
            return;
          }
        } catch {
          // Fallback canvas if captureRef encounters web DOM limitations
          downloadCardViaWebCanvas(
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
            cardBackgroundColor
          );
          triggerToast();
          return;
        }
      }

      // 2. Native Mobile (iOS / Android): Capture the business card View into a high-res PNG file
      if (cardSnapshotRef.current) {
        const uri = await captureRef(cardSnapshotRef, {
          format: 'png',
          quality: 1,
          result: 'tmpfile',
        });

        // 2a. Attempt automatic save directly to device Gallery / Photos
        let autoSaved = false;
        try {
          // @ts-ignore
          const { requireNativeModule } = await import('expo-modules-core').catch(() => ({}));
          if (typeof requireNativeModule === 'function') {
            let nativeMedia: any = null;
            try {
              nativeMedia = requireNativeModule('ExpoMediaLibrary');
            } catch {}

            if (nativeMedia) {
              if (nativeMedia.requestPermissionsAsync) {
                try {
                  await nativeMedia.requestPermissionsAsync(true);
                } catch {}
              }

              if (nativeMedia.saveToLibraryAsync) {
                await nativeMedia.saveToLibraryAsync(uri);
                autoSaved = true;
              } else if (nativeMedia.createAssetAsync) {
                await nativeMedia.createAssetAsync(uri);
                autoSaved = true;
              }
            }
          }
        } catch (mediaErr) {
          console.warn('Auto-save to gallery attempt error:', mediaErr);
        }

        // Trigger toast at the bottom: "Image Saved!"
        triggerToast();

        // 2b. Open native share sheet so user can also share or save
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri, {
            mimeType: 'image/png',
            dialogTitle: autoSaved ? 'Card Saved! Share Business Card' : 'Save / Share Business Card',
            UTI: 'public.png',
          });
        } else {
          await Share.share({
            title: `${displayName} — Business Card`,
            url: uri,
          });
        }
      }
    } catch (err) {
      console.warn('Card snapshot download failed:', err);
      Alert.alert(
        'Card Download',
        'Could not save picture directly. Card URL has been copied for sharing.'
      );
    } finally {
      setTimeout(() => setIsDownloading(false), 1400);
    }
  };

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
            {/* Top-Right Decorative Blue/Purple Gradient Curve */}
            <View style={styles.svgCornerWrapper} pointerEvents="none">
              <Svg width={140} height={110} viewBox="0 0 140 110" fill="none">
                <Defs>
                  <LinearGradient id="veyaWave" x1="0%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%" stopColor={primaryColor} stopOpacity={0.45} />
                    <Stop offset="50%" stopColor={primaryColor} stopOpacity={0.3} />
                    <Stop offset="100%" stopColor={primaryColor} stopOpacity={0.15} />
                  </LinearGradient>
                </Defs>
                <Path
                  d="M30 0C65 15 85 45 105 55C125 65 135 40 140 30V0H30Z"
                  fill="url(#veyaWave)"
                />
                <Path
                  d="M75 0C98 22 110 52 140 68V0H75Z"
                  fill={primaryColor}
                  fillOpacity={0.25}
                />
              </Svg>
            </View>

            {/* ──────────────── UPPER SECTION: IDENTITY ──────────────── */}
            <View style={styles.upperSection}>
              {/* Avatar (Squircle / Rounded Rectangle) */}
              <View
                style={[
                  styles.avatarWrapper,
                  isDarkBg && {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  },
                ]}
              >
                {user?.avatarUrl ? (
                  <Image source={{ uri: user.avatarUrl }} style={styles.avatarImage} />
                ) : (
                  <View
                    style={[
                      styles.avatarFallback,
                      {
                        backgroundColor: isDarkBg ? 'rgba(255, 255, 255, 0.1)' : primaryColor + '18',
                      },
                    ]}
                  >
                    <Text style={[styles.avatarInitials, { color: primaryColor }]}>{initials}</Text>
                  </View>
                )}
              </View>

              {/* Name, Role & Company Identity */}
              <View style={styles.identityDetails}>
                <Text
                  style={[
                    styles.nameText,
                    { color: isDarkBg ? '#FFFFFF' : '#0F172A' },
                  ]}
                  numberOfLines={1}
                >
                  {displayName}
                </Text>
                <Text
                  style={[
                    styles.roleText,
                    { color: isDarkBg ? '#94A3B8' : '#64748B' },
                  ]}
                  numberOfLines={1}
                >
                  {displayRole}
                </Text>

                {/* Company Badge & Name */}
                <View style={styles.companyRow}>
                  {companyLogoUrl ? (
                    <Image
                      source={{ uri: companyLogoUrl }}
                      style={styles.companyLogoBadge}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={[styles.veyaLogoBadge, { backgroundColor: primaryColor }]}>
                      <Text style={styles.veyaLogoLetter}>v</Text>
                    </View>
                  )}
                  <Text
                    style={[
                      styles.companyName,
                      { color: isDarkBg ? '#F8FAFC' : '#0F172A' },
                    ]}
                    numberOfLines={1}
                  >
                    {displayCompany}
                  </Text>
                </View>
              </View>

              {/* Slogan on the right side (optional) */}
              {sloganLines && sloganLines.length > 0 && (
                <View style={styles.sloganContainer}>
                  {sloganLines.map((line, idx) => (
                    <Text
                      key={idx}
                      style={[
                        styles.sloganLine,
                        { color: isDarkBg ? '#F1F5F9' : '#0F172A' },
                      ]}
                    >
                      {line.toUpperCase()}
                    </Text>
                  ))}
                  <View style={[styles.sloganUnderline, { backgroundColor: primaryColor }]} />
                </View>
              )}
            </View>

            {/* Subtle Horizontal Divider */}
            <View
              style={[
                styles.divider,
                { backgroundColor: isDarkBg ? 'rgba(255, 255, 255, 0.12)' : '#F1F5F9' },
              ]}
            />

            {/* ──────────────── LOWER SECTION: 2x2 CONTACT GRID ──────────────── */}
            <View style={styles.lowerSection}>
              {/* Row 1: Phone & Email */}
              <View style={styles.contactRow}>
                {/* Phone */}
                <View style={styles.contactItem}>
                  <View style={styles.iconChip}>
                    <Feather name="phone" size={13.5} color={primaryColor} />
                  </View>
                  <Text
                    style={[
                      styles.contactText,
                      { color: isDarkBg ? '#E2E8F0' : '#334155' },
                    ]}
                    numberOfLines={1}
                  >
                    {displayPhone}
                  </Text>
                </View>

                {/* Email */}
                <View style={styles.contactItem}>
                  <View style={styles.iconChip}>
                    <Feather name="mail" size={13.5} color={primaryColor} />
                  </View>
                  <Text
                    style={[
                      styles.contactText,
                      { color: isDarkBg ? '#E2E8F0' : '#334155' },
                    ]}
                    numberOfLines={1}
                  >
                    {displayEmail}
                  </Text>
                </View>
              </View>

              {/* Row 2: Location & Website */}
              <View style={styles.contactRow}>
                {/* Address */}
                <View style={styles.contactItem}>
                  <View style={styles.iconChip}>
                    <Feather name="map-pin" size={13.5} color={primaryColor} />
                  </View>
                  <Text
                    style={[
                      styles.contactText,
                      { color: isDarkBg ? '#E2E8F0' : '#334155' },
                    ]}
                    numberOfLines={2}
                  >
                    {address}
                  </Text>
                </View>

                {/* Website */}
                <View style={styles.contactItem}>
                  <View style={styles.iconChip}>
                    <Feather name="globe" size={13.5} color={primaryColor} />
                  </View>
                  <Text
                    style={[
                      styles.contactText,
                      { color: isDarkBg ? '#E2E8F0' : '#334155' },
                    ]}
                    numberOfLines={1}
                  >
                    {website}
                  </Text>
                </View>
              </View>
            </View>
          </Pressable>
        </View>
      </Animated.View>

      {/* ──────────────── QR & SHARE MODAL (Disabled in preview mode) ──────────────── */}
      {!isPreviewMode && (
        <Modal
          visible={showModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowModal(false)}
        >
          <Pressable style={styles.modalOverlay} onPress={() => setShowModal(false)}>
            <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
              {/* Modal Top Header */}
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>Digital Business Card</Text>
                  <Text style={styles.modalSubtitle}>Scan with camera to connect</Text>
                </View>
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setShowModal(false)}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  accessibilityLabel="Close modal"
                >
                  <Feather name="x" size={18} color="#0F172A" />
                </TouchableOpacity>
              </View>

              {/* QR Code Frame */}
              <View style={styles.modalQrWrapper}>
                <Image
                  source={{ uri: qrCodeUrl }}
                  style={styles.modalQrImage}
                  resizeMode="contain"
                />
              </View>

              {/* Card URL Pill */}
              <View style={styles.cardUrlPill}>
                <Feather name="globe" size={12} color="#64748B" style={{ marginRight: 6 }} />
                <Text style={styles.cardUrlPillText} numberOfLines={1}>
                  {cardUrl.replace(/^https?:\/\//, '')}
                </Text>
              </View>

              {/* ──────────────── ALL BUTTONS AS ICONS BELOW THE QR ──────────────── */}
              <View style={styles.modalIconActionsRow}>
                {/* Edit Icon Button */}
                <TouchableOpacity
                  style={styles.modalIconButtonWrapper}
                  onPress={handleEdit}
                  activeOpacity={0.75}
                  accessibilityLabel="Edit digital card"
                >
                  <View style={styles.modalIconCircle}>
                    <Feather name="edit-2" size={19} color="#0F172A" />
                  </View>
                  <Text style={styles.modalIconLabel}>Edit</Text>
                </TouchableOpacity>

                {/* Share Icon Button */}
                <TouchableOpacity
                  style={styles.modalIconButtonWrapper}
                  onPress={handleShare}
                  activeOpacity={0.75}
                  accessibilityLabel="Share digital card"
                >
                  <View style={styles.modalIconCircle}>
                    <Feather name="share-2" size={20} color="#0F172A" />
                  </View>
                  <Text style={styles.modalIconLabel}>Share</Text>
                </TouchableOpacity>

                {/* Copy Link Icon Button */}
                <TouchableOpacity
                  style={styles.modalIconButtonWrapper}
                  onPress={handleCopyLink}
                  activeOpacity={0.75}
                  accessibilityLabel="Copy card link to clipboard"
                >
                  <View
                    style={[
                      styles.modalIconCircle,
                      showCopyFeedback && styles.modalIconCircleSuccess,
                    ]}
                  >
                    <Feather
                      name={showCopyFeedback ? 'check' : 'copy'}
                      size={20}
                      color={showCopyFeedback ? '#10B981' : '#0F172A'}
                    />
                  </View>
                  <Text
                    style={[
                      styles.modalIconLabel,
                      showCopyFeedback && styles.modalIconLabelSuccess,
                    ]}
                  >
                    {showCopyFeedback ? 'Copied!' : 'Copy Link'}
                  </Text>
                </TouchableOpacity>

                {/* Download PNG Icon Button */}
                <TouchableOpacity
                  style={styles.modalIconButtonWrapper}
                  onPress={handleDownloadPng}
                  activeOpacity={0.75}
                  accessibilityLabel="Download card as PNG"
                >
                  <View
                    style={[
                      styles.modalIconCircle,
                      isDownloading && styles.modalIconCircleDownloading,
                    ]}
                  >
                    <Feather
                      name={isDownloading ? 'check' : 'download'}
                      size={20}
                      color={isDownloading ? '#111111' : '#0F172A'}
                    />
                  </View>
                  <Text
                    style={[
                      styles.modalIconLabel,
                      isDownloading && { color: '#111111', fontWeight: '700' },
                    ]}
                  >
                    {isDownloading ? 'Saved!' : 'Save'}
                  </Text>
                </TouchableOpacity>
              </View>
            </Pressable>

            {/* ──────────────── BOTTOM TOAST (Inside Modal): "Image Saved!" ──────────────── */}
            {showToast && (
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
          </Pressable>
        </Modal>
      )}

      {/* ──────────────── BOTTOM TOAST (Root fallback): "Image Saved!" ──────────────── */}
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
  svgCornerWrapper: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 140,
    height: 110,
    zIndex: 0,
  },

  /* ──────── Upper Section ──────── */
  upperSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    zIndex: 1,
  },
  avatarWrapper: {
    width: 68,
    height: 68,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111111',
    letterSpacing: -0.5,
  },
  identityDetails: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 6,
  },
  nameText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
    lineHeight: 22,
  },
  roleText: {
    fontSize: 12.5,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
    marginBottom: 4,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  veyaLogoBadge: {
    width: 15,
    height: 15,
    borderRadius: 4,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  veyaLogoLetter: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 11,
  },
  companyName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  companyLogoBadge: {
    width: 17,
    height: 17,
    borderRadius: 4,
    marginRight: 6,
    backgroundColor: '#F1F5F9',
  },
  sloganContainer: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    paddingTop: 1,
    marginLeft: 8,
    zIndex: 2,
  },
  sloganLine: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.8,
    lineHeight: 12,
    textAlign: 'right',
  },
  sloganUnderline: {
    width: 26,
    height: 2.5,
    backgroundColor: '#111111',
    borderRadius: 1.5,
    marginTop: 4,
  },

  /* ──────── Divider ──────── */
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 8,
    width: '100%',
  },

  /* ──────── Lower Section: 2x2 Contact Grid ──────── */
  lowerSection: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    zIndex: 1,
    gap: 8,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconChip: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  contactText: {
    flex: 1,
    fontSize: 11,
    fontWeight: '500',
    color: '#334155',
    lineHeight: 14,
  },

  /* ──────── Modal Styles ──────── */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 18,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalQrWrapper: {
    width: 200,
    height: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#EEF2F6',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  modalQrImage: {
    width: '100%',
    height: '100%',
  },
  cardUrlPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 22,
    maxWidth: '92%',
  },
  cardUrlPillText: {
    fontSize: 11.5,
    color: '#475569',
    fontWeight: '500',
  },

  /* ──────── Modal Icon Buttons Row ──────── */
  modalIconActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 6,
    paddingTop: 4,
  },
  modalIconButtonWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  modalIconCircleSuccess: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  modalIconCircleDownloading: {
    backgroundColor: '#EEF2FF',
    borderColor: '#C7D2FE',
  },
  modalIconLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
  },
  modalIconLabelSuccess: {
    color: '#10B981',
    fontWeight: '700',
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

/**
 * Web Canvas Fallback Renderer:
 * Directly draws the high-resolution 1050x600 px digital business card on an HTML5 canvas
 * and triggers a direct PNG file download.
 */
function downloadCardViaWebCanvas(
  name: string,
  role: string,
  company: string,
  sloganLines: string[] | null,
  phone: string,
  email: string,
  address: string,
  website: string,
  initials: string,
  primaryColor: string = '#111111',
  cardBackgroundColor: string = '#FFFFFF'
) {
  if (typeof document === 'undefined') return;

  const isDark = isDarkColor(cardBackgroundColor);
  const canvas = document.createElement('canvas');
  canvas.width = 1050;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background with rounded corners
  const radius = 36;
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(1050 - radius, 0);
  ctx.quadraticCurveTo(1050, 0, 1050, radius);
  ctx.lineTo(1050, 600 - radius);
  ctx.quadraticCurveTo(1050, 600, 1050 - radius, 600);
  ctx.lineTo(radius, 600);
  ctx.quadraticCurveTo(0, 600, 0, 600 - radius);
  ctx.lineTo(0, radius);
  ctx.quadraticCurveTo(0, 0, radius, 0);
  ctx.closePath();
  ctx.fillStyle = cardBackgroundColor;
  ctx.fill();
  ctx.clip();

  // Top-Right gradient accent curve
  const grad = ctx.createLinearGradient(800, 0, 1050, 200);
  grad.addColorStop(0, primaryColor + '70');
  grad.addColorStop(0.5, primaryColor + '50');
  grad.addColorStop(1, primaryColor + '20');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(700, 0);
  ctx.bezierCurveTo(800, 60, 940, 120, 1050, 160);
  ctx.lineTo(1050, 0);
  ctx.closePath();
  ctx.fill();

  // Avatar box
  const avatarX = 54;
  const avatarY = 54;
  const avatarSize = 140;
  ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.1)' : primaryColor + '18';
  ctx.beginPath();
  if ('roundRect' in ctx && typeof (ctx as any).roundRect === 'function') {
    (ctx as any).roundRect(avatarX, avatarY, avatarSize, avatarSize, 32);
  } else {
    ctx.rect(avatarX, avatarY, avatarSize, avatarSize);
  }
  ctx.fill();
  ctx.fillStyle = primaryColor;
  ctx.font = 'bold 52px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(initials, avatarX + avatarSize / 2, avatarY + avatarSize / 2);

  // Identity Details
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillStyle = isDark ? '#FFFFFF' : '#0F172A';
  ctx.font = 'bold 40px sans-serif';
  ctx.fillText(name, 222, 54);

  ctx.fillStyle = isDark ? '#94A3B8' : '#64748B';
  ctx.font = '500 26px sans-serif';
  ctx.fillText(role, 222, 108);

  // Veya Logo Badge & Company
  ctx.fillStyle = primaryColor;
  ctx.beginPath();
  if ('roundRect' in ctx && typeof (ctx as any).roundRect === 'function') {
    (ctx as any).roundRect(222, 150, 30, 30, 8);
  } else {
    ctx.rect(222, 150, 30, 30);
  }
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 19px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('v', 237, 156);

  ctx.textAlign = 'left';
  ctx.fillStyle = isDark ? '#F8FAFC' : '#0F172A';
  ctx.font = 'bold 26px sans-serif';
  ctx.fillText(company, 264, 150);

  // Slogan on top right (if provided)
  if (sloganLines && sloganLines.length > 0) {
    ctx.textAlign = 'right';
    ctx.fillStyle = isDark ? '#F1F5F9' : '#0F172A';
    ctx.font = '800 20px sans-serif';
    let sloganY = 54;
    sloganLines.forEach((line) => {
      ctx.fillText(line.toUpperCase(), 996, sloganY);
      sloganY += 26;
    });
    ctx.fillStyle = primaryColor;
    ctx.fillRect(996 - 65, sloganY + 4, 65, 5);
  }

  // Horizontal Divider
  ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.15)' : '#F1F5F9';
  ctx.fillRect(54, 238, 942, 2);

  // 2x2 Contact Grid (Clean icons without background, tight row spacing)
  const drawItem = (iconSymbol: string, text: string, x: number, y: number) => {
    ctx.font = '22px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(iconSymbol, x, y + 15);

    ctx.fillStyle = '#334155';
    ctx.font = '500 22px sans-serif';
    const lines = text.split('\n');
    if (lines.length > 1) {
      ctx.fillText(lines[0], x + 38, y + 6);
      ctx.font = '400 18px sans-serif';
      ctx.fillText(lines[1], x + 38, y + 26);
    } else {
      ctx.fillText(text, x + 38, y + 15);
    }
  };

  drawItem('📞', phone, 54, 275);
  drawItem('✉️', email, 540, 275);
  drawItem('📍', address, 54, 335);
  drawItem('🌐', website, 540, 335);

  // Download trigger
  const pngUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = `${name.toLowerCase().replace(/\s+/g, '_')}_card.png`;
  link.href = pngUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
