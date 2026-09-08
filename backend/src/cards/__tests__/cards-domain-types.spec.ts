import { Test, TestingModule } from '@nestjs/testing';
import { validate } from 'class-validator';
import { CardsService } from '../cards.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCardDto } from '../dto/create-card.dto';
import { CardDto, BusinessCardDto } from '@veya/shared';
import { BusinessCard } from '@prisma/client';

// Card color luminance helper function mirroring client implementation
function isDarkColor(hexColor?: string): boolean {
  if (!hexColor) return false;
  const hex = hexColor.replace('#', '');
  if (hex.length !== 6) return false;
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
}

describe('Cards Domain Types & Normalization', () => {
  let cardsService: CardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardsService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    cardsService = module.get<CardsService>(CardsService);
  });

  describe('toCardDto Mapping & Type Compatibility', () => {
    it('should correctly map a complete BusinessCard entity to CardDto', () => {
      const mockCard: BusinessCard = {
        id: 'card-101',
        userId: 'user-202',
        name: 'Jevan Campillos',
        role: 'Full-Stack Developer',
        company: 'Veya',
        slogan: 'PEOPLE\nIDEAS\nOPPORTUNITIES\nCONNECTED',
        phoneNumber: '+63 912 345 6789',
        email: 'jevan@veya.app',
        location: 'Caloocan, Metro Manila, Philippines',
        website: 'https://www.veya.app',
        avatarUrl: 'https://cdn.veya.app/avatars/jevan.png',
        companyLogoUrl: 'https://cdn.veya.app/logos/veya.png',
        primaryColor: '#111111',
        cardBackgroundColor: '#FFFFFF',
        fontFamily: 'inter',
        isDefault: true,
        isPublished: true,
        slug: 'jevan-veya',
        createdAt: new Date('2026-03-01T12:00:00.000Z'),
        updatedAt: new Date('2026-03-02T15:30:00.000Z'),
      };

      const dto: CardDto = cardsService.toCardDto(mockCard);

      expect(dto.id).toBe('card-101');
      expect(dto.userId).toBe('user-202');
      expect(dto.name).toBe('Jevan Campillos');
      expect(dto.role).toBe('Full-Stack Developer');
      expect(dto.company).toBe('Veya');
      expect(dto.slogan).toBe('PEOPLE\nIDEAS\nOPPORTUNITIES\nCONNECTED');
      expect(dto.phoneNumber).toBe('+63 912 345 6789');
      expect(dto.email).toBe('jevan@veya.app');
      expect(dto.location).toBe('Caloocan, Metro Manila, Philippines');
      expect(dto.website).toBe('https://www.veya.app');
      expect(dto.avatarUrl).toBe('https://cdn.veya.app/avatars/jevan.png');
      expect(dto.companyLogoUrl).toBe('https://cdn.veya.app/logos/veya.png');
      expect(dto.primaryColor).toBe('#111111');
      expect(dto.cardBackgroundColor).toBe('#FFFFFF');
      expect(dto.fontFamily).toBe('inter');
      expect(dto.isDefault).toBe(true);
      expect(dto.createdAt).toBe('2026-03-01T12:00:00.000Z');
      expect(dto.updatedAt).toBe('2026-03-02T15:30:00.000Z');

      // Verify backwards-compatibility assignment to BusinessCardDto
      const legacyDto: BusinessCardDto = dto;
      expect(legacyDto.name).toBe('Jevan Campillos');
      expect(legacyDto.fontFamily).toBe('inter');
    });

    it('should map null and undefined fields safely', () => {
      const mockMinimalCard: BusinessCard = {
        id: 'card-min',
        userId: 'user-min',
        name: 'Minimal User',
        role: null,
        company: null,
        slogan: null,
        phoneNumber: null,
        email: null,
        location: null,
        website: null,
        avatarUrl: null,
        companyLogoUrl: null,
        primaryColor: null,
        cardBackgroundColor: null,
        fontFamily: null,
        isDefault: false,
        isPublished: true,
        slug: null,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      };

      const dto = cardsService.toCardDto(mockMinimalCard);
      expect(dto.id).toBe('card-min');
      expect(dto.name).toBe('Minimal User');
      expect(dto.role).toBeNull();
      expect(dto.company).toBeNull();
      expect(dto.avatarUrl).toBeNull();
      expect(dto.isDefault).toBe(false);
    });
  });

  describe('CreateCardDto Validation Behavior', () => {
    it('should succeed validation with valid attributes', async () => {
      const dto = new CreateCardDto();
      dto.name = 'Valid Name';
      dto.role = 'Engineer';
      dto.company = 'Acme Inc';
      dto.email = 'test@example.com';
      dto.isDefault = true;

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail validation when required name is missing', async () => {
      const dto = new CreateCardDto();
      // name omitted

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('name');
    });

    it('should fail validation when name is not a string', async () => {
      const dto = new CreateCardDto();
      // @ts-expect-error test non-string type
      dto.name = 12345;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('name');
    });

    it('should validate optional fontFamily field', async () => {
      const dto = new CreateCardDto();
      dto.name = 'Valid Name';
      dto.fontFamily = 'playfair-display';

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('Card Color Luminance (isDarkColor)', () => {
    it('should identify dark background colors correctly', () => {
      expect(isDarkColor('#000000')).toBe(true);
      expect(isDarkColor('#0F172A')).toBe(true);
      expect(isDarkColor('#0B132B')).toBe(true);
      expect(isDarkColor('#1E1B4B')).toBe(true);
      expect(isDarkColor('000000')).toBe(true); // without hash prefix
    });

    it('should identify light background colors correctly', () => {
      expect(isDarkColor('#FFFFFF')).toBe(false);
      expect(isDarkColor('#F8FAFC')).toBe(false);
      expect(isDarkColor('#FAF8F5')).toBe(false);
      expect(isDarkColor('#EEF2F6')).toBe(false);
    });

    it('should handle edge cases and malformed colors gracefully', () => {
      expect(isDarkColor('')).toBe(false);
      expect(isDarkColor(undefined)).toBe(false);
      expect(isDarkColor('#FFF')).toBe(false); // short hex not matching 6 chars
      expect(isDarkColor('invalid')).toBe(false);
    });
  });

  describe('Font Family Fallback & Normalization', () => {
    it('should fallback to inter if entity has undefined or null fontFamily', () => {
      const cardWithoutFont: BusinessCard = {
        id: 'card-no-font',
        userId: 'user-1',
        name: 'No Font User',
        role: 'Designer',
        company: 'Veya',
        slogan: null,
        phoneNumber: null,
        email: null,
        location: null,
        website: null,
        avatarUrl: null,
        companyLogoUrl: null,
        primaryColor: '#111111',
        cardBackgroundColor: '#FFFFFF',
        fontFamily: null,
        isDefault: true,
        isPublished: true,
        slug: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const dto = cardsService.toCardDto(cardWithoutFont);
      expect(dto.fontFamily).toBe('inter');
    });

    it('should preserve explicit custom font families', () => {
      const cardWithCustomFont = {
        id: 'card-custom-font',
        userId: 'user-1',
        name: 'Custom Font User',
        role: 'Designer',
        company: 'Veya',
        slogan: null,
        phoneNumber: null,
        email: null,
        location: null,
        website: null,
        avatarUrl: null,
        companyLogoUrl: null,
        primaryColor: '#111111',
        cardBackgroundColor: '#FFFFFF',
        fontFamily: 'playfair-display',
        isDefault: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as unknown as BusinessCard;

      const dto = cardsService.toCardDto(cardWithCustomFont);
      expect(dto.fontFamily).toBe('playfair-display');
    });
  });
});
