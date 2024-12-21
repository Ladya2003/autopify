import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    return this.userService.validateUser(email, password);
  }

  async login(user: any) {
    const payload = {
      email: user?._doc?.email,
      sub: user?._doc?._id,
      role: user?._doc?.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '55m', // Access Token живёт 15 минут
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d', // Refresh Token живёт 7 дней
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async register(email: string, password: string) {
    const existingUser = await this.userService.findUserByEmail(email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    return this.userService.createUser(email, password);
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET,
      });

      const newAccessToken = this.jwtService.sign(
        { email: payload.email, sub: payload.sub, role: payload.role },
        { expiresIn: '55m' },
      );

      return { access_token: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
