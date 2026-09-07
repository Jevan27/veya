import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface MediaPickerCardProps {
  title: string;
  subtitle: string;
  imageUri?: string | null;
  fallbackText?: string;
  isCircle?: boolean;
  onPress: () => void;
}

export const MediaPickerCard: React.FC<MediaPickerCardProps> = ({
  title,
  subtitle,
  imageUri,
  fallbackText = 'V',
  isCircle = true,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.mediaCard}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={isCircle ? styles.avatarCircleWrapper : styles.logoSquircleWrapper}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={isCircle ? styles.avatarCircleImage : styles.logoSquircleImage}
            resizeMode={isCircle ? 'cover' : 'contain'}
          />
        ) : (
          <View style={isCircle ? styles.avatarCircleFallback : styles.logoSquircleFallback}>
            <Text style={isCircle ? styles.avatarCircleInitials : styles.logoLetter}>
              {fallbackText}
            </Text>
          </View>
        )}
        <View style={styles.cameraBadge}>
          <Feather name="camera" size={12} color="#FFFFFF" />
        </View>
      </View>
      <Text style={styles.mediaCardTitle}>{title}</Text>
      <Text style={styles.mediaCardSubtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mediaCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#EEF2F6',
  },
  avatarCircleWrapper: {
    position: 'relative',
    width: 58,
    height: 58,
    borderRadius: 29,
    marginBottom: 10,
  },
  avatarCircleImage: {
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  avatarCircleFallback: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#EEF2F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCircleInitials: {
    fontSize: 20,
    fontWeight: '700',
    color: '#475569',
  },
  logoSquircleWrapper: {
    position: 'relative',
    width: 58,
    height: 58,
    borderRadius: 14,
    marginBottom: 10,
  },
  logoSquircleImage: {
    width: 58,
    height: 58,
    borderRadius: 14,
  },
  logoSquircleFallback: {
    width: 58,
    height: 58,
    borderRadius: 14,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoLetter: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: -2,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#0F172A',
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  mediaCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  mediaCardSubtitle: {
    fontSize: 11,
    color: '#64748B',
  },
});
