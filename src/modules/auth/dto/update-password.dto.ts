import { IsNotEmpty, MinLength } from 'class-validator';
import { MatchValidator } from 'src/common/decorators/validator/match-validator.decorator';

export class UpdatePasswordDto {
  @IsNotEmpty()
  token: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @MatchValidator('password')
  confirmPassword: string;
}
