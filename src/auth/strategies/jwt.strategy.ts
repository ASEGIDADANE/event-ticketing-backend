import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
@Injectable()
export class Jwtstrategies extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: '123456',
        });
    }

    async validate(payload: any) {
       try{
        const user = await this.authService.getuserBYId(payload);
        return {
            ...user,
            role: payload.role,
        }

       }
       catch (error) {
              throw new UnauthorizedException('Invalid token');
         }
       
    }
}




    
