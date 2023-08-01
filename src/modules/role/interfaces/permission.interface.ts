import { RoleInterface } from 'src/modules/role/interfaces/role.interface';
import { PermissionStatusEnum } from 'src/modules/role/enums/permission.enum';

export interface PermissionInterface {
  name: string;
  status: PermissionStatusEnum;
  roles: RoleInterface[];
}
