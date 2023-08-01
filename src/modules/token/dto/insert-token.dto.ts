import { IsNotEmpty, IsOptional } from 'class-validator';
import { TokenType } from 'src/common/enums/token-type.enum';
import { UserInterface } from 'src/modules/user/interfaces/user.interface';

export class InsertTokenDto {
  @IsNotEmpty()
  user: UserInterface;

  @IsNotEmpty()
  token: string;

  @IsNotEmpty()
  type: TokenType;

  @IsOptional()
  expires?: Date;
}
