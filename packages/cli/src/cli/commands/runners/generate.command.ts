import { Command, CommandRunner } from 'nest-commander'
import { GeneratePageCommand } from './generate-subcommands/generate-page.command'
import { GenerateTimerCommand } from 'src/cli/commands/runners/generate-subcommands/generate-timer.command'

@Command({
  name: 'generate',
  aliases: ['g'],
  subCommands: [
    GeneratePageCommand,
    GenerateTimerCommand
  ]
})
export class GenerateCommand extends CommandRunner {

  async run(passedParams: string[], options?: Record<string, any>) {
    this.command.help()
  }

}
