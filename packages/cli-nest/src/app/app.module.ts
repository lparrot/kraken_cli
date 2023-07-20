import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import * as path from "path";
import {DataSource} from "typeorm";
import {createDatabase, dropDatabase,} from "typeorm-extension";
import {EntityModule} from "./entities/_entity.module";
import {ConfigModule} from "@nestjs/config";
import configuration from "../../config/configuration";
import {ProvidersModule} from "../services/_providers.module";
import {ControllerModule} from "./controllers/_controller.module";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        return {
          type: 'better-sqlite3',
          database: path.resolve(process.env.APPDATA, 'kraken_cli', 'database.sqlite'),
          autoLoadEntities: true,
          synchronize: true,
        }
      },

      dataSourceFactory: async (options) => {
        if (process.env['db.drop_schema'] === 'true') {
          await dropDatabase({options, ifExist: true})
        }

        await createDatabase({options, ifNotExist: true})

        let dataSource: DataSource = new DataSource(options)
        return dataSource.initialize()
      }
    }),
    ConfigModule.forRoot({load: [configuration]}),
    ControllerModule,
    EntityModule,
    ProvidersModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {

  constructor() {
  }
}
