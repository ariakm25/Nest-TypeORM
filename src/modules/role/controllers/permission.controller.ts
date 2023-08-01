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
import { PermissionService } from '../services/permission.service';
import { UpdatePermissionDto } from '../dtos/permission/update-permission.dto';
import { QueryPermissionDto } from '../dtos/permission/query-permission.dto';
import { CreatePermissionDto } from '../dtos/permission/create-permission.dto';
import { PageDto, PageOptionsDto } from 'src/common/dtos/pages';
import { ApiPaginatedResponse } from 'src/common/decorators/response.decorator';
import { Permission } from 'src/modules/role/entities/permission.entity';
import { PermissionsGuard } from 'src/modules/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/common/decorators/auth.decorator';
import { PermissionEnum } from 'src/modules/role/enums/permission.enum';

@Controller('role-permissions')
@ApiBearerAuth()
@ApiTags('Role Permission')
@UseInterceptors(ClassSerializerInterceptor)
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @UseGuards(PermissionsGuard)
  @RequirePermissions(PermissionEnum.PERMISSION_CREATE)
  create(
    @Body() createPermissionDto: CreatePermissionDto,
  ): Promise<Permission> {
    return this.permissionService.create(createPermissionDto);
  }

  @Get()
  @UseGuards(PermissionsGuard)
  @RequirePermissions(PermissionEnum.PERMISSION_READ)
  @ApiPaginatedResponse(Permission)
  findAll(
    @Query() queryPermissionDto: QueryPermissionDto,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Permission>> {
    return this.permissionService.findAll(queryPermissionDto, pageOptionsDto);
  }

  @Get(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(PermissionEnum.PERMISSION_READ)
  findOne(@Param('id') id: number): Promise<Permission> {
    return this.permissionService.findOne(id);
  }

  @Patch()
  @UseGuards(PermissionsGuard)
  @RequirePermissions(PermissionEnum.PERMISSION_UPDATE)
  update(
    @Body() updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission> {
    return this.permissionService.updateById(
      updatePermissionDto.id,
      updatePermissionDto,
    );
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(PermissionEnum.PERMISSION_DELETE)
  remove(@Param('id') id: number): Promise<Permission> {
    return this.permissionService.remove(id);
  }
}
