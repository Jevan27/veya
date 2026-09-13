import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SocialLinkDto, CardBackgroundStyle } from '@veya/shared';
import { CardBackgroundAccent } from './CardBackgroundAccent';
import { SocialIcon } from '../SocialIcon';

export interface CardFrontFaceProps {
  company: string;
  companyLogoUrl?: string | null;
  sloganLines?: string[] | null;
  website?: string;
  socialLinks?: SocialLinkDto[] | null;
  primaryColor?: string;
  cardBackgroundColor?: string;
  isDarkBg: boolean;
  fontFamily?: string;
  backgroundStyle?: CardBackgroundStyle | null;
}

export const CardFrontFace: React.FC<CardFrontFaceProps> = ({
  company,
  companyLogoUrl,
  sloganLines,
  website,
  socialLinks,
  primaryColor = '#111111',
  cardBackgroundColor = '#FFFFFF',
  isDarkBg,
  fontFamily,
  backgroundStyle = 'minimal',
}) => {
  const customFont = fontFamily ? { fontFamily } : undefined;
  const displayCompany = company?.trim() || 'Veya';
  const companyInitial = displayCompany[0]?.toUpperCase() || 'V';

  return (
    <View
      style={[
        styles.faceContainer,
        {
          backgroundColor: cardBackgroundColor,
          borderColor: isDarkBg ? 'rgba(255, 255, 255, 0.14)' : '#EEF2F6',
        },
      ]}
      testID="card-front-face"
    >
      {/* Background Visual Composition Style */}
      <CardBackgroundAccent
        styleName={backgroundStyle}
        primaryColor={primaryColor}
        cardBackgroundColor={cardBackgroundColor}
        isDarkBg={isDarkBg}
      />

      {/* TOP ROW: Small subtle brand tag */}
      <View style={styles.topRow}>
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
            name="briefcase"
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
            COMPANY
          </Text>
        </View>

        {website ? (
          <View style={styles.websitePill}>
            <Feather
              name="globe"
              size={10.5}
              color={primaryColor}
              style={{ marginRight: 4 }}
            />
            <Text
              style={[
                styles.websiteText,
                { color: isDarkBg ? '#E2E8F0' : '#475569' },
                customFont,
              ]}
              numberOfLines={1}
            >
              {website.replace(/^https?:\/\/(www\.)?/, '')}
            </Text>
          </View>
        ) : null}
      </View>

      {/* CENTER SECTION: Prominent Company Logo & Company Name */}
      <View style={styles.centerSection}>
        {companyLogoUrl ? (
          <View
            style={[
              styles.logoWrapper,
              isDarkBg && {
                borderColor: 'rgba(255, 255, 255, 0.18)',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
              },
            ]}
          >
            <Image
              source={{ uri: companyLogoUrl }}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
        ) : (
          <View
            style={[
              styles.monogramWrapper,
              {
                backgroundColor: isDarkBg
                  ? 'rgba(255, 255, 255, 0.12)'
                  : primaryColor + '16',
                borderColor: isDarkBg
                  ? 'rgba(255, 255, 255, 0.15)'
                  : primaryColor + '30',
              },
            ]}
          >
            <Text
              style={[
                styles.monogramLetter,
                { color: isDarkBg ? '#FFFFFF' : primaryColor },
                customFont,
              ]}
            >
              {companyInitial}
            </Text>
          </View>
        )}

        <Text
          style={[
            styles.companyTitle,
            { color: isDarkBg ? '#FFFFFF' : '#0F172A' },
            customFont,
          ]}
          numberOfLines={1}
        >
          {displayCompany}
        </Text>

        {/* Slogan Accent (if configured) */}
        {sloganLines && sloganLines.length > 0 ? (
          <View style={styles.sloganRow}>
            <Text
              style={[
                styles.sloganText,
                { color: primaryColor },
                customFont,
              ]}
              numberOfLines={2}
            >
              {sloganLines.join('  ·  ')}
            </Text>
          </View>
        ) : null}
      </View>

      {/* BOTTOM SECTION: Company Social Links */}
      <View style={styles.bottomSection}>
        <View
          style={[
            styles.divider,
            {
              backgroundColor: isDarkBg
                ? 'rgba(255, 255, 255, 0.1)'
                : '#F1F5F9',
            },
          ]}
        />
        <View style={styles.socialRow}>
          {socialLinks && socialLinks.length > 0 ? (
            socialLinks.slice(0, 8).map((link) => (
              <View
                key={link.id}
                style={[
                  styles.socialChip,
                  isDarkBg && {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    borderColor: 'rgba(255, 255, 255, 0.12)',
                  },
                ]}
              >
                <SocialIcon
                  platform={link.platform}
                  size={13}
                  color={isDarkBg ? '#E2E8F0' : primaryColor}
                />
              </View>
            ))
          ) : (
            <View style={styles.socialEmptyRow}>
              <Feather
                name="share-2"
                size={12}
                color={isDarkBg ? '#64748B' : '#94A3B8'}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.socialEmptyText,
                  { color: isDarkBg ? '#64748B' : '#94A3B8' },
                  customFont,
                ]}
              >
                Connect with {displayCompany}
              </Text>
            </View>
          )}
        </View>
      </View>
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
    paddingTop: 14,
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
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 2,
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
  websitePill: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 180,
  },
  websiteText: {
    fontSize: 10.5,
    fontWeight: '500',
  },
  centerSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    zIndex: 2,
  },
  logoWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  logoImage: {
    width: 36,
    height: 36,
    borderRadius: 8,
  },
  monogramWrapper: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  monogramLetter: {
    fontSize: 20,
    fontWeight: '800',
  },
  companyTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  sloganRow: {
    marginTop: 4,
    paddingHorizontal: 12,
  },
  sloganText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    textAlign: 'center',
    opacity: 0.9,
  },
  bottomSection: {
    zIndex: 2,
  },
  divider: {
    height: 1,
    width: '100%',
    marginBottom: 10,
  },
  socialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  socialChip: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialEmptyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  socialEmptyText: {
    fontSize: 11,
    fontWeight: '500',
  },
});
