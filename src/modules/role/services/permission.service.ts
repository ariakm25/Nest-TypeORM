import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageDto, PageMetaDto, PageOptionsDto } from 'src/common/dtos/pages';
import { Equal, FindOperator, ILike, Repository } from 'typeorm';
import { Permission } from 'src/modules/role/entities/permission.entity';
import { QueryPermissionDto } from 'src/modules/role/dtos/permission/query-permission.dto';
import { CreatePermissionDto } from 'src/modules/role/dtos/permission/create-permission.dto';
import { UpdatePermissionDto } from 'src/modules/role/dtos/permission/update-permission.dto';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    return await this.permissionRepository.save(createPermissionDto);
  }

  async findAll(
    queryPermissionDto: QueryPermissionDto,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Permission>> {
    const query: {
      [key: string]: FindOperator<any>;
    } = {};

    if (queryPermissionDto.name) {
      query.name = ILike(`%${queryPermissionDto.name}%`);
    }

    if (queryPermissionDto.status) {
      query.status = Equal(queryPermissionDto.status);
    }

    const queryBuilder =
      this.permissionRepository.createQueryBuilder('permission');

    queryBuilder
      .select()
      .where(query)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const totalItems = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ totalItems, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: number): Promise<Permission> {
    const data = await this.permissionRepository.findOneBy({ id });

    if (!data) {
      throw new NotFoundException(['permission not found']);
    }
    return data;
  }

  async findOneBy(key: string, value: string): Promise<Permission | null> {
    return await this.permissionRepository.findOneBy({ [key]: value });
  }

  async updateById(
    id: number,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission> {
    const getPermission = await this.findOne(id);
    if (!getPermission) {
      throw new NotFoundException(['permission not found']);
    }

    return await this.permissionRepository.save({
      ...getPermission,
      ...updatePermissionDto,
    });
  }

  async remove(id: number): Promise<Permission> {
    const permission = await this.findOne(id);
    if (!permission) {
      throw new NotFoundException(['permission not found']);
    }

    return await this.permissionRepository.remove(permission);
  }
}
