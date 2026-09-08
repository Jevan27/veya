import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CardsService } from './cards.service';
import { StorageService } from '../storage/storage.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { BusinessCardDto } from '@veya/shared';
import { Throttle } from '@nestjs/throttler';
import { MAX_IMAGE_SIZE_BYTES } from '../storage/file-validation.util';

@ApiTags('cards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cards')
export class CardsController {
  constructor(
    private readonly cardsService: CardsService,
    private readonly storageService: StorageService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new digital business card' })
  @ApiResponse({ status: 201, description: 'Card created successfully' })
  async create(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateCardDto,
  ): Promise<BusinessCardDto> {
    const card = await this.cardsService.create(userId, dto);
    return this.cardsService.toCardDto(card);
  }

  @Get()
  @ApiOperation({ summary: 'List all digital business cards for current user' })
  @ApiResponse({ status: 200, description: 'List of business cards' })
  async findAll(@CurrentUser('sub') userId: string): Promise<BusinessCardDto[]> {
    const cards = await this.cardsService.findAllByUserId(userId);
    return cards.map((c) => this.cardsService.toCardDto(c));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific business card by ID' })
  @ApiResponse({ status: 200, description: 'Business card details' })
  async findOne(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
  ): Promise<BusinessCardDto> {
    const card = await this.cardsService.findOne(userId, id);
    return this.cardsService.toCardDto(card);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing business card' })
  @ApiResponse({ status: 200, description: 'Updated business card' })
  async update(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateCardDto,
  ): Promise<BusinessCardDto> {
    const card = await this.cardsService.update(userId, id, dto);
    return this.cardsService.toCardDto(card);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a business card' })
  @ApiResponse({ status: 200, description: 'Card deleted successfully' })
  async remove(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
  ): Promise<{ success: boolean }> {
    return this.cardsService.remove(userId, id);
  }

  @Throttle({ upload: { limit: 10, ttl: 60000 } })
  @Post(':id/upload/avatar')
  @ApiOperation({ summary: 'Upload card profile photo to Cloudflare R2 isolated to this card' })
  @ApiConsumes('multipart/form-data', 'application/json')
  @UseInterceptors(FileInterceptor('photo', { limits: { fileSize: MAX_IMAGE_SIZE_BYTES } }))
  async uploadCardAvatar(
    @CurrentUser('sub') userId: string,
    @Param('id') cardId: string,
    @UploadedFile() file?: Express.Multer.File,
    @Body() body?: { base64?: string; mimeType?: string; fileName?: string },
  ): Promise<{ avatarUrl: string }> {
    await this.cardsService.findOne(userId, cardId);
    const { buffer, mimeType, originalName } = this.extractImage(file, body, 'avatar.png');
    const avatarUrl = await this.storageService.uploadCardAsset({
      userId,
      cardId,
      assetType: 'avatar',
      buffer,
      originalName,
      mimeType,
    });
    return { avatarUrl };
  }

  @Throttle({ upload: { limit: 10, ttl: 60000 } })
  @Post(':id/upload/logo')
  @ApiOperation({ summary: 'Upload card company logo to Cloudflare R2 isolated to this card' })
  @ApiConsumes('multipart/form-data', 'application/json')
  @UseInterceptors(FileInterceptor('logo', { limits: { fileSize: MAX_IMAGE_SIZE_BYTES } }))
  async uploadCardLogo(
    @CurrentUser('sub') userId: string,
    @Param('id') cardId: string,
    @UploadedFile() file?: Express.Multer.File,
    @Body() body?: { base64?: string; mimeType?: string; fileName?: string },
  ): Promise<{ companyLogoUrl: string }> {
    await this.cardsService.findOne(userId, cardId);
    const { buffer, mimeType, originalName } = this.extractImage(file, body, 'logo.png');
    const companyLogoUrl = await this.storageService.uploadCardAsset({
      userId,
      cardId,
      assetType: 'logo',
      buffer,
      originalName,
      mimeType,
    });
    return { companyLogoUrl };
  }

  @Throttle({ upload: { limit: 10, ttl: 60000 } })
  @Post('upload/avatar')
  @ApiOperation({ summary: 'Upload draft card avatar asset to Cloudflare R2' })
  @ApiConsumes('multipart/form-data', 'application/json')
  @UseInterceptors(FileInterceptor('photo', { limits: { fileSize: MAX_IMAGE_SIZE_BYTES } }))
  async uploadDraftAvatar(
    @CurrentUser('sub') userId: string,
    @UploadedFile() file?: Express.Multer.File,
    @Body() body?: { base64?: string; mimeType?: string; fileName?: string; cardId?: string },
  ): Promise<{ avatarUrl: string }> {
    const { buffer, mimeType, originalName } = this.extractImage(file, body, 'avatar.png');
    const avatarUrl = await this.storageService.uploadCardAsset({
      userId,
      cardId: body?.cardId || 'draft',
      assetType: 'avatar',
      buffer,
      originalName,
      mimeType,
    });
    return { avatarUrl };
  }

  @Throttle({ upload: { limit: 10, ttl: 60000 } })
  @Post('upload/logo')
  @ApiOperation({ summary: 'Upload card company logo image to Cloudflare R2' })
  @ApiConsumes('multipart/form-data', 'application/json')
  @UseInterceptors(FileInterceptor('logo', { limits: { fileSize: MAX_IMAGE_SIZE_BYTES } }))
  async uploadCompanyLogo(
    @CurrentUser('sub') userId: string,
    @UploadedFile() file?: Express.Multer.File,
    @Body() body?: { base64?: string; mimeType?: string; fileName?: string; cardId?: string },
  ): Promise<{ companyLogoUrl: string }> {
    const { buffer, mimeType, originalName } = this.extractImage(file, body, 'logo.png');
    const companyLogoUrl = await this.storageService.uploadCardAsset({
      userId,
      cardId: body?.cardId || 'draft',
      assetType: 'logo',
      buffer,
      originalName,
      mimeType,
    });

    return { companyLogoUrl };
  }

  private extractImage(
    file?: Express.Multer.File,
    body?: { base64?: string; mimeType?: string; fileName?: string },
    defaultName = 'image.png',
  ): { buffer: Buffer; mimeType: string; originalName: string } {
    if (file && file.buffer) {
      return {
        buffer: file.buffer,
        mimeType: file.mimetype || 'image/png',
        originalName: file.originalname || defaultName,
      };
    }

    if (body?.base64) {
      const cleanBase64 = body.base64.replace(/^data:image\/\w+;base64,/, '');
      const mimeType = body.mimeType || 'image/png';
      const originalName =
        body.fileName || (mimeType.includes('jpeg') ? defaultName.replace('.png', '.jpg') : defaultName);
      return {
        buffer: Buffer.from(cleanBase64, 'base64'),
        mimeType,
        originalName,
      };
    }

    throw new BadRequestException('Image file or base64 data is required');
  }
}
