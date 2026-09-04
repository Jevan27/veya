import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  ViewStyle,
  Image,
  ActivityIndicator,
} from 'react-native';

interface SocialButtonProps {
  onPress?: () => void;
  style?: ViewStyle;
  text?: string;
  loading?: boolean;
  disabled?: boolean;
}

export const SocialButton: React.FC<SocialButtonProps> = ({
  onPress,
  style,
  text = 'Continue with Google',
  loading = false,
  disabled = false,
}) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[styles.button, isDisabled && styles.buttonDisabled, style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={text}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#111111" />
      ) : (
        <>
          <View style={styles.iconContainer}>
            <Image
              source={require('../../../assets/google.png')}
              style={styles.googleIcon}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.text}>{text}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    minHeight: 50,
    paddingHorizontal: 16,
    paddingVertical: 13,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  iconContainer: {
    marginRight: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    width: 18,
    height: 18,
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    letterSpacing: -0.2,
  },
});
