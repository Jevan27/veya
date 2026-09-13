import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CardBackgroundStyle, UserDto } from '@veya/shared';
import { PRIMARY_COLORS, BACKGROUND_COLORS } from '../../utils/card-colors';
import { CardColorPicker } from './CardColorPicker';
import { CardFontPicker } from './CardFontPicker';
import { CardBackgroundPicker } from './CardBackgroundPicker';
import { VeyaCard } from '../VeyaCard/VeyaCard';

interface EditCardAppearanceTabProps {
  primaryColor: string;
  cardBackgroundColor: string;
  fontFamily: string;
  backgroundStyle: CardBackgroundStyle;
  onSelectPrimaryColor: (hex: string) => void;
  onSelectCardBackgroundColor: (hex: string) => void;
  onSelectFontFamily: (fontId: string) => void;
  onSelectBackgroundStyle: (style: CardBackgroundStyle) => void;
  previewUser: UserDto;
  location: string;
  website: string;
  slogan: string;
  companyLogoUrl: string | null;
}

export const EditCardAppearanceTab: React.FC<EditCardAppearanceTabProps> = ({
  primaryColor,
  cardBackgroundColor,
  fontFamily,
  backgroundStyle,
  onSelectPrimaryColor,
  onSelectCardBackgroundColor,
  onSelectFontFamily,
  onSelectBackgroundStyle,
  previewUser,
  location,
  website,
  slogan,
  companyLogoUrl,
}) => {
  return (
    <>
      {/* Typography Font Picker */}
      <CardFontPicker
        selectedFontId={fontFamily}
        onSelectFont={onSelectFontFamily}
      />

      {/* Card Background Style Dropdown */}
      <CardBackgroundPicker
        selectedStyle={backgroundStyle}
        onSelectStyle={onSelectBackgroundStyle}
      />

      {/* Primary Accent Color */}
      <CardColorPicker
        title="Primary Accent Color"
        iconName="droplet"
        colors={PRIMARY_COLORS}
        selectedColor={primaryColor}
        onSelectColor={onSelectPrimaryColor}
      />

      {/* Card Background Color */}
      <CardColorPicker
        title="Card Background Color"
        iconName="layers"
        colors={BACKGROUND_COLORS}
        selectedColor={cardBackgroundColor}
        onSelectColor={onSelectCardBackgroundColor}
      />

      {/* Preview Section Header */}
      <View style={styles.previewSectionHeader}>
        <View>
          <Text style={styles.previewTitle}>Live Card Preview</Text>
          <Text style={styles.previewSubtitle}>This is how your card will look.</Text>
        </View>
      </View>

      {/* Miniature Business Card Preview */}
      <View style={styles.previewCardWrapper} pointerEvents="none">
        <VeyaCard
          user={previewUser}
          address={location}
          website={website}
          slogan={slogan}
          companyLogoUrl={companyLogoUrl}
          primaryColor={primaryColor}
          cardBackgroundColor={cardBackgroundColor}
          fontFamily={fontFamily}
          backgroundStyle={backgroundStyle}
          isPreviewMode
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  previewSectionHeader: {
    marginTop: 8,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  previewSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  previewCardWrapper: {
    marginHorizontal: -4,
    marginBottom: 16,
  },
});
