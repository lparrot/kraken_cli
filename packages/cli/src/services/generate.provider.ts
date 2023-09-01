import { Inject, Injectable } from '@nestjs/common'
import { ProjectProvider } from './project.provider'
import { TemplateProvider } from './template.provider'
import { TemplateInitOptions } from '../../../cli_old/types'
import * as stringcase from 'stringcase'
import { dotcase, lowercase, pascalcase, pathcase, sentencecase, snakecase } from 'stringcase'
import * as path from 'path'
import { ShellCommandsProvider } from 'src/services/shell-commands.provider'
import { PostGenerateControllerBody, PostGenerateEntityBody, PostGeneratePageBody, PostGenerateReferentielBody, PostGenerateTimerBody, ProjectPaths } from '@kraken/types'
import { kebabCase } from 'lodash'
import * as dayjs from 'dayjs'

@Injectable()
export class GenerateProvider {

  @Inject(ProjectProvider) projectProvider: ProjectProvider
  @Inject(TemplateProvider) templateProvider: TemplateProvider
  @Inject(ShellCommandsProvider) shellCommandsProvider: ShellCommandsProvider

  async initProject(templateType: string, data: TemplateInitOptions) {
    const short_name = snakecase(data.name)
    const group_id = dotcase(data.group_id)
    const classname = pascalcase(short_name)
    const cwd = data.cwd == null ? process.cwd() : data.cwd

    await this.templateProvider.generate({
      templatePath: `apps/${templateType}`,
      targetPath: data.artifact_id,
      cwd,
      data: {
        ...data,
        short_name,
        group_id,
        classname,
        version: '1.0.0',
        package: `${group_id}.${short_name}`,
        package_folder: `${pathcase(group_id)}/${short_name}`
      }
    })

    if (data.install_librairies) {
      // logger('info', 'Installation des dépendances Java')

      try {
        await this.shellCommandsProvider.installMavenLibraries(path.resolve(cwd, data.artifact_id, 'server'))
      } catch (err) {
        // return logger('error', `Erreur lors de l'installation des dépendances Java`)
      }

      // logger('info', 'Installation des dépendances Node')

      try {
        await this.shellCommandsProvider.installNpmLibraries(path.resolve(cwd, data.artifact_id, 'web'))
      } catch (err) {
        // return logger('error', `Erreur lors de l'installation des dépendances node`)
      }
    }

    const project_folder = path.resolve(cwd, data.artifact_id)
    if (data.create_git_repo) {
      // logger('info', `Initialisation d'un dépôt Git`)

      try {
        await this.shellCommandsProvider.gitInit(project_folder)
        await this.shellCommandsProvider.gitAdd(project_folder)
        await this.shellCommandsProvider.gitCommit(project_folder, 'commit initial')
      } catch (err) {
        // return logger('error', `Erreur lors de l'initialisation du dépôt Git`)
      }
    }

    // logger('success', `Projet créé avec succès dans le dossier ${project_folder}`)

    await this.projectProvider.getAppdata(path.resolve(cwd, data.artifact_id))
  }

  async generatePage(options: PostGeneratePageBody, paths?: any) {
    const { cwd, ...data } = options

    if (paths == null) {
      paths = this.projectProvider.getProjectPaths(cwd)
    }

    await this.templateProvider.generate({
        cwd,
        data,
        templatePath: 'page',
        targetPath: paths.web_pages_path,
      }
    )

    await this.shellCommandsProvider.gitAdd(paths.server_root_path)
  }

  async generateController(options: PostGenerateControllerBody, paths?: ProjectPaths | null) {
    const { cwd, ...data } = options

    if (paths == null) {
      paths = this.projectProvider.getProjectPaths(cwd)
    }

    data.name = pascalcase(data.name)
    data.url = lowercase(data.url)

    await this.templateProvider.generate({
      cwd,
      data,
      templatePath: 'ctrl',
      targetPath: '.',
    })

    await this.shellCommandsProvider.gitAdd(paths.server_root_path)
  }

  async generateReferentiel(options: PostGenerateReferentielBody, paths?: ProjectPaths | null) {
    const { cwd, ...data } = options

    if (paths == null) {
      paths = this.projectProvider.getProjectPaths(cwd)
    }

    const entity_name = this.templateProvider.convertJavaFilenameToClassSimpleName(data.entity_name)
    const entity_full_name = this.templateProvider.convertJavaFilenameToClassFullName(data.entity_name, paths?.server_java_path)
    const dao_name = this.templateProvider.convertJavaFilenameToClassSimpleName(data.dao_name)
    const dao_full_name = this.templateProvider.convertJavaFilenameToClassFullName(data.dao_name, paths?.server_java_path)

    await this.templateProvider.generate({
      cwd,
      templatePath: `referentiel/${data.template}`,
      targetPath: '.',
      add_to_git: true,
      data: {
        ...data,
        entity_name,
        entity_full_name,
        dao_name,
        dao_full_name,
        package_name: paths?.server_current_package
      }
    })

    if (data.with_page) {
      await this.templateProvider.generate({
        cwd,
        templatePath: `referentiel/page`,
        targetPath: paths?.web_pages_path!,
        add_to_git: true,
        data: {
          ...data,
          ref_state_name: `ref_${snakecase(kebabCase(data.url))}`,
          fields: data.fields.map(it => ({ ...it, label: sentencecase(it.name) }))
        }
      })
    }

    await this.shellCommandsProvider.gitAdd(paths.server_root_path)
  }

  async generateEntity(body: PostGenerateEntityBody, paths?: ProjectPaths | null) {
    const { cwd, ...data } = body

    if (paths == null) {
      paths = this.projectProvider.getProjectPaths(body.cwd)
    }

    const name = stringcase.pascalcase(body.name)

    await this.templateProvider.generate({
      cwd,
      data: {
        ...data,
        name
      },
      templatePath: 'entity',
      targetPath: '.',
    })

    await this.shellCommandsProvider.gitAdd(paths.server_root_path)
  }

  async generateTimer(body: PostGenerateTimerBody, paths?: ProjectPaths | null) {
    const { cwd, ...data } = body

    if (paths == null) {
      paths = this.projectProvider.getProjectPaths(body.cwd)
    }

    const timer_name = snakecase(data.name)
    const timer_description = data.description
    const timer_class = `${timer_name.includes('timer') ? '' : 'Timer'}${stringcase.pascalcase(timer_name)}`
    const timer_package = paths.server_current_package
    const flyway_datetime = dayjs().format('YYYYMMDDHHmm')

    await this.templateProvider.generate({
        cwd,
        templatePath: 'timer/java',
        targetPath: '.',
        data: {
          timer_name,
          timer_class,
          timer_package
        }
      }
    )

    await this.templateProvider.generate({
      templatePath: 'timer/sql',
      targetPath: path.join(paths.server_resources_path, 'db', 'migration'),
      cwd: paths.server_java_path,
      data: {
        timer_name,
        timer_description,
        flyway_datetime,
        timer_class,
        timer_package
      }
    })

    await this.shellCommandsProvider.gitAdd(paths.server_root_path)
  }
}
