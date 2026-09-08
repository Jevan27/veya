import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { VeyaCard } from './VeyaCard/VeyaCard';
import { CardSkeleton } from './VeyaCard/CardSkeleton';
import { EditCardModal } from './EditCardModal/EditCardModal';
import { EditCardData } from '../types/card-form.types';
import { QrScannerIcon } from '../../../components/icons/QrScannerIcon';
import { UserDto } from '@veya/shared';
import { useCard } from '../hooks/useCard';
import { isDarkColor } from '../utils/card-colors';

interface CardsTabProps {
  user: UserDto | null;
  onOpenScanner: () => void;
  onEditCard?: () => void;
  onUserUpdate?: (user: UserDto) => void;
  /** Optional custom slogan (defaults to Veya brand slogan) */
  slogan?: string | string[] | null;
}

export const CardsTab: React.FC<CardsTabProps> = ({
  user,
  onOpenScanner,
  onEditCard,
}) => {
  const { cardData, status, saveCard } = useCard();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const cardUrl = `https://veya.app/card/${user?.id || 'demo'}`;

  const handleOpenEdit = useCallback(() => {
    setIsEditModalVisible(true);
    if (onEditCard) {
      onEditCard();
    }
  }, [onEditCard]);

  const handleSaveCard = useCallback(
    async (updated: EditCardData) => {
      await saveCard(updated);
    },
    [saveCard]
  );

  // Compute effective user representation for VeyaCard
  const effectiveUser = useMemo<UserDto | null>(() => {
    if (!cardData) return null;
    return {
      id: user?.id || 'demo',
      email: cardData.email,
      name: cardData.name,
      role: cardData.role,
      company: cardData.company,
      phoneNumber: cardData.phoneNumber,
      avatarUrl: cardData.avatarUrl,
      onboardingCompleted: true,
      createdAt: user?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }, [cardData, user]);

  // Determine if theme of the customized card is dark for skeleton match
  const isDarkCard = isDarkColor(cardData?.cardBackgroundColor);

  // Render skeleton whenever card data is not yet available in cache
  const shouldShowSkeleton = !cardData || status === 'loading';

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* ──────────────── TOP NAVIGATION BAR ──────────────── */}
        <View style={styles.navBar}>
          <View style={styles.brandTitleWrapper}>
            <Text style={styles.brandTitle}>veya</Text>
          </View>

          <TouchableOpacity
            style={styles.navIconButton}
            onPress={onOpenScanner}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Open QR Scanner"
          >
            <QrScannerIcon size={21} color="#0F172A" strokeWidth={2.4} />
          </TouchableOpacity>
        </View>

        {/* ──────────────── PRIMARY LANDSCAPE DIGITAL CARD ──────────────── */}
        <View style={styles.cardContainer}>
          {shouldShowSkeleton ? (
            <CardSkeleton isDarkTheme={isDarkCard} />
          ) : (
            <VeyaCard
              user={effectiveUser}
              cardUrl={cardUrl}
              address={cardData.location}
              website={cardData.website}
              slogan={cardData.slogan}
              companyLogoUrl={cardData.companyLogoUrl}
              primaryColor={cardData.primaryColor}
              cardBackgroundColor={cardData.cardBackgroundColor}
              fontFamily={cardData.fontFamily}
              onEdit={handleOpenEdit}
            />
          )}
        </View>
      </ScrollView>

      {/* ──────────────── EDIT CARD BOTTOM SHEET MODAL ──────────────── */}
      {cardData && (
        <EditCardModal
          visible={isEditModalVisible}
          onClose={() => setIsEditModalVisible(false)}
          cardData={cardData}
          onSave={handleSaveCard}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 110,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },

  /* ──────── Top Bar ──────── */
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 8,
  },
  navIconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitleWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.8,
  },

  /* ──────── Card Section ──────── */
  cardContainer: {
    width: '100%',
    marginBottom: 16,
  },
});
