'use client';

import React, { useState } from 'react';
import { APK_DOWNLOAD_URL } from '../../config/site';
import { ApkNoticeModal } from './ApkNoticeModal';
import { Download, Smartphone, Apple, Globe, Sparkles, CheckCircle2 } from 'lucide-react';

export const DownloadSection: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleAndroidDownload = () => {
    if (APK_DOWNLOAD_URL && APK_DOWNLOAD_URL.trim().length > 0) {
      window.location.href = APK_DOWNLOAD_URL;
    } else {
      setModalOpen(true);
    }
  };

  return (
    <section className="section-wrapper" id="download">
      <div className="section-container">
        <div className="download-banner">
          <div className="download-content-col">
            <div className="badge-pill">
              <Smartphone size={13} color="#000000" />
              <span>Get Started</span>
            </div>

            <h2 className="download-heading">
              Download Veya and build your digital identity today.
            </h2>

            <p className="download-subtext">
              Create your custom digital business card in minutes on Android. Share with anyone on
              any device instantly.
            </p>

            <div className="download-buttons-row">
              {/* Android APK Button */}
              <button
                onClick={handleAndroidDownload}
                className="btn btn-primary btn-lg"
                aria-label="Download Veya APK for Android"
              >
                <Download size={20} />
                <div style={{ textAlign: 'left' }}>
                  <div
                    style={{
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.6px',
                      opacity: 0.85,
                    }}
                  >
                    Download for Android
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 800 }}>Veya APK</div>
                </div>
              </button>

              {/* iOS Button (Coming Soon) */}
              <div className="btn-ios-disabled" role="status" aria-label="iOS version coming soon">
                <Apple size={22} color="#000000" />
                <div style={{ textAlign: 'left' }}>
                  <div
                    style={{
                      fontSize: '10px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.6px',
                      color: '#64748B',
                    }}
                  >
                    Apple App Store
                  </div>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#94A3B8' }}>
                    Coming Soon
                  </div>
                </div>
              </div>
            </div>

            <div className="download-perks">
              <div className="download-perk-item">
                <CheckCircle2 size={15} color="#000000" />
                <span>100% Free to use</span>
              </div>
              <div className="download-perk-item">
                <CheckCircle2 size={15} color="#000000" />
                <span>No credit card required</span>
              </div>
              <div className="download-perk-item">
                <CheckCircle2 size={15} color="#000000" />
                <span>Unlimited card sharing</span>
              </div>
            </div>
          </div>

          <div className="download-graphic-col">
            <div className="download-qr-box">
              <div className="download-qr-badge">
                <Globe size={16} color="#000000" />
                <span>Instant Web Viewing</span>
              </div>
              <p
                style={{ fontSize: '13px', color: '#475569', marginTop: '10px', lineHeight: '1.5' }}
              >
                When you share your card, contacts can view it on iOS, Android, macOS, or Windows
                with zero app download needed.
              </p>
              <div style={{ marginTop: '18px' }}>
                <a
                  href="#product-showcase"
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', justifyContent: 'center' }}
                >

                  <span>Preview Card in Browser</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* APK Empty State Notice Modal */}
      <ApkNoticeModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
};
