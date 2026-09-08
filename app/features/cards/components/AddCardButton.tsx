import React from 'react';
import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

interface AddCardButtonProps {
  onPress: () => void;
  marginAboveNavBar?: number;
}

const NAVBAR_BASE_HEIGHT = 58;

export const AddCardButton: React.FC<AddCardButtonProps> = ({
  onPress,
  marginAboveNavBar = 16,
}) => {
  const insets = useSafeAreaInsets();
  const navBarBottomPadding = Math.max(insets.bottom, 12);
  const totalNavBarHeight = NAVBAR_BASE_HEIGHT + navBarBottomPadding;
  const bottomPosition = totalNavBarHeight + marginAboveNavBar;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.floatingButton, { bottom: bottomPosition }]}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel="Add new business card"
      accessibilityHint="Opens the form to create a new digital business card"
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Feather name="plus" size={26} color="#FFFFFF" strokeWidth={2.4} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
    }),
  },
});
