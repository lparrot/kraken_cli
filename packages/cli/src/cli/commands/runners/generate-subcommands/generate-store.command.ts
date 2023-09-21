import {CommandRunner, InquirerService, Option, Question, QuestionSet, SubCommand} from 'nest-commander'
import {Inject} from '@nestjs/common'
import {isBlank} from 'src/utils/string.utils'
import {GenerateProvider} from 'src/services/generate.provider'
import {ProjectProvider} from 'src/services/project.provider'
import {logger} from 'src/utils/logger.utils'

@SubCommand({
    name: 'store',
    description: `Génération d'un store Vuex`,
    aliases: ['s'],
})
export class GenerateStoreCommand extends CommandRunner {

    @Inject(InquirerService) inquirer: InquirerService
    @Inject(GenerateProvider) generateProvider: GenerateProvider
    @Inject(ProjectProvider) projectProvider: ProjectProvider

    async run(passedParams: string[], options?: Record<string, any>) {
        const paths = this.projectProvider.getProjectPaths(process.cwd())

        if (paths == null) {
            return logger.error(`Vous n'êtes pas dans un projet Kraken`)
        }

        const ask = await this.inquirer.ask<{ name: string }>('tasks-generate-store', options)

        await this.generateProvider.generateStore({cwd: process.cwd(), ...ask}, paths)

        logger.success(`Store ${ask.name} généré avec succès.`)
    }


    @Option({
        flags: '-n, --name [string]',
        description: 'Nom du fichier du store (sans extension) ?',
    })
    name(val: string): string {
        return val;
    }

}

@QuestionSet({name: 'tasks-generate-store'})
export class GenerateStoreQuestions {

    @Question({
        message: 'Nom du fichier du store (sans extension) ?',
        name: 'name',
        when(options) {
            return isBlank(options['name']);
        }
    })
    name(val: string) {
        return val
    }
}
