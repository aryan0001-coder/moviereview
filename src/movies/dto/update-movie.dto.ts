import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  Min,
  Max,
} from 'class-validator';

export class UpdateMovieDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  director?: string;

  @IsNumber()
  @IsOptional()
  @Min(1888)
  @Max(new Date().getFullYear() + 5)
  releaseYear?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  genre?: string[];

  @IsString()
  @IsOptional()
  description?: string;
}
