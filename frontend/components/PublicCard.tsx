'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Phone, Mail, MapPin, Globe } from 'lucide-react';
import { PublicCardDto } from '@veya/shared';
import { SocialIcon } from './SocialIcon';
import { PublicCardBackground } from './PublicCardBackground';

interface PublicCardProps {
  card: PublicCardDto;
}

// Determines if background color is dark for optimal text contrast
function isDarkColor(hexColor?: string | null): boolean {
  if (!hexColor) return false;
  const hex = hexColor.replace('#', '');
  if (hex.length !== 6) return false;
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
}

// Maps stored font family identifier to Next.js CSS class
function getFontClass(fontFamily?: string | null): string {
  switch (fontFamily?.toLowerCase()) {
    case 'playfair':
    case 'playfair-display':
      return 'font-playfair';
    case 'poppins':
      return 'font-poppins';
    case 'montserrat':
      return 'font-montserrat';
    case 'lora':
      return 'font-lora';
    case 'inter':
    default:
      return 'font-inter';
  }
}

// Formats phone numbers with standard international spacing for display
function formatDisplayPhone(rawPhone?: string | null): string {
  if (!rawPhone || !rawPhone.trim()) return '';
  const trimmed = rawPhone.trim();
  const digits = trimmed.replace(/\D/g, '');
  if (!digits) return trimmed;

  if (digits.startsWith('63') && digits.length >= 10) {
    const nat = digits.slice(2);
    if (nat.length === 10) {
      return `+63 ${nat.slice(0, 3)} ${nat.slice(3, 6)} ${nat.slice(6)}`;
    }
  }
  if (digits.startsWith('1') && digits.length === 11) {
    const nat = digits.slice(1);
    return `+1 ${nat.slice(0, 3)} ${nat.slice(3, 6)} ${nat.slice(6)}`;
  }
  return trimmed;
}

export const PublicCard: React.FC<PublicCardProps> = ({ card }) => {
  const [avatarError, setAvatarError] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const bgColor = card.cardBackgroundColor || '#FFFFFF';
  const primaryColor = card.primaryColor || '#111111';
  const isDark = isDarkColor(bgColor);
  const fontClass = getFontClass(card.fontFamily);

  const textColor = isDark ? '#FFFFFF' : '#0F172A';
  const textSubColor = isDark ? 'rgba(255, 255, 255, 0.75)' : '#475569';
  const dividerColor = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)';

  // Initial avatar letters
  const initials =
    (card.name || 'V')
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0].toUpperCase())
      .join('') || 'V';

  const sloganLines = card.slogan
    ? card.slogan
        .split(/[\n,]/)
        .map((s) => s.trim())
        .filter(Boolean)
    : null;

  const displayPhone = formatDisplayPhone(card.phoneNumber);

  return (
    <div
      className={`veya-web-card ${fontClass}`}
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
    >
      {/* Visual Background Accent (Dynamic 5-Style Composition) */}
      <PublicCardBackground
        backgroundStyle={card.backgroundStyle}
        primaryColor={primaryColor}
        cardBackgroundColor={bgColor}
        isDark={isDark}
      />

      <div className="card-inner">
        {/* Upper Identity Row */}
        <div className="card-header-row">
          {card.avatarUrl && !avatarError ? (
            <img
              src={card.avatarUrl}
              alt={card.name}
              className="card-avatar"
              onError={() => setAvatarError(true)}
            />
          ) : (
            <div className="card-avatar-fallback" style={{ backgroundColor: primaryColor }}>
              {initials}
            </div>
          )}

          <div className="card-identity-col">
            <h1 className="card-name" style={{ color: textColor }}>
              {card.name}
            </h1>

            {card.role && (
              <p className="card-role" style={{ color: textSubColor }}>
                {card.role}
              </p>
            )}

            {card.company && (
              <div className="card-company-pill" style={{ color: textColor }}>
                {card.companyLogoUrl && !logoError ? (
                  <img
                    src={card.companyLogoUrl}
                    alt={card.company}
                    className="card-company-logo"
                    onError={() => setLogoError(true)}
                  />
                ) : null}
                <span>{card.company}</span>
              </div>
            )}
          </div>

          {sloganLines && sloganLines.length > 0 && (
            <div className="card-slogan-col">
              {sloganLines.map((line, idx) => (
                <div key={idx} className="card-slogan-line" style={{ color: primaryColor }}>
                  {line}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="card-divider" style={{ backgroundColor: dividerColor }} />

        {/* 2x2 Contact Grid */}
        <div className="card-contact-grid">
          {displayPhone && (
            <a
              href={`tel:${card.phoneNumber?.replace(/\s+/g, '')}`}
              className="contact-tile"
              style={{ color: textColor }}
            >
              <div
                className="contact-icon-chip"
                style={{
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
                  color: primaryColor,
                }}
              >
                <Phone size={13.5} strokeWidth={2.5} />
              </div>
              <span className="contact-text">{displayPhone}</span>
            </a>
          )}

          {card.email && (
            <a
              href={`mailto:${card.email.trim()}`}
              className="contact-tile"
              style={{ color: textColor }}
            >
              <div
                className="contact-icon-chip"
                style={{
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
                  color: primaryColor,
                }}
              >
                <Mail size={13.5} strokeWidth={2.5} />
              </div>
              <span className="contact-text">{card.email}</span>
            </a>
          )}

          {card.location && (
            <div className="contact-tile" style={{ color: textColor }}>
              <div
                className="contact-icon-chip"
                style={{
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
                  color: primaryColor,
                }}
              >
                <MapPin size={13.5} strokeWidth={2.5} />
              </div>
              <span className="contact-text">{card.location}</span>
            </div>
          )}

          {card.website && (
            <a
              href={card.website.startsWith('http') ? card.website : `https://${card.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-tile"
              style={{ color: textColor }}
            >
              <div
                className="contact-icon-chip"
                style={{
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
                  color: primaryColor,
                }}
              >
                <Globe size={13.5} strokeWidth={2.5} />
              </div>
              <span className="contact-text">{card.website.replace(/^https?:\/\//, '')}</span>
            </a>
          )}
        </div>

        {/* Social Profile Links Row */}
        {card.socialLinks && card.socialLinks.length > 0 && (
          <div className="card-social-links-row">
            {card.socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card-social-link-chip"
                style={{
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
                  color: isDark ? '#FFFFFF' : primaryColor,
                }}
                title={link.label || link.platform}
                aria-label={`Open ${link.platform} profile`}
              >
                <SocialIcon platform={link.platform} size={15} />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
