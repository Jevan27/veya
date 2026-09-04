import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Alex Morgan', description: 'Full name of user' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ example: 'Acme Corp', description: 'Company or business name' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  company?: string;

  @ApiPropertyOptional({ example: 'Software Engineer', description: 'Professional title or role' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  role?: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg', description: 'Profile photo URL or image URI' })
  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
