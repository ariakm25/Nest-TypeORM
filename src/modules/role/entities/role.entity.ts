import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoleStatusEnum } from 'src/modules/role/enums/role.enum';
import { Permission } from 'src/modules/role/entities/permission.entity';
import { ApiHideProperty } from '@nestjs/swagger';
import { User } from 'src/modules/user/entities/user.entity';
import { UserInterface } from 'src/modules/user/interfaces/user.interface';
import { PermissionInterface } from 'src/modules/role/interfaces/permission.interface';
import { RoleInterface } from 'src/modules/role/interfaces/role.interface';

@Entity()
export class Role implements RoleInterface {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 255, unique: true })
  name: string;

  @Column({
    type: 'enum',
    enum: [RoleStatusEnum.ACTIVE, RoleStatusEnum.INACTIVE],
    default: RoleStatusEnum.ACTIVE,
  })
  status: RoleStatusEnum;

  @OneToMany(() => User, (user) => user.role, {
    onDelete: 'CASCADE',
  })
  users: UserInterface[];

  @ManyToMany(() => Permission, (permission) => permission.roles, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  @ApiHideProperty()
  permissions: PermissionInterface[];
}
