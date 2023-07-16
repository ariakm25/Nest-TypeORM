import { Role } from '../enums/role.enum';
import { User } from 'src/modules/user/entities/user.entity';

export class QueryUserDto {
  name?: User['name'];
  email?: User['email'];
  role?: Role;
}
