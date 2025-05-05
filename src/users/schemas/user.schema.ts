import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole;
}

export type UserDocument = User &
  Document<{
    equals(arg0: Types.ObjectId): unknown;
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    role: UserRole;
  }>;

export const UserSchema = SchemaFactory.createForClass(User);
