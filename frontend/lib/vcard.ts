import { PublicCardDto } from '@veya/shared';

/**
 * Builds a valid vCard 3.0 string from a PublicCardDto.
 */
export function buildVCardString(card: PublicCardDto): string {
  const clean = (str?: string | null) =>
    (str || '')
      .replace(/[\r\n]+/g, ' ')
      .replace(/[;,\\]/g, '\\$&')
      .trim();

  const parts = (card.name || '').trim().split(/\s+/);
  const familyName = parts.length > 1 ? parts.slice(-1)[0] : '';
  const givenName = parts.length > 1 ? parts.slice(0, -1).join(' ') : parts[0] || '';

  const lines: string[] = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${clean(familyName)};${clean(givenName)};;;`,
    `FN:${clean(card.name)}`,
  ];

  if (card.company) {
    lines.push(`ORG:${clean(card.company)}`);
  }
  if (card.role) {
    lines.push(`TITLE:${clean(card.role)}`);
  }
  if (card.phoneNumber) {
    lines.push(`TEL;TYPE=CELL,VOICE:${card.phoneNumber.trim()}`);
  }
  if (card.email) {
    lines.push(`EMAIL;TYPE=INTERNET,PREF:${card.email.trim()}`);
  }
  if (card.location) {
    lines.push(`ADR;TYPE=WORK,POSTAL:;;${clean(card.location)};;;;`);
  }
  if (card.website) {
    lines.push(`URL:${card.website.trim()}`);
  }
  if (card.avatarUrl) {
    lines.push(`PHOTO;VALUE=URI:${card.avatarUrl.trim()}`);
  }
  if (card.slogan) {
    lines.push(`NOTE:${clean(card.slogan)}`);
  } else {
    lines.push('NOTE:Digital Business Card powered by Veya');
  }

  lines.push(`REV:${new Date().toISOString()}`);
  lines.push('END:VCARD');

  return lines.join('\r\n');
}

/**
 * Triggers a browser download of the contact's .vcf file.
 */
export function downloadVCard(card: PublicCardDto): void {
  const vcard = buildVCardString(card);
  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const safeName = (card.name || 'contact').replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${safeName}.vcf`);
  document.body.appendChild(link);
  link.click();

  // Clean up URL object after a short timeout
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}
