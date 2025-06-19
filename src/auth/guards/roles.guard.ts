import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import {   } from "rxjs";
import { RolesKey } from "../decorators/roles.decorator";


@Injectable()

export class RolesGuard implements CanActivate {

    constructor(private reflector:Reflector){}

    canActivate(context: ExecutionContext): boolean  {

        const requiredRoles = this.reflector.getAllAndOverride<string[]>(RolesKey, [
        context.getHandler(),
        context.getClass(),
        ]);
        
        if (!requiredRoles) {
            return true; 
        }
        const {user} = context.switchToHttp().getRequest();

        if (!user){
            throw new ForbiddenException('You are not authorized to access this resource');

        }

        const hasrequiredRole = requiredRoles.some(role => user.role === role);
        if( !hasrequiredRole) {
            throw new ForbiddenException('You do not have the required role to access this resource');
        }
        return true;
         

    }
}
