import { Injectable } from '@nestjs/common';
import { TestDrive, TestDriveDocument } from './test-drives.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TestDriveStatus } from 'src/common/const/test-drives';

@Injectable()
export class TestDrivesService {
  constructor(
    @InjectModel(TestDrive.name)
    private readonly testDriveModel: Model<TestDriveDocument>,
  ) {}

  async create(createTestDriveDto: any): Promise<TestDrive> {
    const newTestDrive = new this.testDriveModel(createTestDriveDto);
    return newTestDrive.save();
  }

  async findAllUnavailable(carId: string): Promise<any> {
    const requestedAtDates = await this.testDriveModel
      .find({
        carId,
        status: { $in: [TestDriveStatus.Accepted, TestDriveStatus.Pending] },
      })
      .lean()
      .exec();

    return requestedAtDates;
  }

  async findByCarId(carId: string): Promise<any> {
    return this.testDriveModel.find({ carId }).lean().exec(); // Найти документ по ID
  }

  async findByUserId(userId: string): Promise<any> {
    return this.testDriveModel.find({ authorId: userId }).lean().exec(); // Найти документ по ID
  }

  async updateTestDrive(
    testDriveId: string,
    updateTestDriveDto: any,
  ): Promise<TestDrive> {
    const updatedTestDrive = await this.testDriveModel.findByIdAndUpdate(
      testDriveId, // ID автомобиля, который нужно обновить
      updateTestDriveDto, // Данные для обновления
      { new: true }, // Опция: вернуть обновленный документ
    );

    if (!updatedTestDrive) {
      throw new Error(`Car with ID ${testDriveId} not found`);
    }

    return updatedTestDrive;
  }
}
