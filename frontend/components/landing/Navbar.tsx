'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Download, ArrowRight } from 'lucide-react';
import { siteConfig } from '../../config/site';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className={`navbar-header ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Brand Identity */}
        <Link href="/" className="navbar-brand" onClick={closeMenu}>
          <span className="navbar-brand-name">{siteConfig.name}</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="navbar-desktop-nav" aria-label="Primary Navigation">
          {siteConfig.navItems.map((item) => (
            <a key={item.href} href={item.href} className="navbar-nav-link">
              {item.label}
            </a>
          ))}
        </nav>

        {/* Desktop Action CTA */}
        <div className="navbar-cta-group">
          <a href="#download" className="btn btn-primary btn-sm">
            <Download size={15} />
            <span>Get App</span>
          </a>
        </div>

        {/* Mobile Hamburger Trigger */}
        <button
          className="navbar-mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={closeMenu}>
          <div
            className="mobile-drawer-content"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <div className="mobile-drawer-header">
              <Link href="/" className="navbar-brand" onClick={closeMenu}>
                <span className="navbar-brand-name">{siteConfig.name}</span>
              </Link>
              <button className="modal-close-btn" onClick={closeMenu} aria-label="Close navigation">
                <X size={20} />
              </button>
            </div>

            <nav className="mobile-drawer-nav" aria-label="Mobile Navigation Links">
              {siteConfig.navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="mobile-drawer-link"
                  onClick={closeMenu}
                >
                  <span>{item.label}</span>
                  <ArrowRight size={16} color="#64748B" />
                </a>
              ))}
            </nav>

            <div className="mobile-drawer-footer">
              <a
                href="#download"
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={closeMenu}
              >
                <Download size={16} />
                <span>Download Veya App</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
