'use client';

import React, { useState } from 'react';
import { Phone, Mail, Globe, Share2, Check } from 'lucide-react';
import { PublicCardDto } from '@veya/shared';

interface CardActionButtonsProps {
  card: PublicCardDto;
}

export const CardActionButtons: React.FC<CardActionButtonsProps> = ({ card }) => {
  const [copied, setCopied] = useState(false);

  const cleanPhone = card.phoneNumber?.replace(/\s+/g, '');
  const websiteUrl = card.website?.startsWith('http')
    ? card.website
    : `https://${card.website}`;

  const handleShare = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareTitle = `${card.name} | Veya Business Card`;
    const shareText = `Connect with ${card.name} (${card.role || 'Digital Card'} at ${card.company || 'Veya'}):`;

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // Fall back to copy if user cancelled or dismissed
        if ((err as Error).name === 'AbortError') return;
      }
    }

    // Fallback to clipboard copy
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="action-buttons-row">
      {cleanPhone ? (
        <a href={`tel:${cleanPhone}`} className="quick-action-btn" aria-label="Call">
          <Phone size={17} />
          <span>Call</span>
        </a>
      ) : null}

      {card.email ? (
        <a href={`mailto:${card.email.trim()}`} className="quick-action-btn" aria-label="Email">
          <Mail size={17} />
          <span>Email</span>
        </a>
      ) : null}

      {card.website ? (
        <a
          href={websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="quick-action-btn"
          aria-label="Website"
        >
          <Globe size={17} />
          <span>Website</span>
        </a>
      ) : null}

      <button onClick={handleShare} className="quick-action-btn" aria-label="Share card">
        {copied ? (
          <>
            <Check size={17} color="#22C55E" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Share2 size={17} />
            <span>Share</span>
          </>
        )}
      </button>
    </div>
  );
};
