import { Inject, Injectable } from '@nestjs/common'
import * as child_process from 'child_process'
import { ProjectProvider } from './project.provider'
import { AppProvider } from 'src/app/app.provider'
import { InjectorProvider } from 'src/services/injector.provider'

const shell = require('shelljs')

@Injectable()
export class ShellCommandsProvider {

  @Inject(ProjectProvider) projectProvider: ProjectProvider

  appProvider?: AppProvider

  constructor(injector: InjectorProvider) {
    this.appProvider = injector.getProvider(AppProvider)
  }

  getVersions() {
    const is_node_installed = shell.which('node') != null
    const is_mvn_installed = shell.which('mvn') != null
    const last_npm_version = shell.exec('npm view @socle/core version', { silent: true }).replace(/[\n\r]+/g, '')
    const node_version = shell.exec('node -v', { silent: true }).stdout.replace(/[\n\r]+/g, '')

    return {
      is_node_installed,
      is_mvn_installed,
      last_npm_version,
      node_version
    }
  }

  async gitInit(cwd: string, check = false) {
    if (!check || shell.which('git') != null) {
      return this.executeCommand('git init', cwd)
    }
  }

  async gitAdd(cwd: string, check = false) {
    if (!check || shell.which('git') != null) {
      return this.executeCommand('git add -A', cwd)
    }
  }

  async gitCommit(cwd: string, message: string = 'commit', check = false) {
    if (!check || shell.which('git') != null) {
      return this.executeCommand(`git commit -m "${message}`, cwd)
    }
  }

  async installMavenLibraries(cwd: string, check = false) {
    if (!check || shell.which('mvn') != null) {
      return this.executeCommand('mvn dependency:resolve', cwd)
    }
  }

  async installNpmLibraries(cwd: string, check = false) {
    if (!check || shell.which('npm') != null) {
      return this.executeCommand('npm install', cwd)
    }
  }

  executeCommand(command: string, cwd: string) {
    return new Promise((resolve, reject) => {
      let result: child_process.ChildProcess | undefined

      try {
        result = shell.exec(command, { silent: true, cwd }, (code, stdout, stderr) => {
          if (code === 0) {
            return resolve(stdout)
          } else {
            return reject(`Erreur lors de l'execution de la commande ${command}: ${stderr}`)
          }
        })
      } catch (err) {
        return reject(err)
      }
    })
  }
}
