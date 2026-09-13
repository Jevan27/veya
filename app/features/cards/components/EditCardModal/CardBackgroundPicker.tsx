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
import { CardBackgroundStyle, CARD_BACKGROUND_STYLES, CardBackgroundStyleOption } from '@veya/shared';

interface CardBackgroundPickerProps {
  selectedStyle: CardBackgroundStyle;
  onSelectStyle: (style: CardBackgroundStyle) => void;
}

interface DropdownItemProps {
  option: CardBackgroundStyleOption;
  isSelected: boolean;
  onSelect: () => void;
  isLast: boolean;
}

const DropdownItem: React.FC<DropdownItemProps> = ({
  option,
  isSelected,
  onSelect,
  isLast,
}) => {
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
      accessibilityLabel={`Background style: ${option.name}. ${option.description}. ${isSelected ? 'Currently selected' : ''}`}
      accessibilityState={{ selected: isSelected }}
    >
      <View style={styles.optionContent}>
        <View style={styles.optionHeaderRow}>
          <Text
            style={[
              styles.optionDisplayName,
              isSelected && styles.optionDisplayNameSelected,
            ]}
          >
            {option.name}
          </Text>
        </View>

        <Text
          style={[
            styles.optionDescription,
            isSelected && styles.optionDescriptionSelected,
          ]}
          numberOfLines={2}
        >
          {option.description}
        </Text>
      </View>

      <View style={styles.optionRight}>
        {isSelected ? (
          <View style={styles.checkCircleSelected}>
            <Feather name="check" size={13} color="#FFFFFF" />
          </View>
        ) : (
          <View style={styles.checkCircleUnselected} />
        )}
      </View>
    </TouchableOpacity>
  );
};

export const CardBackgroundPicker: React.FC<CardBackgroundPickerProps> = ({
  selectedStyle = 'minimal',
  onSelectStyle,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const activeOption =
    CARD_BACKGROUND_STYLES.find((s) => s.id === selectedStyle) ||
    CARD_BACKGROUND_STYLES[0];

  const handleToggle = () => {
    if (Platform.OS !== 'web') {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (styleId: CardBackgroundStyle) => {
    if (Platform.OS !== 'web') {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    onSelectStyle(styleId);
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleWithIcon}>
          <Feather name="grid" size={15} color="#0F172A" style={styles.headerIcon} />
          <Text style={styles.title}>Background</Text>
        </View>
        <Text style={styles.selectedSubtitle}>{activeOption.name}</Text>
      </View>

      {/* Dropdown Trigger Button */}
      <TouchableOpacity
        style={[styles.triggerButton, isOpen && styles.triggerButtonOpen]}
        onPress={handleToggle}
        activeOpacity={0.8}
        accessibilityRole="combobox"
        accessibilityLabel={`Card background dropdown. Selected: ${activeOption.name}. Double tap to ${isOpen ? 'collapse' : 'expand'} options.`}
        accessibilityState={{ expanded: isOpen }}
      >
        <View style={styles.triggerContent}>
          <Text style={styles.triggerDisplayName} numberOfLines={1}>
            {activeOption.name}
          </Text>
          <Text style={styles.triggerDescription} numberOfLines={1}>
            {activeOption.description}
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
          {CARD_BACKGROUND_STYLES.map((option, index) => (
            <DropdownItem
              key={option.id}
              option={option}
              isSelected={activeOption.id === option.id}
              onSelect={() => handleSelect(option.id)}
              isLast={index === CARD_BACKGROUND_STYLES.length - 1}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 6,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.1,
  },
  selectedSubtitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  triggerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAFAFA',
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 56,
  },
  triggerButtonOpen: {
    borderColor: '#0F172A',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  triggerContent: {
    flex: 1,
    marginRight: 10,
  },
  triggerDisplayName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  triggerDescription: {
    fontSize: 12,
    color: '#64748B',
    letterSpacing: -0.1,
  },
  chevronContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevronContainerOpen: {
    backgroundColor: '#E2E8F0',
  },
  dropdownMenu: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderTopWidth: 0,
    borderColor: '#0F172A',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
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
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    letterSpacing: -0.2,
  },
  optionDisplayNameSelected: {
    color: '#0F172A',
    fontWeight: '800',
  },
  optionDescription: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  optionDescriptionSelected: {
    color: '#475569',
  },
  optionRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleSelected: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleUnselected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
});
