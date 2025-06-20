import { Module } from '@nestjs/common';
import { VenuesService } from './venues.service';
import { VenuesController } from './venues.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [VenuesService],
  controllers: [VenuesController],
  exports: [VenuesService]
})
export class VenuesModule {}
