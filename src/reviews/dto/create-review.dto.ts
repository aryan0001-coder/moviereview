import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsMongoId,
  Min,
  Max,
} from 'class-validator';

export class CreateReviewDto {
  @IsMongoId()
  @IsNotEmpty()
  movieId: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(10)
  rating: number;

  @IsString()
  @IsNotEmpty()
  comment: string;
}
