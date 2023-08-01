import { User } from 'src/modules/user/entities/user.entity';
import { IsOptional } from 'class-validator';
import { UserInterface } from 'src/modules/user/interfaces/user.interface';

export class QueryUserDto implements Partial<UserInterface> {
  @IsOptional()
  name?: User['name'];
  @IsOptional()
  email?: User['email'];
  @IsOptional()
  roleId?: User['roleId'];
}
