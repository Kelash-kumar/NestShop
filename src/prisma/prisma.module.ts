import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService], //exports modules mean making module available to other modules publically
})
export class PrismaModule {}
