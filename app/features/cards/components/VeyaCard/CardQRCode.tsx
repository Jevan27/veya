import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface CardQRCodeProps {
  cardUrl: string;
  qrCodeUrl: string;
}

export const CardQRCode: React.FC<CardQRCodeProps> = ({ cardUrl, qrCodeUrl }) => {
  const displayUrl = cardUrl.replace(/^https?:\/\//, '');

  return (
    <>
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
        <Feather name="globe" size={12} color="#64748B" style={styles.globeIcon} />
        <Text style={styles.cardUrlPillText} numberOfLines={1}>
          {displayUrl}
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  modalQrWrapper: {
    width: 252,
    height: 252,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#EEF2F6',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
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
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
    maxWidth: '85%',
  },
  globeIcon: {
    marginRight: 6,
  },
  cardUrlPillText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
    letterSpacing: -0.2,
  },
});
