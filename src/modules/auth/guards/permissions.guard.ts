import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from 'src/common/decorators/auth.decorator';
import {
  PermissionEnum,
  PermissionStatusEnum,
} from 'src/modules/role/enums/permission.enum';
import { UserService } from 'src/modules/user/services/user.service';
import { AuthGuard } from '@nestjs/passport';
import { RoleStatusEnum } from 'src/modules/role/enums/role.enum';
import { AuthState } from 'src/modules/auth/interfaces/auth.interface';

@Injectable()
export class PermissionsGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly userService: UserService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const requiredPermissions = this.reflector.getAllAndOverride<
      PermissionEnum[]
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const AuthUser = request.user as AuthState;

    const user = await this.userService.findOneWithRolePermission(AuthUser.id);

    // check user permission is had all of required permission
    return requiredPermissions.every(
      (requiredPermission) =>
        user.role.status == RoleStatusEnum.ACTIVE &&
        user.role.permissions.some(
          (userPermission) =>
            userPermission.name === requiredPermission &&
            userPermission.status === PermissionStatusEnum.ACTIVE,
        ),
    );
  }
}
