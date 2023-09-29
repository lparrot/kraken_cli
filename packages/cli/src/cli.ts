#! /usr/bin/env node

import { CommandFactory } from 'nest-commander'
import { CliModule } from './cli/cli.module'
import { ConsoleLogger } from '@nestjs/common'
import inquirer_fuzzy_path from 'inquirer-fuzzy-path'
import inquirer from 'inquirer'

export async function cliBootstrap() {
  inquirer.registerPrompt('fuzzypath', inquirer_fuzzy_path)
  await CommandFactory.run(CliModule, {
    logger: new ConsoleLogger("", {logLevels: ['warn', 'error']}),
  });
}

cliBootstrap().then(value => {
  //
});
