import {Global, Module} from "@nestjs/common";
import {TypeOrmConfigService} from "./typeorm.service";
import {AwsService} from "./aws.service";

@Global()
@Module(
    {
        providers: [TypeOrmConfigService, AwsService],
        exports: [TypeOrmConfigService, AwsService],
    }
)
export class SharedModule {}
