import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { Review, ReviewSchema } from './schemas/review.schema';
import { Movie, MovieSchema } from '../movies/schemas/movie.schema';
import { MoviesService } from 'src/movies/movies.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Review.name, schema: ReviewSchema },
      { name: Movie.name, schema: MovieSchema },
    ]),
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService,MoviesService],
})
export class ReviewsModule {}