import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { promises } from 'dns';
import { AuthResponse } from './interfaces/auth-response.interface';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';



@Injectable()
export class AuthService {
    constructor(
        private prisma:PrismaService,
        private jwtService: JwtService
    ){}
    

    async registerUser(registerDtor:RegisterDto): Promise<AuthResponse | { user: any; message: string }> {
        const userExist = await this.prisma.user.findUnique({
            where: {
                email: registerDtor.email,
            },
        });

        if (userExist) {
            throw new ConflictException('User with this email already exists');
        }

        const hashedPassword = await this.hashedPassword(registerDtor.password);


        const newUser = await this.prisma.user.create({
           data:{
                email: registerDtor.email,
                password: hashedPassword,
                name: registerDtor.name,
                
            
           },
           include:{
                events: true, 
                bookings: true, 
           }
        });
        const { password, ...result } = newUser;
        return {
            user: result,
            message: 'User registered successfully',
        }
    }




   async loginUser(loginDto:LoginDto): Promise<AuthResponse | { user: any; token: string; message: string }> {
    const userExist = await this.prisma.user.findUnique({
        where:{
            email: loginDto.email,
        }
    }) 

    if (!userExist || !(await bcrypt.compare(loginDto.password, userExist.password))) {
        throw new ConflictException('User with this email does not exist');
    }

    const tokens = this.generateToken(userExist);

    const { password, ...result } = userExist;
    return {
        user: result,
        token: tokens.accessToken,
        message: 'User logged in successfully',
    };


   }


   async createAdmin(registerDto:RegisterDto){
    const userExist = await this.prisma.user.findUnique({
            where: {
                email: registerDto.email,
            },
        });

        if (userExist) {
            throw new ConflictException('User with this email already exists');
        }

        const hashedPassword = await this.hashedPassword(registerDto.password);


        const newUser = await this.prisma.user.create({
           data:{
                email: registerDto.email,
                password: hashedPassword,
                name: registerDto.name,
                role:'admin'
            
           },
           include:{
                events: true, 
                bookings: true, 
           }
        });
        const { password, ...result } = newUser;
        return {
            user: result,
            message: 'User registered successfully',
        }



   }




async RefreshToken(refreshToken: string) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret:'123456',
            });

            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
            });
            if (!user) {
                throw new ConflictException('User not found');
            }

            const accessToken = this.generateAccessToken(user);
            return {
                accessToken,
                
            };

            }
            catch (e){
                throw new ConflictException('Invalid refresh token');
            }
        }

    async getuserBYId(userId: number){
        const user = await this.prisma.user.findUnique({
            where: { id: userId.toString() },
        });
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const { password, ...result } = user;
        return result;
    }

    private async hashedPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10);


}    

    private generateAccessToken(userExist): string {

    const payload = {
        email : userExist.email,
        role: userExist.role,
        sub: userExist.id
    }
    return this.jwtService.sign(payload, {
        secret:'123456',
        expiresIn: '1h', // Access token valid for 1 hour
    });




   

}
private generateRefreshToken(userExist): string {
    const payload = {
        sub:userExist.id,
    }
    return this.jwtService.sign(payload, {
        secret:'123456',
        expiresIn: '7d', // Access token valid for 1 hour
    });





}
private generateToken(userExist){
   
    return {
        accessToken : this.generateAccessToken(userExist),
        refreshToken : this.generateRefreshToken(userExist)
    }
}
}


