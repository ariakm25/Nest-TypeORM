import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { compareSync } from 'bcryptjs';
import { TokenType } from 'src/common/enums/token-type.enum';
import {
  CheckTokenResetPasswordDto,
  ResetPasswordDto,
} from '../dto/reset-password.dto';
import { UpdatePasswordDto } from '../dto/update-password.dto';
import { UserService } from '../../user/services/user.service';
import { TokenService } from 'src/modules/token/services/token.service';
import { MailService } from 'src/modules/mail/mail.service';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import { User } from 'src/modules/user/entities/user.entity';
import { UserInterface } from 'src/modules/user/interfaces/user.interface';
import { AuthResponse } from 'src/modules/auth/interfaces/auth.interface';
import { RefreshTokenDto } from 'src/modules/auth/dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService,
  ) {}

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { email, password } = loginDto;
    const user: UserInterface = await this.usersService.findOneBy(
      'email',
      email,
    );

    if (user) {
      const isValid = compareSync(password, user.password);

      if (isValid) {
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          accessToken: this.tokenService.createAccessToken(user),
          refreshToken: await this.tokenService.createRefreshToken(user),
        };
      }
    }

    throw new BadRequestException(['email or password is incorrect']);
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<AuthResponse> {
    const { refresh_token } = refreshTokenDto;

    const verify = await this.tokenService.validateRefreshToken(refresh_token);

    if (typeof verify === 'number') {
      const user: User = await this.usersService.findOne(verify);

      if (!user) {
        throw new BadRequestException(['invalid user refresh token']);
      }

      await this.tokenService.deleteToken(
        refresh_token,
        TokenType.RefreshToken,
      );

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        accessToken: this.tokenService.createAccessToken(user),
        refreshToken: await this.tokenService.createRefreshToken(user),
      };
    }

    throw new BadRequestException(['invalid refresh token']);
  }

  async sendResetPasswordEmail(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<boolean> {
    const user: User = await this.usersService.findOneBy(
      'email',
      resetPasswordDto.email,
    );
    if (!user) {
      throw new BadRequestException(['user with this email does not exist']);
    }

    const checkToken = await this.tokenService.isTokenRecentlyAdded(
      user.id,
      TokenType.ResetPassword,
    );

    if (checkToken) {
      throw new BadRequestException([
        'token already sent, please wait for 5 minutes to send new token',
      ]);
    }

    const token = await this.tokenService.createRandomTokenForUser(
      user,
      TokenType.ResetPassword,
    );

    try {
      await this.mailService.sendResetPasswordEmail(user.email, token);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }

    return true;
  }

  async updatePassword(updatePassword: UpdatePasswordDto): Promise<boolean> {
    const { password, token } = updatePassword;
    const checkToken = await this.tokenService.getToken(
      token,
      TokenType.ResetPassword,
      true,
    );

    if (!checkToken) {
      throw new BadRequestException(['invalid token']);
    }

    await this.usersService.updatePassword(checkToken.user.id, password);

    await this.tokenService.deleteAllUserTokens(checkToken.user.id);

    return true;
  }

  async checkResetPasswordToken(
    checkTokenResetPasswordDto: CheckTokenResetPasswordDto,
  ): Promise<boolean> {
    const { token } = checkTokenResetPasswordDto;
    const checkToken = await this.tokenService.getToken(
      token,
      TokenType.ResetPassword,
      true,
    );

    if (!checkToken) {
      throw new BadRequestException(['invalid token']);
    }

    return true;
  }

  async logout(id: number): Promise<boolean> {
    await this.tokenService.deleteAllUserTokens(id, TokenType.RefreshToken);
    return true;
  }

  async me(id: number): Promise<User> {
    return await this.usersService.findOneWithRolePermission(id);
  }
}
