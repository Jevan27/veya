import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { CountryItem } from '../../../onboarding/constants/countries';
import { CountryPickerModal } from '../../../onboarding/components/CountryPickerModal';
import {
  formatNationalPhoneNumber,
  parsePhoneNumber,
  combinePhoneNumber,
} from '../../utils/phone-format';

interface EditCardContactTabProps {
  phoneNumber: string;
  email: string;
  location: string;
  website: string;
  onChangePhoneNumber: (val: string) => void;
  onChangeEmail: (val: string) => void;
  onChangeLocation: (val: string) => void;
  onChangeWebsite: (val: string) => void;
}

export const EditCardContactTab: React.FC<EditCardContactTabProps> = ({
  phoneNumber,
  email,
  location,
  website,
  onChangePhoneNumber,
  onChangeEmail,
  onChangeLocation,
  onChangeWebsite,
}) => {
  const initialParsed = parsePhoneNumber(phoneNumber);
  const [selectedCountry, setSelectedCountry] = useState<CountryItem>(initialParsed.country);
  const [nationalNumber, setNationalNumber] = useState<string>(initialParsed.nationalNumber);
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  // Synchronize when parent updates phoneNumber externally (e.g. card switch or initial load)
  useEffect(() => {
    const currentCombined = combinePhoneNumber(selectedCountry, nationalNumber);
    if (phoneNumber !== currentCombined) {
      const parsed = parsePhoneNumber(phoneNumber);
      setSelectedCountry(parsed.country);
      setNationalNumber(parsed.nationalNumber);
    }
  }, [phoneNumber]);

  const handleNumberChange = (rawText: string) => {
    // If the user pastes a number with international dial code (e.g. "+1 555 123 4567")
    if (rawText.trim().startsWith('+')) {
      const parsed = parsePhoneNumber(rawText);
      setSelectedCountry(parsed.country);
      setNationalNumber(parsed.nationalNumber);
      onChangePhoneNumber(combinePhoneNumber(parsed.country, parsed.nationalNumber));
      return;
    }

    const formatted = formatNationalPhoneNumber(rawText);
    setNationalNumber(formatted);
    onChangePhoneNumber(combinePhoneNumber(selectedCountry, formatted));
  };

  const handleSelectCountry = (country: CountryItem) => {
    setSelectedCountry(country);
    onChangePhoneNumber(combinePhoneNumber(country, nationalNumber));
  };

  return (
    <>
      {/* Phone Number with Non-Erasable Country Code & Auto-Spacing */}
      <View style={styles.formFieldContainer}>
        <View style={styles.fieldLabelRow}>
          <Feather name="phone" size={15} color="#64748B" style={styles.fieldIcon} />
          <Text style={styles.fieldLabel}>Phone Number</Text>
        </View>
        <View style={styles.phoneInputRow}>
          <TouchableOpacity
            style={styles.countryCodePill}
            onPress={() => setIsPickerVisible(true)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`Country dial code, currently ${selectedCountry.name} ${selectedCountry.dialCode}`}
          >
            <Text style={styles.flagEmoji}>{selectedCountry.flag}</Text>
            <Text style={styles.dialCodeText}>{selectedCountry.dialCode}</Text>
            <Feather name="chevron-down" size={13} color="#64748B" style={styles.chevronIcon} />
          </TouchableOpacity>

          <TextInput
            style={styles.phoneTextInput}
            value={nationalNumber}
            onChangeText={handleNumberChange}
            keyboardType="phone-pad"
            placeholder={
              selectedCountry.code === 'US' || selectedCountry.code === 'CA'
                ? '555 123 4567'
                : '912 345 6789'
            }
            placeholderTextColor="#94A3B8"
            accessibilityLabel="National phone number"
          />
        </View>

        <CountryPickerModal
          visible={isPickerVisible}
          selectedCountry={selectedCountry}
          onSelect={handleSelectCountry}
          onClose={() => setIsPickerVisible(false)}
        />
      </View>

      {/* Email Address */}
      <View style={styles.formFieldContainer}>
        <View style={styles.fieldLabelRow}>
          <Feather name="mail" size={15} color="#64748B" style={styles.fieldIcon} />
          <Text style={styles.fieldLabel}>Email Address</Text>
        </View>
        <TextInput
          style={styles.textInput}
          value={email}
          onChangeText={onChangeEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="e.g. jevan@veya.app"
          placeholderTextColor="#94A3B8"
        />
      </View>

      {/* Location */}
      <View style={styles.formFieldContainer}>
        <View style={styles.fieldLabelRow}>
          <Feather name="map-pin" size={15} color="#64748B" style={styles.fieldIcon} />
          <Text style={styles.fieldLabel}>Location</Text>
        </View>
        <TextInput
          style={styles.textInput}
          value={location}
          onChangeText={onChangeLocation}
          placeholder="e.g. Caloocan, Metro Manila, Philippines"
          placeholderTextColor="#94A3B8"
        />
      </View>

      {/* Website */}
      <View style={styles.formFieldContainer}>
        <View style={styles.fieldLabelRow}>
          <Feather name="globe" size={15} color="#64748B" style={styles.fieldIcon} />
          <Text style={styles.fieldLabel}>Website</Text>
        </View>
        <TextInput
          style={styles.textInput}
          value={website}
          onChangeText={onChangeWebsite}
          keyboardType="url"
          autoCapitalize="none"
          placeholder="e.g. https://www.veya.app"
          placeholderTextColor="#94A3B8"
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  formFieldContainer: {
    marginBottom: 16,
  },
  fieldLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  fieldIcon: {
    marginRight: 8,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countryCodePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#EEF2F6',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  flagEmoji: {
    fontSize: 18,
  },
  dialCodeText: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#0F172A',
    marginLeft: 6,
    marginRight: 4,
  },
  chevronIcon: {
    marginLeft: 1,
  },
  phoneTextInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#EEF2F6',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14.5,
    color: '#0F172A',
    fontWeight: '500',
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#EEF2F6',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14.5,
    color: '#0F172A',
    fontWeight: '500',
  },
});
