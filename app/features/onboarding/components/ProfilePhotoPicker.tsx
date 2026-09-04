import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';

interface ProfilePhotoPickerProps {
  photoUri: string | null;
  onPhotoSelected: (uri: string | null, base64?: string | null) => void;
}

export const ProfilePhotoPicker: React.FC<ProfilePhotoPickerProps> = ({
  photoUri,
  onPhotoSelected,
}) => {
  const [loading, setLoading] = React.useState(false);

  const handlePickFromLibrary = async () => {
    try {
      setLoading(true);
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Permission required',
          'Veya needs access to your photo library to set your profile picture.',
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

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        onPhotoSelected(asset.uri, asset.base64 || null);
      }
    } catch (err) {
      console.warn('[ProfilePhotoPicker] Pick image error:', err);
      Alert.alert('Error', 'Unable to select image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTakePhoto = async () => {
    try {
      setLoading(true);
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Permission required',
          'Veya needs access to your camera to take a profile picture.',
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        onPhotoSelected(asset.uri, asset.base64 || null);
      }
    } catch (err) {
      console.warn('[ProfilePhotoPicker] Camera error:', err);
      Alert.alert('Error', 'Unable to open camera. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const showOptions = () => {
    Alert.alert('Profile Photo', 'Choose an option to set your Veya photo', [
      { text: 'Take Photo', onPress: handleTakePhoto },
      { text: 'Choose from Library', onPress: handlePickFromLibrary },
      ...(photoUri ? [{ text: 'Remove Photo', style: 'destructive' as const, onPress: () => onPhotoSelected(null, null) }] : []),
      { text: 'Cancel', style: 'cancel' as const },
    ]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={showOptions}
        style={styles.avatarCircle}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={photoUri ? 'Change profile photo' : 'Add profile photo'}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#111111" />
        ) : photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.avatarImage} />
        ) : (
          <View style={styles.placeholderContainer}>
            <Feather name="camera" size={32} color="#6B6B6B" />
            <Text style={styles.placeholderText}>Add Photo</Text>
          </View>
        )}

        {/* Small action badge */}
        <View style={styles.badge}>
          <Feather name={photoUri ? 'edit-2' : 'plus'} size={14} color="#FFFFFF" />
        </View>
      </TouchableOpacity>

      {/* Secondary Controls */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          onPress={showOptions}
          style={styles.actionButton}
          accessibilityRole="button"
        >
          <Text style={styles.actionButtonText}>
            {photoUri ? 'Change photo' : 'Select photo'}
          </Text>
        </TouchableOpacity>

        {photoUri && (
          <TouchableOpacity
            onPress={() => onPhotoSelected(null, null)}
            style={styles.removeButton}
            accessibilityRole="button"
          >
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 24,
  },
  avatarCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FAFAFA',
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 70,
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  placeholderText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B6B6B',
  },
  badge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 18,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111111',
  },
  removeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  removeButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#EF4444',
  },
});
