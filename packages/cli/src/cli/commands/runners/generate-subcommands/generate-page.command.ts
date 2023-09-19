import { CommandRunner, InquirerService, Option, Question, QuestionSet, SubCommand } from 'nest-commander'
import { Inject } from '@nestjs/common'

import { logger } from 'src/utils/logger.utils'
import { GenerateProvider } from 'src/services/generate.provider'
import { ProjectProvider } from 'src/services/project.provider'

@SubCommand({
  name: 'page',
  description: `Génération d'une page .vue`,
  aliases: ['p'],
})
export class GeneratePageCommand extends CommandRunner {
  @Inject(InquirerService) inquirer: InquirerService
  @Inject(GenerateProvider) generateProvider: GenerateProvider
  @Inject(ProjectProvider) projectProvider: ProjectProvider

  async run(passedParams: string[], options?: Record<string, any>): Promise<void> {
    const paths = this.projectProvider.getProjectPaths(process.cwd())

    if (paths == null) {
      return logger.error(`Vous n'êtes pas dans un projet Kraken`)
    }

    const ask = await this.inquirer.ask<{ name: string, title: string }>('tasks-generate-page', options)

    await this.generateProvider.generatePage({ cwd: process.cwd(), ...ask }, paths)

    logger.success('Page générée dans le dossier ' + paths.web_pages_path)
  }

  @Option({ name: 'name', description: 'Nom du fichier de la page (sans extension) ?', flags: '-n --name <name>' })
  name(val: string) {
    return val
  }

  @Option({ name: 'title', description: 'Titre de la page ?', flags: '-t --title <title>' })
  title(val: string) {
    return val
  }
}

@QuestionSet({ name: 'tasks-generate-page' })
export class GeneratePageQuestions {

  @Question({
    message: 'Nom du fichier de la page (sans extension) ?',
    name: 'name'
  })
  name(val: string) {
    return val
  }

  @Question({
    message: 'Titre de la page ?',
    name: 'title'
  })
  title(val: string) {
    return val
  }
}
