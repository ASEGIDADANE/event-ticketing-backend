import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: 'yourSecretKey', // Use env variable in production!
      signOptions: { expiresIn: '1h' },
    }),
    PrismaModule
  ],
  providers: [AuthService],
 
  controllers: [AuthController],
  exports: [AuthService]

})  
export class AuthModule {}
