import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Put,
  Query,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './users.service';
import { Roles } from 'src/decorators/role.decorator';
import { AuthRole } from 'src/common/const/auth.const';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './users.schema';
import { Model } from 'mongoose';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { SellerRequestStatus } from 'src/common/const/seller-request.const';
import { SellerRequestsService } from 'src/seller-requests/seller-requests.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UserService,
    private readonly sellerRequestsService: SellerRequestsService,
  ) {}

  @Get()
  @Roles(AuthRole.Admin)
  async getAll() {
    const users = await this.usersService.getAllUsers();

    return Promise.all(
      users.map(async (user) => {
        const sellerRequest =
          await this.sellerRequestsService.findPendingRequestByUserId(
            user._id.toString(),
          );

        return {
          ...user,
          hasRequest: !!sellerRequest,
        };
      }),
    );
  }

  @Get('sellers')
  @Roles(AuthRole.Guest)
  async findAll() {
    const sellers = await this.usersService.findAllSellers();
    return sellers;
  }

  @Get('user')
  @Roles(AuthRole.Guest)
  async findOne(@Query('userId') id: string) {
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException('Пользователь не найден');

    return user;
  }

  @Put(':id')
  @Roles(AuthRole.Admin)
  async updateUser(@Param('id') id: string, @Body() data: any) {
    const user = await this.usersService.findById(id);

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const role = data?.role;
    const sellerRequestStatus = data?.sellerRequestStatus;
    if (
      [SellerRequestStatus.Accepted, SellerRequestStatus.Rejected].includes(
        sellerRequestStatus,
      )
    ) {
      await this.sellerRequestsService.updateSellerRequest(user, {
        status: sellerRequestStatus,
      });
    }

    return this.usersService.update(user, {
      ...(sellerRequestStatus === SellerRequestStatus.Accepted && {
        role: AuthRole.Seller,
      }),
      ...(role && { role }),
    });
  }

  @Put()
  @Roles(AuthRole.User)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'profilePicture', maxCount: 1 }]),
  )
  async updateRequest(
    @UploadedFiles()
    file: { profilePicture?: Express.Multer.File },
    @Req() req: any,
    @Body() updateData: any,
  ): Promise<any> {
    const user = req.user;

    return this.usersService.update(user, {
      ...updateData,
      profilePicture: file?.profilePicture?.[0]?.path,
    });
  }
}
