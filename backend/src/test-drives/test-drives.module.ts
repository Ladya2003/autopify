import { Module } from '@nestjs/common';
import { TestDrivesController } from './test-drives.controller';
import { TestDrivesService } from './test-drives.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TestDrive, TestDriveSchema } from './test-drives.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TestDrive.name, schema: TestDriveSchema },
    ]),
    TestDrivesModule,
  ],
  controllers: [TestDrivesController],
  providers: [TestDrivesService],
  exports: [TestDrivesService],
})
export class TestDrivesModule {}
