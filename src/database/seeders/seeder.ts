import { seeder } from 'nestjs-seeder';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from 'src/modules/user/entities/user.entity';
import { RoleSeeder } from 'src/database/seeders/role.seeder';
import { PermissionSeeder } from 'src/database/seeders/permission.seeder';
import { Permission } from 'src/modules/role/entities/permission.entity';
import { Role } from 'src/modules/role/entities/role.entity';
import databaseConfig from '../../../config/database.config';
import { UsersSeeder } from 'src/database/seeders/user.seeder';

seeder({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig],
      envFilePath: `${
        process.env.NODE_ENV == 'production' ? '.env' : '.env.dev'
      }`,
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
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
          entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
          synchronize: false,
          migrationsRun: false,
          useUTC: true,
        };
      },
    }),
    TypeOrmModule.forFeature([Role, Permission, User]),
  ],
}).run([RoleSeeder, PermissionSeeder, UsersSeeder]);
