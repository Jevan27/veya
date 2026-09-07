import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface CardContactGridProps {
  phone: string;
  email: string;
  address: string;
  website: string;
  primaryColor?: string;
  isDarkBg: boolean;
}

export const CardContactGrid: React.FC<CardContactGridProps> = ({
  phone,
  email,
  address,
  website,
  primaryColor = '#111111',
  isDarkBg,
}) => {
  return (
    <View style={styles.lowerSection}>
      {/* Row 1: Phone & Email */}
      <View style={styles.contactRow}>
        {/* Phone */}
        <View style={styles.contactItem}>
          <View
            style={[
              styles.iconChip,
              isDarkBg && { backgroundColor: 'rgba(255, 255, 255, 0.08)' },
            ]}
          >
            <Feather name="phone" size={13.5} color={primaryColor} />
          </View>
          <Text
            style={[
              styles.contactText,
              { color: isDarkBg ? '#E2E8F0' : '#334155' },
            ]}
            numberOfLines={1}
          >
            {phone}
          </Text>
        </View>

        {/* Email */}
        <View style={styles.contactItem}>
          <View
            style={[
              styles.iconChip,
              isDarkBg && { backgroundColor: 'rgba(255, 255, 255, 0.08)' },
            ]}
          >
            <Feather name="mail" size={13.5} color={primaryColor} />
          </View>
          <Text
            style={[
              styles.contactText,
              { color: isDarkBg ? '#E2E8F0' : '#334155' },
            ]}
            numberOfLines={1}
          >
            {email}
          </Text>
        </View>
      </View>

      {/* Row 2: Location & Website */}
      <View style={styles.contactRow}>
        {/* Address */}
        <View style={styles.contactItem}>
          <View
            style={[
              styles.iconChip,
              isDarkBg && { backgroundColor: 'rgba(255, 255, 255, 0.08)' },
            ]}
          >
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
          <View
            style={[
              styles.iconChip,
              isDarkBg && { backgroundColor: 'rgba(255, 255, 255, 0.08)' },
            ]}
          >
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
  );
};

const styles = StyleSheet.create({
  lowerSection: {
    zIndex: 1,
    paddingTop: 4,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  contactItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  iconChip: {
    width: 25,
    height: 25,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },
  contactText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: -0.2,
    flex: 1,
  },
});
