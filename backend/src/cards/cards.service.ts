import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { BusinessCardDto } from '@veya/shared';
import { BusinessCard } from '@prisma/client';

@Injectable()
export class CardsService {
  constructor(private readonly prisma: PrismaService) {}

  toCardDto(card: BusinessCard): BusinessCardDto {
    return {
      id: card.id,
      userId: card.userId,
      name: card.name,
      role: card.role,
      company: card.company,
      slogan: card.slogan,
      phoneNumber: card.phoneNumber,
      email: card.email,
      location: card.location,
      website: card.website,
      avatarUrl: card.avatarUrl,
      companyLogoUrl: card.companyLogoUrl,
      primaryColor: card.primaryColor,
      cardBackgroundColor: card.cardBackgroundColor,
      isDefault: card.isDefault,
      createdAt: card.createdAt.toISOString(),
      updatedAt: card.updatedAt.toISOString(),
    };
  }

  async create(userId: string, dto: CreateCardDto): Promise<BusinessCard> {
    // If set as default, unset previous defaults for this user
    if (dto.isDefault) {
      await this.prisma.businessCard.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return this.prisma.businessCard.create({
      data: {
        userId,
        name: dto.name,
        role: dto.role,
        company: dto.company,
        slogan: dto.slogan,
        phoneNumber: dto.phoneNumber,
        email: dto.email,
        location: dto.location,
        website: dto.website,
        avatarUrl: dto.avatarUrl,
        companyLogoUrl: dto.companyLogoUrl,
        primaryColor: dto.primaryColor || '#111111',
        cardBackgroundColor: dto.cardBackgroundColor || '#FFFFFF',
        isDefault: dto.isDefault ?? false,
      },
    });
  }

  async findAllByUserId(userId: string): Promise<BusinessCard[]> {
    return this.prisma.businessCard.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async findOne(userId: string, cardId: string): Promise<BusinessCard> {
    const card = await this.prisma.businessCard.findFirst({
      where: { id: cardId, userId },
    });

    if (!card) {
      throw new NotFoundException(`Business card with ID ${cardId} not found`);
    }

    return card;
  }

  async update(userId: string, cardId: string, dto: UpdateCardDto): Promise<BusinessCard> {
    await this.findOne(userId, cardId);

    if (dto.isDefault) {
      await this.prisma.businessCard.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return this.prisma.businessCard.update({
      where: { id: cardId },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.role !== undefined && { role: dto.role }),
        ...(dto.company !== undefined && { company: dto.company }),
        ...(dto.slogan !== undefined && { slogan: dto.slogan }),
        ...(dto.phoneNumber !== undefined && { phoneNumber: dto.phoneNumber }),
        ...(dto.email !== undefined && { email: dto.email }),
        ...(dto.location !== undefined && { location: dto.location }),
        ...(dto.website !== undefined && { website: dto.website }),
        ...(dto.avatarUrl !== undefined && { avatarUrl: dto.avatarUrl }),
        ...(dto.companyLogoUrl !== undefined && { companyLogoUrl: dto.companyLogoUrl }),
        ...(dto.primaryColor !== undefined && { primaryColor: dto.primaryColor }),
        ...(dto.cardBackgroundColor !== undefined && { cardBackgroundColor: dto.cardBackgroundColor }),
        ...(dto.isDefault !== undefined && { isDefault: dto.isDefault }),
      },
    });
  }

  async remove(userId: string, cardId: string): Promise<{ success: boolean }> {
    await this.findOne(userId, cardId);

    await this.prisma.businessCard.delete({
      where: { id: cardId },
    });

    return { success: true };
  }
}
