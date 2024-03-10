import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  artistId: string | null;

  @IsOptional()
  @IsString()
  albumId: string | null;

  @IsNotEmpty()
  @IsNumber()
  duration: number;
}
