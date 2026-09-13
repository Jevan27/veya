import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
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
  const [previewFlipped, setPreviewFlipped] = useState(false);

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

        <TouchableOpacity
          style={styles.previewFlipButton}
          onPress={() => setPreviewFlipped((prev) => !prev)}
          activeOpacity={0.7}
        >
          <Feather
            name="refresh-cw"
            size={11}
            color="#0F172A"
            style={{ marginRight: 4 }}
          />
          <Text style={styles.previewFlipText}>
            {previewFlipped ? 'Show Front' : 'Show Back'}
          </Text>
        </TouchableOpacity>
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
          isFlipped={previewFlipped}
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
  previewFlipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  previewFlipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0F172A',
  },
});
