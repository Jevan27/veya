import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiPropertyOptional({ example: 'Alex Morgan', description: 'Full name of the user (optional during initial signup)' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'alex@example.com', description: 'Unique email address' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @ApiProperty({ example: 'P@ssw0rd123!', description: 'User password (min 8 characters)' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @IsNotEmpty({ message: 'Password is required' })
  password!: string;
}
