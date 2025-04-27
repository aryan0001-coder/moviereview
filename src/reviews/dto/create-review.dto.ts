import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ example: 8, description: 'Rating from 1 to 10' })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(10)
  rating: number;

  @ApiProperty({ example: 'Great movie, highly recommended!' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ example: '5f9d88b3f5d6f41d7c8c7c1c', description: 'Movie ID' })
  @IsNotEmpty()
  @IsMongoId()
  movieId: string;
}