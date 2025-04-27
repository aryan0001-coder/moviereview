import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie, MovieDocument } from './schemas/movie.schema';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { QueryMoviesDto } from './dto/query-movies.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
  ) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const movie = new this.movieModel(createMovieDto);
    return movie.save();
  }

  async findAll(queryDto: QueryMoviesDto): Promise<Movie[]> {
    const { title, genre, year, sortBy, sortOrder, page = 1, limit = 10 } = queryDto;
    const query = this.movieModel.find();

    if (title) {
      query.where('title', new RegExp(title, 'i'));
    }

    if (genre) {
      query.where('genres', genre);
    }

    if (year) {
      query.where('releaseYear', year);
    }

    if (sortBy) {
      query.sort({ [sortBy]: sortOrder || 'desc' });
    }

    return query
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }

  async findOne(id: string): Promise<Movie> {
    const movie = await this.movieModel.findById(id).exec();
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    return movie;
  }

  async update(id: string, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    const movie = await this.movieModel
      .findByIdAndUpdate(id, updateMovieDto, { new: true })
      .exec();
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    return movie;
  }

  async remove(id: string): Promise<void> {
    const result = await this.movieModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
  }

  async updateRating(movieId: string, rating: number): Promise<void> {
    const movie = await this.movieModel.findById(movieId);
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${movieId} not found`);
    }
    const newCount = movie.reviewCount + 1;
    const newAverage = ((movie.averageRating * movie.reviewCount) + rating) / newCount;
    
    await this.movieModel.findByIdAndUpdate(movieId, {
      averageRating: newAverage,
      reviewCount: newCount,
    });
  }
}