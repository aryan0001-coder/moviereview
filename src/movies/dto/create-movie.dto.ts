import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateMovieDto {
  @ApiProperty({ example: 'The Shawshank Redemption', description: 'Movie title' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'Frank Darabont', description: 'Movie director' })
  @IsNotEmpty()
  @IsString()
  director: string;

  @ApiProperty({ example: 1994, description: 'Release year' })
  @IsNotEmpty()
  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear() + 5) // Allow movies up to 5 years in the future
  releaseYear: number;

  @ApiProperty({ example: 'https://example.com/poster.jpg', description: 'Movie poster URL', required: false })
  @IsOptional()
  @IsString()
  poster?: string;

  @ApiProperty({ example: 'Two imprisoned men bond over a number of years...', description: 'Movie description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: ['Drama', 'Crime'], description: 'Movie genres', required: false })
  @IsOptional()
  @IsString({ each: true })
  genres?: string[];
}