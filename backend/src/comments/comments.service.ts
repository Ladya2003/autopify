import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from './comments.schema';
import { Model } from 'mongoose';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
  ) {}

  async findCommentsByCarId(carId: string): Promise<Comment[]> {
    const comments = await this.commentModel
      .find({ carId })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return comments;
  }

  async findCommentsBySellerId(sellerId: string): Promise<Comment[]> {
    const comments = await this.commentModel
      .find({ sellerId })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return comments;
  }

  async create(carId: string, commentDto: any): Promise<Comment> {
    const newComment = new this.commentModel({ ...commentDto, carId }); // Создать экземпляр модели с данными
    return newComment.save();
  }

  async createSellerComment(
    sellerId: string,
    commentDto: any,
  ): Promise<Comment> {
    const newComment = new this.commentModel({ ...commentDto, sellerId }); // Создать экземпляр модели с данными
    return newComment.save();
  }
}
