import {Module} from "@nestjs/common";
import {ProjectController} from "./project.controller";
import {OsController} from './os.controller';
import {HttpModule} from "@nestjs/axios";
import {WebsocketProvider} from "src/app/websocket.provider";
import {AppProvider} from "src/app/app.provider";
import {GenerateController} from "src/app/controllers/generate.controller";
import {FilesystemController} from "src/app/controllers/filesystem.controller";

@Module({
    imports: [
        HttpModule
    ],
    controllers: [
        GenerateController,
        ProjectController,
        OsController,
        FilesystemController,
    ],
    providers: [
        AppProvider,
        WebsocketProvider,
    ]
})
export class ControllerModule {

}
