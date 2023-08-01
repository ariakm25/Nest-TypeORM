import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageDto, PageMetaDto, PageOptionsDto } from 'src/common/dtos/pages';
import { Equal, FindOperator, ILike, Repository } from 'typeorm';

import { User } from 'src/modules/user/entities/user.entity';
import { TokenService } from 'src/modules/token/services/token.service';
import { CreateUserDto } from 'src/modules/user/dtos/create-user.dto';
import { QueryUserDto } from 'src/modules/user/dtos/query-user.dto';
import { UpdateUserDto } from 'src/modules/user/dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly tokenService: TokenService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return await this.userRepository.save(createUserDto);
  }

  async findAll(
    queryUserDto: QueryUserDto,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<User>> {
    const query: {
      [key: string]: FindOperator<any>;
    } = {};

    if (queryUserDto.name) {
      query.name = ILike(`%${queryUserDto.name}%`);
    }

    if (queryUserDto.email) {
      query.email = ILike(`%${queryUserDto.email}%`);
    }

    if (queryUserDto.roleId) {
      query.roleId = Equal(queryUserDto.roleId);
    }

    const queryBuilder = this.userRepository.createQueryBuilder('user');

    queryBuilder
      .select([
        'user.id',
        'user.name',
        'user.email',
        'user.role',
        'user.avatar',
        'user.createdAt',
      ])
      .where(query)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const totalItems = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ totalItems, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: number): Promise<User> {
    const data = await this.userRepository.findOneBy({ id });

    if (!data) {
      throw new NotFoundException(['user not found']);
    }
    return data;
  }

  async findOneWithRolePermission(id: number): Promise<User> {
    const qb = this.userRepository.createQueryBuilder('user');
    const data = await qb
      .where('user.id = :id', { id })
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('role.permissions', 'permissions')
      .getOne();

    if (!data) {
      throw new NotFoundException(['user not found']);
    }

    return data;
  }

  async findOneBy(key: string, value: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ [key]: value });
  }

  async updateById(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    return await this.userRepository.save(updateUserDto);
  }

  async updatePassword(userId: number, password: string): Promise<User> {
    const user = await this.findOne(userId);

    if (!user) {
      throw new NotFoundException(['user not found']);
    }

    await this.tokenService.deleteAllUserTokens(userId);

    user.password = password;
    return await this.userRepository.save(user);
  }

  async remove(id: number): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(['user not found']);
    }

    return await this.userRepository.remove(user);
  }
}
