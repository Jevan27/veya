import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Platform,
  Alert,
  Linking,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';

const { width } = Dimensions.get('window');
const SCAN_AREA_SIZE = Math.min(width * 0.72, 280);

interface QuickScanModalProps {
  visible: boolean;
  onClose: () => void;
}

export const QuickScanModal: React.FC<QuickScanModalProps> = ({ visible, onClose }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [torch, setTorch] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (scannedData) return; // prevent duplicate trigger
    setScannedData(data);

    Alert.alert(
      'Veya Code Scanned',
      `Result: ${data}`,
      [
        {
          text: 'Scan Again',
          onPress: () => setScannedData(null),
          style: 'cancel',
        },
        {
          text: 'Open Link',
          onPress: async () => {
            setScannedData(null);
            onClose();
            if (data.startsWith('http://') || data.startsWith('https://')) {
              try {
                await Linking.openURL(data);
              } catch {
                Alert.alert('Unable to open URL', data);
              }
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleClose = () => {
    setScannedData(null);
    setTorch(false);
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View style={styles.container}>
        {/* If permissions not yet granted */}
        {!permission?.granted ? (
          <SafeAreaView style={styles.permissionContainer}>
            <View style={styles.permissionCard}>
              <View style={styles.cameraIconBadge}>
                <Feather name="camera" size={32} color="#111111" />
              </View>
              <Text style={styles.permissionTitle}>Camera Access Required</Text>
              <Text style={styles.permissionSubtitle}>
                Veya uses your camera to instantly scan digital business cards and QR codes in real time.
              </Text>
              <TouchableOpacity
                style={styles.permissionButton}
                onPress={requestPermission}
                activeOpacity={0.8}
              >
                <Text style={styles.permissionButtonText}>Enable Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleClose}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        ) : (
          <View style={styles.cameraWrapper}>
            <CameraView
              style={StyleSheet.absoluteFill}
              facing="back"
              enableTorch={torch}
              barcodeScannerSettings={{
                barcodeTypes: ['qr'],
              }}
              onBarcodeScanned={scannedData ? undefined : handleBarcodeScanned}
            />

            {/* Dark Mask Overlays */}
            <SafeAreaView style={styles.overlayContainer}>
              {/* Header Controls */}
              <View style={styles.headerRow}>
                <TouchableOpacity
                  style={styles.circularButton}
                  onPress={() => setTorch((t) => !t)}
                  activeOpacity={0.8}
                  accessibilityLabel="Toggle Flashlight"
                >
                  <Feather
                    name={torch ? 'zap' : 'zap-off'}
                    size={20}
                    color={torch ? '#FBBF24' : '#FFFFFF'}
                  />
                </TouchableOpacity>

                <View style={styles.headerTitleContainer}>
                  <Text style={styles.headerTitle}>Scan QR Code</Text>
                </View>

                <TouchableOpacity
                  style={styles.circularButton}
                  onPress={handleClose}
                  activeOpacity={0.8}
                  accessibilityLabel="Close Scanner"
                >
                  <Feather name="x" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              {/* Viewfinder Target */}
              <View style={styles.viewfinderCenter}>
                <View style={styles.viewfinder}>
                  {/* Corner brackets */}
                  <View style={[styles.corner, styles.cornerTL]} />
                  <View style={[styles.corner, styles.cornerTR]} />
                  <View style={[styles.corner, styles.cornerBL]} />
                  <View style={[styles.corner, styles.cornerBR]} />
                </View>
                <Text style={styles.instructionText}>
                  Align Veya QR code within the frame
                </Text>
              </View>

              {/* Bottom Info Pill */}
              <View style={styles.bottomPillContainer}>
                <View style={styles.badgePill}>
                  <View style={styles.greenDot} />
                  <Text style={styles.badgeText}>Quick Scanner Active</Text>
                </View>
              </View>
            </SafeAreaView>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  permissionCard: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
  },
  cameraIconBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FAFAFA',
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111111',
    letterSpacing: -0.4,
    marginBottom: 10,
    textAlign: 'center',
  },
  permissionSubtitle: {
    fontSize: 14,
    color: '#6B6B6B',
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 32,
  },
  permissionButton: {
    width: '100%',
    height: 52,
    borderRadius: 12,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  permissionButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B6B6B',
  },
  cameraWrapper: {
    flex: 1,
    backgroundColor: '#000000',
  },
  overlayContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 24 : 8,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  circularButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  viewfinderCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewfinder: {
    width: SCAN_AREA_SIZE,
    height: SCAN_AREA_SIZE,
    position: 'relative',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: '#FFFFFF',
  },
  cornerTL: {
    top: -2,
    left: -2,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 16,
  },
  cornerTR: {
    top: -2,
    right: -2,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 16,
  },
  cornerBL: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 16,
  },
  cornerBR: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 16,
  },
  instructionText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 24,
    textAlign: 'center',
  },
  bottomPillContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    gap: 8,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
