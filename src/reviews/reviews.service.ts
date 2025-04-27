import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { MoviesService } from '../movies/movies.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { QueryReviewsDto } from './dto/query-reviews.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    private moviesService: MoviesService,
  ) {}

  async create(createReviewDto: CreateReviewDto, user: any): Promise<Review> {
    await this.moviesService.findOne(createReviewDto.movieId);
    
    const review = new this.reviewModel({
      ...createReviewDto,
      userId: user.userId,
    });
    
    await this.moviesService.updateRating(createReviewDto.movieId, createReviewDto.rating);
    return review.save();
  }

  async findAll(queryDto: QueryReviewsDto): Promise<{ data: Review[]; total: number }> {
    const { userId, movieId, page = 1, limit = 10 } = queryDto;
    const query = this.reviewModel.find();

    if (userId) {
      query.where('userId', userId);
    }

    if (movieId) {
      query.where('movieId', movieId);
    }

    const total = await this.reviewModel.countDocuments(query.getQuery());
    const data = await query
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('userId', 'username')
      .populate('movieId', 'title')
      .exec();

    return { data, total };
  }

  async findOne(id: string): Promise<Review> {
    const review = await this.reviewModel
      .findById(id)
      .populate('userId', 'username')
      .populate('movieId', 'title')
      .exec();
      
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return review;
  }

  async update(id: string, updateReviewDto: UpdateReviewDto, user: any): Promise<Review|null> {
    const review = await this.reviewModel.findById(id);
    
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    
    if (review.userId.toString() !== user.userId) {
      throw new UnauthorizedException('You can only update your own reviews');
    }

    return this.reviewModel
      .findByIdAndUpdate(id, updateReviewDto, { new: true })
      .populate('userId', 'username')
      .populate('movieId', 'title')
      .exec();
  }

  async remove(id: string, user: any): Promise<void> {
    const review = await this.reviewModel.findById(id);
    
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    
    if (review.userId.toString() !== user.userId) {
      throw new UnauthorizedException('You can only delete your own reviews');
    }

    await this.reviewModel.deleteOne({ _id: id });
  }
}