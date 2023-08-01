import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seeder } from 'nestjs-seeder';
import { Repository } from 'typeorm';
import { Role } from 'src/modules/role/entities/role.entity';

@Injectable()
export class RoleSeeder implements Seeder {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async seed(): Promise<any> {
    await this.roleRepository.upsert(
      {
        name: 'Admin',
      },
      {
        conflictPaths: ['name'],
      },
    );

    await this.roleRepository.upsert(
      {
        name: 'User',
      },
      {
        conflictPaths: ['name'],
      },
    );

    return true;
  }

  async drop(): Promise<any> {
    return this.roleRepository.delete({});
  }
}
