'use client';

import React, { useState, useRef, useCallback } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Globe,
  RefreshCw,
  Briefcase,
  User,
} from 'lucide-react';
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
  const [isFlipped, setIsFlipped] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'left' | 'right'>('right');

  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);

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

  const displayCompany = card.company?.trim() || 'Veya';
  const companyInitial = displayCompany[0]?.toUpperCase() || 'V';

  const sloganLines = card.slogan
    ? card.slogan
        .split(/[\n,]/)
        .map((s) => s.trim())
        .filter(Boolean)
    : null;

  const displayPhone = formatDisplayPhone(card.phoneNumber);

  const toggleFlip = useCallback(
    (direction: 'left' | 'right' = 'right') => {
      setFlipDirection(direction);
      setIsFlipped((prev) => !prev);
    },
    []
  );

  // Pointer swipe handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!pointerStartRef.current) return;
    const dx = e.clientX - pointerStartRef.current.x;
    const dy = e.clientY - pointerStartRef.current.y;
    pointerStartRef.current = null;

    if (Math.abs(dx) >= 35 && Math.abs(dx) > Math.abs(dy) * 1.3) {
      if (dx < 0) {
        // Swipe Left -> turn right-to-left
        toggleFlip('left');
      } else {
        // Swipe Right -> turn left-to-right
        toggleFlip('right');
      }
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Only flip if not clicking an anchor, button, or interactive child
    const target = e.target as HTMLElement;
    if (target.closest('a') || target.closest('button')) {
      return;
    }
    toggleFlip(flipDirection);
  };

  const flipperClass = isFlipped
    ? flipDirection === 'left'
      ? 'veya-web-card-flipper flipped-left'
      : 'veya-web-card-flipper flipped-right'
    : 'veya-web-card-flipper';

  return (
    <div className="public-card-flippable-wrapper">
      {/* 3D Flippable Scene */}
      <div className="veya-web-card-scene">
        <div
          className={flipperClass}
          onClick={handleCardClick}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          role="region"
          aria-label="Digital Business Card. Click or swipe to flip."
        >
          {/* ──────────────── FRONT FACE: COMPANY & SOCIAL LINKS ──────────────── */}
          <div
            className={`veya-web-card-face face-front ${fontClass}`}
            style={{
              backgroundColor: bgColor,
              color: textColor,
            }}
          >
            {/* Visual Background Composition Style on Front */}
            <PublicCardBackground
              backgroundStyle={card.backgroundStyle}
              primaryColor={primaryColor}
              cardBackgroundColor={bgColor}
              isDark={isDark}
            />

            <div className="card-inner">
              {/* Front Top Row: Tag & Website */}
              <div className="card-top-row">
                <div
                  className="card-side-tag"
                  style={{
                    backgroundColor: isDark
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(15, 23, 42, 0.04)',
                    color: isDark ? '#94A3B8' : '#64748B',
                  }}
                >
                  <Briefcase size={10.5} />
                  <span>COMPANY</span>
                </div>

                {card.website && (
                  <div className="card-website-pill" style={{ color: textSubColor }}>
                    <Globe size={11} color={primaryColor} />
                    <span>{card.website.replace(/^https?:\/\/(www\.)?/, '')}</span>
                  </div>
                )}
              </div>

              {/* Center Section: Company Logo, Company Name & Slogan */}
              <div className="card-front-center">
                {card.companyLogoUrl && !logoError ? (
                  <img
                    src={card.companyLogoUrl}
                    alt={displayCompany}
                    className="card-front-logo"
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <div
                    className="card-monogram"
                    style={{
                      backgroundColor: isDark
                        ? 'rgba(255, 255, 255, 0.12)'
                        : primaryColor + '16',
                      color: isDark ? '#FFFFFF' : primaryColor,
                      border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.15)' : primaryColor + '30'}`,
                    }}
                  >
                    {companyInitial}
                  </div>
                )}

                <h1 className="card-company-title" style={{ color: textColor }}>
                  {displayCompany}
                </h1>

                {sloganLines && sloganLines.length > 0 && (
                  <div className="card-slogan-banner" style={{ color: primaryColor }}>
                    {sloganLines.join('  ·  ')}
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="card-divider" style={{ backgroundColor: dividerColor }} />

              {/* Bottom Section: Company Social Links */}
              <div className="card-social-links-row" style={{ justifyContent: 'center' }}>
                {card.socialLinks && card.socialLinks.length > 0 ? (
                  card.socialLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card-social-link-chip"
                      style={{
                        backgroundColor: isDark
                          ? 'rgba(255, 255, 255, 0.08)'
                          : 'rgba(0, 0, 0, 0.05)',
                        color: isDark ? '#FFFFFF' : primaryColor,
                      }}
                      title={link.label || link.platform}
                      aria-label={`Open ${link.platform} profile`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <SocialIcon platform={link.platform} size={14} />
                    </a>
                  ))
                ) : (
                  <span
                    style={{
                      fontSize: '11px',
                      color: isDark ? '#64748B' : '#94A3B8',
                      fontWeight: 500,
                    }}
                  >
                    Connect with {displayCompany}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ──────────────── BACK FACE: PERSONAL CONTACT DETAILS ──────────────── */}
          <div
            className={`veya-web-card-face face-back ${fontClass}`}
            style={{
              backgroundColor: bgColor,
              color: textColor,
            }}
          >
            {/* Visual Background Composition Style on Back */}
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
                  <div
                    className="card-avatar-fallback"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {initials}
                  </div>
                )}

                <div className="card-identity-col">
                  <h2 className="card-name" style={{ color: textColor }}>
                    {card.name}
                  </h2>

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

                {/* Back Top-Right: Contact Tag */}
                <div
                  className="card-side-tag"
                  style={{
                    backgroundColor: isDark
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(15, 23, 42, 0.04)',
                    color: isDark ? '#94A3B8' : '#64748B',
                  }}
                >
                  <User size={10.5} />
                  <span>CONTACT</span>
                </div>
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
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      className="contact-icon-chip"
                      style={{
                        backgroundColor: isDark
                          ? 'rgba(255, 255, 255, 0.08)'
                          : 'rgba(0, 0, 0, 0.05)',
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
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      className="contact-icon-chip"
                      style={{
                        backgroundColor: isDark
                          ? 'rgba(255, 255, 255, 0.08)'
                          : 'rgba(0, 0, 0, 0.05)',
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
                        backgroundColor: isDark
                          ? 'rgba(255, 255, 255, 0.08)'
                          : 'rgba(0, 0, 0, 0.05)',
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
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      className="contact-icon-chip"
                      style={{
                        backgroundColor: isDark
                          ? 'rgba(255, 255, 255, 0.08)'
                          : 'rgba(0, 0, 0, 0.05)',
                        color: primaryColor,
                      }}
                    >
                      <Globe size={13.5} strokeWidth={2.5} />
                    </div>
                    <span className="contact-text">
                      {card.website.replace(/^https?:\/\//, '')}
                    </span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ──────────────── EXTERNAL FLIP BUTTON (ICON ONLY) ──────────────── */}
      <div className="web-flip-button-container">
        <button
          type="button"
          className="web-flip-button"
          onClick={() => toggleFlip(flipDirection === 'left' ? 'right' : 'left')}
          aria-label="Flip digital card"
          title="Flip card"
        >
          <RefreshCw
            size={17}
            className={`web-flip-icon ${isFlipped ? 'spin' : ''}`}
            style={{ color: primaryColor || '#0F172A' }}
          />
        </button>
      </div>
    </div>
  );
};
