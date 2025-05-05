import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { UserDocument } from '../../users/schemas/user.schema';
import { MovieDocument } from '../../movies/schemas/movie.schema';

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: UserDocument['_id'];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Movie', required: true })
  movie: MovieDocument['_id'];

  @Prop({ required: true, min: 1, max: 10 })
  rating: number;

  @Prop({ required: true })
  comment: string;

  @Prop({ default: false })
  isEdited: boolean;
}

export type ReviewDocument = Review &
  Document & {
    _id: Types.ObjectId;
    user: Types.ObjectId | UserDocument;
    movie: Types.ObjectId | MovieDocument;
    createdAt: Date;
    updatedAt: Date;
  };
export type PopulatedReviewDocument = Omit<ReviewDocument, 'user' | 'movie'> & {
  user: UserDocument;
  movie: MovieDocument;
};
export const ReviewSchema = SchemaFactory.createForClass(Review);
