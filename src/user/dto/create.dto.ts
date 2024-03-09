import { IsNotEmpty, IsString } from "class-validator";

export class CreateDto {
  @IsNotEmpty()
  @IsString()
  login: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
