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
import { useAuth } from '../../auth/hooks/useAuth';
import { EditCardData } from '../types/card-form.types';

export type CardLoadingStatus = 'idle' | 'loading' | 'refreshing' | 'loaded' | 'error';

export interface CardContextValue {
  /** All business cards belonging to the authenticated user */
  cards: CardDto[];
  /** Identifier of the currently active/selected business card */
  activeCardId: string | null;
  /** Active CardDto entity */
  card: CardDto | null;
  /** Normalized form/design data ready for display and editing of the active card */
  cardData: EditCardData | null;
  /** Granular loading status separating initial cold load from background updates */
  status: CardLoadingStatus;
  /** Error message if fetch or save failed */
  error: string | null;
  /** Select active card by ID */
  setActiveCardId: (id: string) => void;
  /** Refresh user cards from the server (stale-while-revalidate) */
  refreshCard: (silent?: boolean) => Promise<void>;
  /** Create a brand new independent business card */
  createCard: (newCardData: EditCardData) => Promise<CardDto>;
  /** Save updated card customization for active (or targeted) card without mutating other cards */
  saveCard: (updated: EditCardData, targetCardId?: string) => Promise<void>;
  /** Delete a business card by ID */
  deleteCard: (cardId: string) => Promise<void>;
}

export const CardContext = createContext<CardContextValue | null>(null);

const DEFAULT_SLOGAN = 'PEOPLE\nIDEAS\nOPPORTUNITIES\nCONNECTED';
const DEFAULT_LOCATION = 'Caloocan, Metro Manila, Philippines';
const DEFAULT_WEBSITE = 'https://www.veya.app';

