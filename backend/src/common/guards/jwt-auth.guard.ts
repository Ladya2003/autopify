import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Roles } from 'src/decorators/role.decorator';
import { AuthRole } from '../const/auth.const';
import { UserService } from 'src/users/users.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(UserService) private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const role = this.reflector.get(Roles, context.getHandler());
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    // TODO: если role disabled сразу false кидать

    if (role === AuthRole.Guest || !role) return true;

    if (!token) return false;

    try {
      const tokenUser = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      const user = await this.userService.findById(tokenUser.sub);

      request.user = user;

      if (role === AuthRole.User && user.role === AuthRole.Guest) return false;
      if (
        role === AuthRole.Seller &&
        (user.role === AuthRole.Guest || user.role === AuthRole.User)
      )
        return false;
      if (role === AuthRole.Admin && user.role !== AuthRole.Admin) return false;
      return true;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expired');
      } else {
        console.error(error);
        throw new UnauthorizedException('Invalid token');
      }
    }
  }
}
