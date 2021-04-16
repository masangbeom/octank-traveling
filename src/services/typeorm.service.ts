import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { AwsService } from "./aws.service";

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(
    private readonly awsService: AwsService,
  ) {
  }
  async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
    const databaseCredential = await this.awsService.getDatabaseCredential();
    const {host, port, username, password} = databaseCredential;
    return {
      type: 'mysql' as const,
      host,
      port,
      username,
      database: process.env.DATABASE_NAME,
      password,
      entities: [process.env.PWD + '/dist/**/*.entity{.ts,.js}'],
      synchronize: Boolean(process.env.TYPEORM_SYNCHRONIZE),
    };
  }
}
