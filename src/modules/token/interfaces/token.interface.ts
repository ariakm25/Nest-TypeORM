import { UserInterface } from 'src/modules/user/interfaces/user.interface';
import { TokenType } from 'src/common/enums/token-type.enum';

export interface TokenInterface {
  token: string;
  user: UserInterface;
  createdAt: Date;
  expires: Date;
  type: TokenType;
}
