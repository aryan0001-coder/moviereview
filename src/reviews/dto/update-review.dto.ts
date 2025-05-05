import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class UpdateReviewDto {
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(10)
  rating?: number;

  @IsString()
  @IsOptional()
  comment?: string;
}
