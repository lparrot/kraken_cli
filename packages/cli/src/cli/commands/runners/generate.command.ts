import { Command, CommandRunner } from 'nest-commander'
import { GeneratePageCommand } from './generate-subcommands/generate-page.command'
import { GenerateTimerCommand } from 'src/cli/commands/runners/generate-subcommands/generate-timer.command'
import { GenerateStoreCommand } from 'src/cli/commands/runners/generate-subcommands/generate-store.command'
import { GenerateControllerCommand } from 'src/cli/commands/runners/generate-subcommands/generate-controller.command'
import { GenerateReferentielCommand } from 'src/cli/commands/runners/generate-subcommands/generate-referentiel.command'

@Command({
    name: 'generate',
    aliases: ['g'],
    subCommands: [
        GenerateControllerCommand,
        GeneratePageCommand,
      GenerateReferentielCommand,
        GenerateStoreCommand,
        GenerateTimerCommand,
    ]
})
export class GenerateCommand extends CommandRunner {

    async run(passedParams: string[], options?: Record<string, any>) {
        this.command.help()
    }

}
