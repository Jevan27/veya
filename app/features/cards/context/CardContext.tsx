import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  ReactNode,
} from 'react';
import { CardDto, UserDto } from '@veya/shared';
import { cardsApi } from '../../../services/api/cards.api';
import { usersApi } from '../../../services/api/users.api';
import { useAuth } from '../../auth/hooks/useAuth';
import { EditCardData } from '../types/card-form.types';

export type CardLoadingStatus = 'idle' | 'loading' | 'refreshing' | 'loaded' | 'error';

export interface CardContextValue {
  /** Raw CardDto from the backend database (primary/default card) */
  card: CardDto | null;
  /** Normalized form/design data ready for display and editing */
  cardData: EditCardData | null;
  /** Granular loading status separating initial cold load from silent background refresh */
  status: CardLoadingStatus;
  /** Error message if fetch or save failed */
  error: string | null;
  /** Explicit background refresh (stale-while-revalidate) */
  refreshCard: (silent?: boolean) => Promise<void>;
  /** Save updated card customization to DB and sync user profile */
  saveCard: (updated: EditCardData) => Promise<void>;
}

export const CardContext = createContext<CardContextValue | null>(null);

const DEFAULT_SLOGAN = 'PEOPLE\nIDEAS\nOPPORTUNITIES\nCONNECTED';
const DEFAULT_LOCATION = 'Caloocan, Metro Manila, Philippines';
const DEFAULT_WEBSITE = 'https://www.veya.app';

