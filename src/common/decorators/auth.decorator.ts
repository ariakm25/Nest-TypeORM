import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { Role } from 'src/modules/user/enums/role.enum';

export const ROLE_KEY = 'role';
export const RequiredRole = (role: Role) => SetMetadata(ROLE_KEY, role);

export const Auth = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
