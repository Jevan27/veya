import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { fetchPublicCard } from '../../../lib/api';
import { PublicCard } from '../../../components/PublicCard';
import { SaveContactButton } from '../../../components/SaveContactButton';
import { CardActionButtons } from '../../../components/CardActionButtons';

interface PageProps {
  params: Promise<{ identifier: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { identifier } = await params;
  const card = await fetchPublicCard(identifier);

  if (!card) {
    return {
      title: 'Card Not Available — Veya',
      description: 'This Veya business card is currently unavailable.',
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

  if (!card) {
    return (
      <main className="public-page-wrapper">
        <div className="public-card-container">
          <div className="error-card">
            <h2>This card isn't available.</h2>
            <p>
              The business card you are looking for may have been moved, set to private, or does not
              exist.
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
