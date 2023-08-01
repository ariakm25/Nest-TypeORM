import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageDto, PageMetaDto, PageOptionsDto } from 'src/common/dtos/pages';
import { Equal, FindOperator, ILike, In, Repository } from 'typeorm';
import { CreateRoleDto } from '../dtos/role/create-role.dto';
import { QueryRoleDto } from '../dtos/role/query-role.dto';
import { UpdateRoleDto } from '../dtos/role/update-role.dto';
import { Role } from 'src/modules/role/entities/role.entity';
import { Permission } from 'src/modules/role/entities/permission.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    return await this.roleRepository.save(createRoleDto);
  }

  async findAll(
    queryRoleDto: QueryRoleDto,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Role>> {
    const query: {
      [key: string]: FindOperator<any>;
    } = {};

    if (queryRoleDto.name) {
      query.name = ILike(`%${queryRoleDto.name}%`);
    }

    if (queryRoleDto.status) {
      query.status = Equal(queryRoleDto.status);
    }

    if (queryRoleDto.permissions) {
      query.permissions = In(queryRoleDto.permissions);
    }

    const queryBuilder = this.roleRepository.createQueryBuilder('role');

    queryBuilder
      .select()
      .where(query)
      .leftJoinAndSelect('role.permissions', 'permission')
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const totalItems = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ totalItems, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: number): Promise<Role> {
    const data = await this.roleRepository.findOneBy({ id });

    if (!data) {
      throw new NotFoundException(['role not found']);
    }
    return data;
  }

  async findOneBy(key: string, value: string): Promise<Role | null> {
    return await this.roleRepository.findOneBy({ [key]: value });
  }

  async updateById(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const getRole = await this.findOne(id);
    if (!getRole) {
      throw new NotFoundException(['role not found']);
    }

    if (updateRoleDto.permissions) {
      getRole.permissions = await this.permissionRepository.findBy({
        id: In(updateRoleDto.permissions),
      });
    }

    return await this.roleRepository.save({
      ...getRole,
      permissions: getRole.permissions,
      name: updateRoleDto.name,
      status: updateRoleDto.status,
      id: Number(id),
    });
  }

  async remove(id: number): Promise<Role> {
    const role = await this.findOne(id);
    if (!role) {
      throw new NotFoundException(['role not found']);
    }

    return await this.roleRepository.remove(role);
  }
}
