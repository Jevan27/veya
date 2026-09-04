import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const SUGGESTED_ROLES = [
  'Software Engineer',
  'Web Developer',
  'Designer',
  'Photographer',
  'Videographer',
  'Consultant',
  'Real Estate Agent',
  'Architect',
  'Marketing Specialist',
  'Business Owner',
  'Freelancer',
  'Sales Manager',
  'Accountant',
  'Lawyer',
  'Doctor',
  'Dentist',
  'Coach',
  'Trainer',
];

interface RoleComboboxProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string | null;
}

export const RoleCombobox: React.FC<RoleComboboxProps> = ({
  value,
  onChangeText,
  error,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // Filter suggestions based on current input text
  const filteredSuggestions = useMemo(() => {
    const trimmed = value.trim().toLowerCase();
    if (!trimmed) {
      return SUGGESTED_ROLES.slice(0, 8);
    }
    return SUGGESTED_ROLES.filter((r) => r.toLowerCase().includes(trimmed)).slice(0, 6);
  }, [value]);

  const handleSelect = (selectedRole: string) => {
    onChangeText(selectedRole);
    setIsFocused(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Role / Title</Text>

      {/* Input Field */}
      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
          !!error && styles.inputWrapperError,
        ]}
      >
        <TextInput
          style={styles.input}
          placeholder="What do you do? (e.g. Software Engineer)"
          placeholderTextColor="#A1A1A1"
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          selectionColor="#111111"
          autoCapitalize="words"
          autoCorrect={false}
          accessibilityLabel="Role or Title"
        />
        {value.length > 0 && (
          <TouchableOpacity
            onPress={() => onChangeText('')}
            style={styles.clearButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Feather name="x" size={16} color="#6B6B6B" />
          </TouchableOpacity>
        )}
      </View>

      {!!error && <Text style={styles.errorText}>{error}</Text>}

      {/* Quick Suggestions Chips */}
      <View style={styles.suggestionsHeader}>
        <Text style={styles.suggestionsLabel}>Suggestions or enter custom</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsContainer}
        keyboardShouldPersistTaps="handled"
      >
        {filteredSuggestions.map((role) => {
          const isSelected = value.trim().toLowerCase() === role.toLowerCase();
          return (
            <TouchableOpacity
              key={role}
              onPress={() => handleSelect(role)}
              style={[styles.chip, isSelected && styles.chipSelected]}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={`Select role ${role}`}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {role}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111111',
    marginBottom: 6,
    letterSpacing: -0.1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 10,
    minHeight: 50,
    paddingHorizontal: 14,
  },
  inputWrapperFocused: {
    borderColor: '#111111',
    backgroundColor: '#FFFFFF',
  },
  inputWrapperError: {
    borderColor: '#EF4444',
    backgroundColor: '#FFF5F5',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#111111',
    paddingVertical: 12,
  },
  clearButton: {
    padding: 6,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 5,
    marginLeft: 2,
    fontWeight: '500',
  },
  suggestionsHeader: {
    marginTop: 10,
    marginBottom: 8,
  },
  suggestionsLabel: {
    fontSize: 12,
    color: '#6B6B6B',
    fontWeight: '500',
  },
  chipsContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  chipSelected: {
    backgroundColor: '#111111',
    borderColor: '#111111',
  },
  chipText: {
    fontSize: 13,
    color: '#6B6B6B',
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
