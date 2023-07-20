import {Module} from '@nestjs/common';
import {CommandsModule} from './commands/commands.module';
import {ConfigModule} from "@nestjs/config";
import configuration from "../../config/configuration";
import {ProvidersModule} from "../services/_providers.module";
import {ServeStaticModule} from "@nestjs/serve-static";
import {join} from "path";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'www'),
      exclude: ['/api/(.*)'],
    }),
    CommandsModule,
    ProvidersModule,
    ConfigModule.forRoot({load: [configuration]}),
  ],
})
export class CliModule {
}
