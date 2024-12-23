import { Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AuthRole } from 'src/common/const/auth.const';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Field(() => ID)
  _id?: Types.ObjectId;

  @Prop({ required: true })
  email: string;

  @Prop({ default: '' })
  nickname?: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'user' })
  role: AuthRole;

  @Prop()
  profilePicture?: string;

  @Prop({ default: '' })
  description: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
