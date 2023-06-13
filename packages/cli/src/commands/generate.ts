import {Argv as YargsOptions} from "yargs";
import {getModules} from "../utils/folders.js";

export default {
  command: 'generate [action]',
  aliases: ['g'],
  description: 'Generation de fichiers via template',
  async builder(yargs: YargsOptions) {
    await getModules('generate/*.js', module => {
      yargs.command(module.default)
    })
    yargs.demandCommand()
  }
}
