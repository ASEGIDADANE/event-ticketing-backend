import { ExecutionContext, Injectable } from "@nestjs/common";
import { ThrottlerGuard, ThrottlerLimitDetail } from "@nestjs/throttler";
import { RequestWithUser } from "../interfaces/request.interface";



@Injectable()
export class logginThrotterGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>):Promise<string> {
    const email = req.body?.email ||"anonymous";
    return "login:${email}";

    
  
  }

  protected getTtl():Promise<number>{
    return Promise.resolve(60000); 
  }

  protected async throwThrottlingException(): Promise<void> {
    throw new Error("Too many login attempts. Please try again later.");
      
  }






  }
