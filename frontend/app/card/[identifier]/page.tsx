import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { fetchPublicCard } from '../../../lib/api';
import { PublicCard } from '../../../components/PublicCard';
import { SaveContactButton } from '../../../components/SaveContactButton';
import { CardActionButtons } from '../../../components/CardActionButtons';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: Promise<{ identifier: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { identifier } = await params;
  const card = await fetchPublicCard(identifier);

  if (!card || card.isPublished === false) {
    return {
      title: 'The Card Details are Private or Not Available — Veya',
      description: 'This digital business card is currently set to private by its owner or is not available.',
    };
  }

  const title = `${card.name} — ${card.role ? `${card.role} | ` : ''}${card.company || 'Veya'}`;
  const description = card.slogan
    ? `${card.slogan} • Connect with ${card.name} on Veya.`
    : `Connect with ${card.name} (${card.role || 'Digital Card'} at ${card.company || 'Veya'}). Save contact information directly to your device.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      images: card.avatarUrl ? [{ url: card.avatarUrl, width: 400, height: 400 }] : [],
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: card.avatarUrl ? [card.avatarUrl] : [],
    },
  };
}

export default async function PublicCardPage({ params }: PageProps) {
  const { identifier } = await params;
  const card = await fetchPublicCard(identifier);

  if (!card || card.isPublished === false) {
    return (
      <main className="public-page-wrapper">
        <div className="public-card-container">
          <div className="private-card-box">
            <div className="private-lock-badge">
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h2 className="private-card-title">The Card Details are Private or Not Available.</h2>
            <p className="private-card-subtitle">
              This digital business card has been set to private by its owner or is not currently available.
            </p>
          </div>

          <div className="veya-footer-badge">
            <span>Powered by</span>
            <Link href="https://veya.app">Veya</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="public-page-wrapper">
      <div className="public-card-container">
        {/* Digital Business Card */}
        <PublicCard card={card} />

        {/* Primary Contact Action */}
        <SaveContactButton card={card} />

        {/* Secondary Contact Actions */}
        <CardActionButtons card={card} />

        {/* Subtle Brand Identity */}
        <footer className="veya-footer-badge">
          <span>Powered by</span>
          <Link href="https://veya.app" target="_blank" rel="noopener noreferrer">
            Veya
          </Link>
        </footer>
      </div>
    </main>
  );
}
