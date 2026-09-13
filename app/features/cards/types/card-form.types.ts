import { SocialLinkDto, CardBackgroundStyle } from '@veya/shared';

export interface EditCardData {
  name: string;
  role: string;
  company: string;
  slogan: string;
  phoneNumber: string;
  email: string;
  location: string;
  website: string;
  avatarUrl: string | null;
  companyLogoUrl: string | null;
  primaryColor: string;
  cardBackgroundColor: string;
  fontFamily: string;
  backgroundStyle?: CardBackgroundStyle;
  socialLinks?: SocialLinkDto[] | null;
}

/**
 * Backwards-compatibility alias for EditCardData.
 */
export type EditBusinessCardData = EditCardData;

export interface EditCardModalProps {
  visible: boolean;
  onClose: () => void;
  cardData: EditCardData;
  onSave: (updatedData: EditCardData) => Promise<void> | void;
  mode?: 'edit' | 'create';
}

/**
 * Backwards-compatibility alias for EditCardModalProps.
 */
export type EditBusinessCardModalProps = EditCardModalProps;

export type EditCardTab = 'personal' | 'contact' | 'preview';
