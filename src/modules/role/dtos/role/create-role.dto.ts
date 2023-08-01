import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { Role } from 'src/modules/role/entities/role.entity';
import { RoleStatusEnum } from 'src/modules/role/enums/role.enum';
import { Transform } from 'class-transformer';

export class CreateRoleDto {
  @IsNotEmpty()
  name: Role['name'];

  @IsOptional()
  @IsIn([RoleStatusEnum.ACTIVE, RoleStatusEnum.INACTIVE])
  @Transform(({ value }) => value.toUpperCase())
  status?: Role['status'];

  @IsOptional()
  permissions?: Role['permissions'];
}
