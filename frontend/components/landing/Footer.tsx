import React from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { siteConfig } from '../../config/site';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="landing-footer">
      <div className="section-container footer-container">
        <div className="footer-top-grid">
          {/* Brand Info */}
          <div className="footer-brand-col">
            <Link href="/" className="navbar-brand" style={{ marginBottom: '14px' }}>
              <span className="navbar-brand-name">{siteConfig.name}</span>
            </Link>

            <p className="footer-description">{siteConfig.description}</p>

            <div className="footer-status-pill">
              <span className="status-indicator-dot" />
              <span>All Systems Operational</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="footer-links-col">
            <h3 className="footer-col-title">Navigation</h3>
            <ul className="footer-links-list">
              <li>
                <a href="#about" className="footer-link">
                  What is Veya
                </a>
              </li>
              <li>
                <a href="#why-veya" className="footer-link">
                  Why Choose Veya
                </a>
              </li>
              <li>
                <a href="#features" className="footer-link">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="footer-link">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#product-showcase" className="footer-link">
                  Card Simulator
                </a>
              </li>
              <li>
                <a href="#comparison" className="footer-link">
                  Card Comparison
                </a>
              </li>
            </ul>
          </div>

          {/* Product & Platforms */}
          <div className="footer-links-col">
            <h3 className="footer-col-title">Platforms</h3>
            <ul className="footer-links-list">
              <li>
                <a href="#download" className="footer-link">
                  Android APK
                </a>
              </li>
              <li>
                <span className="footer-link-disabled">iOS App (Coming Soon)</span>
              </li>
              <li>
                <a href="#product-showcase" className="footer-link">
                  Web Profile Viewer
                </a>
              </li>
              <li>
                <a href="#faq" className="footer-link">
                  Frequently Asked Questions
                </a>
              </li>
            </ul>
          </div>

          {/* Legal / Company */}
          <div className="footer-links-col">
            <h3 className="footer-col-title">Legal & Security</h3>
            <ul className="footer-links-list">
              <li>
                <Link href="/privacy" className="footer-link">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="footer-link">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a href="#trust" className="footer-link">
                  Security Infrastructure
                </a>
              </li>
              <li>
                <span className="footer-link-disabled">Cloudflare Edge Caching</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom-bar">
          <div className="footer-copyright">
            &copy; {currentYear} {siteConfig.name}. All rights reserved.
          </div>

          <div className="footer-bottom-meta">
            <span>Built for modern contactless networking</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
