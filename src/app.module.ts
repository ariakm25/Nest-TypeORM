import { APP_GUARD } from '@nestjs/core';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { RedisOptions } from 'ioredis';
import { BullBoardModule } from './modules/bullboard/bullboard.module';
import { MailerModule } from '@nestjs-modules/mailer';

import mailConfig from 'config/mail.config';
import appConfig from 'config/app.config';
import databaseConfig from 'config/database.config';
import tokenConfig from 'config/token.config';
import redisConfig from 'config/redis.config';
import bullboardConfig from 'config/bullboard.config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from 'src/modules/database/database.module';
import { RoleModule } from 'src/modules/role/role.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${
        process.env.NODE_ENV == 'production' ? '.env' : '.env.dev'
      }`,
      load: [
        appConfig,
        databaseConfig,
        tokenConfig,
        mailConfig,
        redisConfig,
        bullboardConfig,
      ],
      cache: true,
    }),
    DatabaseModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        let redisConfig: RedisOptions = {
          host: configService.get<string>('redis.host'),
          port: configService.get<number>('redis.port'),
          username: configService.get<string>('redis.username'),
          password: configService.get<string>('redis.password'),
        };

        const isTls: string =
          configService.get<string>('redis.isTls') || 'false';

        if (isTls == 'true') {
          redisConfig = {
            ...redisConfig,
            tls: {
              host: configService.get<string>('redis.tls.host'),
            },
          };
        }

        const maxCompletedJobs = configService.get<number>(
          'redis.maxCompletedJobs',
        );

        return {
          redis: redisConfig,
          defaultJobOptions: {
            removeOnComplete: {
              count: maxCompletedJobs,
            },
          },
        };
      },
    }),
    BullBoardModule,
    MailerModule,
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 120,
    }),
    RoleModule,
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
