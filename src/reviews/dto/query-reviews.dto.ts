import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryReviewsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  userId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  movieId?: string;

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;
}