import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException, ServiceUnavailableException } from '@nestjs/common';
import { UsersService } from '../users.service';
import { PrismaService } from '../../prisma/prisma.service';
import { StorageService } from '../../storage/storage.service';
import { User } from '@prisma/client';

describe('UsersService uploadProfilePhoto (Architecture & Integrity)', () => {
  let usersService: UsersService;
  let mockPrismaService: {
    user: {
      findUnique: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
      create: jest.Mock;
    };
  };
  let mockStorageService: {
    uploadBuffer: jest.Mock;
    deleteUserDirectory: jest.Mock;
  };

  const userId = 'user-123-uuid';

  const mockUser: User = {
    id: userId,
    email: 'test@example.com',
    name: 'Test User',
    passwordHash: 'hash',
    company: null,
    role: null,
    avatarUrl: null,
    phoneNumber: null,
    onboardingCompleted: true,
    hashedRefreshToken: null,
    provider: 'email',
    providerId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Legitimate minimal 1x1 PNG buffer
  const validPngBuffer = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
    0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00,
    0x0a, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
    0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49,
    0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
  ]);

  beforeEach(async () => {
    mockPrismaService = {
      user: {
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        create: jest.fn(),
      },
    };

    mockStorageService = {
      uploadBuffer: jest.fn(),
      deleteUserDirectory: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: StorageService, useValue: mockStorageService },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  it('should successfully upload valid file buffer and update database avatarUrl', async () => {
    mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
    mockStorageService.uploadBuffer.mockResolvedValue('https://cdn.veya.app/users/user-123-uuid/userpfp/avatar-123.png');
    mockPrismaService.user.update.mockResolvedValue({
      ...mockUser,
      avatarUrl: 'https://cdn.veya.app/users/user-123-uuid/userpfp/avatar-123.png',
    });

    const mockMulterFile = {
      buffer: validPngBuffer,
      originalname: 'photo.png',
      mimetype: 'image/png',
    } as Express.Multer.File;

    const result = await usersService.uploadProfilePhoto(userId, { file: mockMulterFile });

    expect(result.avatarUrl).toBe('https://cdn.veya.app/users/user-123-uuid/userpfp/avatar-123.png');
    expect(mockStorageService.uploadBuffer).toHaveBeenCalledWith(
      expect.stringContaining('users/user-123-uuid/userpfp/avatar-'),
      validPngBuffer,
      'image/png',
    );
    expect(mockPrismaService.user.update).toHaveBeenCalledWith({
      where: { id: userId },
      data: { avatarUrl: 'https://cdn.veya.app/users/user-123-uuid/userpfp/avatar-123.png' },
    });
  });

  it('should successfully upload valid base64 payload and update database avatarUrl', async () => {
    mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
    mockStorageService.uploadBuffer.mockResolvedValue('https://cdn.veya.app/users/user-123-uuid/userpfp/avatar-456.png');
    mockPrismaService.user.update.mockResolvedValue({
      ...mockUser,
      avatarUrl: 'https://cdn.veya.app/users/user-123-uuid/userpfp/avatar-456.png',
    });

    const base64Data = `data:image/png;base64,${validPngBuffer.toString('base64')}`;

    const result = await usersService.uploadProfilePhoto(userId, {
      base64: base64Data,
      fileName: 'profile.png',
      mimeType: 'image/png',
    });

    expect(result.avatarUrl).toBe('https://cdn.veya.app/users/user-123-uuid/userpfp/avatar-456.png');
    expect(mockStorageService.uploadBuffer).toHaveBeenCalled();
    expect(mockPrismaService.user.update).toHaveBeenCalled();
  });

  it('should NOT update database if storage upload fails', async () => {
    mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
    mockStorageService.uploadBuffer.mockRejectedValue(
      new ServiceUnavailableException('Storage service is currently unavailable'),
    );

    const mockMulterFile = {
      buffer: validPngBuffer,
      originalname: 'photo.png',
      mimetype: 'image/png',
    } as Express.Multer.File;

    await expect(
      usersService.uploadProfilePhoto(userId, { file: mockMulterFile }),
    ).rejects.toThrow(ServiceUnavailableException);

    expect(mockPrismaService.user.update).not.toHaveBeenCalled();
  });

  it('should reject requests with neither file nor base64 data', async () => {
    mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

    await expect(
      usersService.uploadProfilePhoto(userId, {}),
    ).rejects.toThrow(BadRequestException);

    expect(mockStorageService.uploadBuffer).not.toHaveBeenCalled();
    expect(mockPrismaService.user.update).not.toHaveBeenCalled();
  });

  it('should reject SVG or malicious disguised files before storage upload (Phase 1 preservation)', async () => {
    mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

    const svgBuffer = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>');
    const mockMulterFile = {
      buffer: svgBuffer,
      originalname: 'malicious.jpg',
      mimetype: 'image/jpeg',
    } as Express.Multer.File;

    await expect(
      usersService.uploadProfilePhoto(userId, { file: mockMulterFile }),
    ).rejects.toThrow(BadRequestException);

    expect(mockStorageService.uploadBuffer).not.toHaveBeenCalled();
    expect(mockPrismaService.user.update).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException if user does not exist', async () => {
    mockPrismaService.user.findUnique.mockResolvedValue(null);

    const mockMulterFile = {
      buffer: validPngBuffer,
      originalname: 'photo.png',
      mimetype: 'image/png',
    } as Express.Multer.File;

    await expect(
      usersService.uploadProfilePhoto('non-existent-user', { file: mockMulterFile }),
    ).rejects.toThrow(NotFoundException);

    expect(mockStorageService.uploadBuffer).not.toHaveBeenCalled();
    expect(mockPrismaService.user.update).not.toHaveBeenCalled();
  });
});
