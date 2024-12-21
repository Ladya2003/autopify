import { Reflector } from '@nestjs/core';
import { AuthRole } from 'src/common/const/auth.const';

export const Roles = Reflector.createDecorator<AuthRole>();
