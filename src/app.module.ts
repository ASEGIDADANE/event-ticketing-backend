import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { VenuesModule } from './venues/venues.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [AuthModule, UsersModule, VenuesModule, EventsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
