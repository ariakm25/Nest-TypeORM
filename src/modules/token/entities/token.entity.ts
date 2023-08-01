import { User } from '../../user/entities/user.entity';
import { TokenType } from 'src/common/enums/token-type.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TokenInterface } from 'src/modules/token/interfaces/token.interface';

@Entity()
export class Token implements TokenInterface {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  token: string;

  @Column({
    type: 'enum',
    enum: [
      TokenType.RefreshToken,
      TokenType.ConfirmEmail,
      TokenType.ResetPassword,
    ],
  })
  type: TokenType;

  @Column({ type: 'timestamp', nullable: true })
  expires: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;
}
