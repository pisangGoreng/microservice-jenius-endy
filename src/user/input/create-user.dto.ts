import { IsEmail, IsInt, IsString } from "class-validator"

export class CreateUserDto {
  @IsString()
  username: string;

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