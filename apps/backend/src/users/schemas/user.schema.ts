import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Schema({
  timestamps: true,
  collection: 'users',
})
export class User {
  @Prop({
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    minlength: 3,
    maxlength: 30,
  })
  username: string;

  @Prop({
    required: true,
    lowercase: true,
    trim: true,
    unique: true,
  })
  email: string;

  @Prop({
    required: true,
    select: false,
  })
  passwordHash: string;

  @Prop({
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Prop()
  resetPasswordToken?: string;

  @Prop()
  resetPasswordExpires?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
