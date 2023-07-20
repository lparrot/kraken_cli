import {Global, Module} from "@nestjs/common";
import {TemplateProvider} from "./template.provider";
import {ProjectProvider} from "./project.provider";
import {ShellCommandsProvider} from "./shell-commands.provider";
import {GenerateProvider} from "./generate.provider";
import {HttpModule} from "@nestjs/axios";
import {InjectorProvider} from "src/services/injector.provider";

const providers = [
  GenerateProvider,
  ProjectProvider,
  ShellCommandsProvider,
  TemplateProvider,
  InjectorProvider
]

@Global()
@Module({
  imports: [
    HttpModule
  ],
  providers: [
    ...providers,
  ],
  exports: [
    ...providers
  ]
})
export class ProvidersModule {

}
