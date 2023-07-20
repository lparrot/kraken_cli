import {Command, CommandRunner} from "nest-commander";
import {GeneratePageCommand} from "./generate-subcommands/generate-page.command";

@Command({
  name: 'generate',
  aliases: ['g'],
  subCommands: [GeneratePageCommand]
})
export class GenerateCommand extends CommandRunner {

  run(passedParams: string[], options?: Record<string, any>): Promise<void> {
    this.command.help()
    return Promise.resolve(undefined);
  }

}
