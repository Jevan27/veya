import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { CardBackgroundStyle, CARD_BACKGROUND_STYLES, UserDto } from '@veya/shared';
import { VeyaCard } from '../../cards/components/VeyaCard/VeyaCard';
import { useOnboarding } from '../context/OnboardingContext';

interface CardStyleSelectorProps {
  selectedStyle: CardBackgroundStyle;
  onSelectStyle: (style: CardBackgroundStyle) => void;
}

export const CardStyleSelector: React.FC<CardStyleSelectorProps> = ({
  selectedStyle,
  onSelectStyle,
}) => {
  const { fullName, role, company, photoUri, phoneNumber, country } = useOnboarding();

  const formattedPhone = phoneNumber.trim()
    ? `${country.dialCode} ${phoneNumber.trim()}`
    : undefined;

  const previewUser: UserDto = useMemo(
    () => ({
      id: 'preview-id',
      email: 'hello@veya.app',
      name: fullName.trim() || 'Your Name',
      role: role.trim() || 'Professional Role',
      company: company.trim() || 'Company Name',
      avatarUrl: photoUri || null,
      phoneNumber: formattedPhone || null,
      onboardingCompleted: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }),
    [fullName, role, company, photoUri, formattedPhone],
  );

  return (
    <View style={styles.container}>
      {CARD_BACKGROUND_STYLES.map((option) => {
        const isSelected = selectedStyle === option.id;

        return (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionCard,
              isSelected ? styles.optionCardSelected : styles.optionCardUnselected,
            ]}
            onPress={() => onSelectStyle(option.id)}
            activeOpacity={0.85}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={`${option.name} background style. ${option.description}`}
          >
            {/* Header: Name, Description & Selection Badge */}
            <View style={styles.optionHeader}>
              <View style={styles.optionTextContainer}>
                <View style={styles.titleRow}>
                  <Text
                    style={[
                      styles.optionName,
                      isSelected && styles.optionNameSelected,
                    ]}
                  >
                    {option.name}
                  </Text>
                  {option.id === 'minimal' && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultBadgeText}>Default</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </View>

              {/* Radio Indicator */}
              <View
                style={[
                  styles.radioOuter,
                  isSelected ? styles.radioOuterSelected : styles.radioOuterUnselected,
                ]}
              >
                {isSelected && (
                  <View style={styles.radioInner}>
                    <Feather name="check" size={12} color="#FFFFFF" />
                  </View>
                )}
              </View>
            </View>

            {/* Live Interactive/Miniature Card Preview */}
            <View style={styles.previewContainer} pointerEvents="none">
              <VeyaCard
                user={previewUser}
                primaryColor="#111111"
                cardBackgroundColor="#FFFFFF"
                backgroundStyle={option.id}
                isPreviewMode
              />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingBottom: 8,
  },
  optionCard: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  optionCardUnselected: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
  },
  optionCardSelected: {
    backgroundColor: '#FAFAFA',
    borderWidth: 2,
    borderColor: '#111111',
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  optionTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 3,
  },
  optionName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  optionNameSelected: {
    color: '#111111',
    fontWeight: '800',
  },
  defaultBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  defaultBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  optionDescription: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  radioOuterUnselected: {
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
  },
  radioOuterSelected: {
    backgroundColor: '#111111',
  },
  radioInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewContainer: {
    marginHorizontal: -4,
    marginTop: 4,
    marginBottom: -4,
  },
});
