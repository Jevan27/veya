import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { VeyaCard } from './VeyaCard/VeyaCard';
import { EditCardModal } from './EditCardModal/EditCardModal';
import { EditCardData } from '../types/card-form.types';
import { QrScannerIcon } from '../../../components/icons/QrScannerIcon';
import { UserDto, CardDto } from '@veya/shared';
import { usersApi } from '../../../services/api/users.api';
import { cardsApi } from '../../../services/api/cards.api';

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
  onUserUpdate,
  slogan = 'PEOPLE\nIDEAS\nOPPORTUNITIES\nCONNECTED',
}) => {
  const cardUrl = `https://veya.app/card/${user?.id || 'demo'}`;
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const initialSloganString = typeof slogan === 'string'
    ? slogan
    : Array.isArray(slogan)
    ? slogan.join('\n')
    : 'PEOPLE\nIDEAS\nOPPORTUNITIES\nCONNECTED';

  const [currentCardId, setCurrentCardId] = useState<string | null>(null);
  const [, setUserCards] = useState<CardDto[]>([]);

  const [cardData, setCardData] = useState<EditCardData>({
    name: user?.name || 'Jevan Campillos',
    role: user?.role || 'Full-Stack Developer',
    company: user?.company || 'Veya',
    slogan: initialSloganString,
    phoneNumber: user?.phoneNumber || '+63 912 345 6789',
    email: user?.email || 'jevan@veya.app',
    location: 'Caloocan, Metro Manila, Philippines',
    website: 'https://www.veya.app',
    avatarUrl: user?.avatarUrl || null,
    companyLogoUrl: null,
    primaryColor: '#111111',
    cardBackgroundColor: '#FFFFFF',
  });

  // Fetch user's business cards from backend database
  useEffect(() => {
    let isMounted = true;
    async function loadCards() {
      if (!user) return;
      try {
        const cards = await cardsApi.getCards();
        if (isMounted && cards && cards.length > 0) {
          setUserCards(cards);
          const primaryCard = cards.find((c) => c.isDefault) || cards[0];
          setCurrentCardId(primaryCard.id);
          setCardData({
            name: primaryCard.name || user.name || '',
            role: primaryCard.role || user.role || '',
            company: primaryCard.company || user.company || '',
            slogan: primaryCard.slogan || initialSloganString,
            phoneNumber: primaryCard.phoneNumber || user.phoneNumber || '',
            email: primaryCard.email || user.email || '',
            location: primaryCard.location || 'Caloocan, Metro Manila, Philippines',
            website: primaryCard.website || 'https://www.veya.app',
            avatarUrl: primaryCard.avatarUrl ?? user.avatarUrl ?? null,
            companyLogoUrl: primaryCard.companyLogoUrl ?? null,
            primaryColor: primaryCard.primaryColor || '#111111',
            cardBackgroundColor: primaryCard.cardBackgroundColor || '#FFFFFF',
          });
        }
      } catch (err) {
        console.warn('[CardsTab] Failed to fetch cards from database:', err);
      }
    }
    loadCards();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleOpenEdit = () => {
    setIsEditModalVisible(true);
    if (onEditCard) {
      onEditCard();
    }
  };

  const handleSaveCard = async (updated: EditCardData) => {
    let finalAvatarUrl = updated.avatarUrl;
    let finalCompanyLogoUrl = updated.companyLogoUrl;

    // 1. Upload company logo to Cloudflare R2 if a new local image was selected
    if (updated.companyLogoUrl && updated.companyLogoUrl.startsWith('file:')) {
      try {
        const logoRes = await cardsApi.uploadCompanyLogo(updated.companyLogoUrl);
        finalCompanyLogoUrl = logoRes.companyLogoUrl;
      } catch (logoErr) {
        console.warn('[CardsTab] Company logo upload error:', logoErr);
      }
    }

    // 2. Upload avatar to Cloudflare R2 if a new local image was selected
    if (updated.avatarUrl && updated.avatarUrl.startsWith('file:')) {
      try {
        const uploadRes = await usersApi.uploadProfilePhoto(updated.avatarUrl);
        finalAvatarUrl = uploadRes.avatarUrl;
      } catch (uploadErr) {
        console.warn('[CardsTab] Avatar upload error:', uploadErr);
      }
    }

    const mergedData: EditCardData = {
      ...updated,
      avatarUrl: finalAvatarUrl,
      companyLogoUrl: finalCompanyLogoUrl,
    };

    setCardData(mergedData);

    // 3. Save to database table `business_cards`
    if (user) {
      try {
        if (currentCardId) {
          const updatedCard = await cardsApi.updateCard(currentCardId, {
            name: mergedData.name,
            role: mergedData.role,
            company: mergedData.company,
            slogan: mergedData.slogan,
            phoneNumber: mergedData.phoneNumber,
            email: mergedData.email,
            location: mergedData.location,
            website: mergedData.website,
            avatarUrl: mergedData.avatarUrl,
            companyLogoUrl: mergedData.companyLogoUrl,
            primaryColor: mergedData.primaryColor,
            cardBackgroundColor: mergedData.cardBackgroundColor,
          });
          setUserCards((prev) =>
            prev.map((c) => (c.id === currentCardId ? updatedCard : c)),
          );
        } else {
          const newCard = await cardsApi.createCard({
            name: mergedData.name,
            role: mergedData.role,
            company: mergedData.company,
            slogan: mergedData.slogan,
            phoneNumber: mergedData.phoneNumber,
            email: mergedData.email,
            location: mergedData.location,
            website: mergedData.website,
            avatarUrl: mergedData.avatarUrl,
            companyLogoUrl: mergedData.companyLogoUrl,
            primaryColor: mergedData.primaryColor,
            cardBackgroundColor: mergedData.cardBackgroundColor,
            isDefault: true,
          });
          setCurrentCardId(newCard.id);
          setUserCards((prev) => [newCard, ...prev]);
        }

        // 4. Also update User profile record for consistency
        const updatedProfile = await usersApi.updateProfile({
          name: mergedData.name,
          role: mergedData.role,
          company: mergedData.company,
          phoneNumber: mergedData.phoneNumber,
          avatarUrl: finalAvatarUrl || undefined,
        });

        if (onUserUpdate) {
          onUserUpdate({
            ...user,
            ...updatedProfile,
            avatarUrl: finalAvatarUrl || updatedProfile.avatarUrl,
          });
        }
      } catch (apiErr) {
        console.warn('[CardsTab] Failed to persist card to database:', apiErr);
      }
    }
  };

  const effectiveUser: UserDto = {
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
          <VeyaCard
            user={effectiveUser}
            cardUrl={cardUrl}
            address={cardData.location}
            website={cardData.website}
            slogan={cardData.slogan}
            companyLogoUrl={cardData.companyLogoUrl}
            primaryColor={cardData.primaryColor}
            cardBackgroundColor={cardData.cardBackgroundColor}
            onEdit={handleOpenEdit}
          />
        </View>
      </ScrollView>

      {/* ──────────────── EDIT CARD BOTTOM SHEET MODAL ──────────────── */}
      <EditCardModal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        cardData={cardData}
        onSave={handleSaveCard}
      />
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
