import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { Permission } from 'src/modules/role/entities/permission.entity';
import { RoleStatusEnum } from 'src/modules/role/enums/role.enum';
import { Transform } from 'class-transformer';

export class UpdatePermissionDto {
  @IsNotEmpty()
  id: Permission['id'];

  @IsOptional()
  name?: Permission['name'];

  @IsOptional()
  @IsIn([RoleStatusEnum.ACTIVE, RoleStatusEnum.INACTIVE])
  @Transform(({ value }) => value.toUpperCase())
  status?: Permission['status'];
}
