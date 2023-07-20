#! /usr/bin/env node

import {CommandFactory} from 'nest-commander';
import {CliModule} from "./cli/cli.module";
import {ConsoleLogger} from "@nestjs/common";

export async function cliBootstrap() {
  await CommandFactory.run(CliModule, {
    logger: new ConsoleLogger("", {logLevels: ['warn', 'error']}),
  });
}

cliBootstrap().then(value => {
  //
});
