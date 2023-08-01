import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleController } from './controllers/role.controller';
import { RoleService } from './services/role.service';
import { Role } from 'src/modules/role/entities/role.entity';
import { Permission } from 'src/modules/role/entities/permission.entity';
import { PermissionController } from 'src/modules/role/controllers/permission.controller';
import { PermissionService } from 'src/modules/role/services/permission.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission])],
  controllers: [RoleController, PermissionController],
  providers: [RoleService, PermissionService],
  exports: [RoleService, PermissionService],
})
export class RoleModule {}
