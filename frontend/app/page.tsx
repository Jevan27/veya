import React from 'react';
import Link from 'next/link';
import { CreditCard, Sparkles, Smartphone, ShieldCheck } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="public-page-wrapper">
      <div className="public-card-container" style={{ textAlign: 'center' }}>
        <div style={{ padding: '40px 24px', background: '#111827', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
            }}
          >
            <CreditCard size={28} color="#FFFFFF" />
          </div>

          <h1 style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.6px', marginBottom: '10px' }}>
            Veya Business Cards
          </h1>

          <p style={{ color: '#94A3B8', fontSize: '14.5px', lineHeight: '1.6', marginBottom: '24px' }}>
            Instant, contactless digital business cards designed for modern networking. Share via QR, link, or NFC without needing an app.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              textAlign: 'left',
              marginBottom: '28px',
            }}
          >
            <div style={{ padding: '14px', background: '#1E293B', borderRadius: '12px' }}>
              <Sparkles size={18} color="#818CF8" style={{ marginBottom: '6px' }} />
              <div style={{ fontSize: '12.5px', fontWeight: 700 }}>Custom Styles</div>
              <div style={{ fontSize: '11px', color: '#94A3B8' }}>Fonts, themes & logos</div>
            </div>

            <div style={{ padding: '14px', background: '#1E293B', borderRadius: '12px' }}>
              <Smartphone size={18} color="#818CF8" style={{ marginBottom: '6px' }} />
              <div style={{ fontSize: '12.5px', fontWeight: 700 }}>Instant Save</div>
              <div style={{ fontSize: '11px', color: '#94A3B8' }}>1-tap vCard export</div>
            </div>
          </div>

          <div style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <ShieldCheck size={14} color="#10B981" />
            <span>Secure & Private Cloud Infrastructure</span>
          </div>
        </div>

        <footer className="veya-footer-badge">
          <span>&copy; {new Date().getFullYear()} Veya. All rights reserved.</span>
        </footer>
      </div>
    </main>
  );
}
