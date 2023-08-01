import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataFactory, Seeder } from 'nestjs-seeder';
import { Repository } from 'typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Role } from 'src/modules/role/entities/role.entity';

@Injectable()
export class UsersSeeder implements Seeder {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async seed(): Promise<any> {
    const users = DataFactory.createForClass(User).generate(50);

    const getRoleAdmin = await this.roleRepository.findOne({
      where: { name: 'Admin' },
    });

    await this.userRepository.upsert(
      {
        name: 'Admin',
        email: 'admin@admin.com',
        password:
          '$2a$10$gKLiOrts6gyxa92zITbkBObiGQ8.xYrlD/EZwE6wzdHNgN61BOK8u', // password
        avatar: 'https://avatars.githubusercontent.com/u/45255650?v=4',
        roleId: getRoleAdmin.id || 1,
      },
      {
        conflictPaths: ['email'],
      },
    );

    const getUserRole = await this.roleRepository.findOne({
      where: { name: 'User' },
    });

    users.forEach((user) => {
      user.roleId = getUserRole.id || 2;
    });

    return this.userRepository.insert(users);
  }

  async drop(): Promise<any> {
    return this.userRepository.delete({});
  }
}
