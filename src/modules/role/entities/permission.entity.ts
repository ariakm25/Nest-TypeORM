import {
  Column,
  Entity,
  Index,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PermissionStatusEnum } from 'src/modules/role/enums/permission.enum';
import { Role } from 'src/modules/role/entities/role.entity';
import { RoleInterface } from 'src/modules/role/interfaces/role.interface';
import { PermissionInterface } from 'src/modules/role/interfaces/permission.interface';

@Entity()
export class Permission implements PermissionInterface {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Index({ unique: true })
  @Column({ length: 255, unique: true })
  name: string;

  @Column({
    type: 'enum',
    enum: [PermissionStatusEnum.ACTIVE, PermissionStatusEnum.INACTIVE],
    default: PermissionStatusEnum.ACTIVE,
  })
  status: PermissionStatusEnum;

  @ManyToMany(() => Role, (role) => role.permissions, {
    onDelete: 'CASCADE',
  })
  roles: RoleInterface[];
}
