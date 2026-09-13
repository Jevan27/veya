import {
  detectSocialPlatform,
  normalizeSocialUrl,
  SocialLinkDto,
} from '@veya/shared';
import { BusinessCard } from '@prisma/client';
import { CardsService } from '../cards.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('Social Links Detection & Validation', () => {
  describe('detectSocialPlatform', () => {
    it('detects Facebook URLs', () => {
      const urls = [
        'https://facebook.com/username',
        'https://www.facebook.com/username',
        'http://facebook.com/username',
        'facebook.com/username',
        'https://m.facebook.com/username',
        'https://fb.me/username',
      ];
      for (const url of urls) {
        const detected = detectSocialPlatform(url);
        expect(detected).not.toBeNull();
        expect(detected?.platform).toBe('facebook');
      }
    });

    it('detects LinkedIn URLs', () => {
      const urls = [
        'https://linkedin.com/in/username',
        'https://www.linkedin.com/in/username',
        'linkedin.com/in/username',
      ];
      for (const url of urls) {
        const detected = detectSocialPlatform(url);
        expect(detected).not.toBeNull();
        expect(detected?.platform).toBe('linkedin');
      }
    });

    it('detects Instagram URLs', () => {
      const urls = [
        'https://instagram.com/username',
        'https://www.instagram.com/username',
        'instagram.com/username',
        'https://instagr.am/username',
      ];
      for (const url of urls) {
        const detected = detectSocialPlatform(url);
        expect(detected).not.toBeNull();
        expect(detected?.platform).toBe('instagram');
      }
    });

    it('detects X / Twitter URLs', () => {
      const urls = [
        'https://x.com/username',
        'https://twitter.com/username',
        'https://www.twitter.com/username',
        'x.com/username',
      ];
      for (const url of urls) {
        const detected = detectSocialPlatform(url);
        expect(detected).not.toBeNull();
        expect(detected?.platform).toBe('x');
      }
    });

    it('detects TikTok URLs', () => {
      const urls = [
        'https://tiktok.com/@username',
        'https://www.tiktok.com/@username',
        'tiktok.com/@username',
      ];
      for (const url of urls) {
        const detected = detectSocialPlatform(url);
        expect(detected).not.toBeNull();
        expect(detected?.platform).toBe('tiktok');
      }
    });

    it('detects YouTube URLs', () => {
      const urls = [
        'https://youtube.com/@username',
        'https://www.youtube.com/channel/abc',
        'https://youtu.be/abcxyz',
        'youtube.com/@username',
      ];
      for (const url of urls) {
        const detected = detectSocialPlatform(url);
        expect(detected).not.toBeNull();
        expect(detected?.platform).toBe('youtube');
      }
    });

    it('detects GitHub URLs', () => {
      const urls = [
        'https://github.com/username',
        'https://www.github.com/username',
        'github.com/username',
      ];
      for (const url of urls) {
        const detected = detectSocialPlatform(url);
        expect(detected).not.toBeNull();
        expect(detected?.platform).toBe('github');
      }
    });

    it('detects Telegram, WhatsApp, Threads, Pinterest, Reddit, Discord, Snapchat', () => {
      expect(detectSocialPlatform('https://t.me/username')?.platform).toBe('telegram');
      expect(detectSocialPlatform('https://wa.me/1234567890')?.platform).toBe('whatsapp');
      expect(detectSocialPlatform('https://threads.net/@username')?.platform).toBe('threads');
      expect(detectSocialPlatform('https://pinterest.com/username')?.platform).toBe('pinterest');
      expect(detectSocialPlatform('https://reddit.com/user/username')?.platform).toBe('reddit');
      expect(detectSocialPlatform('https://discord.gg/mycommunity')?.platform).toBe('discord');
      expect(detectSocialPlatform('https://snapchat.com/add/user')?.platform).toBe('snapchat');
    });

    it('falls back to website for generic valid URLs', () => {
      const detected = detectSocialPlatform('https://example.com/portfolio');
      expect(detected).not.toBeNull();
      expect(detected?.platform).toBe('website');
      expect(detected?.name).toBe('Website');
      expect(detected?.isFallbackWebsite).toBe(true);
    });

    it('rejects malicious or dangerous protocols', () => {
      expect(detectSocialPlatform('javascript:alert(1)')).toBeNull();
      expect(detectSocialPlatform('data:text/html,<script>alert(1)</script>')).toBeNull();
      expect(detectSocialPlatform('vbscript:msgbox(1)')).toBeNull();
      expect(detectSocialPlatform('file:///etc/passwd')).toBeNull();
      expect(detectSocialPlatform('malformed-url')).toBeNull();
      expect(detectSocialPlatform('')).toBeNull();
    });

    it('verifies all minimum required URLs from prompt', () => {
      const tests = [
        { url: 'https://facebook.com/user', expected: 'facebook' },
        { url: 'https://www.facebook.com/user', expected: 'facebook' },
        { url: 'http://facebook.com/user', expected: 'facebook' },
        { url: 'https://linkedin.com/in/user', expected: 'linkedin' },
        { url: 'https://instagram.com/user', expected: 'instagram' },
        { url: 'https://x.com/user', expected: 'x' },
        { url: 'https://twitter.com/user', expected: 'x' },
        { url: 'https://tiktok.com/@user', expected: 'tiktok' },
        { url: 'https://youtube.com/@user', expected: 'youtube' },
        { url: 'https://github.com/user', expected: 'github' },
        { url: 'https://example.com', expected: 'website' },
      ];

      for (const t of tests) {
        const detected = detectSocialPlatform(t.url);
        expect(detected).not.toBeNull();
        expect(detected?.platform).toBe(t.expected);
      }

      expect(detectSocialPlatform('javascript:alert(1)')).toBeNull();
      expect(detectSocialPlatform('malformed-url')).toBeNull();
    });

    it('prevents domain spoofing / false positives', () => {
      // notfacebook.com should not be detected as facebook
      const spoof = detectSocialPlatform('https://notfacebook.com/username');
      expect(spoof?.platform).toBe('website'); // Generic website, not Facebook!

      const pathSpoof = detectSocialPlatform('https://myblog.org/facebook.com/test');
      expect(pathSpoof?.platform).toBe('website'); // Not Facebook!
    });

    it('handles changing URL during edit and re-detects platform', () => {
      const initial = detectSocialPlatform('https://facebook.com/user');
      expect(initial?.platform).toBe('facebook');

      // User changes input to LinkedIn
      const updated = detectSocialPlatform('https://linkedin.com/in/user');
      expect(updated?.platform).toBe('linkedin');
    });
  });

  describe('normalizeSocialUrl', () => {
    it('prepends https:// when missing', () => {
      expect(normalizeSocialUrl('facebook.com/username')).toBe('https://facebook.com/username');
    });

    it('preserves existing https:// and http:// and strips trailing slash', () => {
      expect(normalizeSocialUrl('https://github.com/user')).toBe('https://github.com/user');
      expect(normalizeSocialUrl('http://github.com/user')).toBe('http://github.com/user');
      expect(normalizeSocialUrl('https://github.com/user/')).toBe('https://github.com/user');
    });
  });

  describe('CardsService Social Links Integration', () => {
    let service: CardsService;
    let prisma: jest.Mocked<PrismaService>;

    beforeEach(() => {
      prisma = {
        businessCard: {
          count: jest.fn(),
          create: jest.fn(),
          update: jest.fn(),
          findFirst: jest.fn(),
          findMany: jest.fn(),
          updateMany: jest.fn(),
        },
        $transaction: jest.fn(async (cb: (tx: unknown) => Promise<unknown>) => cb(prisma)),
      } as unknown as jest.Mocked<PrismaService>;

      service = new CardsService(prisma);
    });

    it('toCardDto returns parsed socialLinks array', () => {
      const mockCard = {
        id: 'card-1',
        userId: 'user-1',
        name: 'Jane Doe',
        role: 'Founder',
        company: 'Veya',
        slogan: null,
        phoneNumber: null,
        email: null,
        location: null,
        website: null,
        avatarUrl: null,
        companyLogoUrl: null,
        primaryColor: '#000',
        cardBackgroundColor: '#fff',
        fontFamily: 'inter',
        socialLinks: [
          {
            id: 'link-1',
            platform: 'github',
            url: 'https://github.com/janedoe',
            displayOrder: 0,
          },
        ],
        isDefault: true,
        isPublished: true,
        slug: 'jane',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      } as unknown as BusinessCard;

      const dto = service.toCardDto(mockCard);
      expect(dto.socialLinks).toHaveLength(1);
      expect(dto.socialLinks?.[0]?.platform).toBe('github');
      expect(dto.socialLinks?.[0]?.url).toBe('https://github.com/janedoe');
    });

    it('toPublicCardDto returns public card with socialLinks', () => {
      const mockCard = {
        id: 'card-1',
        name: 'Jane Doe',
        role: 'Founder',
        company: 'Veya',
        slogan: null,
        phoneNumber: null,
        email: null,
        location: null,
        website: null,
        avatarUrl: null,
        companyLogoUrl: null,
        primaryColor: '#000',
        cardBackgroundColor: '#fff',
        fontFamily: 'inter',
        socialLinks: [
          {
            id: 'link-1',
            platform: 'linkedin',
            url: 'https://linkedin.com/in/janedoe',
            displayOrder: 0,
          },
        ],
        isPublished: true,
        slug: 'jane',
      } as unknown as BusinessCard;

      const pubDto = service.toPublicCardDto(mockCard);
      expect(pubDto.socialLinks).toHaveLength(1);
      expect(pubDto.socialLinks?.[0]?.platform).toBe('linkedin');
    });

    it('sanitizes and enforces detected platform on card creation', async () => {
      (prisma.businessCard.count as jest.Mock).mockResolvedValue(0);
      (prisma.businessCard.create as jest.Mock).mockImplementation(async (args) => ({
        id: 'new-card',
        ...args.data,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      await service.create('user-1', {
        name: 'John Doe',
        socialLinks: [
          {
            id: 'link-spoofed',
            platform: 'facebook', // client claims facebook, but URL is github
            url: 'https://github.com/johndoe',
            displayOrder: 0,
          } as SocialLinkDto,
          {
            id: 'bad-link',
            platform: 'website',
            url: 'javascript:alert(1)', // should be filtered out
            displayOrder: 1,
          } as SocialLinkDto,
        ],
      });

      expect(prisma.businessCard.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            socialLinks: [
              expect.objectContaining({
                platform: 'github', // Correctly derived from URL!
                url: 'https://github.com/johndoe',
              }),
            ],
          }),
        }),
      );
    });
  });
});
