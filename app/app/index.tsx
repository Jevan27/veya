import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../features/auth/hooks/useAuth';
import { AuthButton } from '../features/auth/components/AuthButton';
import { usersApi } from '../services/api/users.api';

export default function HomeScreen() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout, updateUser } = useAuth();
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/(auth)/login');
    } else if (!isLoading && isAuthenticated && user && user.onboardingCompleted === false) {
      router.replace('/(onboarding)/welcome');
    }
  }, [isLoading, isAuthenticated, user, router]);

  const handleChangePhoto = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission required', 'Access to your photo library is required to change your avatar.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]?.uri) {
        setIsUploadingPhoto(true);
        const { avatarUrl } = await usersApi.uploadProfilePhoto(result.assets[0].uri);
        if (user) {
          updateUser({ ...user, avatarUrl });
        }
        Alert.alert('Photo Updated', 'Your profile photo has been updated in Cloudflare R2.');
      }
    } catch (err) {
      console.warn('[HomeScreen] Photo upload error:', err);
      Alert.alert('Upload Error', 'Failed to upload photo to Cloudflare R2 storage.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.brand}>veya</Text>
        <ActivityIndicator size="small" color="#111111" />
      </SafeAreaView>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.brand}>veya</Text>

        <View style={styles.card}>
          {/* Avatar with instant R2 upload trigger */}
          <View style={styles.avatarSection}>
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

            <TouchableOpacity
              onPress={handleChangePhoto}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.changePhotoText}>
                {isUploadingPhoto ? 'Uploading to R2...' : 'Change Photo'}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.welcome}>Welcome back,</Text>
          <Text style={styles.name}>{user?.name || 'Veya Member'}</Text>
          {user?.role ? <Text style={styles.roleText}>{user.role}</Text> : null}
          {user?.company ? <Text style={styles.companyText}>{user.company}</Text> : null}
          <Text style={styles.email}>{user?.email}</Text>

          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>
              {user?.onboardingCompleted ? 'Digital Identity Ready' : 'Onboarding Pending'}
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <AuthButton
            title="Sign out"
            onPress={async () => {
              await logout();
              router.replace('/(auth)/login');
            }}
            style={styles.signOutButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  brand: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -1,
    color: '#111111',
    marginBottom: 32,
    fontFamily: 'System',
  },
  card: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
  },
  avatarButton: {
    position: 'relative',
  },
  avatarImage: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
  },
  avatarPlaceholder: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIconBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#111111',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  changePhotoText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111111',
  },
  welcome: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B6B6B',
    marginBottom: 4,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111111',
    letterSpacing: -0.4,
    marginBottom: 2,
  },
  roleText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111111',
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  companyText: {
    fontSize: 14,
    color: '#6B6B6B',
    marginBottom: 8,
  },
  email: {
    fontSize: 14,
    color: '#6B6B6B',
    marginBottom: 20,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#111111',
  },
  actions: {
    marginTop: 'auto',
  },
  signOutButton: {
    backgroundColor: '#111111',
  },
});
