import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRole } from '../users/schemas/user.schema';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

interface AuthUser {
  userId: string;
  role: UserRole;
}

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new review' })
  create(
    @Body() createReviewDto: CreateReviewDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.reviewsService.create(user.userId, createReviewDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reviews' })
  findAll() {
    return this.reviewsService.findAll();
  }

  @ApiOperation({ summary: 'Get a review of a movie having a id' })
  @Get('movie/:movieId')
  findByMovie(@Param('movieId') movieId: string) {
    return this.reviewsService.findByMovie(movieId);
  }
  @ApiOperation({ summary: 'Get a review of a user having a id' })
  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  findByUser(@Param('userId') userId: string, @CurrentUser() user: AuthUser) {
    if (user.userId !== userId && user.role !== UserRole.ADMIN) {
      userId = user.userId;
    }
    return this.reviewsService.findByUser(userId);
  }

  @Get('my-reviews')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get my reviews' })
  findMyReviews(@CurrentUser() user: AuthUser) {
    return this.reviewsService.findByUser(user.userId);
  }

  @ApiOperation({ summary: 'Get a review with id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a review of particular id' })
  update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.reviewsService.update(
      id,
      user.userId,
      user.role,
      updateReviewDto,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a review with a particular id' })
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.reviewsService.remove(id, user.userId, user.role);
  }
}
