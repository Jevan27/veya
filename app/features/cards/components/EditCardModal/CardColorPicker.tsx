import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface ColorOption {
  name: string;
  hex: string;
  isDark?: boolean;
}

interface CardColorPickerProps {
  title: string;
  iconName: React.ComponentProps<typeof Feather>['name'];
  colors: ColorOption[];
  selectedColor: string;
  onSelectColor: (hex: string) => void;
}

export const CardColorPicker: React.FC<CardColorPickerProps> = ({
  title,
  iconName,
  colors,
  selectedColor,
  onSelectColor,
}) => {
  return (
    <View style={styles.colorSectionContainer}>
      <View style={styles.fieldLabelRow}>
        <Feather name={iconName} size={15} color="#64748B" style={styles.fieldIcon} />
        <Text style={styles.fieldLabel}>{title}</Text>
      </View>
      <View style={styles.swatchRow}>
        {colors.map((c) => {
          const isSelected = selectedColor.toLowerCase() === c.hex.toLowerCase();
          const isLight = c.isDark === false;
          return (
            <TouchableOpacity
              key={c.hex}
              onPress={() => onSelectColor(c.hex)}
              style={[
                styles.swatchCircle,
                { backgroundColor: c.hex },
                isLight && styles.swatchCircleLightBorder,
                isSelected && styles.swatchCircleActive,
              ]}
              activeOpacity={0.8}
              accessibilityLabel={`${c.name} color option`}
            >
              {isSelected && (
                <Feather
                  name="check"
                  size={13}
                  color={c.isDark ?? true ? '#FFFFFF' : '#0F172A'}
                  strokeWidth={3}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  colorSectionContainer: {
    marginBottom: 20,
  },
  fieldLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  fieldIcon: {
    marginRight: 8,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  swatchRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  swatchCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatchCircleLightBorder: {
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  swatchCircleActive: {
    borderWidth: 3,
    borderColor: '#0F172A',
  },
});
