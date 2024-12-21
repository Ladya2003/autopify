import { Prop, Schema } from '@nestjs/mongoose';

export type RatingDocument = Rating & Document;

@Schema({ timestamps: true })
export class Rating {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  carId: string;

  @Prop({ required: true })
  rating: number;
}
