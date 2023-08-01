import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from 'src/modules/auth/services/auth.service';
import { UserModule } from 'src/modules/user/user.module';
import { TokenModule } from 'src/modules/token/token.module';
import { MailModule } from 'src/modules/mail/mail.module';
import { AuthController } from 'src/modules/auth/controllers/auth.controller';
import { JwtStrategy } from 'src/modules/auth/strategies/jwt.strategy';

@Module({
  imports: [UserModule, ConfigModule, PassportModule, TokenModule, MailModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, TokenModule],
})
export class AuthModule {}
