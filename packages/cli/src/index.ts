#! /usr/bin/env node
import yargs from 'yargs/yargs'
import {hideBin} from "yargs/helpers";
import inquirer from "inquirer";
import inquirer_fuzzy_path from 'inquirer-fuzzy-path'
import {getModules} from "./utils/folders.js";

inquirer.registerPrompt('fuzzypath', inquirer_fuzzy_path)

const cli = yargs(hideBin(process.argv))
  .scriptName('kn')
  .usage('Utilisation : $0 <commande>')
  .locale('fr')
  .wrap(null)
  .showHelpOnFail(true)
  .string('help')
  .number('version')
  .demandCommand()
  .recommendCommands()
  .strict();

await getModules('commands/*.js', module => {
  cli.command(module)
})

cli.argv
