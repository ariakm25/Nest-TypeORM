import { RoleStatusEnum } from 'src/modules/role/enums/role.enum';
import { UserInterface } from 'src/modules/user/interfaces/user.interface';
import { PermissionInterface } from 'src/modules/role/interfaces/permission.interface';

export interface RoleInterface {
  name: string;
  status: RoleStatusEnum;
  permissions: PermissionInterface[];
  users: UserInterface[];
}
