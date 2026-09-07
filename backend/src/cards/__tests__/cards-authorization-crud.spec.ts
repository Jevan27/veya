import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';

jest.mock('../../auth/guards/jwt-auth.guard', () => ({
  JwtAuthGuard: class MockJwtAuthGuard {
    canActivate() {
      return true;
    }
  },
}));

import { CardsController } from '../cards.controller';
import { CardsService } from '../cards.service';
import { StorageService } from '../../storage/storage.service';
import { CreateCardDto } from '../dto/create-card.dto';
import { UpdateCardDto } from '../dto/update-card.dto';
import { BusinessCard } from '@prisma/client';

describe('Cards Authorization & Controller CRUD', () => {
  let controller: CardsController;
  let cardsService: jest.Mocked<CardsService>;
  let storageService: jest.Mocked<StorageService>;

  const userA = 'user-auth-a';
  const userB = 'user-auth-b';

  const mockCardEntity: BusinessCard = {
    id: 'card-1',
    userId: userA,
    name: 'Alice Smith',
    role: 'Founder',
    company: 'Acme Corp',
    slogan: 'Innovation First',
    phoneNumber: '+15551234567',
    email: 'alice@acme.com',
    location: 'Austin, TX',
    website: 'https://acme.com',
    avatarUrl: null,
    companyLogoUrl: null,
    primaryColor: '#1E40AF',
    cardBackgroundColor: '#FFFFFF',
    isDefault: true,
    createdAt: new Date('2026-02-01T12:00:00.000Z'),
    updatedAt: new Date('2026-02-01T12:00:00.000Z'),
  };

  beforeEach(async () => {
    const mockCardsService = {
      create: jest.fn(),
      findAllByUserId: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      toCardDto: jest.fn().mockImplementation((c: BusinessCard) => ({
        id: c.id,
        userId: c.userId,
        name: c.name,
        role: c.role,
        company: c.company,
        slogan: c.slogan,
        phoneNumber: c.phoneNumber,
        email: c.email,
        location: c.location,
        website: c.website,
        avatarUrl: c.avatarUrl,
        companyLogoUrl: c.companyLogoUrl,
        primaryColor: c.primaryColor,
        cardBackgroundColor: c.cardBackgroundColor,
        isDefault: c.isDefault,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
      })),
    };

    const mockStorageService = {
      uploadCompanyLogo: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardsController],
      providers: [
        { provide: CardsService, useValue: mockCardsService },
        { provide: StorageService, useValue: mockStorageService },
      ],
    }).compile();

    controller = module.get<CardsController>(CardsController);
    cardsService = module.get(CardsService);
    storageService = module.get(StorageService);
  });

  describe('Create Card', () => {
    it('creates a card attached to the authenticated user ID and returns DTO', async () => {
      const dto: CreateCardDto = {
        name: 'Alice Smith',
        role: 'Founder',
        company: 'Acme Corp',
        isDefault: true,
      };

      cardsService.create.mockResolvedValue(mockCardEntity);

      const result = await controller.create(userA, dto);

      expect(cardsService.create).toHaveBeenCalledWith(userA, dto);
      expect(result.id).toBe('card-1');
      expect(result.userId).toBe(userA);
      expect(result.name).toBe('Alice Smith');
      expect(result.isDefault).toBe(true);
    });
  });

  describe('Find All Cards', () => {
    it('returns only cards belonging to the current user', async () => {
      const card2: BusinessCard = {
        ...mockCardEntity,
        id: 'card-2',
        name: 'Alice Personal',
        isDefault: false,
      };

      cardsService.findAllByUserId.mockResolvedValue([mockCardEntity, card2]);

      const result = await controller.findAll(userA);

      expect(cardsService.findAllByUserId).toHaveBeenCalledWith(userA);
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('card-1');
      expect(result[1].id).toBe('card-2');
    });

    it('returns empty array when user has no cards', async () => {
      cardsService.findAllByUserId.mockResolvedValue([]);

      const result = await controller.findAll(userB);

      expect(cardsService.findAllByUserId).toHaveBeenCalledWith(userB);
      expect(result).toEqual([]);
    });
  });

  describe('Find One Card (Ownership & IDOR Boundary)', () => {
    it('returns card details when requesting user owns the card', async () => {
      cardsService.findOne.mockResolvedValue(mockCardEntity);

      const result = await controller.findOne(userA, 'card-1');

      expect(cardsService.findOne).toHaveBeenCalledWith(userA, 'card-1');
      expect(result.id).toBe('card-1');
      expect(result.name).toBe('Alice Smith');
    });

    it('throws NotFoundException when user B attempts to access user A card', async () => {
      cardsService.findOne.mockRejectedValue(
        new NotFoundException('Business card with ID card-1 not found'),
      );

      await expect(controller.findOne(userB, 'card-1')).rejects.toThrow(NotFoundException);
      expect(cardsService.findOne).toHaveBeenCalledWith(userB, 'card-1');
    });
  });

  describe('Update Card (Ownership & IDOR Boundary)', () => {
    it('updates card when requesting user owns the card', async () => {
      const updateDto: UpdateCardDto = { name: 'Alice Johnson' };
      const updatedCard: BusinessCard = { ...mockCardEntity, name: 'Alice Johnson' };

      cardsService.update.mockResolvedValue(updatedCard);

      const result = await controller.update(userA, 'card-1', updateDto);

      expect(cardsService.update).toHaveBeenCalledWith(userA, 'card-1', updateDto);
      expect(result.name).toBe('Alice Johnson');
    });

    it('throws NotFoundException when unauthorized user attempts to update card', async () => {
      cardsService.update.mockRejectedValue(
        new NotFoundException('Business card with ID card-1 not found'),
      );

      await expect(
        controller.update(userB, 'card-1', { name: 'Hacked Card' }),
      ).rejects.toThrow(NotFoundException);

      expect(cardsService.update).toHaveBeenCalledWith(userB, 'card-1', { name: 'Hacked Card' });
    });
  });

  describe('Delete Card (Ownership & IDOR Boundary)', () => {
    it('successfully deletes card when owned by requesting user', async () => {
      cardsService.remove.mockResolvedValue({ success: true });

      const result = await controller.remove(userA, 'card-1');

      expect(cardsService.remove).toHaveBeenCalledWith(userA, 'card-1');
      expect(result).toEqual({ success: true });
    });

    it('throws NotFoundException when unauthorized user attempts to delete card', async () => {
      cardsService.remove.mockRejectedValue(
        new NotFoundException('Business card with ID card-1 not found'),
      );

      await expect(controller.remove(userB, 'card-1')).rejects.toThrow(NotFoundException);
      expect(cardsService.remove).toHaveBeenCalledWith(userB, 'card-1');
    });
  });

  describe('Logo Upload Security & Payload Handling', () => {
    it('uploads multipart file buffer and returns secure CDN URL', async () => {
      const mockFile = {
        buffer: Buffer.from('fake-image-bytes'),
        mimetype: 'image/png',
        originalname: 'logo.png',
      } as Express.Multer.File;

      storageService.uploadCompanyLogo.mockResolvedValue('https://cdn.veya.app/logo-123.png');

      const result = await controller.uploadCompanyLogo(userA, mockFile);

      expect(storageService.uploadCompanyLogo).toHaveBeenCalledWith({
        userId: userA,
        buffer: mockFile.buffer,
        originalName: 'logo.png',
        mimeType: 'image/png',
      });
      expect(result).toEqual({ companyLogoUrl: 'https://cdn.veya.app/logo-123.png' });
    });

    it('uploads base64 image data and strips data URL prefix correctly', async () => {
      const base64Data = 'data:image/jpeg;base64,dGVzdC1pbWFnZQ==';
      storageService.uploadCompanyLogo.mockResolvedValue('https://cdn.veya.app/logo-base64.jpg');

      const result = await controller.uploadCompanyLogo(userA, undefined, {
        base64: base64Data,
        mimeType: 'image/jpeg',
        fileName: 'custom-logo.jpg',
      });

      expect(storageService.uploadCompanyLogo).toHaveBeenCalledWith({
        userId: userA,
        buffer: Buffer.from('dGVzdC1pbWFnZQ==', 'base64'),
        originalName: 'custom-logo.jpg',
        mimeType: 'image/jpeg',
      });
      expect(result).toEqual({ companyLogoUrl: 'https://cdn.veya.app/logo-base64.jpg' });
    });

    it('throws BadRequestException when neither file nor base64 is provided', async () => {
      await expect(controller.uploadCompanyLogo(userA)).rejects.toThrow(BadRequestException);
      expect(storageService.uploadCompanyLogo).not.toHaveBeenCalled();
    });
  });
});
