import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Body } from '@nestjs/common/decorators/http/route-params.decorator';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Roles } from './decorators/roles.decorator';


@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}
    
    @Post('register')
    register(@Body() registerDto: RegisterDto) {
        return this.authService.registerUser(registerDto);
    }

    @Post('login')
    login(@Body() loginDto: LoginDto) {
        return this.authService.loginUser(loginDto);
    }

    
    @Post('refresh-token')
    refreshToken(@Body('refreshToken') refreshToken: string) {  
        return this.authService.RefreshToken(refreshToken);
    }

    @Post('create-role')
    @UseGuards(JwtAuthGuard)
    async createUserWithRole(
        @Body() registerDto: RegisterDto,
        @Body('role') role
    ) {
        return this.authService.createUserWithRole(registerDto, role);
    }





}
