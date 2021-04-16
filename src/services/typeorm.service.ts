import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { AwsService } from "./aws.service";
import {Activity} from "../entities/activity.entity";
import {Room} from "../entities/room.entity";
import {Reservation} from "../entities/reservation.entity";

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
      database: 'traveling',
      password,
      entities: [process.env.PWD + '/dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    };
  }
}
