import {CommandRunner, InquirerService, Option, Question, QuestionSet, SubCommand} from 'nest-commander'
import {Inject} from '@nestjs/common'
import {isBlank} from 'src/utils/string.utils'
import {GenerateProvider} from 'src/services/generate.provider'
import {ProjectProvider} from 'src/services/project.provider'
import {logger} from 'src/utils/logger.utils'

@SubCommand({
    name: 'ctrl',
    description: `Génération d'un controlleur Rest et son service associé`,
    aliases: ['c'],
})
export class GenerateControllerCommand extends CommandRunner {

    @Inject(InquirerService) inquirer: InquirerService
    @Inject(GenerateProvider) generateProvider: GenerateProvider
    @Inject(ProjectProvider) projectProvider: ProjectProvider

    async run(passedParams: string[], options?: Record<string, any>) {
        const paths = this.projectProvider.getProjectPaths(process.cwd())

        if (paths == null) {
            return logger.error(`Vous n'êtes pas dans un projet Kraken`)
        }

        const ask = await this.inquirer.ask<{ name: string, url: string }>('tasks-generate-ctrl', options)

        await this.generateProvider.generateController({cwd: process.cwd(), ...ask}, paths)

        logger.success(`Controlleur ${ask.name} et service générés avec succès.`)
    }

    @Option({
        flags: '-n, --name [string]',
        description: 'Nom du controller (sans préfixe ou suffixe)',
    })
    name(val: string): string {
        return val;
    }

    @Option({
        flags: '-u, --url [string]',
        description: 'Url du webservice',
    })
    url(val: string): string {
        return val;
    }

}

@QuestionSet({name: 'tasks-generate-ctrl'})
export class GenerateControllerQuestions {

    @Question({
        message: 'Nom du controller (sans préfixe ou suffixe) ?',
        name: 'name',
        when(options) {
            return isBlank(options['name']);
        }
    })
    name(val: string) {
        return val
    }

    @Question({
        message: 'Url du webservice ?',
        name: 'url',
        when(options) {
            return isBlank(options['url']);
        }
    })
    url(val: string) {
        return val
    }
}
