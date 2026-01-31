import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { UserResponseDto } from './dto/user-response.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly SALT_ROUND = 12;
  constructor(private readonly prisma: PrismaService) { }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        password: false,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return users;
  }

  async findOne(userId: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        password: false,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    return user;
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    // TODO: check duplicate email 
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        password: false,
      },
    });
    return user;
  }

  //chnage current user password
  async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<{ message: string }> {

    const existingUser = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const isPasswordMatch = await bcrypt.compare(
      changePasswordDto.currentPassword,
      existingUser.password
    );

    if (!isPasswordMatch) {
      throw new BadRequestException('Current password is incorrect');
    }

    const isSamePassword = await bcrypt.compare(
      changePasswordDto.newPassword,
      existingUser.password
    );
    if (isSamePassword) {
      throw new BadRequestException('New password is same as current password');
    }
    const hashedPassword = await bcrypt.hash(
      changePasswordDto.newPassword,
      this.SALT_ROUND
    );

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
    });
    return { message: 'Password changed successfully' };
  }

  //remove current user
  async deleteAccount(userId: string): Promise<{ message: string }> {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!existingUser) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    await this.prisma.user.delete({
      where: {
        id: userId,
      },
    });
    return { message: 'Account deleted successfully' };
  }
}
