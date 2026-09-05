import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface CardPreviewProps {
  fullName: string;
  role: string;
  company?: string;
  photoUri: string | null;
  phoneNumber?: string | null;
}

export const CardPreview: React.FC<CardPreviewProps> = ({
  fullName,
  role,
  company,
  photoUri,
  phoneNumber,
}) => {
  const displayName = fullName.trim() || 'Your Name';
  const displayRole = role.trim() || 'Professional Role';
  const displayCompany = company?.trim() || 'Company Name';

  // Extract initials if no photo
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');

  return (
    <View style={styles.cardContainer}>
      {/* Top Card Bar */}
      <View style={styles.cardHeader}>
        <View style={styles.brandRow}>
          <View style={styles.brandDot} />
          <Text style={styles.brandName}>veya</Text>
        </View>
        <Feather name="share-2" size={16} color="#6B6B6B" />
      </View>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarInitials}>{initials || 'V'}</Text>
          </View>
        )}
      </View>

      {/* Name, Role & Company */}
      <Text style={styles.nameText} numberOfLines={1}>
        {displayName}
      </Text>
      <Text style={styles.roleText} numberOfLines={1}>
        {displayRole}
      </Text>
      <Text style={styles.companyText} numberOfLines={1}>
        {displayCompany}
      </Text>

      {phoneNumber ? (
        <View style={styles.phoneBadge}>
          <Feather name="phone" size={12} color="#4B5563" style={{ marginRight: 6 }} />
          <Text style={styles.phoneText}>{phoneNumber}</Text>
        </View>
      ) : null}

      {/* Primary Action Button Mock */}
      <View style={styles.saveContactButton}>
        <Feather name="user-plus" size={15} color="#FFFFFF" style={{ marginRight: 8 }} />
        <Text style={styles.saveContactText}>Save Contact</Text>
      </View>

      {/* Quick Action Pill Icons */}
      <View style={styles.actionRow}>
        <View style={styles.actionPill}>
          <Feather name="phone" size={14} color="#111111" />
          <Text style={styles.actionLabel}>Call</Text>
        </View>
        <View style={styles.actionPill}>
          <Feather name="mail" size={14} color="#111111" />
          <Text style={styles.actionLabel}>Email</Text>
        </View>
        <View style={styles.actionPill}>
          <Feather name="send" size={14} color="#111111" />
          <Text style={styles.actionLabel}>Share</Text>
        </View>
      </View>

      {/* Card Footer Tag */}
      <View style={styles.cardFooter}>
        <Text style={styles.cardFooterText}>veya.app/card</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    marginVertical: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#111111',
  },
  brandName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: -0.5,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FAFAFA',
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
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
    backgroundColor: '#F3F4F6',
  },
  avatarInitials: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111111',
  },
  nameText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111111',
    letterSpacing: -0.4,
    marginBottom: 4,
    textAlign: 'center',
  },
  roleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111111',
    letterSpacing: -0.2,
    marginBottom: 2,
    textAlign: 'center',
  },
  companyText: {
    fontSize: 13,
    color: '#6B6B6B',
    marginBottom: 8,
    textAlign: 'center',
  },
  phoneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 16,
  },
  phoneText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  saveContactButton: {
    backgroundColor: '#111111',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 12,
    marginBottom: 16,
  },
  saveContactText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    width: '100%',
    marginBottom: 16,
  },
  actionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 6,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#111111',
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
    width: '100%',
    alignItems: 'center',
  },
  cardFooterText: {
    fontSize: 11,
    color: '#9CA3AF',
    letterSpacing: 0.2,
  },
});
