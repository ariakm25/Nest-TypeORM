import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UniqueValidator } from 'src/common/decorators/validator/unique-validator.decorator';
import { ExistValidator } from 'src/common/decorators/validator/exist-validator.decorator';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: 'default',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: configService.get<any>('database.type'),
          host: configService.get<string>('database.host'),
          port: configService.get<number>('database.port'),
          username: configService.get<string>('database.username'),
          password: configService.get<string>('database.password'),
          database: configService.get<string>('database.database'),
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          synchronize: false,
          migrationsRun: false,
          useUTC: true,
        };
      },
    }),
  ],
  providers: [UniqueValidator, ExistValidator],
  exports: [],
})
export class DatabaseModule {}
