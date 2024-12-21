import { Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { CommentType } from 'src/common/const/comment.const';

export type CommentDocument = Comment & Document;

@Schema({ timestamps: true })
export class Comment {
  @Field(() => ID)
  _id?: Types.ObjectId;

  @Prop()
  carId?: string;

  @Prop()
  sellerId?: string;

  @Prop()
  authorId?: string;

  @Prop({ required: true })
  text: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  status?: CommentType;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
