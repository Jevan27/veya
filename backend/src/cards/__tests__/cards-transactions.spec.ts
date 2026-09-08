import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { CardsService } from '../cards.service';
import { PrismaService } from '../../prisma/prisma.service';
import { BusinessCard } from '@prisma/client';

describe('CardsService Transactions, Concurrency & Ownership', () => {
  let cardsService: CardsService;
  let mockPrismaService: {
    businessCard: {
      findMany: jest.Mock;
      findFirst: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      updateMany: jest.Mock;
      delete: jest.Mock;
      count: jest.Mock;
    };
    $transaction: jest.Mock;
  };

  const userA = 'user-uuid-aaa';
  const userB = 'user-uuid-bbb';

  const mockCardA: BusinessCard = {
    id: 'card-111',
    userId: userA,
    name: 'Alex Developer',
    role: 'Staff Engineer',
    company: 'Veya Corp',
    slogan: 'Building the future',
    phoneNumber: '+1234567890',
    email: 'alex@veya.app',
    location: 'San Francisco, CA',
    website: 'https://veya.app',
    avatarUrl: 'https://cdn.veya.app/alex.jpg',
    companyLogoUrl: 'https://cdn.veya.app/logo.png',
    primaryColor: '#111111',
    cardBackgroundColor: '#FFFFFF',
    fontFamily: 'inter',
    isDefault: true,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  const mockCardB: BusinessCard = {
    id: 'card-222',
    userId: userB,
    name: 'Bob Designer',
    role: 'Design Lead',
    company: 'Design Co',
    slogan: 'Crafting beauty',
    phoneNumber: '+1987654321',
    email: 'bob@design.co',
    location: 'New York, NY',
    website: 'https://design.co',
    avatarUrl: null,
    companyLogoUrl: null,
    primaryColor: '#000000',
    cardBackgroundColor: '#F0F0F0',
    fontFamily: 'inter',
    isDefault: true,
    createdAt: new Date('2026-01-02T00:00:00.000Z'),
    updatedAt: new Date('2026-01-02T00:00:00.000Z'),
  };

  beforeEach(async () => {
    mockPrismaService = {
      businessCard: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
        delete: jest.fn(),
        count: jest.fn().mockResolvedValue(1),
      },
      // $transaction executes the callback with the transactional client
      $transaction: jest.fn().mockImplementation(async (callback) => {
        return callback(mockPrismaService);
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    cardsService = module.get<CardsService>(CardsService);
  });

  describe('Transactional Card Creation & Default Invariant', () => {
    it('should create a default card inside $transaction and unset existing defaults', async () => {
      const newCard: BusinessCard = {
        ...mockCardA,
        id: 'card-333',
        name: 'Alex Secondary',
        isDefault: true,
      };

      mockPrismaService.businessCard.updateMany.mockResolvedValue({ count: 1 });
      mockPrismaService.businessCard.create.mockResolvedValue(newCard);

      const result = await cardsService.create(userA, {
        name: 'Alex Secondary',
        isDefault: true,
      });

      expect(mockPrismaService.$transaction).toHaveBeenCalled();
      expect(mockPrismaService.businessCard.updateMany).toHaveBeenCalledWith({
        where: { userId: userA, isDefault: true },
        data: { isDefault: false },
      });
      expect(mockPrismaService.businessCard.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: userA,
          name: 'Alex Secondary',
          isDefault: true,
        }),
      });
      expect(result.id).toBe('card-333');
      expect(result.isDefault).toBe(true);
    });

    it('should not unset defaults when creating a non-default card', async () => {
      const nonDefaultCard: BusinessCard = {
        ...mockCardA,
        id: 'card-444',
        name: 'Alex Non Default',
        isDefault: false,
      };

      mockPrismaService.businessCard.create.mockResolvedValue(nonDefaultCard);

      const result = await cardsService.create(userA, {
        name: 'Alex Non Default',
        isDefault: false,
      });

      expect(mockPrismaService.$transaction).toHaveBeenCalled();
      expect(mockPrismaService.businessCard.updateMany).not.toHaveBeenCalled();
      expect(result.isDefault).toBe(false);
    });

    it('should rollback transaction if card creation fails', async () => {
      mockPrismaService.businessCard.updateMany.mockResolvedValue({ count: 1 });
      mockPrismaService.businessCard.create.mockRejectedValue(new Error('DB write failed'));

      await expect(
        cardsService.create(userA, {
          name: 'Failing Card',
          isDefault: true,
        }),
      ).rejects.toThrow('DB write failed');
    });

    it('should map P2002 unique constraint violation to ConflictException', async () => {
      const p2002Error = new Error('Unique constraint failed on the fields: (user_id, is_default)');
      (p2002Error as unknown as { code: string }).code = 'P2002';

      mockPrismaService.$transaction.mockRejectedValue(p2002Error);

      await expect(
        cardsService.create(userA, {
          name: 'Concurrent Default Card',
          isDefault: true,
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('Transactional Card Update & Default Invariant', () => {
    it('should update a card to default inside $transaction and unset other defaults', async () => {
      // User owns card-111
      mockPrismaService.businessCard.findFirst.mockResolvedValue({
        ...mockCardA,
        isDefault: false,
      });
      mockPrismaService.businessCard.updateMany.mockResolvedValue({ count: 1 });
      mockPrismaService.businessCard.update.mockResolvedValue({
        ...mockCardA,
        isDefault: true,
      });

      const result = await cardsService.update(userA, 'card-111', { isDefault: true });

      expect(mockPrismaService.businessCard.findFirst).toHaveBeenCalledWith({
        where: { id: 'card-111', userId: userA },
      });
      expect(mockPrismaService.$transaction).toHaveBeenCalled();
      expect(mockPrismaService.businessCard.updateMany).toHaveBeenCalledWith({
        where: { userId: userA, isDefault: true, id: { not: 'card-111' } },
        data: { isDefault: false },
      });
      expect(mockPrismaService.businessCard.update).toHaveBeenCalledWith({
        where: { id: 'card-111' },
        data: expect.objectContaining({ isDefault: true }),
      });
      expect(result.isDefault).toBe(true);
    });

    it('should map P2002 during update to ConflictException', async () => {
      mockPrismaService.businessCard.findFirst.mockResolvedValue(mockCardA);

      const p2002Error = new Error('Unique constraint failed');
      (p2002Error as unknown as { code: string }).code = 'P2002';
      mockPrismaService.$transaction.mockRejectedValue(p2002Error);

      await expect(
        cardsService.update(userA, 'card-111', { isDefault: true }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('User Ownership & Authorization Isolation', () => {
    it('should throw NotFoundException if User A tries to view User B card', async () => {
      mockPrismaService.businessCard.findFirst.mockResolvedValue(null);

      await expect(cardsService.findOne(userA, mockCardB.id)).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.businessCard.findFirst).toHaveBeenCalledWith({
        where: { id: mockCardB.id, userId: userA },
      });
    });

    it('should throw NotFoundException and NOT update if User A tries to update User B card', async () => {
      mockPrismaService.businessCard.findFirst.mockResolvedValue(null);

      await expect(
        cardsService.update(userA, mockCardB.id, { name: 'Hacked Card' }),
      ).rejects.toThrow(NotFoundException);

      expect(mockPrismaService.businessCard.update).not.toHaveBeenCalled();
      expect(mockPrismaService.$transaction).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException and NOT delete if User A tries to delete User B card', async () => {
      mockPrismaService.businessCard.findFirst.mockResolvedValue(null);

      await expect(cardsService.remove(userA, mockCardB.id)).rejects.toThrow(NotFoundException);

      expect(mockPrismaService.businessCard.delete).not.toHaveBeenCalled();
      expect(mockPrismaService.$transaction).not.toHaveBeenCalled();
    });

    it('should successfully delete card when user is the verified owner', async () => {
      mockPrismaService.businessCard.findFirst
        .mockResolvedValueOnce(mockCardA) // findOne
        .mockResolvedValueOnce({ ...mockCardB, userId: userA, isDefault: false }); // findFirst next card
      mockPrismaService.businessCard.delete.mockResolvedValue(mockCardA);
      mockPrismaService.businessCard.update.mockResolvedValue({ ...mockCardB, isDefault: true });

      const result = await cardsService.remove(userA, mockCardA.id);

      expect(mockPrismaService.businessCard.findFirst).toHaveBeenCalledWith({
        where: { id: mockCardA.id, userId: userA },
      });
      expect(mockPrismaService.$transaction).toHaveBeenCalled();
      expect(mockPrismaService.businessCard.delete).toHaveBeenCalledWith({
        where: { id: mockCardA.id },
      });
      // Verifies the remaining card was promoted to default
      expect(mockPrismaService.businessCard.update).toHaveBeenCalledWith({
        where: { id: mockCardB.id },
        data: { isDefault: true },
      });
      expect(result.success).toBe(true);
    });
  });
});
