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

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UserService) {}

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

  @Put()
  @Roles(AuthRole.User)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'profilePicture', maxCount: 1 }, // Укажите имя поля и максимальное количество файлов
    ]),
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
      profilePicture: file?.profilePicture?.path,
    });
  }
}
