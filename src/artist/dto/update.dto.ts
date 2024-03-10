import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UpdateDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsBoolean()
  grammy: boolean;
}
