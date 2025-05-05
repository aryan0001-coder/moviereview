import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  Min,
  Max,
} from 'class-validator';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  director: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1888)
  @Max(new Date().getFullYear() + 5)
  releaseYear: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  genre?: string[];

  @IsString()
  @IsOptional()
  description?: string;
}
