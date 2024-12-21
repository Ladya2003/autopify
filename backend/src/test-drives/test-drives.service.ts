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
}
