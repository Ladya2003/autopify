import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Car, CarDocument } from './cars.schema';
import { CarRequestStatus } from 'src/common/const/car.const';

@Injectable()
export class CarsService {
  constructor(
    @InjectModel(Car.name) private readonly carModel: Model<CarDocument>,
  ) {}

  // Получить все автомобили
  async findAll(): Promise<Car[]> {
    return this.carModel.find().exec(); // Вернуть все документы из коллекции
  }

  async findOne(id: string): Promise<Car | null> {
    return this.carModel.findById(id).lean().exec(); // Найти документ по ID
  }

  // Получить все бренды
  async getAllBrands(): Promise<string[]> {
    const brands = await this.carModel.distinct('brand').exec();
    return brands;
  }

  // Получить модели по бренду
  async getModelsByBrand(brand: string): Promise<string[]> {
    const models = await this.carModel.find({ brand }).distinct('model').exec();
    return models;
  }

  // Создать новый автомобиль
  async create(createCarDto: any): Promise<Car> {
    const newCar = new this.carModel(createCarDto); // Создать экземпляр модели с данными
    return newCar.save(); // Сохранить новый автомобиль в базе данных
  }

  async updateCar(carId: string, updateCarDto: any): Promise<Car> {
    const updatedCar = await this.carModel.findByIdAndUpdate(
      carId, // ID автомобиля, который нужно обновить
      updateCarDto, // Данные для обновления
      { new: true }, // Опция: вернуть обновленный документ
    );

    if (!updatedCar) {
      throw new Error(`Car with ID ${carId} not found`);
    }

    return updatedCar;
  }

  async findFiltered(filters: {
    brand?: string;
    model?: string;
    priceFrom?: number;
    priceTo?: number;
    status?: string;
  }): Promise<Car[]> {
    const query: any = {};

    // Фильтрация по бренду
    if (filters.status) {
      query.status = filters.status;
    }

    // Фильтрация по бренду
    if (filters.brand) {
      query.brand = filters.brand;
    }

    // Фильтрация по модели
    if (filters.model) {
      query.model = filters.model;
    }

    // Фильтрация по диапазону цен
    if (filters.priceFrom !== undefined || filters.priceTo !== undefined) {
      query.price = {};
      if (filters.priceFrom !== undefined) {
        query.price.$gte = filters.priceFrom; // Больше или равно
      }
      if (filters.priceTo !== undefined) {
        query.price.$lte = filters.priceTo; // Меньше или равно
      }
    }

    // Выполнение запроса с фильтром
    return this.carModel.find(query).exec();
  }

  async deleteCar(id: string): Promise<void> {
    await this.carModel.deleteOne({ _id: id }).exec();
  }
}
