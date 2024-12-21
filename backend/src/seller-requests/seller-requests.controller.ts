import {
  Controller,
  Post,
  Body,
  Req,
  Put,
  Param,
  Get,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { SellerRequestsService } from './seller-requests.service';
import { Roles } from 'src/decorators/role.decorator';
import { AuthRole } from 'src/common/const/auth.const';

@Controller('seller-requests')
export class SellerRequestsController {
  constructor(private readonly sellerRequestsService: SellerRequestsService) {}

  @Get()
  @Roles(AuthRole.Guest)
  async findOne(@Req() req: any) {
    const user = req.user;

    const sellerRequest = await this.sellerRequestsService.findRequestByUserId(
      user._id,
    );
    if (sellerRequest) {
      throw new BadRequestException('You already have a pending request.');
    }

    return null;
  }

  @Post()
  @Roles(AuthRole.User)
  async createRequest(@Req() req: any) {
    const user = req.user;

    return this.sellerRequestsService.createRequest(user);
  }

  @Put()
  @Roles(AuthRole.User)
  async updateRequest(@Req() req: any, @Body() updateData: any): Promise<any> {
    const user = req.user;

    return this.sellerRequestsService.updateSellerRequest(user, updateData);
  }
}
