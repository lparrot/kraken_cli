import { Inject, Injectable } from '@nestjs/common'
import { ProjectProvider } from './project.provider'
import { TemplateProvider } from './template.provider'
import { TemplateInitOptions } from '../../../cli_old/types'
import { dotcase, lowercase, pascalcase, pathcase, snakecase } from 'stringcase'
import * as path from 'path'
import { ShellCommandsProvider } from 'src/services/shell-commands.provider'

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

  async generatePage(options: { cwd?: string, data: { name: string, title: string } }, paths?: any) {
    const { cwd, data } = options

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
  }

  async generateController(options: { cwd?: string, data: { name: string, url: string } }) {
    const { cwd, data } = options

    data.name = pascalcase(data.name)
    data.url = lowercase(data.url)

    await this.templateProvider.generate({
      cwd,
      data,
      templatePath: 'ctrl',
      targetPath: '.',
    })
  }
}
