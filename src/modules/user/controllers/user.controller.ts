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
import { PageDto, PageOptionsDto } from 'src/common/dtos/pages';
import { ApiPaginatedResponse } from 'src/common/decorators/response.decorator';
import { User } from 'src/modules/user/entities/user.entity';
import { RequirePermissions } from 'src/common/decorators/auth.decorator';
import { PermissionEnum } from 'src/modules/role/enums/permission.enum';
import { PermissionsGuard } from 'src/modules/auth/guards/permissions.guard';
import { UserService } from 'src/modules/user/services/user.service';
import { CreateUserDto } from 'src/modules/user/dtos/create-user.dto';
import { QueryUserDto } from 'src/modules/user/dtos/query-user.dto';
import { UpdateUserDto } from 'src/modules/user/dtos/update-user.dto';

@Controller('users')
@ApiBearerAuth()
@ApiTags('Users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(PermissionsGuard)
  @RequirePermissions(PermissionEnum.USER_CREATE)
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(PermissionsGuard)
  @RequirePermissions(PermissionEnum.USER_READ)
  @ApiPaginatedResponse(User)
  findAll(
    @Query() queryUserDto: QueryUserDto,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<User>> {
    return this.userService.findAll(queryUserDto, pageOptionsDto);
  }

  @Get(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(PermissionEnum.USER_READ)
  findOne(@Param('id') id: number): Promise<User> {
    return this.userService.findOne(id);
  }

  @Patch()
  @UseGuards(PermissionsGuard)
  @RequirePermissions(PermissionEnum.USER_UPDATE)
  update(@Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.userService.updateById(updateUserDto.id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(PermissionEnum.USER_DELETE)
  remove(@Param('id') id: number): Promise<User> {
    return this.userService.remove(id);
  }
}
