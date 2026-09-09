'use client';

import React, { useState } from 'react';
import { sampleCardPresets } from '../../content/landing';
import { Phone, Mail, MapPin, Globe, Sparkles, Check, Download } from 'lucide-react';
import { downloadVCard } from '../../lib/vcard';

export const ProductShowcase: React.FC = () => {
  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const preset = sampleCardPresets[activePresetIndex];
  const isDark = preset.bgColor === '#0F172A' || preset.bgColor === '#0B132B';
  const textColor = isDark ? '#FFFFFF' : '#0F172A';
  const textSubColor = isDark ? 'rgba(255, 255, 255, 0.75)' : '#475569';
  const dividerColor = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)';

  const fontClass =
    preset.fontFamily === 'Playfair Display'
      ? 'font-playfair'
      : preset.fontFamily === 'Poppins'
        ? 'font-poppins'
        : preset.fontFamily === 'Montserrat'
          ? 'font-montserrat'
          : 'font-inter';

  const initials = preset.card.name
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0])
    .join('');

  const handleDemoDownload = () => {
    downloadVCard({
      id: 'demo-card',
      name: preset.card.name,
      role: preset.card.role,
      company: preset.card.company,
      slogan: preset.card.slogan,
      phoneNumber: preset.card.phoneNumber,
      email: preset.card.email,
      location: preset.card.location,
      website: preset.card.website,
      primaryColor: preset.primaryColor,
      cardBackgroundColor: preset.bgColor,
      fontFamily: preset.fontFamily,
      isPublished: true,
    });
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <section className="section-wrapper" id="product-showcase">
      <div className="section-container">
        <div className="section-header-center">
          <div className="badge-pill">
            <Sparkles size={13} color="#000000" />
            <span>Interactive Demo</span>
          </div>
          <h2 className="section-heading">Experience Veya in Action</h2>
          <p className="section-lead">
            Select a style preset below to see how Veya renders customized typography, color themes,
            and signature wave curves in real time.
          </p>
        </div>

        {/* Preset Selector Tabs */}
        <div className="showcase-preset-tabs" role="tablist" aria-label="Card Theme Presets">
          {sampleCardPresets.map((item, idx) => (
            <button
              key={item.id}
              role="tab"
              aria-selected={activePresetIndex === idx}
              className={`preset-tab-btn ${activePresetIndex === idx ? 'preset-tab-active' : ''}`}
              onClick={() => setActivePresetIndex(idx)}
            >
              <span className="preset-color-dot" style={{ backgroundColor: item.primaryColor }} />
              <span className="preset-name">{item.name}</span>
            </button>
          ))}
        </div>

        {/* Live Simulator View */}
        <div className="showcase-card-container">
          <div
            className={`veya-web-card ${fontClass}`}
            style={{
              backgroundColor: preset.bgColor,
              color: textColor,
              maxWidth: '460px',
              margin: '0 auto',
            }}
          >
            {/* Signature Wave SVG */}
            <svg
              className="card-wave-svg"
              viewBox="0 0 140 90"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M0 0C40 25 90 20 140 90V0H0Z"
                fill={preset.primaryColor}
                fillOpacity={isDark ? 0.25 : 0.12}
              />
              <path
                d="M30 0C70 15 110 30 140 70V0H30Z"
                fill={preset.primaryColor}
                fillOpacity={isDark ? 0.4 : 0.22}
              />
            </svg>

            <div className="card-inner">
              {/* Header */}
              <div className="card-header-row">
                <div
                  className="card-avatar-fallback"
                  style={{ backgroundColor: preset.primaryColor }}
                >
                  {initials}
                </div>

                <div className="card-identity-col">
                  <div className="card-name" style={{ color: textColor }}>
                    {preset.card.name}
                  </div>
                  <div className="card-role" style={{ color: textSubColor }}>
                    {preset.card.role}
                  </div>
                  <div className="card-company-pill" style={{ color: textColor }}>
                    <span>{preset.card.company}</span>
                  </div>
                </div>

                {preset.card.slogan && (
                  <div className="card-slogan-col">
                    {preset.card.slogan.split('·').map((word, i) => (
                      <div
                        key={i}
                        className="card-slogan-line"
                        style={{ color: preset.primaryColor }}
                      >
                        {word.trim()}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="card-divider" style={{ backgroundColor: dividerColor }} />

              {/* 2x2 Contact Grid */}
              <div className="card-contact-grid">
                <div className="contact-tile" style={{ color: textColor }}>
                  <div
                    className="contact-icon-chip"
                    style={{
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
                      color: preset.primaryColor,
                    }}
                  >
                    <Phone size={13.5} strokeWidth={2.5} />
                  </div>
                  <span className="contact-text">{preset.card.phoneNumber}</span>
                </div>

                <div className="contact-tile" style={{ color: textColor }}>
                  <div
                    className="contact-icon-chip"
                    style={{
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
                      color: preset.primaryColor,
                    }}
                  >
                    <Mail size={13.5} strokeWidth={2.5} />
                  </div>
                  <span className="contact-text">{preset.card.email}</span>
                </div>

                <div className="contact-tile" style={{ color: textColor }}>
                  <div
                    className="contact-icon-chip"
                    style={{
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
                      color: preset.primaryColor,
                    }}
                  >
                    <MapPin size={13.5} strokeWidth={2.5} />
                  </div>
                  <span className="contact-text">{preset.card.location}</span>
                </div>

                <div className="contact-tile" style={{ color: textColor }}>
                  <div
                    className="contact-icon-chip"
                    style={{
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
                      color: preset.primaryColor,
                    }}
                  >
                    <Globe size={13.5} strokeWidth={2.5} />
                  </div>
                  <span className="contact-text">{preset.card.website}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Test vCard Download Button */}
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button
              onClick={handleDemoDownload}
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex' }}
            >
              {downloadSuccess ? (
                <>
                  <Check size={16} color="#000000" />
                  <span>vCard Downloaded!</span>
                </>
              ) : (
                <>
                  <Download size={16} />
                  <span>Test vCard Download</span>
                </>
              )}
            </button>
            <p style={{ fontSize: '12px', color: '#64748B', marginTop: '8px' }}>
              Click to download the actual .vcf file and test importing it on your device.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
