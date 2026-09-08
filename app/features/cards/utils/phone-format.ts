import { COUNTRIES, CountryItem } from '../../onboarding/constants/countries';

export const DEFAULT_CARD_COUNTRY: CountryItem =
  COUNTRIES.find((c) => c.code === 'PH') || COUNTRIES[0];

/**
 * Strips all non-digit characters and formats the national phone number
 * with standard mobile spacing (e.g. "912 345 6789" or "555 123 4567").
 * Also strips accidental leading trunk zero (e.g. "0912..." -> "912...").
 */
export function formatNationalPhoneNumber(text: string): string {
  if (!text) return '';
  // Keep only digits
  let digits = text.replace(/\D/g, '');

  // Strip leading zero if present (national trunk prefix, e.g. 0917 -> 917)
  if (digits.startsWith('0')) {
    digits = digits.replace(/^0+/, '');
  }

  // Cap at 12 digits (standard national mobile numbers are 10-11 digits)
  digits = digits.slice(0, 12);

  if (digits.length === 0) return '';
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  if (digits.length <= 10) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }
  // For 11-12 digit numbers
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)} ${digits.slice(10)}`;
}

/**
 * Parses a full phone number string (e.g. "+63 912 345 6789" or "+1 555 123 4567")
 * into its matching CountryItem and formatted national number.
 */
export function parsePhoneNumber(
  fullPhone?: string | null,
  fallbackCountry: CountryItem = DEFAULT_CARD_COUNTRY
): { country: CountryItem; nationalNumber: string } {
  if (!fullPhone || !fullPhone.trim()) {
    return { country: fallbackCountry, nationalNumber: '' };
  }

  const trimmed = fullPhone.trim();

  // Sort countries with longest dialCode first to match e.g. +971 before +91, +353 before +35
  const sorted = [...COUNTRIES].sort((a, b) => b.dialCode.length - a.dialCode.length);

  for (const c of sorted) {
    if (trimmed.startsWith(c.dialCode)) {
      const remainder = trimmed.slice(c.dialCode.length);
      return {
        country: c,
        nationalNumber: formatNationalPhoneNumber(remainder),
      };
    }
  }

  // Check if digits start with a known dial code without '+' (e.g. "639123456789")
  const digitsOnly = trimmed.replace(/\D/g, '');
  for (const c of sorted) {
    const rawDial = c.dialCode.replace('+', '');
    if (digitsOnly.startsWith(rawDial) && digitsOnly.length > rawDial.length + 5) {
      const remainder = digitsOnly.slice(rawDial.length);
      return {
        country: c,
        nationalNumber: formatNationalPhoneNumber(remainder),
      };
    }
  }

  // Fallback: entire string as national number under fallback country
  return {
    country: fallbackCountry,
    nationalNumber: formatNationalPhoneNumber(trimmed),
  };
}

/**
 * Combines selected country and national number into a clean formatted string.
 * Returns empty string if no digits are entered.
 */
export function combinePhoneNumber(country: CountryItem, nationalNumber: string): string {
  const digits = nationalNumber.replace(/\D/g, '');
  if (!digits) return '';
  return `${country.dialCode} ${nationalNumber.trim()}`;
}

/**
 * Formats any raw or unformatted phone string into standard display format
 * for cards (e.g. "+63 927 278 6783").
 * If empty or invalid, falls back to default "+63 912 345 6789".
 */
export function formatCardPhone(
  rawPhone?: string | null,
  fallback: string = '+63 912 345 6789'
): string {
  if (!rawPhone || !rawPhone.trim()) {
    return fallback;
  }
  const { country, nationalNumber } = parsePhoneNumber(rawPhone);
  if (!nationalNumber) {
    return fallback;
  }
  return `${country.dialCode} ${nationalNumber}`;
}
