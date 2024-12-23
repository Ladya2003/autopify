import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Req,
  Get,
  Query,
  NotFoundException,
  Put,
  Param,
} from '@nestjs/common';
import { TestDrivesService } from './test-drives.service';
import { Roles } from 'src/decorators/role.decorator';
import { AuthRole } from 'src/common/const/auth.const';
import { UserService } from 'src/users/users.service';
import { TestDrive } from './test-drives.schema';
import { CarsService } from 'src/cars/cars.service';

@Controller('test-drives')
export class TestDrivesController {
  constructor(
    private readonly testDrivesService: TestDrivesService,
    private readonly userService: UserService,
    private readonly carsService: CarsService,
  ) {}

  @Post()
  @Roles(AuthRole.User)
  async create(@Body() requestDto: any, @Req() req: any) {
    if (
      !requestDto.carId ||
      !requestDto.status ||
      !requestDto.testDriveDatetime
    ) {
      throw new BadRequestException(
        'Missing required fields: carId, status, or testDriveDatetime',
      );
    }

    const user = req.user;
    requestDto.authorId = user.id;

    return this.testDrivesService.create(requestDto);
  }

  @Get('')
  @Roles(AuthRole.Seller)
  async findOne(@Query('carId') id: string) {
    const testDrives = (await this.testDrivesService.findByCarId(
      id,
    )) as TestDrive[];
    if (!testDrives) throw new NotFoundException('Тест драйв не найден');

    const newTestDrives = await Promise.all(
      testDrives.map(async (test) => {
        const author = await this.userService.findById(test.authorId);

        return {
          ...test,
          author: {
            profilePicture: author?.profilePicture,
            nickname: author?.nickname,
            email: author?.email,
            id: author?._id,
          },
        };
      }),
    );

    return newTestDrives;
  }

  @Get('test-drives-userId')
  @Roles(AuthRole.User)
  async findByUserId(@Query('userId') id: string) {
    const testDrives = (await this.testDrivesService.findByUserId(
      id,
    )) as TestDrive[];
    if (!testDrives) throw new NotFoundException('Тест драйв не найден');

    const newTestDrives = await Promise.all(
      testDrives.map(async (test) => {
        const car = await this.carsService.findOne(test.carId);

        return {
          ...test,
          car: {
            brand: car?.brand,
            model: car?.model,
            year: car?.year,
            price: car?.price,
          },
        };
      }),
    );

    return newTestDrives;
  }

  @Put(':testDriveId')
  @Roles(AuthRole.Seller)
  async updateCar(
    @Param('testDriveId') testDriveId: string,
    @Body() updateData: any,
  ): Promise<any> {
    return this.testDrivesService.updateTestDrive(testDriveId, updateData);
  }
}
