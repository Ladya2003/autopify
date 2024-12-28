import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Req,
  UploadedFiles,
  UseInterceptors,
  NotFoundException,
  Delete,
  Param,
  HttpException,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { CarsService } from './cars.service';
import { Roles } from 'src/decorators/role.decorator';
import { AuthRole } from 'src/common/const/auth.const';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UserService } from 'src/users/users.service';
import { TestDrivesService } from 'src/test-drives/test-drives.service';
import { TestDriveStatus } from 'src/common/const/test-drives';

@Controller('cars')
export class CarsController {
  constructor(
    private readonly carsService: CarsService,
    private readonly userService: UserService,
    private readonly testDrivesService: TestDrivesService,
  ) {}

  @Get()
  @Roles(AuthRole.Guest)
  async findAll(
    @Query('brand') brand?: string,
    @Query('model') model?: string,
    @Query('priceFrom') priceFrom?: string,
    @Query('priceTo') priceTo?: string,
    @Query('status') status?: string,
  ) {
    const filters = {
      brand,
      model,
      priceFrom: priceFrom ? parseFloat(priceFrom) : undefined,
      priceTo: priceTo ? parseFloat(priceTo) : undefined,
      status,
    };

    const cars = await this.carsService.findFiltered(filters);
    return cars;
  }

  @Get('cars')
  @Roles(AuthRole.Guest)
  async findOne(@Query('carId') id: string) {
    const car = await this.carsService.findOne(id);
    if (!car) throw new NotFoundException('Машина не найдена');

    const seller = await this.userService.findById(car.sellerId);
    if (!seller) throw new NotFoundException('Владелец не найден');

    const testDriveUnavailabilityModels =
      await this.testDrivesService.findAllUnavailable(car._id.toString());

    const testDriveUnavailability = testDriveUnavailabilityModels.map(
      (model) => model.testDriveDatetime,
    );

    const testDriveAvailability = car.testDriveAvailability.filter(
      (date) => !testDriveUnavailability.includes(date),
    );

    return {
      ...car,
      seller: {
        profilePicture: seller.profilePicture,
        nickname: seller.nickname,
        email: seller.email,
        id: seller._id,
      },
      testDriveAvailability,
    };
  }

  @Get('brands')
  @Roles(AuthRole.Guest)
  async getBrandsAndModels(@Query('brand') brand?: string) {
    if (brand) {
      const models = await this.carsService.getModelsByBrand(brand);
      return models;
    }

    const brands = await this.carsService.getAllBrands();
    return brands;
  }

  @Post()
  @Roles(AuthRole.Seller)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'images', maxCount: 10 }, // Укажите имя поля и максимальное количество файлов
    ]),
  )
  async create(
    @UploadedFiles()
    files: { images?: Express.Multer.File[] },
    @Body() createCarDto: any,
    @Req() req: any,
  ) {
    const user = req.user;

    const processedImages = files.images?.map((file) => {
      const relativePath = file.path.replace('/usr/src/app/assets/images/', ''); // Удаляем префикс
      return relativePath; // Сохраняем относительный путь
    });

    // Передача файлов в сервис
    return this.carsService.create({
      ...createCarDto,
      sellerId: user.id,
      // testDriveAvailability: createCarDto?.testDriveAvailability?.sort(),
      images: processedImages, // Сохраняем пути к файлам
    });
  }

  @Put(':carId')
  @Roles(AuthRole.Seller)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'images', maxCount: 10 }, // Укажите имя поля и максимальное количество файлов
    ]),
  )
  async updateCar(
    @Param('carId') carId: string,
    @Body() updateData: any,
    @UploadedFiles()
    files: { images?: Express.Multer.File[] },
  ): Promise<any> {
    const dataToUpdate = files?.images
      ? { ...updateData, images: files?.images?.map((file) => file.path.replace('/usr/src/app/assets/images/', '')) }
      : updateData;

    // updateData = {
    //   ...updateData,
    //   testDriveAvailability: updateData?.testDriveAvailability?.sort(),
    // };

    // const car = await this.carsService.findOne(carId);
    // if (!car) throw new NotFoundException('Машина не найдена');

    // const carTestDrives = car.testDriveAvailability || [];
    // const newTestDrives = dataToUpdate.testDriveAvailability || [];

    // const deletedTestDrives = carTestDrives.filter(
    //   (existingTD) => !newTestDrives.includes(existingTD),
    // );

    // if (
    //   deletedTestDrives?.length > 0 &&
    //   carTestDrives.length > newTestDrives.length
    // ) {
    //   await Promise.all(
    //     deletedTestDrives.map((td) => {
    //       this.testDrivesService.updateTestDriveByDateTime(td, {
    //         status: TestDriveStatus.Canceled,
    //       });
    //     }),
    //   );
    // }

    return this.carsService.updateCar(carId, dataToUpdate);
  }

  @Delete(':id')
  @Roles(AuthRole.Seller)
  async deleteCar(@Param('id') id: string) {
    try {
      await this.carsService.deleteCar(id);
      return { message: 'Car successfully deleted' };
    } catch (error) {
      throw new HttpException(
        'Car not found or cannot be deleted',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
