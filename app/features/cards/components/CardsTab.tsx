import React, { useState, useMemo, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { VeyaCard } from './VeyaCard/VeyaCard';
import { CardFlipButton } from './VeyaCard/CardFlipButton';
import { CardVisibilityButton } from './VeyaCard/CardVisibilityButton';
import { CardSkeleton } from './VeyaCard/CardSkeleton';
import { EditCardModal } from './EditCardModal/EditCardModal';
import { CardSelector } from './CardSelector';
import { AddCardButton } from './AddCardButton';
import { EditCardData } from '../types/card-form.types';
import { QrScannerIcon } from '../../../components/icons/QrScannerIcon';
import { Toast } from '../../../components/Toast';
import { UserDto } from '@veya/shared';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCard } from '../hooks/useCard';
import { isDarkColor } from '../utils/card-colors';
import { getPublicCardWebUrl } from '../utils/card-url';

interface CardsTabProps {
  user: UserDto | null;
  onOpenScanner: () => void;
  onEditCard?: () => void;
  onUserUpdate?: (user: UserDto) => void;
}

const DEFAULT_LOCATION = 'Caloocan, Metro Manila, Philippines';
const DEFAULT_WEBSITE = 'https://www.veya.app';

export const CardsTab: React.FC<CardsTabProps> = ({
  user,
  onOpenScanner,
  onEditCard,
}) => {
  const {
    cards,
    activeCardId,
    card,
    cardData,
    status,
    setActiveCardId,
    createCard,
    saveCard,
    toggleCardVisibility,
    setCardVisibility,
  } = useCard();

  const [modalMode, setModalMode] = useState<'edit' | 'create'>('edit');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [isTogglingVisibility, setIsTogglingVisibility] = useState(false);

  // Toast notification state for privacy toggle
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastIcon, setToastIcon] = useState<keyof typeof Feather.glyphMap>('globe');
  const [toastIconBg, setToastIconBg] = useState<string>('#10B981');
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleToggleVisibility = useCallback(async () => {
    if (!card || isTogglingVisibility) return;
    const isCurrentlyPublic = card.isPublished !== false;
    const isNowPublic = !isCurrentlyPublic;

    setIsTogglingVisibility(true);

    try {
      await setCardVisibility(card.id, isNowPublic);

      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
      setToastMessage(isNowPublic ? 'Card is Public' : 'Card is Private');
      setToastIcon(isNowPublic ? 'globe' : 'lock');
      setToastIconBg(isNowPublic ? '#10B981' : '#64748B');
      setToastVisible(true);

      toastTimeoutRef.current = setTimeout(() => {
        setToastVisible(false);
      }, 2200);
    } catch (err) {
      console.warn('[CardsTab] Failed to toggle card visibility:', err);
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
      setToastMessage('Failed to update card visibility');
      setToastIcon('alert-circle');
      setToastIconBg('#EF4444');
      setToastVisible(true);

      toastTimeoutRef.current = setTimeout(() => {
        setToastVisible(false);
      }, 2500);
    } finally {
      setIsTogglingVisibility(false);
    }
  }, [card, isTogglingVisibility, setCardVisibility]);

  const cardUrl = getPublicCardWebUrl(card?.slug || card?.id || user?.id);

  const handleOpenEdit = useCallback(() => {
    setModalMode('edit');
    setIsModalVisible(true);
    if (onEditCard) {
      onEditCard();
    }
  }, [onEditCard]);

  const handleSelectCard = useCallback(
    (id: string) => {
      setActiveCardId(id);
      setIsCardFlipped(false);
    },
    [setActiveCardId]
  );

  const handleOpenCreate = useCallback(() => {
    setModalMode('create');
    setIsModalVisible(true);
  }, []);

  const newCardDefaultData = useMemo<EditCardData>(() => {
    return {
      name: user?.name || '',
      role: '',
      company: '',
      slogan: '',
      phoneNumber: '',
      email: user?.email || '',
      location: DEFAULT_LOCATION,
      website: DEFAULT_WEBSITE,
      avatarUrl: null, // Fully independent
      companyLogoUrl: null, // Fully independent
      primaryColor: '#111111',
      cardBackgroundColor: '#FFFFFF',
      fontFamily: 'inter',
      backgroundStyle: 'minimal',
      socialLinks: [],
    };
  }, [user]);

  const handleSaveModal = useCallback(
    async (updated: EditCardData) => {
      if (modalMode === 'create') {
        await createCard(updated);
      } else {
        await saveCard(updated);
      }
    },
    [modalMode, createCard, saveCard]
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

  const insets = useSafeAreaInsets();
  const bottomScrollPadding = 58 + Math.max(insets.bottom, 12) + 56 + 24;

  // Determine if theme of the customized card is dark for skeleton match
  const isDarkCard = isDarkColor(cardData?.cardBackgroundColor);

  // Render skeleton whenever card data is not yet available in cache
  const shouldShowSkeleton = !cardData || status === 'loading';

  return (
    <View style={styles.screenWrapper}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: bottomScrollPadding }]}
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

        {/* ──────────────── CARD SELECTOR (WHEN USER HAS >1 CARDS) ──────────────── */}
        <CardSelector
          cards={cards}
          activeCardId={activeCardId}
          onSelectCard={handleSelectCard}
        />

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
              backgroundStyle={cardData.backgroundStyle}
              socialLinks={cardData.socialLinks}
              isFlipped={isCardFlipped}
              onFlip={setIsCardFlipped}
              onEdit={handleOpenEdit}
              isPublished={card?.isPublished ?? true}
              onTogglePrivacy={() => toggleCardVisibility(card?.id)}
            />
          )}
        </View>

        {/* ──────────────── EXTERNAL CARD CONTROLS (FLIP & VISIBILITY TOGGLE) ──────────────── */}
        {!shouldShowSkeleton && cardData && (
          <View style={styles.cardControlsRow}>
            <CardFlipButton
              isFlipped={isCardFlipped}
              onFlip={() => setIsCardFlipped((prev) => !prev)}
            />
            <CardVisibilityButton
              isPublished={card?.isPublished ?? true}
              onToggle={handleToggleVisibility}
              isLoading={isTogglingVisibility}
            />
          </View>
        )}
      </ScrollView>

      {/* ──────────────── FLOATING '+' ADD CARD BUTTON ──────────────── */}
      <AddCardButton onPress={handleOpenCreate} />

      {/* ──────────────── EDIT / CREATE CARD BOTTOM SHEET MODAL ──────────────── */}
      <EditCardModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        cardData={modalMode === 'create' ? newCardDefaultData : (cardData || newCardDefaultData)}
        onSave={handleSaveModal}
        mode={modalMode}
      />

      {/* ──────────────── PRIVACY TOGGLE TOAST NOTIFICATION ──────────────── */}
      <Toast
        visible={toastVisible}
        message={toastMessage}
        icon={toastIcon}
        iconBgColor={toastIconBg}
        bottomOffset={bottomScrollPadding - 24}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 120,
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
  cardControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginVertical: 8,
  },
});
