import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { UserDto } from '@veya/shared';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { StorageService } from '../storage/storage.service';

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

  toUserDto(user: User): UserDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      company: user.company,
      role: user.role,
      avatarUrl: user.avatarUrl,
      phoneNumber: (user as any).phoneNumber || null,
      onboardingCompleted: user.onboardingCompleted,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
