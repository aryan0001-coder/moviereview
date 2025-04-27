import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { MoviesModule } from './movies/movies.module';
import { ReviewsModule } from './reviews/reviews.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://aryan:aryan1234@cluster0.u2p1f.mongodb.net/movie-review?retryWrites=true&w=majority&appName=Cluster0'),
    UsersModule,
    MoviesModule,
    ReviewsModule,
    AuthModule,
  ],
})
export class AppModule {}