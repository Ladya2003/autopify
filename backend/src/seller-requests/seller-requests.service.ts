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
    const updatedSellerRequest =
      await this.sellerRequestModel.findByIdAndUpdate(
        user._id.toString(), // ID автомобиля, который нужно обновить
        updateSellerRequestDto, // Данные для обновления
        { new: true }, // Опция: вернуть обновленный документ
      );

    if (!updatedSellerRequest) {
      throw new Error(`Seller Request with ID ${user._id} not found`);
    }

    return updatedSellerRequest;
  }
}
