import { IsString, IsOptional, IsBoolean, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SocialLinkDto, CardBackgroundStyle } from '@veya/shared';

export class CreateCardDto {
  @ApiProperty({ description: 'Full name on the business card' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Role or job title' })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiPropertyOptional({ description: 'Company name' })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiPropertyOptional({ description: 'Slogan or tagline' })
  @IsOptional()
  @IsString()
  slogan?: string;

  @ApiPropertyOptional({ description: 'Contact phone number' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({ description: 'Email address' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ description: 'Physical or business location' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ description: 'Website URL' })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional({ description: 'Avatar / Profile image URL' })
  @IsOptional()
  @IsString()
  avatarUrl?: string | null;

  @ApiPropertyOptional({ description: 'Company logo URL' })
  @IsOptional()
  @IsString()
  companyLogoUrl?: string | null;

  @ApiPropertyOptional({ description: 'Primary accent color hex' })
  @IsOptional()
  @IsString()
  primaryColor?: string;

  @ApiPropertyOptional({ description: 'Card background color hex' })
  @IsOptional()
  @IsString()
  cardBackgroundColor?: string;

  @ApiPropertyOptional({ description: 'Curated font family identifier (e.g. inter, playfair-display, poppins, montserrat, lora)' })
  @IsOptional()
  @IsString()
  fontFamily?: string;

  @ApiPropertyOptional({
    description: 'Visual background composition style',
    enum: ['minimal', 'flow', 'glass', 'geometric', 'organic', 'dot-fade'],
    default: 'minimal',
  })
  @IsOptional()
  @IsIn(['minimal', 'flow', 'glass', 'geometric', 'organic', 'dot-fade'])
  backgroundStyle?: CardBackgroundStyle;

  @ApiPropertyOptional({ description: 'Whether this card is the default/primary card' })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @ApiPropertyOptional({ description: 'Whether this card is publicly published and viewable on web' })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiPropertyOptional({ description: 'Unique custom URL slug for public card address' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({
    description: 'Social profile and website links',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        platform: { type: 'string' },
        url: { type: 'string' },
        label: { type: 'string' },
        displayOrder: { type: 'number' },
      },
    },
  })
  @IsOptional()
  socialLinks?: SocialLinkDto[] | null;
}
