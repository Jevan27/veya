/**
 * Veya Legal & Compliance Global Configuration
 * 
 * Update this file whenever your company details, emails, DPO, or dates change.
 * Both /terms and /privacy automatically pull from these values.
 */

export const legalConfig = {
  companyName: 'Veya Technologies',
  companyAddress: 'Phase 9 Bagong Silang, Caloocan City, Metro Manila, Philippines',
  jurisdiction: 'Republic of the Philippines',
  venue: 'Caloocan City, Metro Manila, Philippines',
  websiteUrl: 'https://veya.app',

  supportEmail: 'veya.tech@gmail.com',
  privacyEmail: 'veya.privacy@gmail.com',

  dpo: {
    name: 'Jevan Campillos',
    email: 'jvncmplls@gmail.com',
  },

  dates: {
    effectiveDate: 'September 11, 2026',
    lastUpdatedDate: 'September 11, 2026',
  },

  eligibility: {
    minimumAge: 18,
  },

  infrastructure: {
    storageProvider: 'Cloudflare R2',
    databaseProvider: 'PostgreSQL hosted on Supabase',
    edgeNetwork: 'Cloudflare / Vercel',
  },

  payments: {
    processor: 'Stripe',
    currencies: 'Philippine Pesos (PHP) or US Dollars (USD)',
    liabilityCapPhp: 'PHP 1,000.00',
    liabilityCapUsd: 'USD 50.00',
  },
};
