import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CardsService } from '../cards.service';
import { PublicCardsController } from '../public-cards.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { BusinessCard } from '@prisma/client';
import { Response } from 'express';

describe('Public Cards Architecture & Security Boundaries', () => {
  let cardsService: CardsService;
  let publicCardsController: PublicCardsController;
  let mockPrisma: {
    businessCard: {
      findFirst: jest.Mock;
    };
  };

  const sampleCard: BusinessCard = {
    id: 'card-uuid-1234',
    userId: 'secret-user-id-999',
    name: 'Jevan Campillos',
    role: 'Product Designer',
    company: 'Veya',
    slogan: 'LIVE LAUGH LOVE',
    phoneNumber: '+63 927 278 6783',
    email: 'jevan@veya.app',
    location: 'Caloocan, Metro Manila, Philippines',
    website: 'https://www.veya.app',
    avatarUrl: 'https://r2.veya.app/avatar.jpg',
    companyLogoUrl: 'https://r2.veya.app/logo.png',
    primaryColor: '#4F46E5',
    cardBackgroundColor: '#0F172A',
    fontFamily: 'playfair',
    backgroundStyle: 'glass',
    socialLinks: [],
    isDefault: true,
    isPublished: true,
    slug: 'jevan-veya',
    createdAt: new Date('2026-03-01T12:00:00Z'),
    updatedAt: new Date('2026-03-02T12:00:00Z'),
  };

  beforeEach(async () => {
    mockPrisma = {
      businessCard: {
        findFirst: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicCardsController],
      providers: [
        CardsService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    cardsService = module.get<CardsService>(CardsService);
    publicCardsController = module.get<PublicCardsController>(PublicCardsController);
  });

  describe('getPublicCard & Data Isolation', () => {
    it('should resolve a published card by UUID and omit userId', async () => {
      mockPrisma.businessCard.findFirst.mockResolvedValue(sampleCard);

      const publicDto = await cardsService.getPublicCard('card-uuid-1234');

      expect(publicDto.id).toBe('card-uuid-1234');
      expect(publicDto.slug).toBe('jevan-veya');
      expect(publicDto.name).toBe('Jevan Campillos');
      expect(publicDto.role).toBe('Product Designer');
      expect(publicDto.company).toBe('Veya');
      expect(publicDto.phoneNumber).toBe('+63 927 278 6783');
      expect(publicDto.fontFamily).toBe('playfair');
      expect(publicDto.isPublished).toBe(true);
      expect(publicDto.backgroundStyle).toBe('glass');

      // Verify security isolation: userId MUST NOT be present on public DTO
      expect((publicDto as unknown as Record<string, unknown>).userId).toBeUndefined();
    });

    it('should resolve a published card by slug', async () => {
      mockPrisma.businessCard.findFirst.mockResolvedValue(sampleCard);

      const publicDto = await cardsService.getPublicCard('jevan-veya');

      expect(publicDto.id).toBe('card-uuid-1234');
      expect(publicDto.slug).toBe('jevan-veya');
      expect(mockPrisma.businessCard.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [{ slug: 'jevan-veya' }, { id: 'jevan-veya' }],
        },
      });
    });

    it('should throw NotFoundException if card does not exist', async () => {
      mockPrisma.businessCard.findFirst.mockResolvedValue(null);

      await expect(cardsService.getPublicCard('non-existent')).rejects.toThrow(
        new NotFoundException('Card not found'),
      );
    });

    it('should throw NotFoundException without leaking private data when card is unpublished', async () => {
      mockPrisma.businessCard.findFirst.mockResolvedValue({
        ...sampleCard,
        isPublished: false,
      });

      await expect(cardsService.getPublicCard('jevan-veya')).rejects.toThrow(
        new NotFoundException("This card isn't available."),
      );
    });
  });

  describe('generateVCard Formatting', () => {
    it('should generate standard vCard 3.0 specification string', () => {
      const publicDto = cardsService.toPublicCardDto(sampleCard);
      const vcard = cardsService.generateVCard(publicDto);

      expect(vcard).toContain('BEGIN:VCARD');
      expect(vcard).toContain('VERSION:3.0');
      expect(vcard).toContain('FN:Jevan Campillos');
      expect(vcard).toContain('ORG:Veya');
      expect(vcard).toContain('TITLE:Product Designer');
      expect(vcard).toContain('TEL;TYPE=CELL,VOICE:+63 927 278 6783');
      expect(vcard).toContain('EMAIL;TYPE=INTERNET,PREF:jevan@veya.app');
      expect(vcard).toContain('URL:https://www.veya.app');
      expect(vcard).toContain('END:VCARD');
    });

    it('should handle optional and missing fields gracefully in vCard', () => {
      const minimalCard: BusinessCard = {
        ...sampleCard,
        company: null,
        role: null,
        phoneNumber: null,
        email: null,
        location: null,
        website: null,
        avatarUrl: null,
        slogan: null,
      };

      const publicDto = cardsService.toPublicCardDto(minimalCard);
      const vcard = cardsService.generateVCard(publicDto);

      expect(vcard).toContain('BEGIN:VCARD');
      expect(vcard).toContain('FN:Jevan Campillos');
      expect(vcard).not.toContain('TEL;');
      expect(vcard).not.toContain('EMAIL;');
      expect(vcard).toContain('END:VCARD');
    });
  });

  describe('PublicCardsController', () => {
    it('should return public card representation via controller GET :identifier', async () => {
      mockPrisma.businessCard.findFirst.mockResolvedValue(sampleCard);

      const result = await publicCardsController.getPublicCard('jevan-veya');
      expect(result.name).toBe('Jevan Campillos');
      expect((result as unknown as Record<string, unknown>).userId).toBeUndefined();
    });

    it('should stream vCard with proper headers via controller GET :identifier/vcf', async () => {
      mockPrisma.businessCard.findFirst.mockResolvedValue(sampleCard);

      const setHeaderMock = jest.fn();
      const sendMock = jest.fn();
      const resMock = {
        setHeader: setHeaderMock,
        send: sendMock,
      } as unknown as Response;

      await publicCardsController.getVCard('jevan-veya', resMock);

      expect(setHeaderMock).toHaveBeenCalledWith(
        'Content-Disposition',
        'attachment; filename="jevan_campillos.vcf"',
      );
      expect(setHeaderMock).toHaveBeenCalledWith('Content-Type', 'text/vcard; charset=utf-8');
      expect(sendMock).toHaveBeenCalledWith(expect.stringContaining('BEGIN:VCARD'));
    });
  });
});
