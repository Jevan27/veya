import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import { UserDto } from '@veya/shared';
import { usersApi } from '../../../services/api/users.api';

interface SettingsTabProps {
  user: UserDto | null;
  onUserUpdate: (updated: UserDto) => void;
  onSignOut: () => Promise<void>;
  onDeleteAccount: () => Promise<void>;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  user,
  onUserUpdate,
  onSignOut,
  onDeleteAccount,
}) => {
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to permanently delete your account? All your digital business cards, profile information, and uploaded media will be permanently removed. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Permanently',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsDeletingAccount(true);
              await onDeleteAccount();
            } catch (err: unknown) {
              console.warn('[SettingsTab] Delete account error:', err);
              const errorMessage = err instanceof Error ? err.message : 'Failed to delete account. Please try again.';
              Alert.alert('Error', errorMessage);
            } finally {
              setIsDeletingAccount(false);
            }
          },
        },
      ]
    );
  };

  const handleChangePhoto = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Permission required',
          'Access to your photo library is required to change your avatar.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        setIsUploadingPhoto(true);

        const { avatarUrl } = asset.base64
          ? await usersApi.uploadProfilePhotoBase64(asset.base64, asset.mimeType || 'image/jpeg')
          : await usersApi.uploadProfilePhoto(asset.uri);

        if (user) {
          onUserUpdate({ ...user, avatarUrl });
        }
        Alert.alert('Photo Updated', 'Your profile picture has been updated in Cloudflare R2.');
      }
    } catch (err) {
      console.warn('[SettingsTab] Photo upload error:', err);
      Alert.alert('Upload Error', 'Failed to upload photo to Cloudflare R2 storage.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleActionStub = (title: string) => {
    Alert.alert(title, 'This setting will be configurable in your next account sync.');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Account & Preferences</Text>
      </View>

      {/* User Profile Overview Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarRow}>
          <TouchableOpacity
            onPress={handleChangePhoto}
            style={styles.avatarButton}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Change profile picture"
          >
            {isUploadingPhoto ? (
              <View style={styles.avatarPlaceholder}>
                <ActivityIndicator size="small" color="#111111" />
              </View>
            ) : user?.avatarUrl ? (
              <Image source={{ uri: user.avatarUrl }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Feather name="user" size={28} color="#111111" />
              </View>
            )}

            <View style={styles.cameraIconBadge}>
              <Feather name="camera" size={12} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          <View style={styles.profileDetails}>
            <Text style={styles.nameText}>{user?.name || 'Veya Member'}</Text>
            {user?.role ? <Text style={styles.roleText}>{user.role}</Text> : null}
            {user?.company ? <Text style={styles.companyText}>{user.company}</Text> : null}
            <Text style={styles.emailText}>{user?.email}</Text>
            {user?.phoneNumber ? <Text style={styles.emailText}>{user.phoneNumber}</Text> : null}
          </View>
        </View>

        <TouchableOpacity
          style={styles.changePhotoButton}
          onPress={handleChangePhoto}
          disabled={isUploadingPhoto}
        >
          <Text style={styles.changePhotoText}>
            {isUploadingPhoto ? 'Uploading to R2...' : 'Update Profile Photo'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Section: Digital Identity */}
      <Text style={styles.sectionHeader}>DIGITAL IDENTITY</Text>
      <View style={styles.sectionGroup}>
        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => handleActionStub('Card Link')}
          activeOpacity={0.7}
        >
          <View style={styles.menuIconWrapper}>
            <Feather name="link" size={16} color="#111111" />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Custom Card URL</Text>
            <Text style={styles.menuSubtitle}>veya.app/card/{user?.id?.slice(0, 8)}</Text>
          </View>
          <Feather name="chevron-right" size={16} color="#9CA3AF" />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => handleActionStub('Storage Provider')}
          activeOpacity={0.7}
        >
          <View style={styles.menuIconWrapper}>
            <Feather name="cloud" size={16} color="#111111" />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Media Storage</Text>
            <Text style={styles.menuSubtitle}>Cloudflare R2 Bucket (Active)</Text>
          </View>
          <Feather name="chevron-right" size={16} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Section: Preferences */}
      <Text style={styles.sectionHeader}>PREFERENCES</Text>
      <View style={styles.sectionGroup}>
        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => handleActionStub('Privacy & Sharing')}
          activeOpacity={0.7}
        >
          <View style={styles.menuIconWrapper}>
            <Feather name="shield" size={16} color="#111111" />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Privacy & Security</Text>
            <Text style={styles.menuSubtitle}>Card visibility and contacts</Text>
          </View>
          <Feather name="chevron-right" size={16} color="#9CA3AF" />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => handleActionStub('Notifications')}
          activeOpacity={0.7}
        >
          <View style={styles.menuIconWrapper}>
            <Feather name="bell" size={16} color="#111111" />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Notifications</Text>
            <Text style={styles.menuSubtitle}>Card scans and views</Text>
          </View>
          <Feather name="chevron-right" size={16} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Account Actions */}
      <TouchableOpacity
        style={styles.signOutButton}
        onPress={onSignOut}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Sign out of account"
      >
        <Feather name="log-out" size={16} color="#374151" style={{ marginRight: 8 }} />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

      {/* Delete Account Button */}
      <TouchableOpacity
        style={styles.deleteAccountButton}
        onPress={handleDeleteAccount}
        disabled={isDeletingAccount}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Permanently delete account"
      >
        {isDeletingAccount ? (
          <ActivityIndicator size="small" color="#DC2626" style={{ marginRight: 8 }} />
        ) : (
          <Feather name="trash-2" size={16} color="#DC2626" style={{ marginRight: 8 }} />
        )}
        <Text style={styles.deleteAccountText}>
          {isDeletingAccount ? 'Deleting Account...' : 'Delete Account'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.versionText}>Veya v0.1.0 • Build 2026</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 110,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: -1,
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B6B6B',
    marginTop: 2,
  },
  profileCard: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 14,
  },
  avatarButton: {
    position: 'relative',
  },
  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIconBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#111111',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileDetails: {
    flex: 1,
  },
  nameText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111111',
    letterSpacing: -0.3,
  },
  roleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111111',
    marginTop: 1,
  },
  companyText: {
    fontSize: 12,
    color: '#6B6B6B',
    marginTop: 1,
  },
  emailText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 3,
  },
  changePhotoButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 10,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changePhotoText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111111',
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionGroup: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 14,
    marginBottom: 24,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  menuIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111111',
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#6B6B6B',
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginLeft: 60,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 10,
  },
  signOutText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  deleteAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 16,
  },
  deleteAccountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DC2626',
  },
  versionText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 4,
  },
});
