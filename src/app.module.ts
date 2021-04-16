import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './services/app.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {TypeOrmConfigService} from "./services/typeorm.service";
import {SharedModule} from "./services/shared.module";
import {Activity} from "./entities/activity.entity";
import {Room} from "./entities/room.entity";
import {Reservation} from "./entities/reservation.entity";

@Module({
    imports: [
        SharedModule,
        TypeOrmModule.forRootAsync({
            inject: [TypeOrmConfigService],
            useFactory: async (typeOrmConfigService: TypeOrmConfigService) => typeOrmConfigService.createTypeOrmOptions(),
        }),
        TypeOrmModule.forFeature([Activity, Room, Reservation])
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
