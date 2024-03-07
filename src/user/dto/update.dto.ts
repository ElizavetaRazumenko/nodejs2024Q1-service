import { IsString } from "class-validator";

export class UpdateDto {
  @IsString()
  oldPassword: string;
  @IsString()
  newPassword: string;
}