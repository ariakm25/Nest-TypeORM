import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MinLength,
  Validate,
} from 'class-validator';
import { UniqueValidator } from 'src/common/decorators/validator/unique-validator.decorator';
import { ExistValidator } from 'src/common/decorators/validator/exist-validator.decorator';
import { User } from 'src/modules/user/entities/user.entity';
import { Role } from 'src/modules/role/entities/role.entity';
import { UserInterface } from 'src/modules/user/interfaces/user.interface';

export class CreateUserDto implements UserInterface {
  @IsNotEmpty()
  name: User['name'];

  @IsEmail()
  @Validate(UniqueValidator, [User, 'email'])
  email: User['email'];

  @IsNotEmpty()
  @MinLength(8)
  password: User['password'];

  @IsOptional()
  avatar?: User['avatar'];

  @IsOptional()
  @Validate(ExistValidator, [Role, 'id'])
  roleId?: User['roleId'];
}
