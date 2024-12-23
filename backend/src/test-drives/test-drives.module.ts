import { Module, forwardRef } from '@nestjs/common';
import { TestDrivesController } from './test-drives.controller';
import { TestDrivesService } from './test-drives.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TestDrive, TestDriveSchema } from './test-drives.schema';
import { UsersModule } from 'src/users/users.module';
import { CarsModule } from 'src/cars/cars.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => CarsModule),
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
