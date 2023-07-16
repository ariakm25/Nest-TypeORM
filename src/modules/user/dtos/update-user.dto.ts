import {
  IsDefined,
  IsEmail,
  IsOptional,
  MinLength,
  Validate,
} from 'class-validator';
import { Role } from '../enums/role.enum';
import { User } from 'src/modules/user/entities/user.entity';
import { UniqueValidator } from 'src/common/decorators/validator/unique-validator.decorator';
import { ExistValidator } from 'src/common/decorators/validator/exist-validator.decorator';

export class UpdateUserDto {
  @IsDefined()
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
  @Validate(ExistValidator, [User, 'role'])
  role?: Role;
}
