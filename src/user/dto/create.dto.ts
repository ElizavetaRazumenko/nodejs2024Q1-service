import { IsString } from "class-validator";

export class CreateDto {
  @IsString()
  login: string;
  @IsString()
  password: string;
}
