import { Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { CarRequestStatus } from 'src/common/const/car.const';

export type CarDocument = Car & Document;

@Schema({ timestamps: true })
export class Car {
  @Field(() => ID)
  _id?: Types.ObjectId;

  @Prop({ required: true })
  brand: string;

  @Prop({ required: true })
  model: string;

  @Prop({ required: true })
  year: number;

  @Prop({ required: true })
  transmission: string;

  @Prop({ required: true })
  engineSize: number;

  @Prop({ required: true })
  fuelType: string;

  @Prop({ required: true })
  mileage: number;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  description: string;

  @Prop({ default: [] })
  images: File[];

  @Prop({ default: 0 })
  views: number;

  @Prop({ default: 0 })
  rating: number;

  @Prop({ required: true })
  sellerId: string;

  @Prop({ required: true })
  testDriveAvailability: string[]; // Доступное время для тест-драйва

  @Prop({ required: true, default: CarRequestStatus.Pending })
  status: CarRequestStatus;
}

export const CarSchema = SchemaFactory.createForClass(Car);

CarSchema.index(
  {
    brand: 1,
    model: 1,
    year: 1,
    transmission: 1,
    engineSize: 1,
    fuelType: 1,
    mileage: 1,
  },
  { unique: true },
);