export const CardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cards, setCards] = useState<CardDto[]>([]);
  const [activeCardId, setActiveCardIdState] = useState<string | null>(null);
  const [status, setStatus] = useState<CardLoadingStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  // Track in-flight request to deduplicate concurrent calls
  const isFetchingRef = useRef(false);
  const userRef = useRef<UserDto | null>(user);
  userRef.current = user;

  const mapToEditCardData = useCallback((primaryCard: CardDto, currentUser: UserDto | null): EditCardData => {
    return {
      name: primaryCard.name || currentUser?.name || '',
      role: primaryCard.role || '',
      company: primaryCard.company || '',
      slogan: primaryCard.slogan || DEFAULT_SLOGAN,
      phoneNumber: primaryCard.phoneNumber || '',
      email: primaryCard.email || currentUser?.email || '',
      location: primaryCard.location || DEFAULT_LOCATION,
      website: primaryCard.website || DEFAULT_WEBSITE,
      avatarUrl: primaryCard.avatarUrl ?? null,
      companyLogoUrl: primaryCard.companyLogoUrl ?? null,
      primaryColor: primaryCard.primaryColor || '#111111',
      cardBackgroundColor: primaryCard.cardBackgroundColor || '#FFFFFF',
      fontFamily: primaryCard.fontFamily || 'inter',
      backgroundStyle: primaryCard.backgroundStyle || 'minimal',
      socialLinks: primaryCard.socialLinks || [],
    };
  }, []);

  // Compute active card entity and presentation data
  const card = useMemo<CardDto | null>(() => {
    if (!cards || cards.length === 0) return null;
    if (activeCardId) {
      const match = cards.find((c) => c.id === activeCardId);
      if (match) return match;
    }
    return cards.find((c) => c.isDefault) || cards[0] || null;
  }, [cards, activeCardId]);

  const cardData = useMemo<EditCardData | null>(() => {
    if (card) {
      return mapToEditCardData(card, userRef.current);
    }
    if (userRef.current) {
      // Clean fallback for brand new accounts with 0 cards
      return {
        name: userRef.current.name || '',
        role: userRef.current.role || '',
        company: userRef.current.company || '',
        slogan: DEFAULT_SLOGAN,
        phoneNumber: userRef.current.phoneNumber || '',
        email: userRef.current.email || '',
        location: DEFAULT_LOCATION,
        website: DEFAULT_WEBSITE,
        avatarUrl: null,
        companyLogoUrl: null,
        primaryColor: '#111111',
        cardBackgroundColor: '#FFFFFF',
        fontFamily: 'inter',
        backgroundStyle: 'minimal',
        socialLinks: [],
      };
    }
    return null;
  }, [card, mapToEditCardData]);

  // Stable ref for cardData so refreshCard doesn't invalidate every render
  const cardDataRef = useRef<EditCardData | null>(cardData);
  cardDataRef.current = cardData;

  const setActiveCardId = useCallback((id: string) => {
    setActiveCardIdState(id);
  }, []);

  const refreshCard = useCallback(
    async (silent = false) => {
      const currentUser = userRef.current;
      if (!currentUser) return;
      if (isFetchingRef.current) return;

      isFetchingRef.current = true;
      setError(null);

      const hasCached = Boolean(cardDataRef.current);
      setStatus((prev) => (hasCached || silent || prev === 'loaded' ? 'refreshing' : 'loading'));

      try {
        const fetchedCards = await cardsApi.getCards();
        setCards(fetchedCards || []);

        if (fetchedCards && fetchedCards.length > 0) {
          // If current activeCardId is valid in the newly fetched list, keep it
          setActiveCardIdState((prevId) => {
            if (prevId && fetchedCards.some((c) => c.id === prevId)) {
              return prevId;
            }
            const defaultCard = fetchedCards.find((c) => c.isDefault) || fetchedCards[0];
            return defaultCard.id;
          });
          setStatus('loaded');
        } else {
          setActiveCardIdState(null);
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
    []
  );

  // Fetch card data when authenticated user changes or on first mount
  const prevUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!user) {
      setCards([]);
      setActiveCardIdState(null);
      setStatus('idle');
      prevUserIdRef.current = null;
      return;
    }

    const userIdChanged = prevUserIdRef.current !== user.id;
    prevUserIdRef.current = user.id;

    if (userIdChanged) {
      refreshCard(Boolean(cardDataRef.current));
    }
  }, [user, refreshCard]);

  /**
   * Create a new independent card
   */
  const createCard = useCallback(
    async (newCardData: EditCardData): Promise<CardDto> => {
      const currentUser = userRef.current;
      if (!currentUser) {
        throw new Error('You must be signed in to create a business card');
      }

      let finalAvatarUrl = newCardData.avatarUrl;
      let finalCompanyLogoUrl = newCardData.companyLogoUrl;

      // 1. Upload card-specific avatar if local image was picked
      if (newCardData.avatarUrl && newCardData.avatarUrl.startsWith('file:')) {
        try {
          const avatarRes = await cardsApi.uploadCardAvatar('', newCardData.avatarUrl);
          finalAvatarUrl = avatarRes.avatarUrl;
        } catch (uploadErr) {
          console.warn('[CardProvider] Draft avatar upload error:', uploadErr);
        }
      }

      // 2. Upload card-specific company logo if local image was picked
      if (newCardData.companyLogoUrl && newCardData.companyLogoUrl.startsWith('file:')) {
        try {
          const logoRes = await cardsApi.uploadCardLogo('', newCardData.companyLogoUrl);
          finalCompanyLogoUrl = logoRes.companyLogoUrl;
        } catch (logoErr) {
          console.warn('[CardProvider] Draft logo upload error:', logoErr);
        }
      }

      try {
        const created = await cardsApi.createCard({
          name: newCardData.name,
          role: newCardData.role,
          company: newCardData.company,
          slogan: newCardData.slogan,
          phoneNumber: newCardData.phoneNumber,
          email: newCardData.email,
          location: newCardData.location,
          website: newCardData.website,
          avatarUrl: finalAvatarUrl,
          companyLogoUrl: finalCompanyLogoUrl,
          primaryColor: newCardData.primaryColor,
          cardBackgroundColor: newCardData.cardBackgroundColor,
          fontFamily: newCardData.fontFamily,
          backgroundStyle: newCardData.backgroundStyle || 'minimal',
          socialLinks: newCardData.socialLinks || [],
          isDefault: cards.length === 0,
        });

        // Prepend new card and make it active immediately
        setCards((prev) => [created, ...prev]);
        setActiveCardIdState(created.id);
        setStatus('loaded');
        return created;
      } catch (err: unknown) {
        console.warn('[CardProvider] Error creating new card:', err);
        setError(err instanceof Error ? err.message : 'Failed to create card');
        throw err;
      }
    },
    [cards.length]
  );

  /**
   * Save changes to an existing card without mutating other cards or user profile
   */
  const saveCard = useCallback(
    async (updated: EditCardData, targetCardId?: string) => {
      const currentUser = userRef.current;
      if (!currentUser) return;

      const targetId = targetCardId || activeCardId || card?.id;

      let finalAvatarUrl = updated.avatarUrl;
      let finalCompanyLogoUrl = updated.companyLogoUrl;

      // 1. Upload card-scoped company logo if a new local image was selected
      if (updated.companyLogoUrl && updated.companyLogoUrl.startsWith('file:')) {
        try {
          const logoRes = await cardsApi.uploadCardLogo(targetId || '', updated.companyLogoUrl);
          finalCompanyLogoUrl = logoRes.companyLogoUrl;
        } catch (logoErr) {
          console.warn('[CardProvider] Company logo upload error:', logoErr);
        }
      }

      // 2. Upload card-scoped avatar if a new local image was selected
      if (updated.avatarUrl && updated.avatarUrl.startsWith('file:')) {
        try {
          const uploadRes = await cardsApi.uploadCardAvatar(targetId || '', updated.avatarUrl);
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

      try {
        let savedCard: CardDto;
        if (targetId) {
          savedCard = await cardsApi.updateCard(targetId, {
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
            backgroundStyle: mergedData.backgroundStyle || 'minimal',
            socialLinks: mergedData.socialLinks || [],
          });

          // Update only the targeted card in the cards list
          setCards((prev) => prev.map((c) => (c.id === targetId ? savedCard : c)));
        } else {
          // If no card exists yet, create one
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
            backgroundStyle: mergedData.backgroundStyle || 'minimal',
            socialLinks: mergedData.socialLinks || [],
            isDefault: true,
          });

          setCards([savedCard]);
          setActiveCardIdState(savedCard.id);
        }

        setStatus('loaded');
      } catch (err: unknown) {
        console.warn('[CardProvider] Error saving card to database:', err);
        setError(err instanceof Error ? err.message : 'Failed to save card changes');
        throw err;
      }
    },
    [activeCardId, card?.id]
  );

  /**
   * Delete a card by ID and promote remaining cards
   */
  const deleteCard = useCallback(
    async (cardId: string) => {
      try {
        await cardsApi.deleteCard(cardId);
        setCards((prev) => {
          const remaining = prev.filter((c) => c.id !== cardId);
          if (activeCardId === cardId) {
            const nextDefault = remaining.find((c) => c.isDefault) || remaining[0] || null;
            setActiveCardIdState(nextDefault ? nextDefault.id : null);
          }
          return remaining;
        });
      } catch (err: unknown) {
        console.warn('[CardProvider] Error deleting card:', err);
        throw err;
      }
    },
    [activeCardId]
  );

  const value = useMemo<CardContextValue>(
    () => ({
      cards,
      activeCardId,
      card,
      cardData,
      status,
      error,
      setActiveCardId,
      refreshCard,
      createCard,
      saveCard,
      deleteCard,
    }),
    [
      cards,
      activeCardId,
      card,
      cardData,
      status,
      error,
      setActiveCardId,
      refreshCard,
      createCard,
      saveCard,
      deleteCard,
    ]
  );

  return <CardContext.Provider value={value}>{children}</CardContext.Provider>;
};
