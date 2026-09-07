import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface CardHeaderProps {
  displayName: string;
  displayRole: string;
  displayCompany: string;
  avatarUrl?: string | null;
  initials: string;
  companyLogoUrl?: string | null;
  sloganLines?: string[] | null;
  primaryColor?: string;
  isDarkBg: boolean;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  displayName,
  displayRole,
  displayCompany,
  avatarUrl,
  initials,
  companyLogoUrl,
  sloganLines,
  primaryColor = '#111111',
  isDarkBg,
}) => {
  return (
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
                backgroundColor: isDarkBg ? 'rgba(255, 255, 255, 0.1)' : primaryColor + '18',
              },
            ]}
          >
            <Text style={[styles.avatarInitials, { color: primaryColor }]}>{initials}</Text>
          </View>
        )}
      </View>

      {/* Name, Role & Company Identity */}
      <View style={styles.identityDetails}>
        <Text
          style={[
            styles.nameText,
            { color: isDarkBg ? '#FFFFFF' : '#0F172A' },
          ]}
          numberOfLines={1}
        >
          {displayName}
        </Text>
        <Text
          style={[
            styles.roleText,
            { color: isDarkBg ? '#94A3B8' : '#64748B' },
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
            <View style={[styles.veyaLogoBadge, { backgroundColor: primaryColor }]}>
              <Text style={styles.veyaLogoLetter}>v</Text>
            </View>
          )}
          <Text
            style={[
              styles.companyName,
              { color: isDarkBg ? '#F8FAFC' : '#0F172A' },
            ]}
            numberOfLines={1}
          >
            {displayCompany}
          </Text>
        </View>
      </View>

      {/* Slogan on the right side (optional) */}
      {sloganLines && sloganLines.length > 0 && (
        <View style={styles.sloganContainer}>
          {sloganLines.map((line, idx) => (
            <Text
              key={idx}
              style={[
                styles.sloganLine,
                { color: isDarkBg ? '#F1F5F9' : '#0F172A' },
              ]}
            >
              {line.toUpperCase()}
            </Text>
          ))}
          <View style={[styles.sloganUnderline, { backgroundColor: primaryColor }]} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  upperSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    zIndex: 1,
  },
  avatarWrapper: {
    width: 68,
    height: 68,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111111',
    letterSpacing: -0.5,
  },
  identityDetails: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 1,
  },
  nameText: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.4,
    marginBottom: 2,
  },
  roleText: {
    fontSize: 12.5,
    fontWeight: '500',
    marginBottom: 7,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyLogoBadge: {
    width: 17,
    height: 17,
    borderRadius: 4,
    marginRight: 6,
  },
  veyaLogoBadge: {
    width: 17,
    height: 17,
    borderRadius: 4,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  veyaLogoLetter: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    marginTop: -1,
  },
  companyName: {
    fontSize: 12.5,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  sloganContainer: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    paddingLeft: 8,
  },
  sloganLine: {
    fontSize: 7.5,
    fontWeight: '800',
    letterSpacing: 0.6,
    lineHeight: 9.5,
  },
  sloganUnderline: {
    width: 22,
    height: 2,
    marginTop: 3,
    borderRadius: 1,
  },
});
