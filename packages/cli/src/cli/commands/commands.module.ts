import { Module } from '@nestjs/common'
import { InitCommand } from './runners/init.command'
import { UiCommand } from './runners/ui.command'
import { GenerateCommand } from './runners/generate.command'
import { GeneratePageCommand, GeneratePageQuestions } from './runners/generate-subcommands/generate-page.command'
import { GenerateTimerCommand, GenerateTimerQuestions } from 'src/cli/commands/runners/generate-subcommands/generate-timer.command'

@Module({
  providers: [
    InitCommand,
    GenerateCommand,

    GeneratePageCommand,
    GeneratePageQuestions,

    GenerateTimerCommand,
    GenerateTimerQuestions,

    UiCommand
  ],
})
export class CommandsModule {
}
