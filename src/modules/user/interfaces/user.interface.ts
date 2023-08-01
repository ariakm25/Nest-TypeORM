import { Token } from 'src/modules/token/entities/token.entity';
import { RoleInterface } from 'src/modules/role/interfaces/role.interface';

export interface UserInterface {
  id?: number;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  roleId?: number;
  role?: RoleInterface;
  createdAt?: Date;
  updatedAt?: Date;
  tokens?: Token[];
}
