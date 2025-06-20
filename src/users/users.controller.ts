import { Controller } from '@nestjs/common';
import { Get } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { User } from '../../generated/prisma';

import { currentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
   constructor(private readonly usersService: UsersService) {}

  // @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@currentUser() user: User) {
    return this.usersService.getMe(user.id);
  }


}
