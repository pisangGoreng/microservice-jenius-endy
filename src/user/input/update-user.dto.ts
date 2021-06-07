import { IsEmail, IsInt, IsString } from "class-validator"

export class UpdateUserDto {
  @IsInt()
  accountNumber: number;

  @IsString()
  @IsEmail()
  emailAddress: string;

  @IsInt()
  identityNumber: number;
}