import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { AuthState } from 'src/modules/auth/interfaces/auth.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('token.accessTokenSecret'),
    });
  }

  async validate(payload: AuthState): Promise<AuthState> {
    return {
      id: payload.id,
      name: payload.name,
      avatar: payload.avatar,
    };
  }
}
