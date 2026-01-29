import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { UserResponseDto } from './dto/user-response.dto.js';
import type { RequestWithUser } from 'src/common/interfaces/request-with-user.interface.js';

@ApiTags("users")
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard,RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('me')
  @ApiOperation({summary:"Get current user profile"})
  @ApiResponse({
    status:200,
    description:"The current user profile",
    type:UserResponseDto
  })
  @ApiResponse({
    status:401,
    description:"Unauthorized",
  }) 
  
  async getUserProfile(@Req() req:RequestWithUser) : Promise<UserResponseDto>{
    return this.usersService.findOne(req.user.id);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(+id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
