import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seeder } from 'nestjs-seeder';
import { Repository } from 'typeorm';
import { Permission } from 'src/modules/role/entities/permission.entity';
import { Role } from 'src/modules/role/entities/role.entity';
import { PermissionEnum } from 'src/modules/role/enums/permission.enum';

@Injectable()
export class PermissionSeeder implements Seeder {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async seed(): Promise<any> {
    const getRoleAdmin = await this.roleRepository.findOne({
      where: { name: 'Admin' },
    });

    if (getRoleAdmin) {
      const permissions = [
        PermissionEnum.USER_CREATE,
        PermissionEnum.USER_READ,
        PermissionEnum.USER_UPDATE,
        PermissionEnum.USER_DELETE,
        //
        PermissionEnum.ROLE_CREATE,
        PermissionEnum.ROLE_READ,
        PermissionEnum.ROLE_UPDATE,
        PermissionEnum.ROLE_DELETE,
        //
        PermissionEnum.PERMISSION_CREATE,
        PermissionEnum.PERMISSION_READ,
        PermissionEnum.PERMISSION_UPDATE,
        PermissionEnum.PERMISSION_DELETE,
      ];

      for (const permission of permissions) {
        const getPermission = await this.permissionRepository.findOne({
          where: { name: permission },
        });

        if (!getPermission) {
          const newPermission = new Permission();
          newPermission.name = permission;
          newPermission.roles = [getRoleAdmin];
          await this.permissionRepository.save(newPermission);
        } else {
          getPermission.roles = [getRoleAdmin];
          await this.permissionRepository.save(getPermission);
        }
      }
    }

    return true;
  }

  async drop(): Promise<any> {
    return this.permissionRepository.delete({});
  }
}
