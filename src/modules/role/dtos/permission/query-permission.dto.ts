import { Permission } from 'src/modules/role/entities/permission.entity';
import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryPermissionDto {
  @IsOptional()
  name?: Permission['name'];
  @IsOptional()
  @Transform((value) => String(value).toUpperCase() as Permission['status'])
  status?: Permission['status'];
}
