import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { QueryReviewsDto } from './dto/query-reviews.dto';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  // @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new review' })
  create(@Body() createReviewDto: CreateReviewDto, @Request() req:any) { //Accesses the HTTP request object. req.user contains the authenticated user (populated by JwtStrategy).
    return this.reviewsService.create(createReviewDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reviews with pagination and filtering' })
  findAll(@Query() queryDto: QueryReviewsDto) {
    return this.reviewsService.findAll(queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a review by ID' })
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a review' })
  update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @Request() req:any,
  ) {
    return this.reviewsService.update(id, updateReviewDto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a review' })
  remove(@Param('id') id: string, @Request() req:any) {
    return this.reviewsService.remove(id, req.user);
  }
}