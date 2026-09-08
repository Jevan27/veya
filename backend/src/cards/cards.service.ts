import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { CardDto, PublicCardDto } from '@veya/shared';
import { BusinessCard } from '@prisma/client';

@Injectable()
export class CardsService {
  private readonly logger = new Logger(CardsService.name);

  constructor(private readonly prisma: PrismaService) {}

  toCardDto(card: BusinessCard): CardDto {
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
      fontFamily: card.fontFamily ?? 'inter',
      isDefault: card.isDefault,
      isPublished: card.isPublished,
      slug: card.slug,
      createdAt: card.createdAt.toISOString(),
      updatedAt: card.updatedAt.toISOString(),
    };
  }

  toPublicCardDto(card: BusinessCard): PublicCardDto {
    return {
      id: card.id,
      slug: card.slug,
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
      fontFamily: card.fontFamily ?? 'inter',
      isPublished: card.isPublished,
    };
  }

  /**
   * Checks if an error is a Prisma unique constraint violation (P2002).
   */
  private isUniqueConstraintViolation(error: unknown): boolean {
    return Boolean(
      error &&
        typeof error === 'object' &&
        'code' in error &&
        (error as { code: string }).code === 'P2002',
    );
  }

  /**
   * Creates a new business card inside a transaction.
   * If marked as default, atomically unsets existing defaults for this user.
   */
  async create(userId: string, dto: CreateCardDto): Promise<BusinessCard> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        // If isDefault is not explicitly provided, default to true only if user has 0 cards
        let isDefault = dto.isDefault;
        if (isDefault === undefined) {
          const existingCount = await tx.businessCard.count({ where: { userId } });
          isDefault = existingCount === 0;
        }

        if (isDefault) {
          await tx.businessCard.updateMany({
            where: { userId, isDefault: true },
            data: { isDefault: false },
          });
        }

        return tx.businessCard.create({
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
            fontFamily: dto.fontFamily || 'inter',
            isDefault,
            isPublished: dto.isPublished !== undefined ? dto.isPublished : true,
            slug: dto.slug || null,
          },
        });
      });
    } catch (error: unknown) {
      if (this.isUniqueConstraintViolation(error)) {
        this.logger.warn(`Default card concurrency collision detected for user ${userId}`);
        throw new ConflictException(
          'Another business card was concurrently designated as the default card or has a colliding slug. Please try again.',
        );
      }
      throw error;
    }
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

  /**
   * Updates an existing card inside a transaction.
   * Enforces user ownership and atomically unsets other default cards if updating to default.
   */
  async update(userId: string, cardId: string, dto: UpdateCardDto): Promise<BusinessCard> {
    // Enforce ownership check before mutation
    await this.findOne(userId, cardId);

    try {
      return await this.prisma.$transaction(async (tx) => {
        if (dto.isDefault === true) {
          await tx.businessCard.updateMany({
            where: { userId, isDefault: true, id: { not: cardId } },
            data: { isDefault: false },
          });
        }

        return tx.businessCard.update({
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
            ...(dto.cardBackgroundColor !== undefined && {
              cardBackgroundColor: dto.cardBackgroundColor,
            }),
            ...(dto.fontFamily !== undefined && { fontFamily: dto.fontFamily }),
            ...(dto.isDefault !== undefined && { isDefault: dto.isDefault }),
            ...(dto.isPublished !== undefined && { isPublished: dto.isPublished }),
            ...(dto.slug !== undefined && { slug: dto.slug || null }),
          },
        });
      });
    } catch (error: unknown) {
      if (this.isUniqueConstraintViolation(error)) {
        this.logger.warn(`Default card concurrency collision during update for user ${userId}`);
        throw new ConflictException(
          'Another business card was concurrently designated as the default card or has a colliding slug. Please try again.',
        );
      }
      throw error;
    }
  }

  /**
   * Atomically deletes a card after verifying ownership.
   */
  async remove(userId: string, cardId: string): Promise<{ success: boolean }> {
    // Enforce ownership check before deletion
    const existing = await this.findOne(userId, cardId);

    await this.prisma.$transaction(async (tx) => {
      await tx.businessCard.delete({
        where: { id: cardId },
      });

      // If deleted card was the default card, promote the user's newest remaining card
      if (existing.isDefault) {
        const nextCard = await tx.businessCard.findFirst({
          where: { userId },
          orderBy: { createdAt: 'desc' },
        });

        if (nextCard) {
          await tx.businessCard.update({
            where: { id: nextCard.id },
            data: { isDefault: true },
          });
        }
      }
    });

    return { success: true };
  }

  /**
   * Sets a specific card as default for the user.
   */
  async setDefault(userId: string, cardId: string): Promise<BusinessCard> {
    return this.update(userId, cardId, { isDefault: true });
  }

  /**
   * Resolves a public card representation by public ID or unique slug.
   * Enforces publication visibility: unpublished cards return a generic 404
   * so private information and metadata are never leaked.
   */
  async getPublicCard(identifier: string): Promise<PublicCardDto> {
    const trimmed = identifier.trim();
    if (!trimmed) {
      throw new NotFoundException('Card not found');
    }

    const card = await this.prisma.businessCard.findFirst({
      where: {
        OR: [
          { slug: trimmed },
          { id: trimmed },
        ],
      },
    });

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    if (!card.isPublished) {
      throw new NotFoundException("This card isn't available.");
    }

    return this.toPublicCardDto(card);
  }

  /**
   * Generates a standard vCard (VCF 3.0) string from a public card representation.
   */
  generateVCard(card: PublicCardDto): string {
    const clean = (str?: string | null) =>
      (str || '').replace(/[\r\n]+/g, ' ').replace(/[;,\\]/g, '\\$&').trim();

    const parts = (card.name || '').trim().split(/\s+/);
    const familyName = parts.length > 1 ? parts.slice(-1)[0] : '';
    const givenName = parts.length > 1 ? parts.slice(0, -1).join(' ') : parts[0] || '';

    const lines: string[] = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `N:${clean(familyName)};${clean(givenName)};;;`,
      `FN:${clean(card.name)}`,
    ];

    if (card.company) {
      lines.push(`ORG:${clean(card.company)}`);
    }
    if (card.role) {
      lines.push(`TITLE:${clean(card.role)}`);
    }
    if (card.phoneNumber) {
      lines.push(`TEL;TYPE=CELL,VOICE:${card.phoneNumber.trim()}`);
    }
    if (card.email) {
      lines.push(`EMAIL;TYPE=INTERNET,PREF:${card.email.trim()}`);
    }
    if (card.location) {
      lines.push(`ADR;TYPE=WORK,POSTAL:;;${clean(card.location)};;;;`);
    }
    if (card.website) {
      lines.push(`URL:${card.website.trim()}`);
    }
    if (card.avatarUrl) {
      lines.push(`PHOTO;VALUE=URI:${card.avatarUrl.trim()}`);
    }
    if (card.slogan) {
      lines.push(`NOTE:${clean(card.slogan)}`);
    } else {
      lines.push('NOTE:Digital Business Card powered by Veya');
    }

    lines.push(`REV:${new Date().toISOString()}`);
    lines.push('END:VCARD');

    return lines.join('\r\n');
  }
}
