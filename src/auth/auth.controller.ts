import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Body } from '@nestjs/common/decorators/http/route-params.decorator';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';


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


}
