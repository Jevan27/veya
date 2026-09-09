import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display, Poppins, Montserrat, Lora } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://veya.app';

export const viewport: Viewport = {
  themeColor: '#FFFFFF',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Veya — Digital Business Cards & Contactless Networking',
    template: '%s | Veya',
  },
  description:
    'Instant, contactless digital business cards for modern professionals. Share your profile via QR, NFC, or direct link with zero app required for recipients.',
  applicationName: 'Veya',
  authors: [{ name: 'Veya', url: siteUrl }],
  generator: 'Next.js',
  keywords: [
    'digital business card',
    'contactless business card',
    'virtual business card',
    'NFC business card',
    'vCard QR code',
    'electronic business card',
    'smart business card',
    'professional networking',
    'instant contact exchange',
  ],
  icons: {
    icon: '/favicon.png',
    apple: '/icon.png',
  },
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Veya',
    title: 'Veya — Digital Business Cards & Contactless Networking',
    description:
      'Instant, contactless digital business cards for modern professionals. Share via QR, NFC, or direct link with zero app required for recipients.',
    images: [
      {
        url: '/icon.png',
        width: 512,
        height: 512,
        alt: 'Veya Digital Business Card',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Veya — Digital Business Cards & Contactless Networking',
    description:
      'Instant, contactless digital business cards for modern professionals. Share via QR, NFC, or link.',
    images: ['/icon.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${poppins.variable} ${montserrat.variable} ${lora.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
