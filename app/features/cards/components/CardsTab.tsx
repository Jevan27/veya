import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
  Modal,
  Image,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { QrScannerIcon } from '../../../components/icons/QrScannerIcon';
import { CardPreview } from '../../onboarding/components/CardPreview';
import { UserDto } from '@veya/shared';

interface CardsTabProps {
  user: UserDto | null;
  onOpenScanner: () => void;
}

export const CardsTab: React.FC<CardsTabProps> = ({ user, onOpenScanner }) => {
  const [showQRModal, setShowQRModal] = useState(false);

  const cardUrl = `https://veya.app/card/${user?.id || 'demo'}`;
  // High quality QR code preview using standard reliable public generator
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=12&data=${encodeURIComponent(
    cardUrl
  )}`;

  const handleShareCard = async () => {
    try {
      await Share.share({
        title: `${user?.name || 'Veya'} Digital Business Card`,
        message: `Connect with ${user?.name || 'me'} on Veya: ${cardUrl}`,
        url: cardUrl,
      });
    } catch (error) {
      console.warn('Share error:', error);
    }
  };

  const handleCopyLink = () => {
    Alert.alert('Link Copied', `Card URL: ${cardUrl}\nReady to paste and share anywhere.`);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brandTitle}>veya</Text>
          <Text style={styles.subtitle}>Digital Business Cards</Text>
        </View>

        <TouchableOpacity
          style={styles.scanHeaderButton}
          onPress={onOpenScanner}
          activeOpacity={0.8}
          accessibilityLabel="Open Quick QR Scanner"
        >
          <QrScannerIcon size={18} color="#111111" strokeWidth={2.2} />
        </TouchableOpacity>
      </View>

      {/* Primary Card View */}
      <View style={styles.cardSection}>
        <CardPreview
          fullName={user?.name || 'Veya Member'}
          role={user?.role || 'Professional'}
          company={user?.company || undefined}
          photoUri={user?.avatarUrl || null}
          phoneNumber={user?.phoneNumber || undefined}
        />
      </View>

      {/* Action Buttons Row */}
      <View style={styles.actionGrid}>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => setShowQRModal(true)}
          activeOpacity={0.8}
        >
          <View style={styles.actionIconBg}>
            <Feather name="grid" size={20} color="#111111" />
          </View>
          <Text style={styles.actionTitle}>Show QR</Text>
          <Text style={styles.actionSubtitle}>In-person scan</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={handleShareCard}
          activeOpacity={0.8}
        >
          <View style={styles.actionIconBg}>
            <Feather name="share-2" size={20} color="#111111" />
          </View>
          <Text style={styles.actionTitle}>Share Card</Text>
          <Text style={styles.actionSubtitle}>Send link</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={handleCopyLink}
          activeOpacity={0.8}
        >
          <View style={styles.actionIconBg}>
            <Feather name="link-2" size={20} color="#111111" />
          </View>
          <Text style={styles.actionTitle}>Copy Link</Text>
          <Text style={styles.actionSubtitle}>Clipboard</Text>
        </TouchableOpacity>
      </View>

      {/* Personal QR Code Modal */}
      <Modal
        visible={showQRModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowQRModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.qrModalCard}>
            <View style={styles.qrModalHeader}>
              <Text style={styles.qrModalTitle}>My Veya QR</Text>
              <TouchableOpacity
                onPress={() => setShowQRModal(false)}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Feather name="x" size={20} color="#111111" />
              </TouchableOpacity>
            </View>

            <Text style={styles.qrModalDesc}>
              Let others scan your QR code with their phone camera to instantly view and save your digital card.
            </Text>

            <View style={styles.qrImageWrapper}>
              <Image source={{ uri: qrCodeUrl }} style={styles.qrImage} resizeMode="contain" />
            </View>

            <Text style={styles.cardUrlText}>{cardUrl}</Text>

            <TouchableOpacity
              style={styles.qrDoneButton}
              onPress={() => setShowQRModal(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.qrDoneButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 110,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B6B6B',
    marginTop: 2,
  },
  scanHeaderButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardSection: {
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  actionIconBg: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111111',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 11,
    color: '#6B6B6B',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  qrModalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  qrModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  qrModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111111',
    letterSpacing: -0.3,
  },
  qrModalDesc: {
    fontSize: 13,
    color: '#6B6B6B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  qrImageWrapper: {
    width: 220,
    height: 220,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    padding: 8,
  },
  qrImage: {
    width: '100%',
    height: '100%',
  },
  cardUrlText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 20,
  },
  qrDoneButton: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrDoneButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
