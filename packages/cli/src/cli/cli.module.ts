import {Module} from '@nestjs/common';
import {CommandsModule} from './commands/commands.module';
import {ConfigModule} from "@nestjs/config";
import configuration from "../../config/configuration";
import {ProvidersModule} from "../services/_providers.module";

@Module({
  imports: [
    CommandsModule,
    ProvidersModule,
    ConfigModule.forRoot({load: [configuration]}),
  ],
})
export class CliModule {
}
