import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { IsPasswordSafe } from "../../common/utils/validations/isPasswordSafe";

export class CreateUserDto {

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
    name:string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
    email:string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(50)
  @IsPasswordSafe()
    password:string;
}