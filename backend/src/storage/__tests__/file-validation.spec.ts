import { BadRequestException } from '@nestjs/common';
import {
  validateImageBuffer,
  detectImageSignature,
  MAX_IMAGE_SIZE_BYTES,
} from '../file-validation.util';

describe('File & Image Upload Security Validation', () => {
  // Valid magic byte buffers
  const validJpegBuffer = Buffer.from([
    0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x00,
  ]);
  const validPngBuffer = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
  ]);
  const validWebpBuffer = Buffer.from([
    0x52, 0x49, 0x46, 0x46, 0x20, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50, 0x56, 0x50, 0x38, 0x20,
  ]);

  // Malicious / Invalid buffers
  const svgXmlBuffer = Buffer.from(
    '<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>',
    'utf8',
  );
  const plainSvgBuffer = Buffer.from(
    '<svg width="100" height="100"><circle cx="50" cy="50" r="40"/></svg>',
    'utf8',
  );
  const windowsExeBuffer = Buffer.from([
    0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00, 0xff, 0xff, 0x00, 0x00,
  ]);
  const linuxElfBuffer = Buffer.from([
    0x7f, 0x45, 0x4c, 0x46, 0x02, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  ]);

  describe('detectImageSignature', () => {
    it('should correctly identify genuine JPEG buffer', () => {
      expect(detectImageSignature(validJpegBuffer)).toBe('jpeg');
    });

    it('should correctly identify genuine PNG buffer', () => {
      expect(detectImageSignature(validPngBuffer)).toBe('png');
    });

    it('should correctly identify genuine WebP buffer', () => {
      expect(detectImageSignature(validWebpBuffer)).toBe('webp');
    });

    it('should return null for XML/SVG files', () => {
      expect(detectImageSignature(svgXmlBuffer)).toBeNull();
      expect(detectImageSignature(plainSvgBuffer)).toBeNull();
    });

    it('should return null for executables', () => {
      expect(detectImageSignature(windowsExeBuffer)).toBeNull();
      expect(detectImageSignature(linuxElfBuffer)).toBeNull();
    });

    it('should return null for truncated/tiny buffers', () => {
      expect(detectImageSignature(Buffer.from([0xff, 0xd8]))).toBeNull();
    });
  });

  describe('validateImageBuffer', () => {
    it('should accept a legitimate JPEG image', () => {
      const result = validateImageBuffer(validJpegBuffer, 'photo.jpg', 'image/jpeg');
      expect(result.format).toBe('jpeg');
      expect(result.extension).toBe('jpg');
      expect(result.detectedMime).toBe('image/jpeg');
    });

    it('should accept a legitimate PNG image', () => {
      const result = validateImageBuffer(validPngBuffer, 'logo.png', 'image/png');
      expect(result.format).toBe('png');
      expect(result.extension).toBe('png');
      expect(result.detectedMime).toBe('image/png');
    });

    it('should accept a legitimate WebP image', () => {
      const result = validateImageBuffer(validWebpBuffer, 'banner.webp', 'image/webp');
      expect(result.format).toBe('webp');
      expect(result.extension).toBe('webp');
      expect(result.detectedMime).toBe('image/webp');
    });

    it('should reject plain SVG files', () => {
      expect(() => validateImageBuffer(plainSvgBuffer, 'vector.svg', 'image/svg+xml')).toThrow(
        BadRequestException,
      );
    });

    it('should reject SVG disguised as a JPEG (.jpg)', () => {
      expect(() => validateImageBuffer(plainSvgBuffer, 'malicious.jpg', 'image/jpeg')).toThrow(
        BadRequestException,
      );
    });

    it('should reject XML/SVG disguised as a PNG (.png)', () => {
      expect(() => validateImageBuffer(svgXmlBuffer, 'malicious.png', 'image/png')).toThrow(
        BadRequestException,
      );
    });

    it('should reject an executable disguised as a JPEG (.jpg)', () => {
      expect(() => validateImageBuffer(windowsExeBuffer, 'payload.jpg', 'image/jpeg')).toThrow(
        BadRequestException,
      );
    });

    it('should reject an executable disguised as a PNG (.png)', () => {
      expect(() => validateImageBuffer(windowsExeBuffer, 'payload.png', 'image/png')).toThrow(
        BadRequestException,
      );
    });

    it('should reject mismatched extension (PNG content renamed to .jpg)', () => {
      expect(() => validateImageBuffer(validPngBuffer, 'photo.jpg', 'image/jpeg')).toThrow(
        /Extension spoofing is prohibited/,
      );
    });

    it('should reject unsupported extensions even if content is valid (e.g. .exe, .sh, .svg, .gif)', () => {
      expect(() => validateImageBuffer(validJpegBuffer, 'image.gif', 'image/gif')).toThrow(
        /File extension '\.gif' is not permitted/,
      );
      expect(() => validateImageBuffer(validJpegBuffer, 'image.svg', 'image/svg+xml')).toThrow(
        /File extension '\.svg' is not permitted/,
      );
      expect(() => validateImageBuffer(validJpegBuffer, 'image.exe', 'application/octet-stream')).toThrow(
        /File extension '\.exe' is not permitted/,
      );
    });

    it('should reject unsupported MIME types (e.g. image/svg+xml, image/gif, text/html)', () => {
      expect(() => validateImageBuffer(validJpegBuffer, 'image.jpg', 'image/svg+xml')).toThrow(
        /MIME type 'image\/svg\+xml' is not allowed/,
      );
      expect(() => validateImageBuffer(validJpegBuffer, 'image.jpg', 'text/html')).toThrow(
        /MIME type 'text\/html' is not allowed/,
      );
    });

    it('should reject oversized buffers exceeding 5MB', () => {
      const oversizedBuffer = Buffer.alloc(MAX_IMAGE_SIZE_BYTES + 1024);
      // Put valid JPEG header on the oversized buffer
      oversizedBuffer[0] = 0xff;
      oversizedBuffer[1] = 0xd8;
      oversizedBuffer[2] = 0xff;

      expect(() => validateImageBuffer(oversizedBuffer, 'huge.jpg', 'image/jpeg')).toThrow(
        /exceeds the allowed limit of 5 MB/,
      );
    });

    it('should reject empty buffers', () => {
      expect(() => validateImageBuffer(Buffer.alloc(0), 'empty.jpg', 'image/jpeg')).toThrow(
        /Uploaded file buffer is empty/,
      );
    });
  });
});
