import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Movie {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  director: string;

  @Prop({ required: true })
  releaseYear: number;

  @Prop()
  genre: string[];

  @Prop()
  description: string;

  @Prop({ default: 0 })
  averageRating: number;

  @Prop({ default: 0 })
  reviewCount: number;
}

export type MovieDocument = Movie &
  Document & {
    _id: Types.ObjectId;
  };
export const MovieSchema = SchemaFactory.createForClass(Movie);
