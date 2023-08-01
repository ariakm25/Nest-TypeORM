import {
  IsDefined,
  IsEmail,
  IsOptional,
  MinLength,
  Validate,
} from 'class-validator';
import { User } from 'src/modules/user/entities/user.entity';
import { UniqueValidator } from 'src/common/decorators/validator/unique-validator.decorator';
import { ExistValidator } from 'src/common/decorators/validator/exist-validator.decorator';
import { Role } from 'src/modules/role/entities/role.entity';
import { UserInterface } from 'src/modules/user/interfaces/user.interface';

export class UpdateUserDto implements Partial<UserInterface> {
  @IsDefined()
  @Validate(ExistValidator, [User, 'id'])
  id: number;

  @IsOptional()
  name?: User['name'];

  @IsEmail()
  @Validate(UniqueValidator, [User, 'email', ['id', 'id']])
  email?: User['email'];

  @IsOptional()
  @MinLength(8)
  password?: User['password'];

  @IsOptional()
  avatar?: User['avatar'];

  @IsOptional()
  @Validate(ExistValidator, [Role, 'id'])
  roleId?: User['roleId'];
}
