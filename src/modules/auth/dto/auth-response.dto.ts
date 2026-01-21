// user auth response dto
import { Role } from '@prisma/client';
import { IsString } from 'class-validator';

export class AuthResponseDto {
  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;

  user: {
    id: string;
    name: string | null;
    email: string;
    firstName: string | null;
    lastName: string | null;
    role: Role;
  };
}
