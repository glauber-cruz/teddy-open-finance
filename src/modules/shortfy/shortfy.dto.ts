import { IsNotEmpty, IsString, IsUrl, MaxLength } from "class-validator";

export class ShortfyUrlDto {

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  @MaxLength(1000)
    url:string;
}