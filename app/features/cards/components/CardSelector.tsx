import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { CardDto } from '@veya/shared';

interface CardSelectorProps {
  cards: CardDto[];
  activeCardId: string | null;
  onSelectCard: (cardId: string) => void;
}

export const CardSelector: React.FC<CardSelectorProps> = ({
  cards,
  activeCardId,
  onSelectCard,
}) => {
  if (!cards || cards.length <= 1) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Your Cards</Text>
        <Text style={styles.cardCountText}>
          {cards.length} {cards.length === 1 ? 'card' : 'cards'}
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {cards.map((card, index) => {
          const isSelected = card.id === activeCardId;
          const displayTitle = card.company || card.role || card.name || `Card ${index + 1}`;
          const dotColor = card.primaryColor || '#111111';

          return (
            <TouchableOpacity
              key={card.id}
              onPress={() => onSelectCard(card.id)}
              style={[
                styles.cardChip,
                isSelected ? styles.cardChipActive : styles.cardChipInactive,
              ]}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityLabel={`Select ${displayTitle}${card.isDefault ? ', default card' : ''}. ${isSelected ? 'Currently active' : ''}`}
              accessibilityState={{ selected: isSelected }}
            >
              {/* Card Color Accent Dot */}
              <View
                style={[
                  styles.accentDot,
                  { backgroundColor: dotColor },
                  isSelected && styles.accentDotActive,
                ]}
              />

              <Text
                style={[
                  styles.cardChipText,
                  isSelected ? styles.cardChipTextActive : styles.cardChipTextInactive,
                ]}
                numberOfLines={1}
              >
                {displayTitle}
              </Text>

              {card.isDefault && (
                <View
                  style={[
                    styles.defaultBadge,
                    isSelected && styles.defaultBadgeActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.defaultBadgeText,
                      isSelected && styles.defaultBadgeTextActive,
                    ]}
                  >
                    Default
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  cardCountText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#94A3B8',
  },
  scrollContent: {
    paddingVertical: 2,
    gap: 8,
  },
  cardChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    minHeight: 38,
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  cardChipActive: {
    backgroundColor: '#0F172A',
  },
  cardChipInactive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  accentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  accentDotActive: {
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  cardChipText: {
    fontSize: 13,
    fontWeight: '600',
    marginRight: 6,
  },
  cardChipTextActive: {
    color: '#FFFFFF',
  },
  cardChipTextInactive: {
    color: '#334155',
  },
  defaultBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  defaultBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  defaultBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  defaultBadgeTextActive: {
    color: '#FFFFFF',
  },
});
