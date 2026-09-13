import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Modal,
  Animated,
  Linking,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SocialLinkDto } from '@veya/shared';
import { CardQRCode } from './CardQRCode';
import { SocialIcon } from '../SocialIcon';

interface CardModalProps {
  visible: boolean;
  onClose: () => void;
  cardUrl: string;
  qrCodeUrl: string;
  socialLinks?: SocialLinkDto[] | null;
  onEdit: () => void;
  onShare: () => void;
  onCopyLink: () => void;
  showCopyFeedback: boolean;
  onDownloadPng: () => void;
  isDownloading: boolean;
  showToast: boolean;
  toastAnim: Animated.Value;
}

export const CardModal: React.FC<CardModalProps> = ({
  visible,
  onClose,
  cardUrl,
  qrCodeUrl,
  socialLinks,
  onEdit,
  onShare,
  onCopyLink,
  showCopyFeedback,
  onDownloadPng,
  isDownloading,
  showToast,
  toastAnim,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
          {/* Modal Top Header */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Digital Business Card</Text>
              <Text style={styles.modalSubtitle}>Scan with camera to connect</Text>
            </View>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={onClose}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              accessibilityLabel="Close modal"
            >
              <Feather name="x" size={18} color="#0F172A" />
            </TouchableOpacity>
          </View>

          {/* QR Code Frame & URL Pill */}
          <CardQRCode cardUrl={cardUrl} qrCodeUrl={qrCodeUrl} />

          {/* Action Buttons Row Below QR */}
          <View style={styles.modalIconActionsRow}>
            {/* Edit Icon Button */}
            <TouchableOpacity
              style={styles.modalIconButtonWrapper}
              onPress={onEdit}
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
              onPress={onShare}
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
              onPress={onCopyLink}
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
              onPress={onDownloadPng}
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
                  isDownloading && styles.modalIconLabelDownloading,
                ]}
              >
                {isDownloading ? 'Saved!' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Social Profiles Row */}
          {socialLinks && socialLinks.length > 0 && (
            <View style={styles.modalSocialSection}>
              <Text style={styles.modalSocialHeading}>Connect & Follow</Text>
              <View style={styles.modalSocialIconsRow}>
                {socialLinks.map((link) => (
                  <TouchableOpacity
                    key={link.id}
                    style={styles.modalSocialChip}
                    onPress={() => Linking.openURL(link.url)}
                    activeOpacity={0.7}
                    accessibilityRole="link"
                    accessibilityLabel={`Open ${link.platform} link`}
                  >
                    <SocialIcon platform={link.platform} size={16} color="#0F172A" />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </Pressable>

        {/* Bottom Toast Notification (Inside Modal) */}
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
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 22,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.2,
    shadowRadius: 28,
    elevation: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 18,
    paddingHorizontal: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
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
  modalIconLabelDownloading: {
    color: '#111111',
    fontWeight: '700',
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
  modalSocialSection: {
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    alignItems: 'center',
    width: '100%',
  },
  modalSocialHeading: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  modalSocialIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  modalSocialChip: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#EEF2F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
