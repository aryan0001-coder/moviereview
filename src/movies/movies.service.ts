import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie, MovieDocument } from './schemas/movie.schema';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
  ) {}

  async create(createMovieDto: CreateMovieDto): Promise<MovieDocument> {
    const newMovie = new this.movieModel(createMovieDto);
    return newMovie.save();
  }

  async findAll(): Promise<MovieDocument[]> {
    return this.movieModel.find().exec();
  }

  async findById(id: string): Promise<MovieDocument> {
    const movie = await this.movieModel.findById(id).exec();
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    return movie;
  }

  async update(
    id: string,
    updateMovieDto: UpdateMovieDto,
  ): Promise<MovieDocument> {
    const updatedMovie = await this.movieModel
      .findByIdAndUpdate(id, updateMovieDto, { new: true })
      .exec();

    if (!updatedMovie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }

    return updatedMovie;
  }

  async remove(id: string): Promise<void> {
    const result = await this.movieModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
  }

  async updateMovieRatings(
    movieId: string,
    newRating: number,
    oldRating?: number,
  ): Promise<void> {
    const movie = await this.findById(movieId);

    if (oldRating !== undefined) {
      const totalRating = movie.averageRating * movie.reviewCount;
      const updatedTotalRating = totalRating - oldRating + newRating;
      const updatedAverageRating =
        movie.reviewCount > 0 ? updatedTotalRating / movie.reviewCount : 0;

      await this.movieModel.updateOne(
        { _id: movieId },
        { averageRating: parseFloat(updatedAverageRating.toFixed(1)) },
      );
    } else {
      const totalRating = movie.averageRating * movie.reviewCount + newRating;
      const newCount = movie.reviewCount + 1;
      const updatedAverageRating = totalRating / newCount;

      await this.movieModel.updateOne(
        { _id: movieId },
        {
          averageRating: parseFloat(updatedAverageRating.toFixed(1)),
          reviewCount: newCount,
        },
      );
    }
  }

  async decrementReviewCount(movieId: string, rating: number): Promise<void> {
    const movie = await this.findById(movieId);

    if (movie.reviewCount <= 1) {
      await this.movieModel.updateOne(
        { _id: movieId },
        { averageRating: 0, reviewCount: 0 },
      );
      return;
    }

    const totalRating = movie.averageRating * movie.reviewCount;
    const updatedTotalRating = totalRating - rating;
    const newCount = movie.reviewCount - 1;
    const updatedAverageRating = updatedTotalRating / newCount;

    await this.movieModel.updateOne(
      { _id: movieId },
      {
        averageRating: parseFloat(updatedAverageRating.toFixed(1)),
        reviewCount: newCount,
      },
    );
  }
}
