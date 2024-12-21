import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TestDriveStatus } from 'src/common/const/test-drives';
import { Document } from 'mongoose';

export type TestDriveDocument = TestDrive & Document;

@Schema({ timestamps: true })
export class TestDrive {
  @Prop({ required: true })
  carId: string;

  @Prop()
  userId?: string;

  @Prop()
  authorId: string;

  @Prop({ required: true })
  testDriveDatetime: string;

  @Prop({ required: true })
  status: TestDriveStatus;

  @Prop()
  description?: string;
}

export const TestDriveSchema = SchemaFactory.createForClass(TestDrive);
