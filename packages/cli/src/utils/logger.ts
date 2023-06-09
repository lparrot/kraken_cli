import chalk from 'chalk'

export function logger(level: 'success' | 'info' | 'warn' | 'error', ...message: unknown[]) {
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
