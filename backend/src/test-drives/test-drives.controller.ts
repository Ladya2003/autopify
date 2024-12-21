import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { TestDrivesService } from './test-drives.service';
import { Roles } from 'src/decorators/role.decorator';
import { AuthRole } from 'src/common/const/auth.const';

@Controller('test-drives')
export class TestDrivesController {
  constructor(private readonly testDrivesService: TestDrivesService) {}

  @Post()
  @Roles(AuthRole.User)
  async create(@Body() requestDto: any, @Req() req: any) {
    if (
      !requestDto.carId ||
      !requestDto.status ||
      !requestDto.testDriveDatetime
    ) {
      throw new BadRequestException(
        'Missing required fields: carId, status, or testDriveDatetime',
      );
    }

    const user = req.user;
    requestDto.authorId = user.id;

    return this.testDrivesService.create(requestDto);
  }
}
