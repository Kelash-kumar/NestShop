import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email used for login',
    format: 'email',
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @ApiProperty({
    example: 'Password@123',
    description:
      'User password. Must include uppercase, lowercase, number, and special character.',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty({ message: 'password is required' })
  @MinLength(6, { message: 'password must greater or equal to 6 characters' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  password: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Display name of the user',
  })
  @IsString()
  @IsNotEmpty({ message: 'name is required' })
  name: string;

  @ApiPropertyOptional({
    example: 'John',
    description: 'User first name (optional)',
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({
    example: 'Doe',
    description: 'User last name (optional)',
  })
  @IsString()
  @IsOptional()
  lastName?: string;
}
