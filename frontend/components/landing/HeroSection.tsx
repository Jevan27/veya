'use client';

import React from 'react';
import { Download, Phone, Mail, MapPin, Globe, ArrowRight } from 'lucide-react';
import { heroContent } from '../../content/landing';

export const HeroSection: React.FC = () => {
  return (
    <section className="hero-section" id="hero">
      <div className="section-container hero-grid">
        {/* Left / Upper Column: Copy & CTAs */}
        <div className="hero-copy-col">
          <h1 className="hero-heading">
            A digital business card that works anywhere.
          </h1>

          <p className="hero-description">{heroContent.description}</p>

          <div className="hero-cta-group">
            <a href="#download" className="btn btn-primary btn-lg">
              <Download size={18} />
              <span>{heroContent.primaryCta}</span>
            </a>

            <a href="#features" className="btn btn-secondary btn-lg">
              <span>{heroContent.secondaryCta}</span>
              <ArrowRight size={17} />
            </a>
          </div>
        </div>

        {/* Right / Lower Column: Interactive Live Card Preview */}
        <div className="hero-visual-col">
          <div className="hero-card-glow-wrapper">
            <div className="hero-ambient-glow" />

            {/* Simulated Live Veya Business Card */}
            <div className="hero-card-frame">
              {/* Card Container matching Veya design tokens */}
              <div
                className="veya-web-card font-inter"
                style={{
                  backgroundColor: '#000000',
                  color: '#FFFFFF',
                  boxShadow:
                    '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                }}
              >
                {/* Signature Dual-Wave SVG in Monochrome */}
                <svg
                  className="card-wave-svg"
                  viewBox="0 0 140 90"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M0 0C40 25 90 20 140 90V0H0Z" fill="#FFFFFF" fillOpacity={0.12} />
                  <path d="M30 0C70 15 110 30 140 70V0H30Z" fill="#FFFFFF" fillOpacity={0.22} />
                </svg>

                <div className="card-inner">
                  {/* Upper Row */}
                  <div className="card-header-row">
                    <div
                      className="card-avatar-fallback"
                      style={{ backgroundColor: '#FFFFFF', color: '#000000', fontWeight: 800 }}
                    >
                      AR
                    </div>

                    <div className="card-identity-col">
                      <div className="card-name" style={{ color: '#FFFFFF', fontSize: '18px' }}>
                        Alexander Reed
                      </div>
                      <div
                        className="card-role"
                        style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '13px' }}
                      >
                        Head of Product Strategy
                      </div>
                      <div
                        className="card-company-pill"
                        style={{ color: '#FFFFFF', background: 'rgba(255, 255, 255, 0.1)' }}
                      >
                        <span style={{ fontSize: '11.5px' }}>Veya Technologies</span>
                      </div>
                    </div>

                    <div className="card-slogan-col">
                      <div className="card-slogan-line" style={{ color: '#FFFFFF', opacity: 0.85 }}>
                        BUILD
                      </div>
                      <div className="card-slogan-line" style={{ color: '#FFFFFF', opacity: 0.85 }}>
                        SCALE
                      </div>
                      <div className="card-slogan-line" style={{ color: '#FFFFFF', opacity: 0.85 }}>
                        CONNECT
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div
                    className="card-divider"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                  />

                  {/* 2x2 Contact Grid */}
                  <div className="card-contact-grid">
                    <div className="contact-tile" style={{ color: '#FFFFFF' }}>
                      <div
                        className="contact-icon-chip"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.12)', color: '#FFFFFF' }}
                      >
                        <Phone size={13} />
                      </div>
                      <span className="contact-text">+1 415 890 2341</span>
                    </div>

                    <div className="contact-tile" style={{ color: '#FFFFFF' }}>
                      <div
                        className="contact-icon-chip"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.12)', color: '#FFFFFF' }}
                      >
                        <Mail size={13} />
                      </div>
                      <span className="contact-text">alexander@veya.app</span>
                    </div>

                    <div className="contact-tile" style={{ color: '#FFFFFF' }}>
                      <div
                        className="contact-icon-chip"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.12)', color: '#FFFFFF' }}
                      >
                        <MapPin size={13} />
                      </div>
                      <span className="contact-text">San Francisco, CA</span>
                    </div>

                    <div className="contact-tile" style={{ color: '#FFFFFF' }}>
                      <div
                        className="contact-icon-chip"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.12)', color: '#FFFFFF' }}
                      >
                        <Globe size={13} />
                      </div>
                      <span className="contact-text">veya.app</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
