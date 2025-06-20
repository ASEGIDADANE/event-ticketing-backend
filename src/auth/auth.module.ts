import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { Jwtstrategies } from './strategies/jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: '123456',
      signOptions: { expiresIn: '1d' },
    }),
    PrismaModule
  ],
  providers: [AuthService,Jwtstrategies],
 
  controllers: [AuthController],
  exports: [AuthService]

})  
export class AuthModule {}
