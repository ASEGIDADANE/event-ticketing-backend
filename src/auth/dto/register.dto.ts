
import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterDto {
    @IsEmail({}, { message: "Email is not valid" })
    email: string; 

    @IsNotEmpty({ message: "name should not be empty" })
    @IsString({ message: "name should be a string" })
    @MinLength(10, { message: "name should be at least 10 characters long" })
    @MaxLength(5000, { message: "name should not exceed 5000 characters" })
    name:string;

    @IsNotEmpty({ message: "password should not be empty" })
    @MinLength(10, { message: "password should be at least 10 characters long" })
    password: string;
    









}
