import chalk from 'chalk'

/**
 * @param {'success' | 'info' | 'warn' | 'error'} level
 * @param {unknown[]|unknown} message
 */
export function logger(level, ...message) {
	switch (level) {
		case 'success':
			console.log(chalk.greenBright(message))
			break
		case 'info':
			console.log(chalk.blueBright(message))
			break
		case 'warn':
			console.log(chalk.keyword('orange')(message))
			break
		case 'error':
			console.log(chalk.red(message))
			break
		default:
			break
	}
}