import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Review,
  ReviewDocument,
  PopulatedReviewDocument,
} from './schemas/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { MoviesService } from '../movies/movies.service';
import { UserRole } from '../users/schemas/user.schema';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    @Inject(forwardRef(() => MoviesService))
    private moviesService: MoviesService,
  ) {}

  async create(
    userId: string,
    createReviewDto: CreateReviewDto,
  ): Promise<ReviewDocument> {
    const { movieId, ...reviewData } = createReviewDto;

    const existingReview = await this.reviewModel
      .findOne({
        user: new Types.ObjectId(userId),
        movie: new Types.ObjectId(movieId),
      })
      .exec();

    if (existingReview) {
      throw new ForbiddenException('You have already reviewed this movie');
    }

    await this.moviesService.findById(movieId);

    const newReview = new this.reviewModel({
      ...reviewData,
      user: new Types.ObjectId(userId),
      movie: new Types.ObjectId(movieId),
    });

    const savedReview = await newReview.save();

    await this.moviesService.updateMovieRatings(movieId, reviewData.rating);

    return savedReview;
  }

  async findAll(): Promise<PopulatedReviewDocument[]> {
    return this.reviewModel
      .find()
      .populate('user', 'name email')
      .populate('movie', 'title director releaseYear')
      .exec() as Promise<PopulatedReviewDocument[]>;
  }

  async findById(id: string): Promise<PopulatedReviewDocument> {
    const review = await this.reviewModel
      .findById(id)
      .populate('user', 'name email')
      .populate('movie', 'title director releaseYear')
      .orFail(new NotFoundException(`Review with ID ${id} not found`))
      .exec();

    return review as PopulatedReviewDocument;
  }

  async findByMovie(movieId: string): Promise<PopulatedReviewDocument[]> {
    return this.reviewModel
      .find({ movie: new Types.ObjectId(movieId) })
      .populate('user', 'name email')
      .exec() as Promise<PopulatedReviewDocument[]>;
  }

  async findByUser(userId: string): Promise<PopulatedReviewDocument[]> {
    return this.reviewModel
      .find({ user: new Types.ObjectId(userId) })
      .populate('movie', 'title director releaseYear')
      .exec() as Promise<PopulatedReviewDocument[]>;
  }

  async update(
    id: string,
    userId: string,
    userRole: UserRole,
    updateReviewDto: UpdateReviewDto,
  ): Promise<PopulatedReviewDocument> {
    const review = await this.findById(id);

    const reviewUserId = new Types.ObjectId(
      (review.user as unknown as { _id: Types.ObjectId })._id,
    );

    if (
      !reviewUserId.equals(new Types.ObjectId(userId)) &&
      userRole !== UserRole.ADMIN
    ) {
      throw new ForbiddenException('You cannot update this review');
    }

    const oldRating = review.rating;
    const updatedReview = await this.reviewModel
      .findByIdAndUpdate(
        id,
        { ...updateReviewDto, isEdited: true },
        { new: true },
      )
      .populate('user', 'name email')
      .populate('movie', 'title director releaseYear')
      .exec();

    if (updateReviewDto.rating && updateReviewDto.rating !== oldRating) {
      const reviewMovie = review.movie;
      await this.moviesService.updateMovieRatings(
        reviewMovie._id.toString(),
        updateReviewDto.rating,
        oldRating,
      );
    }

    return updatedReview as PopulatedReviewDocument;
  }

  async remove(id: string, userId: string, userRole: UserRole): Promise<void> {
    const review = await this.findById(id);

    const reviewUserId = new Types.ObjectId(
      (review.user as unknown as { _id: Types.ObjectId })._id,
    );

    if (
      !reviewUserId.equals(new Types.ObjectId(userId)) &&
      userRole !== UserRole.ADMIN
    ) {
      throw new ForbiddenException('You cannot delete this review');
    }

    const result = await this.reviewModel.deleteOne({ _id: id }).exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    const reviewMovie = review.movie;
    await this.moviesService.decrementReviewCount(
      reviewMovie._id.toString(),
      review.rating,
    );
  }
}
