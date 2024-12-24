import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from 'src/users/users.schema';
import { SellerRequest, SellerRequestDocument } from './seller-requests.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SellerRequestStatus } from 'src/common/const/seller-request.const';

@Injectable()
export class SellerRequestsService {
  constructor(
    @InjectModel(SellerRequest.name)
    private readonly sellerRequestModel: Model<SellerRequestDocument>,
  ) {}

  async findRequestByUserId(userId: string): Promise<SellerRequest> {
    const request = await this.sellerRequestModel.findOne({ userId });
    return request;
  }

  async findPendingRequestByUserId(userId: string): Promise<SellerRequest> {
    const request = await this.sellerRequestModel.findOne({
      userId,
      status: SellerRequestStatus.Pending,
    });
    return request;
  }

  // FIXED: почему-то если отвергнули заявку стать селлером, потом опять закидываешь, то ошибка уникалного индекса (db has a userId_1 index and it affects a new entity)
  async createRequest(user: User): Promise<SellerRequest> {
    const existingRequest = await this.sellerRequestModel.findOne({
      where: { user, status: SellerRequestStatus.Pending },
    });

    if (existingRequest) {
      throw new BadRequestException('You already have a pending request.');
    }

    const sellerRequest = new this.sellerRequestModel({
      userId: user._id,
      status: SellerRequestStatus.Pending,
    });
    return sellerRequest.save();
  }

  async updateSellerRequest(
    user: User,
    updateSellerRequestDto: Partial<SellerRequest>,
  ): Promise<SellerRequest> {
    const sellerRequest = await this.sellerRequestModel
      .findOne({
        userId: user._id.toString(),
      })
      .lean()
      .exec();

    const updatedSellerRequest =
      await this.sellerRequestModel.findByIdAndUpdate(
        sellerRequest._id, // ID автомобиля, который нужно обновить
        updateSellerRequestDto, // Данные для обновления
        { new: true }, // Опция: вернуть обновленный документ
      );

    if (!updatedSellerRequest) {
      throw new Error(`Seller Request with ID ${user._id} not found`);
    }

    return updatedSellerRequest;
  }
}
