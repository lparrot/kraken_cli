import { Module } from '@nestjs/common'
import { InitCommand } from './runners/init.command'
import { UiCommand } from './runners/ui.command'
import { GenerateCommand } from './runners/generate.command'
import { GeneratePageCommand, GeneratePageQuestions } from './runners/generate-subcommands/generate-page.command'
import { GenerateTimerCommand, GenerateTimerQuestions } from 'src/cli/commands/runners/generate-subcommands/generate-timer.command'
import { GenerateStoreCommand, GenerateStoreQuestions } from 'src/cli/commands/runners/generate-subcommands/generate-store.command'
import { GenerateControllerCommand, GenerateControllerQuestions } from 'src/cli/commands/runners/generate-subcommands/generate-controller.command'
import { GenerateReferentielCommand, GenerateReferentielQuestions } from 'src/cli/commands/runners/generate-subcommands/generate-referentiel.command'

@Module({
    providers: [
        InitCommand,
        GenerateCommand,

        GenerateControllerCommand,
        GenerateControllerQuestions,

        GeneratePageCommand,
        GeneratePageQuestions,

      GenerateReferentielCommand,
      GenerateReferentielQuestions,

        GenerateStoreCommand,
        GenerateStoreQuestions,

        GenerateTimerCommand,
        GenerateTimerQuestions,

        UiCommand
    ],
})
export class CommandsModule {
}
