import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

import { TokenType } from 'src/common/enums/token-type.enum';
import { randomBytes } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, MoreThan, Repository } from 'typeorm';
import { Token } from 'src/modules/token/entities/token.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { InsertTokenDto } from 'src/modules/token/dto/insert-token.dto';
import { UserInterface } from 'src/modules/user/interfaces/user.interface';
import { TokenInterface } from 'src/modules/token/interfaces/token.interface';

@Injectable()
export class TokenService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
  ) {}

  createAccessToken(user: UserInterface): string {
    const payload = {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
    };
    return this.jwtService.sign(payload);
  }

  async createRefreshToken(user: UserInterface): Promise<string> {
    const payload = {
      id: user.id,
    };

    const generateRefreshToken = this.jwtService.sign(
      payload,
      this.getRefreshTokenOptions(),
    );

    const refreshToken = await this.insertToken({
      type: TokenType.RefreshToken,
      user: user,
      token: generateRefreshToken,
    });

    return refreshToken.token;
  }

  async validateRefreshToken(token: string): Promise<number | boolean> {
    const getToken = await this.tokenRepository.findOne({
      where: { token, type: TokenType.RefreshToken },
    });

    if (!getToken) {
      return false;
    }

    const verify = this.jwtService.verify(token, this.getRefreshTokenOptions());

    if (!verify) {
      return false;
    }

    return verify.sub;
  }

  async createRandomTokenForUser(user: User, type: TokenType): Promise<string> {
    const token = randomBytes(30).toString('hex');

    await this.insertToken({
      type,
      user,
      token,
    });

    return token;
  }

  async getToken(
    token: string,
    type: TokenType,
    checkExpires?: boolean,
  ): Promise<Token> {
    const getToken = await this.tokenRepository.findOne({
      where: { token, type },
      relations: ['user'],
    });

    if (!getToken) {
      throw new BadRequestException(['invalid token']);
    }

    if (checkExpires && getToken.expires && getToken.expires < new Date()) {
      await this.tokenRepository.delete({ id: getToken.id });
      throw new BadRequestException(['token expired']);
    }

    return getToken;
  }

  async isTokenRecentlyAdded(
    userId: number,
    type: TokenType,
  ): Promise<boolean> {
    const check = await this.tokenRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        type,
        createdAt: MoreThan(new Date(new Date().getTime() - 1000 * 60 * 5)),
      },
    });

    return !!check;
  }

  async deleteToken(token: string, type: TokenType): Promise<DeleteResult> {
    return await this.tokenRepository.delete({ token, type });
  }

  async deleteAllUserTokens(
    userId: number,
    type?: TokenType,
  ): Promise<DeleteResult> {
    let query: any = { user: userId };
    if (type) {
      query = { ...query, type };
    }
    return await this.tokenRepository.delete(query);
  }

  private getRefreshTokenOptions(): JwtSignOptions {
    return {
      secret: this.configService.get<string>('token.refreshTokenSecret'),
      expiresIn: this.configService.get<string>('token.refreshTokenExpiration'),
    };
  }

  private async insertToken(
    insertTokenDto: InsertTokenDto,
  ): Promise<TokenInterface> {
    let expires: Date = new Date();
    switch (insertTokenDto.type) {
      case TokenType.ResetPassword:
        expires.setHours(
          expires.getHours() +
            parseInt(
              this.configService.get<string>(
                'token.resetPasswordTokenExpiration',
              ),
            ),
        );
        break;
      case TokenType.ConfirmEmail:
        expires.setHours(
          expires.getHours() +
            parseInt(
              this.configService.get<string>(
                'token.confirmEmailTokenExpiration',
              ),
            ),
        );
        break;
      default:
        expires = null;
        break;
    }

    const payload: InsertTokenDto = { ...insertTokenDto, expires };
    return this.tokenRepository.save(payload);
  }
}
