import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, FileText } from 'lucide-react';
import { siteConfig } from '../../config/site';

interface LegalHeaderProps {
  activeDoc: 'terms' | 'privacy';
}

export const LegalHeader: React.FC<LegalHeaderProps> = ({ activeDoc }) => {
  return (
    <header className="navbar-header" style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255, 255, 255, 0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--surface-border)' }}>
      <div className="navbar-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px', padding: '0 24px', maxWidth: 'var(--max-content-width)', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link href="/" className="navbar-brand" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <span className="navbar-brand-name" style={{ fontSize: '20px', fontWeight: 800, color: '#000000', letterSpacing: '-0.02em' }}>
              {siteConfig.name}
            </span>
          </Link>
          <span style={{ color: 'var(--surface-border)', fontSize: '18px' }}>/</span>
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>
            {activeDoc === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
          </span>
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link
            href="/terms"
            style={{
              fontSize: '14px',
              fontWeight: activeDoc === 'terms' ? 700 : 500,
              color: activeDoc === 'terms' ? '#000000' : 'var(--text-secondary)',
              textDecoration: 'none',
              padding: '6px 12px',
              borderRadius: '6px',
              background: activeDoc === 'terms' ? 'var(--bg-subtle)' : 'transparent',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <FileText size={15} />
            Terms
          </Link>
          <Link
            href="/privacy"
            style={{
              fontSize: '14px',
              fontWeight: activeDoc === 'privacy' ? 700 : 500,
              color: activeDoc === 'privacy' ? '#000000' : 'var(--text-secondary)',
              textDecoration: 'none',
              padding: '6px 12px',
              borderRadius: '6px',
              background: activeDoc === 'privacy' ? 'var(--bg-subtle)' : 'transparent',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ShieldCheck size={15} />
            Privacy
          </Link>
          <Link
            href="/"
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginLeft: '8px',
              padding: '6px 12px',
              border: '1px solid var(--surface-border)',
              borderRadius: '6px',
              background: '#FFFFFF',
            }}
          >
            <ArrowLeft size={14} />
            Home
          </Link>
        </nav>
      </div>
    </header>
  );
};
