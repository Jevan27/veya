import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface CardSkeletonProps {
  isDarkTheme?: boolean;
}

/**
 * Pixel-perfect skeleton matching the exact visual geometry of VeyaCard:
 * - 1.72:1 landscape aspect ratio
 * - Identical borderRadius, padding, elevation, and margins
 * - Avatar squircle (68x68), identity lines, top-right accent placeholder
 * - Horizontal divider
 * - 2x2 contact info grid
 * - Smooth, subtle pulsing opacity loop with useNativeDriver
 */
export const CardSkeleton: React.FC<CardSkeletonProps> = ({ isDarkTheme = false }) => {
  const pulseAnim = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.75,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.35,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();
    return () => animation.stop();
  }, [pulseAnim]);

  const boneColor = isDarkTheme ? '#334155' : '#E2E8F0';
  const cardBg = isDarkTheme ? '#1E293B' : '#FFFFFF';
  const borderColor = isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : '#EEF2F6';
  const dividerColor = isDarkTheme ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9';

  return (
    <View style={styles.cardWrapper}>
      <View
        style={[
          styles.cardContainer,
          {
            backgroundColor: cardBg,
            borderColor,
          },
        ]}
      >
        {/* UPPER SECTION: IDENTITY */}
        <View style={styles.upperSection}>
          {/* Avatar Squircle */}
          <Animated.View
            style={[
              styles.avatarBone,
              { backgroundColor: boneColor, opacity: pulseAnim },
            ]}
          />

          {/* Identity details (Name, Role, Company badge) */}
          <View style={styles.identityDetails}>
            <Animated.View
              style={[
                styles.nameBone,
                { backgroundColor: boneColor, opacity: pulseAnim },
              ]}
            />
            <Animated.View
              style={[
                styles.roleBone,
                { backgroundColor: boneColor, opacity: pulseAnim },
              ]}
            />
            <View style={styles.companyRow}>
              <Animated.View
                style={[
                  styles.companyLogoBone,
                  { backgroundColor: boneColor, opacity: pulseAnim },
                ]}
              />
              <Animated.View
                style={[
                  styles.companyNameBone,
                  { backgroundColor: boneColor, opacity: pulseAnim },
                ]}
              />
            </View>
          </View>

          {/* Slogan Accent placeholder on top right */}
          <View style={styles.sloganPlaceholder}>
            <Animated.View
              style={[
                styles.sloganBoneLine,
                { backgroundColor: boneColor, opacity: pulseAnim },
              ]}
            />
            <Animated.View
              style={[
                styles.sloganBoneLineShort,
                { backgroundColor: boneColor, opacity: pulseAnim },
              ]}
            />
          </View>
        </View>

        {/* Subtle Horizontal Divider */}
        <View style={[styles.divider, { backgroundColor: dividerColor }]} />

        {/* LOWER SECTION: 2x2 CONTACT GRID */}
        <View style={styles.lowerSection}>
          {/* Row 1 */}
          <View style={styles.contactRow}>
            {/* Phone */}
            <View style={styles.contactItem}>
              <Animated.View
                style={[
                  styles.iconChipBone,
                  { backgroundColor: boneColor, opacity: pulseAnim },
                ]}
              />
              <Animated.View
                style={[
                  styles.contactTextBone,
                  { width: '60%', backgroundColor: boneColor, opacity: pulseAnim },
                ]}
              />
            </View>

            {/* Email */}
            <View style={styles.contactItem}>
              <Animated.View
                style={[
                  styles.iconChipBone,
                  { backgroundColor: boneColor, opacity: pulseAnim },
                ]}
              />
              <Animated.View
                style={[
                  styles.contactTextBone,
                  { width: '68%', backgroundColor: boneColor, opacity: pulseAnim },
                ]}
              />
            </View>
          </View>

          {/* Row 2 */}
          <View style={styles.contactRow}>
            {/* Address */}
            <View style={styles.contactItem}>
              <Animated.View
                style={[
                  styles.iconChipBone,
                  { backgroundColor: boneColor, opacity: pulseAnim },
                ]}
              />
              <Animated.View
                style={[
                  styles.contactTextBone,
                  { width: '75%', backgroundColor: boneColor, opacity: pulseAnim },
                ]}
              />
            </View>

            {/* Website */}
            <View style={styles.contactItem}>
              <Animated.View
                style={[
                  styles.iconChipBone,
                  { backgroundColor: boneColor, opacity: pulseAnim },
                ]}
              />
              <Animated.View
                style={[
                  styles.contactTextBone,
                  { width: '55%', backgroundColor: boneColor, opacity: pulseAnim },
                ]}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    aspectRatio: 1.72,
    marginVertical: 12,
  },
  cardContainer: {
    flex: 1,
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 14,
    borderWidth: 1,
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'space-between',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },
  upperSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatarBone: {
    width: 68,
    height: 68,
    borderRadius: 16,
    marginRight: 14,
  },
  identityDetails: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 4,
  },
  nameBone: {
    width: '58%',
    height: 18,
    borderRadius: 6,
    marginBottom: 7,
  },
  roleBone: {
    width: '42%',
    height: 12,
    borderRadius: 4,
    marginBottom: 9,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyLogoBone: {
    width: 17,
    height: 17,
    borderRadius: 4,
    marginRight: 6,
  },
  companyNameBone: {
    width: '38%',
    height: 12,
    borderRadius: 4,
  },
  sloganPlaceholder: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    paddingLeft: 8,
    paddingTop: 4,
  },
  sloganBoneLine: {
    width: 50,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  sloganBoneLineShort: {
    width: 34,
    height: 8,
    borderRadius: 4,
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 4,
  },
  lowerSection: {
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
  iconChipBone: {
    width: 25,
    height: 25,
    borderRadius: 6,
    marginRight: 9,
  },
  contactTextBone: {
    height: 11,
    borderRadius: 4,
  },
});
