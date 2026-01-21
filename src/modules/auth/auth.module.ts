import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy.js';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy.js';

@Module({
  // imports:[PrismaService], //import prisma service this mean we can use prisma in auth service injectable , but we are not using it here we use in app.module.ts for global use
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret:
          configService.get<string>('JWT_SECRET') ?? 'DefaultTestSecret2026 ',
        signOptions: {
          expiresIn: Number(
            configService.get<number>('JWT_EXPIRES_IN') ?? '900 ',
          ),
        },
      }),
    }), 
  ],
  providers: [AuthService,JwtStrategy,RefreshTokenStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
