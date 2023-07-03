import chalk from 'chalk'
import {io} from "../api/index.js";
import {LoggerLevel} from "@kraken/types";

export function logger(level: LoggerLevel, message: string) {
  io.emit('logger:message', {level, message})

  switch (level) {
    case 'success':
      console.log(chalk.greenBright(message))
      break
    case 'info':
      console.log(chalk.blueBright(message))
      break
    case 'warn':
      console.log(chalk.yellow(message))
      break
    case 'error':
      console.log(chalk.red(message))
      break
    default:
      break
  }
}
