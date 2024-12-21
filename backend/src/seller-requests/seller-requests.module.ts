import { Module } from '@nestjs/common';
import { SellerRequestsController } from './seller-requests.controller';
import { SellerRequestsService } from './seller-requests.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SellerRequest, SellerRequestSchema } from './seller-requests.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SellerRequest.name, schema: SellerRequestSchema },
    ]),
    SellerRequestsModule,
  ],
  controllers: [SellerRequestsController],
  providers: [SellerRequestsService],
  exports: [SellerRequestsService],
})
export class SellerRequestsModule {}
