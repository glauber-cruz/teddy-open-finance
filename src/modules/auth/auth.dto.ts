import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { IsPasswordSafe } from "../../common/utils/validations/isPasswordSafe";

const defaultErrorMessage = { message:"The provided data does not match our records. Please check and try again." };

export class LoginDto {

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
    email:string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, defaultErrorMessage)
  @MaxLength(50, defaultErrorMessage)
  @IsPasswordSafe(defaultErrorMessage)
    password:string;
}