import { ServiceUnavailableException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageService } from '../storage.service';

describe('StorageService Security & Failure Handling', () => {
  let configService: Partial<ConfigService>;

  describe('When R2 is unconfigured', () => {
    let service: StorageService;

    beforeEach(() => {
      configService = {
        get: jest.fn().mockImplementation((key: string) => {
          if (key === 'R2_ACCOUNT_ID') return undefined;
          if (key === 'R2_ACCESS_KEY_ID') return undefined;
          if (key === 'R2_SECRET_ACCESS_KEY') return undefined;
          if (key === 'R2_BUCKET_NAME') return undefined;
          if (key === 'R2_PUBLIC_DOMAIN') return undefined;
          return undefined;
        }),
      };

      service = new StorageService(configService as ConfigService);
    });

    it('should throw ServiceUnavailableException and never return fake Unsplash URL', async () => {
      const buffer = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01]);

      await expect(service.uploadBuffer('test-key.jpg', buffer, 'image/jpeg')).rejects.toThrow(
        ServiceUnavailableException,
      );

      try {
        await service.uploadBuffer('test-key.jpg', buffer, 'image/jpeg');
      } catch (err: unknown) {
        expect(err).toBeInstanceOf(ServiceUnavailableException);
        if (err instanceof ServiceUnavailableException) {
          expect(err.message).not.toContain('unsplash');
        }
      }
    });

    it('should reject company logo upload with ServiceUnavailableException when storage unconfigured', async () => {
      const validJpegBuffer = Buffer.from([
        0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x00,
      ]);

      await expect(
        service.uploadCompanyLogo({
          userId: 'user-123',
          buffer: validJpegBuffer,
          originalName: 'logo.jpg',
          mimeType: 'image/jpeg',
        }),
      ).rejects.toThrow(ServiceUnavailableException);
    });
  });

  describe('Upload validation before storage invocation', () => {
    let service: StorageService;

    beforeEach(() => {
      configService = {
        get: jest.fn().mockImplementation((key: string) => {
          if (key === 'R2_ACCOUNT_ID') return 'mock-account';
          if (key === 'R2_ACCESS_KEY_ID') return 'mock-key';
          if (key === 'R2_SECRET_ACCESS_KEY') return 'mock-secret';
          if (key === 'R2_BUCKET_NAME') return 'mock-bucket';
          return undefined;
        }),
      };

      service = new StorageService(configService as ConfigService);
    });

    it('should reject SVG company logo before even sending to S3/R2', async () => {
      const svgBuffer = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"></svg>', 'utf8');

      await expect(
        service.uploadCompanyLogo({
          userId: 'user-123',
          buffer: svgBuffer,
          originalName: 'logo.svg',
          mimeType: 'image/svg+xml',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should reject spoofed executable logo before sending to S3/R2', async () => {
      const exeBuffer = Buffer.from([0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00]);

      await expect(
        service.uploadCompanyLogo({
          userId: 'user-123',
          buffer: exeBuffer,
          originalName: 'logo.png',
          mimeType: 'image/png',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
