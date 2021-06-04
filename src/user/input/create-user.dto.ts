import { IsEmail, IsInt, IsString } from "class-validator"

export class CreateUserDto {
  @IsString()
  userName: string;

  @IsString()
  password: string;

  @IsInt()
  accountNumber: number;

  @IsString()
  @IsEmail()
  emailAddress: string;

  @IsInt()
  identityNumber: number;
}