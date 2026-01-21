// user auth response dto
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsString } from 'class-validator';

export class AuthResponseDto {
  @ApiProperty({
    description: 'Access token for Authentication',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  accessToken: string;

  @ApiProperty({
    description: 'Refresh token for obtaining new access token',
    example: 'dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4=',
  })
  @IsString()
  refreshToken: string;
  // @ApiProperty({ type: () => UserDto })
  @ApiProperty({
    description: 'Authenticated user information',
    example: {
      id: 'user-123',
      name: 'John Doe',
      email: '<EMAIL>',
      firstName: 'John',
      lastName: 'Doe',
      role: 'USER',
    },
  })
  user: {
    id: string;
    name: string | null;
    email: string;
    firstName: string | null;
    lastName: string | null;
    role: Role;
  };
}
