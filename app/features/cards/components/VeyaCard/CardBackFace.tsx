import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { CardBackgroundStyle } from '@veya/shared';
import { CardBackgroundAccent } from './CardBackgroundAccent';
import { CardContactGrid } from './CardContactGrid';

export interface CardBackFaceProps {
  displayName: string;
  displayRole: string;
  displayCompany: string;
  avatarUrl?: string | null;
  initials: string;
  companyLogoUrl?: string | null;
  phone: string;
  email: string;
  address: string;
  website: string;
  primaryColor?: string;
  cardBackgroundColor?: string;
  isDarkBg: boolean;
  fontFamily?: string;
  backgroundStyle?: CardBackgroundStyle | null;
}

export const CardBackFace: React.FC<CardBackFaceProps> = ({
  displayName,
  displayRole,
  displayCompany,
  avatarUrl,
  initials,
  companyLogoUrl,
  phone,
  email,
  address,
  website,
  primaryColor = '#111111',
  cardBackgroundColor = '#FFFFFF',
  isDarkBg,
  fontFamily,
  backgroundStyle = 'minimal',
}) => {
  const customFont = fontFamily ? { fontFamily } : undefined;

  return (
    <View
      style={[
        styles.faceContainer,
        {
          backgroundColor: cardBackgroundColor,
          borderColor: isDarkBg ? 'rgba(255, 255, 255, 0.14)' : '#EEF2F6',
        },
      ]}
      testID="card-back-face"
    >
      {/* Background Visual Composition Style */}
      <CardBackgroundAccent
        styleName={backgroundStyle}
        primaryColor={primaryColor}
        cardBackgroundColor={cardBackgroundColor}
        isDarkBg={isDarkBg}
      />

      {/* UPPER SECTION: IDENTITY */}
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
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
          ) : (
            <View
              style={[
                styles.avatarFallback,
                {
                  backgroundColor: isDarkBg
                    ? 'rgba(255, 255, 255, 0.1)'
                    : primaryColor + '18',
                },
              ]}
            >
              <Text
                style={[
                  styles.avatarInitials,
                  { color: primaryColor },
                  customFont,
                ]}
              >
                {initials}
              </Text>
            </View>
          )}
        </View>

        {/* Name, Role & Company Identity */}
        <View style={styles.identityDetails}>
          <Text
            style={[
              styles.nameText,
              { color: isDarkBg ? '#FFFFFF' : '#0F172A' },
              customFont,
            ]}
            numberOfLines={1}
          >
            {displayName}
          </Text>
          <Text
            style={[
              styles.roleText,
              { color: isDarkBg ? '#94A3B8' : '#64748B' },
              customFont,
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
              <View
                style={[
                  styles.veyaLogoBadge,
                  { backgroundColor: primaryColor },
                ]}
              >
                <Text style={styles.veyaLogoLetter}>v</Text>
              </View>
            )}
            <Text
              style={[
                styles.companyName,
                { color: isDarkBg ? '#F8FAFC' : '#0F172A' },
                customFont,
              ]}
              numberOfLines={1}
            >
              {displayCompany}
            </Text>
          </View>
        </View>

        {/* Side Tag Badge in Top-Right */}
        <View
          style={[
            styles.sideTag,
            {
              backgroundColor: isDarkBg
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(15, 23, 42, 0.04)',
            },
          ]}
        >
          <Feather
            name="user"
            size={10.5}
            color={isDarkBg ? '#94A3B8' : '#64748B'}
            style={{ marginRight: 4 }}
          />
          <Text
            style={[
              styles.sideTagText,
              { color: isDarkBg ? '#94A3B8' : '#64748B' },
              customFont,
            ]}
          >
            CONTACT
          </Text>
        </View>
      </View>

      {/* Subtle Horizontal Divider */}
      <View
        style={[
          styles.divider,
          {
            backgroundColor: isDarkBg
              ? 'rgba(255, 255, 255, 0.12)'
              : '#F1F5F9',
          },
        ]}
      />

      {/* LOWER SECTION: 2x2 CONTACT GRID */}
      <CardContactGrid
        phone={phone}
        email={email}
        address={address}
        website={website}
        primaryColor={primaryColor}
        isDarkBg={isDarkBg}
        fontFamily={fontFamily}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  faceContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 14,
    borderWidth: 1,
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
  upperSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    zIndex: 2,
  },
  avatarWrapper: {
    width: 48,
    height: 48,
    borderRadius: 14,
    overflow: 'hidden',
    marginRight: 13,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 18,
    fontWeight: '800',
  },
  identityDetails: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 8,
  },
  nameText: {
    fontSize: 16.5,
    fontWeight: '800',
    letterSpacing: -0.3,
    lineHeight: 20,
    marginBottom: 2,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 15,
    marginBottom: 4,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyLogoBadge: {
    width: 14,
    height: 14,
    borderRadius: 3,
    marginRight: 5,
  },
  veyaLogoBadge: {
    width: 14,
    height: 14,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  veyaLogoLetter: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '900',
    marginTop: -1,
  },
  companyName: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  sideTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 12,
  },
  sideTagText: {
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 4,
  },
});
