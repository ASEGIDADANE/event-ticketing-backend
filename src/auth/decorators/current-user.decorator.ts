import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { create } from "domain";


export const currentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();

        return request.user; 
        
    }   
);







  











 








