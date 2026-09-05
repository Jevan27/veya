import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { CountryItem } from '../constants/countries';
import { CountryPickerModal } from './CountryPickerModal';

interface PhoneInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  selectedCountry: CountryItem;
  onSelectCountry: (country: CountryItem) => void;
  error?: string | null;
  placeholder?: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  label = 'Phone number',
  value,
  onChangeText,
  selectedCountry,
  onSelectCountry,
  error,
  placeholder = 'Mobile phone number',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  return (
    <View style={styles.container}>
      {!!label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
          !!error && styles.inputWrapperError,
        ]}
      >
        {/* Country Code Trigger */}
        <TouchableOpacity
          style={styles.countryTrigger}
          onPress={() => setIsPickerVisible(true)}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={`Select country code, currently ${selectedCountry.name} ${selectedCountry.dialCode}`}
        >
          <Text style={styles.flag}>{selectedCountry.flag}</Text>
          <Text style={styles.dialCode}>{selectedCountry.dialCode}</Text>
          <Feather name="chevron-down" size={14} color="#6B7280" style={{ marginLeft: 2 }} />
        </TouchableOpacity>

        {/* Vertical Divider */}
        <View style={styles.divider} />

        {/* Phone digits input */}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChangeText}
          keyboardType="phone-pad"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          selectionColor="#0F172A"
          accessibilityLabel={label}
        />
      </View>

      {!!error && <Text style={styles.errorText}>{error}</Text>}

      {/* Country selection modal */}
      <CountryPickerModal
        visible={isPickerVisible}
        selectedCountry={selectedCountry}
        onSelect={onSelectCountry}
        onClose={() => setIsPickerVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
    letterSpacing: -0.1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1.2,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    minHeight: 50,
    paddingHorizontal: 12,
  },
  inputWrapperFocused: {
    borderColor: '#0F172A',
    backgroundColor: '#FFFFFF',
  },
  inputWrapperError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  countryTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingRight: 10,
  },
  flag: {
    fontSize: 18,
    marginRight: 6,
  },
  dialCode: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#E5E7EB',
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    paddingVertical: 12,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 5,
    marginLeft: 2,
    fontWeight: '500',
  },
});
