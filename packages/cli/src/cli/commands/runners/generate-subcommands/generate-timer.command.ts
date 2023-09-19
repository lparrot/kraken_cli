import { CommandRunner, InquirerService, Question, QuestionSet, SubCommand } from 'nest-commander'
import { Inject } from '@nestjs/common'
import { isNotBlank } from 'src/utils/string.utils'
import { GenerateProvider } from 'src/services/generate.provider'
import { ProjectProvider } from 'src/services/project.provider'
import { logger } from 'src/utils/logger.utils'
import * as path from 'path'
import { snakecase } from 'stringcase'

@SubCommand({
  name: 'timer',
  description: `Génération d'un timer Spring`,
  aliases: ['t'],
})
export class GenerateTimerCommand extends CommandRunner {

  @Inject(InquirerService) inquirer: InquirerService
  @Inject(GenerateProvider) generateProvider: GenerateProvider
  @Inject(ProjectProvider) projectProvider: ProjectProvider

  async run(passedParams: string[], options?: Record<string, any>) {
    const paths = this.projectProvider.getProjectPaths(process.cwd())

    if (paths == null) {
      return logger.error(`Vous n'êtes pas dans un projet Kraken`)
    }

    const ask = await this.inquirer.ask<{ name: string, description: string }>('tasks-generate-timer', options)

    await this.generateProvider.generateTimer({ cwd: process.cwd(), ...ask }, paths)

    logger.success('Timer généré dans le dossier ' + process.cwd() + ' et script sql généré dans le dossier ' + path.join(paths.server_resources_path, 'db', 'migration'))
  }

}

@QuestionSet({ name: 'tasks-generate-timer' })
export class GenerateTimerQuestions {

  @Question({
    message: 'Nom du timer ?',
    name: 'name',
    validate(input: any) {
      return isNotBlank(input)
    },
    transformer(input: any) {
      return snakecase(input)
    }
  })
  name(val: string) {
    return val
  }

  @Question({
    message: 'Description du timer ?',
    name: 'description',
    validate(input: any) {
      return isNotBlank(input)
    }
  })
  description(val: string) {
    return val
  }
}
