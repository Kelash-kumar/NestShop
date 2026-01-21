import { LoginDto } from './dto/login.dto.js';
import { AuthResponseDto } from './dto/auth-response.dto.js';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { RegisterDto } from './dto/register.dto.js';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private SALT_ROUND = 12;
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  //register
  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password, name, firstName, lastName } = registerDto;

    try {
      const alreadyExist = await this.prisma.user.findUnique({
        where: { email },
      });

      if (alreadyExist) {
        throw new ConflictException('User with this email already exists');
      }
      const hashPassword = await bcrypt.hash(password, this.SALT_ROUND);

      const user = await this.prisma.user.create({
        data: {
          email,
          password: hashPassword,
          name,
          firstName,
          lastName,
        },
        select: {
          id: true,
          name: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
        },
      });

      //generate token
      const tokens = await this.generateToken(user.id, user.email);

      //update refresh token
      this.updateRefreshToken(user.id, tokens.refreshToken);
      return {
        ...tokens,
        user,
      };
    } catch (error) {
      // If it's already an HttpException, rethrow it
      if (error instanceof ConflictException) {
        throw error;
      }

      // Log the actual error
      const errorMessage = error instanceof Error ? error.message : String(error);
      Logger.error(`Registration failed: ${errorMessage}`, error instanceof Error ? error.stack : '');
      
      // Throw a proper exception with details
      throw new InternalServerErrorException({
        message: 'An error occurred during registration',
        details: errorMessage,
        timestamp: new Date().toISOString(),
      });
    }
  }

  //generate new token
  private async generateToken(
    userId: string,
    email: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: userId, email };

    const refreshId = randomBytes(16).toString('hex');
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '15m' }),
      this.jwtService.signAsync({ ...payload, refreshId }, { expiresIn: '7d' }),
    ]);

    return { accessToken, refreshToken };
  }

  //private function to update refresh token return void
  private async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }

  //refresh access token
  async refreshToken(userId: string): Promise<AuthResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User Not Found');
    }

    //generate token
    const tokens = await this.generateToken(user.id, user.email);

    //update refresh token
    this.updateRefreshToken(user.id, tokens.refreshToken);
    return {
      ...tokens,
      user,
    };
  }

  //logout
  async logOut(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken: null,
      },
    });
  }

  //login
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid email and password');
    }

    const tokens = await this.generateToken(user.id, user.email);

    //update refresh token
    this.updateRefreshToken(user.id, tokens.refreshToken);
    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }
}
