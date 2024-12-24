import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/users/users.service';
import { Roles } from 'src/decorators/role.decorator';
import { AuthRole } from 'src/common/const/auth.const';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  // Регистрация
  @Roles(AuthRole.Guest)
  @Post('register')
  async register(@Body() body: { email: string; password: string }) {
    const user = await this.userService.createUser(body.email, body.password);
    return { message: 'User registered successfully', user };
  }

  // Вход
  @Roles(AuthRole.Guest)
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = (await this.userService.validateUser(
      body.email,
      body.password,
    )) as any;
    if (!user) {
      return { message: 'Invalid credentials' };
    }
    if (user._doc.role === AuthRole.Disabled) {
      return { message: 'Banned by admin' };
    }
    return this.authService.login(user); // Возвращаем JWT токен
  }

  // @Roles(AuthRole.Guest)
  @Roles(AuthRole.Guest)
  @Post('refresh')
  async refresh(@Body('refresh_token') refreshToken: string) {
    const access_token = await this.authService.refreshToken(refreshToken);
    return access_token;
  }

  @Roles(AuthRole.User)
  @Get('me')
  async getMe(@Req() req) {
    const user = req.user; // Данные пользователя из токена
    const userProfile = await this.userService.findById(user.id);
    if (!userProfile) throw new NotFoundException('User not found');

    return {
      id: userProfile._id,
      email: userProfile.email,
      role: userProfile.role,
      nickname: userProfile.nickname,
      profilePicture: userProfile.profilePicture,
      description: userProfile.description,
    };
  }
}
