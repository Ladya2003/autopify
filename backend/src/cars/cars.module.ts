import { Module, forwardRef } from '@nestjs/common';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Car, CarSchema } from './cars.schema';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { UsersModule } from 'src/users/users.module';
import { TestDrivesModule } from 'src/test-drives/test-drives.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => TestDrivesModule),
    MongooseModule.forFeature([{ name: Car.name, schema: CarSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
      }),
    }),
    MulterModule.register({
      storage: diskStorage({
        destination: join(__dirname, '../../assets/images'), // Укажите папку для сохранения файлов
        filename: (req, file, callback) => {
          const uniqueName = `${Date.now()}-${file.originalname}`;
          callback(null, uniqueName);
        },
      }),
    }),
  ],
  controllers: [CarsController],
  providers: [CarsService, JwtService],
  exports: [CarsService],
})
export class CarsModule {}
