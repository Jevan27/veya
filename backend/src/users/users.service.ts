import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { UserDto } from '@veya/shared';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { StorageService } from '../storage/storage.service';
import { validateImageBuffer } from '../storage/file-validation.util';

export interface CreateUserData {
  name?: string | null;
  email: string;
  passwordHash?: string;
  provider?: string;
  providerId?: string;
}

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async create(data: CreateUserData): Promise<User> {
    return this.prisma.user.create({
      data: {
        ...data,
        email: data.email.toLowerCase().trim(),
      },
    });
  }

  async updateHashedRefreshToken(userId: string, hashedRefreshToken: string | null): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken },
    });
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<User> {
    const existing = await this.findById(userId);
    if (!existing) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
        ...(dto.company !== undefined ? { company: dto.company.trim() } : {}),
        ...(dto.role !== undefined ? { role: dto.role.trim() } : {}),
        ...(dto.avatarUrl !== undefined ? { avatarUrl: dto.avatarUrl } : {}),
        ...(dto.phoneNumber !== undefined ? { phoneNumber: dto.phoneNumber.trim() } : {}),
      },
    });
  }

  async completeOnboarding(userId: string): Promise<User> {
    const existing = await this.findById(userId);
    if (!existing) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        onboardingCompleted: true,
      },
    });
  }

  async updatePassword(userId: string, passwordHash: string): Promise<User> {
    const existing = await this.findById(userId);
    if (!existing) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash,
        hashedRefreshToken: null, // Revoke active sessions on password reset
      },
    });
  }

  async deleteUser(userId: string): Promise<void> {
    const existing = await this.findById(userId);
    if (!existing) {
      throw new NotFoundException('User not found');
    }

    // 1. Delete user files from Cloudflare R2 bucket
    await this.storageService.deleteUserDirectory(userId);

    // 2. Delete user record from database
    await this.prisma.user.delete({
      where: { id: userId },
    });
  }

  /**
   * Uploads and updates a user's profile photo.
   * Handles Multer file buffer or base64 data, validates magic bytes,
   * uploads to R2 under users/{userId}/userpfp/avatar-{timestamp}.{ext},
   * and updates the user's avatarUrl in the database.
   */
  async uploadProfilePhoto(
    userId: string,
    input: {
      file?: Express.Multer.File;
      base64?: string;
      mimeType?: string;
      fileName?: string;
    },
  ): Promise<{ avatarUrl: string }> {
    const existing = await this.findById(userId);
    if (!existing) {
      throw new NotFoundException('User not found');
    }

    let buffer: Buffer;
    let originalName: string | undefined;
    let declaredMimeType: string | undefined;

    if (input.file && input.file.buffer) {
      buffer = input.file.buffer;
      originalName = input.file.originalname;
      declaredMimeType = input.file.mimetype;
    } else if (input.base64) {
      const cleanBase64 = input.base64.replace(/^data:image\/\w+;base64,/, '');
      buffer = Buffer.from(cleanBase64, 'base64');
      originalName = input.fileName;
      declaredMimeType = input.mimeType;
    } else {
      throw new BadRequestException('Image file or base64 data is required');
    }

    const { detectedMime, extension } = validateImageBuffer(
      buffer,
      originalName,
      declaredMimeType,
    );
    const safeUserId = userId.replace(/[^a-zA-Z0-9_-]/g, '');
    const key = `users/${safeUserId}/userpfp/avatar-${Date.now()}.${extension}`;

    const avatarUrl = await this.storageService.uploadBuffer(key, buffer, detectedMime);
    await this.updateProfile(userId, { avatarUrl });

    return { avatarUrl };
  }

  toUserDto(user: User): UserDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      company: user.company,
      role: user.role,
      avatarUrl: user.avatarUrl,
      phoneNumber: (user as unknown as { phoneNumber?: string | null }).phoneNumber || null,
      onboardingCompleted: user.onboardingCompleted,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
