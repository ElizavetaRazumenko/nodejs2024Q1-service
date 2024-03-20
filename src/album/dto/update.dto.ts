import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  year: number;

  @IsOptional()
  @IsString()
  artistId: string | null;
}
