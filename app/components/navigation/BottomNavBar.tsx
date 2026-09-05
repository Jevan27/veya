import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { QrScannerIcon } from '../icons/QrScannerIcon';

export type TabType = 'cards' | 'settings';

const BAR_HEIGHT = 58;
const BUTTON_SIZE = 46;

interface BottomNavBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onCameraPress: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onTabChange,
  onCameraPress,
}) => {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 12);

  return (
    <View
      style={[
        styles.container,
        {
          height: BAR_HEIGHT + bottomPadding,
          paddingBottom: bottomPadding,
        },
      ]}
    >
      {/* Left tab: Cards */}
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => onTabChange('cards')}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Cards"
      >
        <Feather
          name="credit-card"
          size={22}
          color={activeTab === 'cards' ? '#111111' : '#8E8E93'}
        />
      </TouchableOpacity>

      {/* Center: Scanner button (aligned in bar, dark circular style) */}
      <View style={styles.centerContainer}>
        <TouchableOpacity
          style={styles.scannerButton}
          onPress={onCameraPress}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Scan QR Code"
        >
          <QrScannerIcon size={22} color="#FFFFFF" strokeWidth={2.4} />
        </TouchableOpacity>
      </View>

      {/* Right tab: Settings */}
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => onTabChange('settings')}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Settings"
      >
        <Feather
          name="settings"
          size={22}
          color={activeTab === 'settings' ? '#111111' : '#8E8E93'}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: BAR_HEIGHT,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: BAR_HEIGHT,
  },
  scannerButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.16,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});
