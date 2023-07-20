import {Module} from '@nestjs/common';
import {InitCommand} from "./runners/init.command";
import {UiCommand} from "./runners/ui.command";
import {GenerateCommand} from "./runners/generate.command";
import {GeneratePageCommand, GeneratePageQuestions} from "./runners/generate-subcommands/generate-page.command";

@Module({
  providers: [
    InitCommand,
    GenerateCommand,

    GeneratePageCommand,
    GeneratePageQuestions,

    UiCommand
  ],
})
export class CommandsModule {
}
