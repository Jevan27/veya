'use client';

import React, { useState } from 'react';
import { UserPlus, Check } from 'lucide-react';
import { PublicCardDto } from '@veya/shared';
import { downloadVCard } from '../lib/vcard';

interface SaveContactButtonProps {
  card: PublicCardDto;
}

export const SaveContactButton: React.FC<SaveContactButtonProps> = ({ card }) => {
  const [downloaded, setDownloaded] = useState(false);

  const handleSave = () => {
    try {
      downloadVCard(card);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3500);
    } catch (err) {
      console.error('Failed to download contact vCard:', err);
    }
  };

  return (
    <button
      onClick={handleSave}
      className="save-contact-btn"
      aria-label="Save contact to your device"
    >
      {downloaded ? (
        <>
          <Check size={18} color="#16A34A" strokeWidth={2.5} />
          <span>Contact Saved</span>
        </>
      ) : (
        <>
          <UserPlus size={18} strokeWidth={2.5} />
          <span>Save Contact</span>
        </>
      )}
    </button>
  );
};
