import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Body,
  UseGuards,
  NotFoundException,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { StorageService } from '../storage/storage.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserDto, CompleteOnboardingResponse } from '@veya/shared';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly storageService: StorageService,
  ) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  @ApiResponse({ status: 200, description: 'Current user profile' })
  async getMe(@CurrentUser('sub') userId: string): Promise<UserDto> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.usersService.toUserDto(user);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update profile details (name, company, role, avatar)' })
  @ApiResponse({ status: 200, description: 'Updated user profile' })
  async updateProfile(
    @CurrentUser('sub') userId: string,
    @Body() dto: UpdateProfileDto,
  ): Promise<UserDto> {
    const updated = await this.usersService.updateProfile(userId, dto);
    return this.usersService.toUserDto(updated);
  }

  @Post('profile/photo')
  @ApiOperation({ summary: 'Upload profile photo to Cloudflare R2' })
  @ApiConsumes('multipart/form-data', 'application/json')
  @UseInterceptors(
    FileInterceptor('photo', {
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    }),
  )
  async uploadProfilePhoto(
    @CurrentUser('sub') userId: string,
    @UploadedFile() file?: Express.Multer.File,
    @Body() body?: { base64?: string; mimeType?: string; fileName?: string },
  ): Promise<{ avatarUrl: string }> {
    let buffer: Buffer;
    let mimeType = 'image/jpeg';
    let fileExt = 'jpg';

    if (file && file.buffer) {
      buffer = file.buffer;
      mimeType = file.mimetype || 'image/jpeg';
      fileExt = file.originalname?.split('.').pop() || 'jpg';
    } else if (body?.base64) {
      const cleanBase64 = body.base64.replace(/^data:image\/\w+;base64,/, '');
      buffer = Buffer.from(cleanBase64, 'base64');
      mimeType = body.mimeType || 'image/jpeg';
      if (mimeType.includes('png')) fileExt = 'png';
      else if (mimeType.includes('webp')) fileExt = 'webp';
      else fileExt = 'jpg';
    } else {
      throw new BadRequestException('Image file or base64 data is required');
    }

    const key = `users/${userId}/userpfp/user.${fileExt}`;
    const avatarUrl = await this.storageService.uploadBuffer(key, buffer, mimeType);
    await this.usersService.updateProfile(userId, { avatarUrl });
    return { avatarUrl };
  }

  @Post('onboarding/complete')
  @ApiOperation({ summary: 'Mark onboarding as completed for the current user' })
  @ApiResponse({ status: 200, description: 'Onboarding completed confirmation' })
  async completeOnboarding(@CurrentUser('sub') userId: string): Promise<CompleteOnboardingResponse> {
    const updated = await this.usersService.completeOnboarding(userId);
    return {
      success: true,
      user: this.usersService.toUserDto(updated),
    };
  }

  @Delete('account')
  @ApiOperation({ summary: 'Permanently delete current user account and Cloudflare R2 assets' })
  @ApiResponse({ status: 200, description: 'Account successfully deleted' })
  async deleteAccount(@CurrentUser('sub') userId: string): Promise<{ success: boolean; message: string }> {
    await this.usersService.deleteUser(userId);
    return {
      success: true,
      message: 'Account and associated media successfully deleted',
    };
  }
}