export const CardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, updateUser } = useAuth();
  const [card, setCard] = useState<CardDto | null>(null);
  const [cardData, setCardData] = useState<EditCardData | null>(null);
  const [status, setStatus] = useState<CardLoadingStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  // Track in-flight request to deduplicate concurrent calls
  const isFetchingRef = useRef(false);
  const userRef = useRef<UserDto | null>(user);
  userRef.current = user;

  const mapToEditCardData = useCallback((primaryCard: CardDto, currentUser: UserDto | null): EditCardData => {
    return {
      name: primaryCard.name || currentUser?.name || '',
      role: primaryCard.role || currentUser?.role || '',
      company: primaryCard.company || currentUser?.company || '',
      slogan: primaryCard.slogan || DEFAULT_SLOGAN,
      phoneNumber: primaryCard.phoneNumber || currentUser?.phoneNumber || '',
      email: primaryCard.email || currentUser?.email || '',
      location: primaryCard.location || DEFAULT_LOCATION,
      website: primaryCard.website || DEFAULT_WEBSITE,
      avatarUrl: primaryCard.avatarUrl ?? currentUser?.avatarUrl ?? null,
      companyLogoUrl: primaryCard.companyLogoUrl ?? null,
      primaryColor: primaryCard.primaryColor || '#111111',
      cardBackgroundColor: primaryCard.cardBackgroundColor || '#FFFFFF',
      fontFamily: primaryCard.fontFamily || 'inter',
    };
  }, []);

  // Stable ref for cardData so refreshCard doesn't invalidate every render
  const cardDataRef = useRef<EditCardData | null>(cardData);
  cardDataRef.current = cardData;

  const refreshCard = useCallback(
    async (silent = false) => {
      const currentUser = userRef.current;
      if (!currentUser) return;
      if (isFetchingRef.current) return;

      isFetchingRef.current = true;
      setError(null);

      // If we already have cached card data, keep it visible and mark as refreshing silently.
      // Otherwise, mark as loading (which displays the skeleton).
      const hasCached = Boolean(cardDataRef.current);
      setStatus((prev) => (hasCached || silent || prev === 'loaded' ? 'refreshing' : 'loading'));

      try {
        const cards = await cardsApi.getCards();
        if (cards && cards.length > 0) {
          const primaryCard = cards.find((c) => c.isDefault) || cards[0];
          setCard(primaryCard);
          setCardData(mapToEditCardData(primaryCard, currentUser));
          setStatus('loaded');
        } else {
          // If the user has no card in DB yet, construct one initialized from their profile
          const fallbackData: EditCardData = {
            name: currentUser.name || '',
            role: currentUser.role || '',
            company: currentUser.company || '',
            slogan: DEFAULT_SLOGAN,
            phoneNumber: currentUser.phoneNumber || '',
            email: currentUser.email || '',
            location: DEFAULT_LOCATION,
            website: DEFAULT_WEBSITE,
            avatarUrl: currentUser.avatarUrl || null,
            companyLogoUrl: null,
            primaryColor: '#111111',
            cardBackgroundColor: '#FFFFFF',
            fontFamily: 'inter',
          };
          setCard(null);
          setCardData(fallbackData);
          setStatus('loaded');
        }
      } catch (err: unknown) {
        console.warn('[CardProvider] Error fetching card data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load card data');
        setStatus(() => (cardDataRef.current ? 'loaded' : 'error'));
      } finally {
        isFetchingRef.current = false;
      }
    },
    [mapToEditCardData]
  );

  // Fetch card data when authenticated user changes or on first mount
  const prevUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!user) {
      setCard(null);
      setCardData(null);
      setStatus('idle');
      prevUserIdRef.current = null;
      return;
    }

    const userIdChanged = prevUserIdRef.current !== user.id;
    prevUserIdRef.current = user.id;

    if (userIdChanged) {
      // New user session: if no card data yet, show skeleton; else silent refresh
      refreshCard(Boolean(cardDataRef.current));
    }
  }, [user, refreshCard]);

  const saveCard = useCallback(
    async (updated: EditCardData) => {
      const currentUser = userRef.current;
      if (!currentUser) return;

      let finalAvatarUrl = updated.avatarUrl;
      let finalCompanyLogoUrl = updated.companyLogoUrl;

      // 1. Upload company logo to Cloudflare R2 if a new local image was selected
      if (updated.companyLogoUrl && updated.companyLogoUrl.startsWith('file:')) {
        try {
          const logoRes = await cardsApi.uploadCompanyLogo(updated.companyLogoUrl);
          finalCompanyLogoUrl = logoRes.companyLogoUrl;
        } catch (logoErr) {
          console.warn('[CardProvider] Company logo upload error:', logoErr);
        }
      }

      // 2. Upload avatar to Cloudflare R2 if a new local image was selected
      if (updated.avatarUrl && updated.avatarUrl.startsWith('file:')) {
        try {
          const uploadRes = await usersApi.uploadProfilePhoto(updated.avatarUrl);
          finalAvatarUrl = uploadRes.avatarUrl;
        } catch (uploadErr) {
          console.warn('[CardProvider] Avatar upload error:', uploadErr);
        }
      }

      const mergedData: EditCardData = {
        ...updated,
        avatarUrl: finalAvatarUrl,
        companyLogoUrl: finalCompanyLogoUrl,
      };

      // Optimistically update card data in local cache
      setCardData(mergedData);

      try {
        let savedCard: CardDto;
        if (card?.id) {
          savedCard = await cardsApi.updateCard(card.id, {
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
            fontFamily: mergedData.fontFamily,
          });
        } else {
          savedCard = await cardsApi.createCard({
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
            fontFamily: mergedData.fontFamily,
            isDefault: true,
          });
        }

        setCard(savedCard);
        setCardData(mapToEditCardData(savedCard, currentUser));
        setStatus('loaded');

        // Sync with User Profile record
        const updatedProfile = await usersApi.updateProfile({
          name: mergedData.name,
          role: mergedData.role,
          company: mergedData.company,
          phoneNumber: mergedData.phoneNumber,
          avatarUrl: finalAvatarUrl || undefined,
        });

        updateUser({
          ...currentUser,
          ...updatedProfile,
          avatarUrl: finalAvatarUrl || updatedProfile.avatarUrl,
        });
      } catch (err: unknown) {
        console.warn('[CardProvider] Error saving card to database:', err);
        setError(err instanceof Error ? err.message : 'Failed to save card changes');
        throw err;
      }
    },
    [card?.id, mapToEditCardData, updateUser]
  );

  const value = useMemo<CardContextValue>(
    () => ({
      card,
      cardData,
      status,
      error,
      refreshCard,
      saveCard,
    }),
    [card, cardData, status, error, refreshCard, saveCard]
  );

  return <CardContext.Provider value={value}>{children}</CardContext.Provider>;
};
