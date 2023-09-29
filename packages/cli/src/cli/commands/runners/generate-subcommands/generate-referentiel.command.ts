import { CommandRunner, InquirerService, Option, Question, QuestionSet, SubCommand } from 'nest-commander'
import { Inject } from '@nestjs/common'
import { isBlank } from 'src/utils/string.utils'
import { GenerateProvider } from 'src/services/generate.provider'
import { ProjectProvider } from 'src/services/project.provider'
import { logger } from 'src/utils/logger.utils'

@SubCommand({
  name: 'ref',
  description: `Permet de créer les classes de type referentiel à l'emplacement actuel`,
  aliases: ['r'],
})
export class GenerateReferentielCommand extends CommandRunner {

  @Inject(InquirerService) inquirer: InquirerService
  @Inject(GenerateProvider) generateProvider: GenerateProvider
  @Inject(ProjectProvider) projectProvider: ProjectProvider

  async run(passedParams: string[], options?: Record<string, any>) {
    const paths = this.projectProvider.getProjectPaths(process.cwd())

    if (paths == null) {
      return logger.error(`Vous n'êtes pas dans un projet Kraken`)
    }

    const ask = await this.inquirer.ask<{ name: string, url: string }>('tasks-generate-ctrl', options)

    await this.generateProvider.generateController({ cwd: process.cwd(), ...ask }, paths)

    logger.success(`Controlleur ${ask.name} et service générés avec succès.`)
  }

  @Option({
    flags: '-e, --entity [string]',
    description: 'Classe de l\'entité à utiliser',
  })
  entity(val: string): string {
    return val
  }

}

@QuestionSet({ name: 'tasks-generate-ctrl' })
export class GenerateReferentielQuestions {

  @Question({
    type: 'list', message: 'Type de réferentiel ?', name: 'template', choices: [
      { value: 'simple', name: 'Consultation' },
      { value: 'crud', name: 'Consultation/Modification' },
    ]
  })
  template(val: string) {
    return val
  }

  @Question({
    message: 'Classe de l\'entité à utiliser ?', name: 'entity',
    when(options) {
      return isBlank(options['entity'])
    }
  })
  entity(val: string) {
    return val
  }
}
