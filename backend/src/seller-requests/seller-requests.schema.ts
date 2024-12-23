import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SellerRequestStatus } from 'src/common/const/seller-request.const';

export type SellerRequestDocument = SellerRequest & Document;

@Schema({ timestamps: true })
export class SellerRequest {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  status: SellerRequestStatus;
}

export const SellerRequestSchema = SchemaFactory.createForClass(SellerRequest);

SellerRequestSchema.index({ userId: 1, status: 1 }, { unique: true });
