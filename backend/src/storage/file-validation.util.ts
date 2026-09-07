import { BadRequestException } from '@nestjs/common';

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export type SupportedImageFormat = 'jpeg' | 'png' | 'webp';

export interface ValidatedImageInfo {
  detectedMime: string;
  extension: 'jpg' | 'png' | 'webp';
  format: SupportedImageFormat;
}

const ALLOWED_EXTENSIONS_MAP: Record<string, SupportedImageFormat> = {
  jpg: 'jpeg',
  jpeg: 'jpeg',
  png: 'png',
  webp: 'webp',
};

const ALLOWED_MIME_MAP: Record<string, SupportedImageFormat> = {
  'image/jpeg': 'jpeg',
  'image/pjpeg': 'jpeg',
  'image/png': 'png',
  'image/webp': 'webp',
};

/**
 * Inspects binary magic bytes of the buffer to determine true file type.
 */
export function detectImageSignature(buffer: Buffer): SupportedImageFormat | null {
  if (!buffer || buffer.length < 12) {
    return null;
  }

  // Check for SVG / XML text signatures as defense-in-depth
  const initialText = buffer.subarray(0, Math.min(buffer.length, 512)).toString('utf8').trim().toLowerCase();
  if (
    initialText.startsWith('<?xml') ||
    initialText.startsWith('<svg') ||
    initialText.includes('<!doctype svg') ||
    initialText.includes('<svg')
  ) {
    return null; // Explicitly treat SVG as rejected
  }

  // Check JPEG: 0xFF, 0xD8, 0xFF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'jpeg';
  }

  // Check PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return 'png';
  }

  // Check WebP: RIFF (bytes 0-3) + WEBP (bytes 8-11)
  const isRiff =
    buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46; // 'RIFF'
  const isWebp =
    buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50; // 'WEBP'

  if (isRiff && isWebp) {
    return 'webp';
  }

  return null;
}

/**
 * Validates an image buffer against allowed formats, size limits, and binary signatures.
 * Rejects SVGs, executables, mismatched extensions, and forged MIME types.
 */
export function validateImageBuffer(
  buffer: Buffer,
  originalName?: string,
  declaredMimeType?: string,
): ValidatedImageInfo {
  if (!buffer || buffer.length === 0) {
    throw new BadRequestException('Uploaded file buffer is empty');
  }

  if (buffer.length > MAX_IMAGE_SIZE_BYTES) {
    throw new BadRequestException(
      `File size (${(buffer.length / (1024 * 1024)).toFixed(2)} MB) exceeds the allowed limit of 5 MB`,
    );
  }

  // Detect genuine file format from magic bytes
  const detectedFormat = detectImageSignature(buffer);
  if (!detectedFormat) {
    throw new BadRequestException(
      'Invalid file content or unsupported format. Only genuine JPEG, PNG, and WebP images are allowed. SVG and other non-raster formats are prohibited.',
    );
  }

  // Validate declared extension if provided
  if (originalName) {
    const rawExt = originalName.split('.').pop()?.toLowerCase() || '';
    const extFormat = ALLOWED_EXTENSIONS_MAP[rawExt];

    if (!extFormat) {
      throw new BadRequestException(
        `File extension '.${rawExt}' is not permitted. Only .jpg, .jpeg, .png, and .webp extensions are accepted.`,
      );
    }

    if (extFormat !== detectedFormat) {
      throw new BadRequestException(
        `File extension '.${rawExt}' does not match detected image content (${detectedFormat}). Extension spoofing is prohibited.`,
      );
    }
  }

  // Validate declared MIME type if provided
  if (declaredMimeType) {
    const normalizedMime = declaredMimeType.toLowerCase().trim();
    const mimeFormat = ALLOWED_MIME_MAP[normalizedMime];

    if (!mimeFormat) {
      throw new BadRequestException(
        `MIME type '${declaredMimeType}' is not allowed. Only image/jpeg, image/png, and image/webp are accepted.`,
      );
    }

    if (mimeFormat !== detectedFormat) {
      throw new BadRequestException(
        `Declared MIME type '${declaredMimeType}' does not match detected file format (${detectedFormat}).`,
      );
    }
  }

  const extension: 'jpg' | 'png' | 'webp' =
    detectedFormat === 'jpeg' ? 'jpg' : detectedFormat;
  const detectedMime = `image/${detectedFormat}`;

  return {
    detectedMime,
    extension,
    format: detectedFormat,
  };
}
