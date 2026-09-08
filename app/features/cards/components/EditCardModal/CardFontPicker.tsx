import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  LayoutAnimation,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { CARD_FONTS, FontDefinition, getFontDefinition } from '../../fonts/font-registry';
import { useCardFont } from '../../fonts/useCardFont';

interface DropdownItemProps {
  font: FontDefinition;
  isSelected: boolean;
  onSelect: () => void;
  isLast: boolean;
}

const DropdownItem: React.FC<DropdownItemProps> = ({
  font,
  isSelected,
  onSelect,
  isLast,
}) => {
  const { fontFamily } = useCardFont(font.id);

  return (
    <TouchableOpacity
      onPress={onSelect}
      style={[
        styles.optionRow,
        isSelected && styles.optionRowSelected,
        !isLast && styles.optionRowDivider,
      ]}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Font option: ${font.displayName}, ${font.category}. ${font.description}. ${isSelected ? 'Currently selected' : ''}`}
      accessibilityState={{ selected: isSelected }}
    >
      <View style={styles.optionContent}>
        <View style={styles.optionHeaderRow}>
          <Text
            style={[
              styles.optionDisplayName,
              fontFamily ? { fontFamily } : undefined,
              isSelected && styles.optionDisplayNameSelected,
            ]}
          >
            {font.displayName}
          </Text>
          <View style={[styles.categoryBadge, isSelected && styles.categoryBadgeSelected]}>
            <Text style={[styles.categoryBadgeText, isSelected && styles.categoryBadgeTextSelected]}>
              {font.category}
            </Text>
          </View>
        </View>

        <Text
          style={[
            styles.optionSampleText,
            fontFamily ? { fontFamily } : undefined,
            isSelected && styles.optionSampleTextSelected,
          ]}
          numberOfLines={1}
        >
          {font.previewSample}
        </Text>
      </View>

      <View style={[styles.checkCircle, isSelected && styles.checkCircleSelected]}>
        {isSelected && (
          <Feather name="check" size={13} color="#FFFFFF" strokeWidth={3} />
        )}
      </View>
    </TouchableOpacity>
  );
};

interface CardFontPickerProps {
  selectedFontId: string;
  onSelectFont: (fontId: string) => void;
}

export const CardFontPicker: React.FC<CardFontPickerProps> = ({
  selectedFontId,
  onSelectFont,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedFont = getFontDefinition(selectedFontId);
  const { fontFamily: activeFontFamily } = useCardFont(selectedFont.id);

  const toggleDropdown = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen((prev) => !prev);
  };

  const handleSelectFont = (fontId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onSelectFont(fontId);
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      {/* Field Label Header */}
      <View style={styles.fieldLabelRow}>
        <Feather name="type" size={15} color="#64748B" style={styles.fieldIcon} />
        <Text style={styles.fieldLabel}>Card Typography / Font</Text>
      </View>
      <Text style={styles.fieldSubtitle}>
        Select a typography style for your business card preview and export.
      </Text>

      {/* Dropdown Trigger Button */}
      <TouchableOpacity
        onPress={toggleDropdown}
        style={[styles.dropdownTrigger, isOpen && styles.dropdownTriggerOpen]}
        activeOpacity={0.8}
        accessibilityRole="combobox"
        accessibilityLabel={`Card font dropdown. Selected: ${selectedFont.displayName} (${selectedFont.category}). Double tap to ${isOpen ? 'collapse' : 'expand'} font options.`}
        accessibilityState={{ expanded: isOpen }}
      >
        <View style={styles.triggerContent}>
          <View style={styles.triggerTitleRow}>
            <Text
              style={[
                styles.triggerDisplayName,
                activeFontFamily ? { fontFamily: activeFontFamily } : undefined,
              ]}
              numberOfLines={1}
            >
              {selectedFont.displayName}
            </Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{selectedFont.category}</Text>
            </View>
          </View>

          <Text
            style={[
              styles.triggerSampleText,
              activeFontFamily ? { fontFamily: activeFontFamily } : undefined,
            ]}
            numberOfLines={1}
          >
            {selectedFont.previewSample}
          </Text>
        </View>

        <View style={[styles.chevronContainer, isOpen && styles.chevronContainerOpen]}>
          <Feather
            name={isOpen ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={isOpen ? '#0F172A' : '#64748B'}
          />
        </View>
      </TouchableOpacity>

      {/* Dropdown Options List */}
      {isOpen && (
        <View style={styles.dropdownMenu}>
          {CARD_FONTS.map((font, index) => (
            <DropdownItem
              key={font.id}
              font={font}
              isSelected={selectedFont.id === font.id}
              onSelect={() => handleSelectFont(font.id)}
              isLast={index === CARD_FONTS.length - 1}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 22,
  },
  fieldLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  fieldIcon: {
    marginRight: 8,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  fieldSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 10,
    lineHeight: 16,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    minHeight: 62,
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  dropdownTriggerOpen: {
    borderColor: '#0F172A',
    backgroundColor: '#F8FAFC',
  },
  triggerContent: {
    flex: 1,
    marginRight: 10,
  },
  triggerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  triggerDisplayName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginRight: 8,
  },
  triggerSampleText: {
    fontSize: 11,
    color: '#64748B',
    letterSpacing: 0.2,
  },
  chevronContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevronContainerOpen: {
    backgroundColor: '#0F172A15',
  },
  dropdownMenu: {
    marginTop: 8,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 14,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
    minHeight: 56,
  },
  optionRowSelected: {
    backgroundColor: '#F8FAFC',
  },
  optionRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  optionContent: {
    flex: 1,
    marginRight: 12,
  },
  optionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  optionDisplayName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
    marginRight: 8,
  },
  optionDisplayNameSelected: {
    color: '#0F172A',
  },
  categoryBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  categoryBadgeSelected: {
    backgroundColor: '#0F172A15',
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.2,
  },
  categoryBadgeTextSelected: {
    color: '#0F172A',
  },
  optionSampleText: {
    fontSize: 11,
    color: '#64748B',
    letterSpacing: 0.2,
  },
  optionSampleTextSelected: {
    color: '#0F172A',
    fontWeight: '600',
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleSelected: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
});
