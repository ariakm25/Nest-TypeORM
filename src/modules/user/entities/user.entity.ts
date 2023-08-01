import {
  AfterLoad,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Factory } from 'nestjs-seeder';
import { Token } from 'src/modules/token/entities/token.entity';
import { Exclude } from 'class-transformer';
import { hashSync } from 'bcryptjs';
import { ApiHideProperty } from '@nestjs/swagger';
import { Role } from 'src/modules/role/entities/role.entity';
import { UserInterface } from 'src/modules/user/interfaces/user.interface';
import { RoleInterface } from 'src/modules/role/interfaces/role.interface';

@Entity()
export class User implements UserInterface {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Factory((faker) => faker.person.firstName())
  @Column({ length: 255 })
  name: string;

  @Factory((faker) => faker.internet.email())
  @Column({ length: 255, unique: true })
  email: string;

  @Factory('$2a$10$gKLiOrts6gyxa92zITbkBObiGQ8.xYrlD/EZwE6wzdHNgN61BOK8u') // password
  @Column({ length: 255 })
  @Exclude()
  @ApiHideProperty()
  password: string;

  @Factory((faker) => faker.image.avatar())
  @Column({ length: 255, nullable: true, default: null })
  avatar?: string;

  @Column({ nullable: true, default: null })
  roleId?: number;

  @ManyToOne(() => Role, {
    onDelete: 'SET NULL',
  })
  role: RoleInterface;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Token, (token) => token.user, {
    onDelete: 'CASCADE',
  })
  @ApiHideProperty()
  tokens?: Token[];

  @Exclude()
  @ApiHideProperty()
  private tempPassword?: string;

  @AfterLoad()
  private loadTempPassword(): void {
    this.tempPassword = this.password;
  }

  @BeforeUpdate()
  private hashPassword(): void {
    if (this.tempPassword !== this.password) {
      this.password = hashSync(this.password, 10);
    }
  }
}
