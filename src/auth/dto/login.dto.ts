import { IsEmail, IsNotEmpty,  MinLength,  } from "class-validator";


export class LoginDto {
    @IsEmail({}, { message: "Email is not valid" })
    email: string; 

   
    @IsNotEmpty({ message: "password should not be empty" })
    @MinLength(10, { message: "password should be at least 10 characters long" })
    password: string;

    







}