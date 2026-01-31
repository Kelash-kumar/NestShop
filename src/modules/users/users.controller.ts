import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ParseUUIDPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { UserResponseDto } from './dto/user-response.dto.js';
import type { RequestWithUser } from 'src/common/interfaces/request-with-user.interface.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Role } from '@prisma/client';
import { GetUser } from '../../common/decorators/get-user.decorator.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';

@ApiTags("users")
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  //Get current user profile
  @Get('me')
  @ApiOperation({ summary: "Get current user profile" })
  @ApiResponse({
    status: 200,
    description: "The current user profile",
    type: UserResponseDto
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
  })
  async getUserProfile(@Req() req: RequestWithUser): Promise<UserResponseDto> {
    return await this.usersService.findOne(req.user.id);
  }

  // Get List of all users Only for admin
  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Get all users" })
  @ApiResponse({
    status: 200,
    description: "List of all users",
    type: [UserResponseDto]
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden",
  })
  async findAll(): Promise<UserResponseDto[]> {
    return await this.usersService.findAll();
  }

  // Get user by id Only for admin
  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Get user by id" })
  @ApiResponse({
    status: 200,
    description: "User profile fetched by Id",
    type: UserResponseDto
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden",
  })
  @ApiResponse({
    status: 404,
    description: "User not found",
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<UserResponseDto> {
    return await this.usersService.findOne(id);
  }

  // update user only for admin
  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Update user by id" })
  @ApiResponse({
    status: 200,
    description: "User updated successfully",
    type: UserResponseDto
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden",
  })
  @ApiResponse({
    status: 404,
    description: "User not found",
  })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    return await this.usersService.update(id, updateUserDto);
  }

  //Change current user password
  @Patch('me/password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Change current user password" })
  @ApiResponse({
    status: 200,
    description: "Password changed successfully",
    type: UserResponseDto
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden",
  })
  async changePassword(@GetUser('id') id: string, @Body() changePasswordDto: ChangePasswordDto): Promise<{ message: string }> {
    return await this.usersService.changePassword(id, changePasswordDto);
  }

  //delete current user
  @Delete('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete current user" })
  @ApiResponse({
    status: 200,
    description: "User deleted successfully",
    type: UserResponseDto
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden",
  })
  async remove(@GetUser('id') id: string): Promise<{ message: string }> {
    return await this.usersService.deleteAccount(id);
  }

  //delete user by id only for ADMIn
  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete user by id" })
  @ApiResponse({
    status: 200,
    description: "User deleted successfully",
    type: UserResponseDto
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden",
  })
  @ApiResponse({
    status: 404,
    description: "User not found",
  })
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
    return await this.usersService.deleteAccount(id);
  }
}
