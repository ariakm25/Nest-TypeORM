import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleService } from '../services/role.service';
import { UpdateRoleDto } from '../dtos/role/update-role.dto';
import { QueryRoleDto } from '../dtos/role/query-role.dto';
import { CreateRoleDto } from '../dtos/role/create-role.dto';
import { PageDto, PageOptionsDto } from 'src/common/dtos/pages';
import { ApiPaginatedResponse } from 'src/common/decorators/response.decorator';
import { Role } from 'src/modules/role/entities/role.entity';
import { PermissionsGuard } from 'src/modules/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/common/decorators/auth.decorator';
import { PermissionEnum } from 'src/modules/role/enums/permission.enum';

@Controller('roles')
@ApiBearerAuth()
@ApiTags('Roles')
@UseInterceptors(ClassSerializerInterceptor)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @UseGuards(PermissionsGuard)
  @RequirePermissions(PermissionEnum.ROLE_CREATE)
  create(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  @UseGuards(PermissionsGuard)
  @RequirePermissions(PermissionEnum.ROLE_READ)
  @ApiPaginatedResponse(Role)
  findAll(
    @Query() queryRoleDto: QueryRoleDto,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Role>> {
    return this.roleService.findAll(queryRoleDto, pageOptionsDto);
  }

  @Get(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(PermissionEnum.ROLE_READ)
  findOne(@Param('id') id: number): Promise<Role> {
    return this.roleService.findOne(id);
  }

  @Patch()
  @UseGuards(PermissionsGuard)
  @RequirePermissions(PermissionEnum.ROLE_UPDATE)
  update(@Body() updateRoleDto: UpdateRoleDto): Promise<Role> {
    return this.roleService.updateById(updateRoleDto.id, updateRoleDto);
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(PermissionEnum.ROLE_DELETE)
  remove(@Param('id') id: number): Promise<Role> {
    return this.roleService.remove(id);
  }
}
