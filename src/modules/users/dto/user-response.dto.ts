import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty({
    description: 'User id',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'User email',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
    nullable:true
  })
  firstName: string | null;
  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    nullable:true
  })
  lastName: string | null;

  @ApiProperty({
    description: 'User role',
    enum: Role,
    example: Role.USER,
  })
  role: Role;

  @ApiProperty({
    description: 'User created at',
    example: '2022-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'User updated at',
    example: '2022-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
