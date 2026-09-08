import {
  Controller,
  Get,
  Param,
  Res,
  Header,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiProduces } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { CardsService } from './cards.service';
import { PublicCardDto } from '@veya/shared';

@ApiTags('public-cards')
@Controller('public/cards')
export class PublicCardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Get(':identifier')
  @Throttle({ default: { limit: 60, ttl: 60000 } })
  @ApiOperation({ summary: 'Retrieve public business card presentation by ID or slug' })
  @ApiResponse({ status: 200, description: 'Public business card representation' })
  @ApiResponse({ status: 404, description: 'Card not found or unpublished' })
  async getPublicCard(@Param('identifier') identifier: string): Promise<PublicCardDto> {
    return this.cardsService.getPublicCard(identifier);
  }

  @Get(':identifier/vcf')
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @ApiOperation({ summary: 'Download standard vCard (.vcf) file for this business card' })
  @ApiProduces('text/vcard')
  @ApiResponse({ status: 200, description: 'vCard 3.0 contact file download' })
  @ApiResponse({ status: 404, description: 'Card not found or unpublished' })
  @Header('Content-Type', 'text/vcard; charset=utf-8')
  async getVCard(
    @Param('identifier') identifier: string,
    @Res() res: Response,
  ): Promise<void> {
    const card = await this.cardsService.getPublicCard(identifier);
    const vcardContent = this.cardsService.generateVCard(card);

    // Sanitize filename for attachment
    const safeName = (card.name || 'contact')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .toLowerCase();

    res.setHeader('Content-Disposition', `attachment; filename="${safeName}.vcf"`);
    res.setHeader('Content-Type', 'text/vcard; charset=utf-8');
    res.send(vcardContent);
  }
}
