import { Inject, Injectable } from '@nestjs/common'
import * as path from 'path'
import { globSync } from 'glob'
import { ProjectAppData, ProjectPaths } from '@kraken/types'
import * as fs from 'fs-extra'
import { HttpService } from '@nestjs/axios'
import axios from 'axios'
import { InjectorProvider } from 'src/services/injector.provider'
import { AppProvider } from 'src/app/app.provider'
import { spawn } from 'child_process'
import { WebsocketProvider } from 'src/app/websocket.provider'

const BASE_SEARCH_PATH = 'web/nuxt.config.js'
const SERVER_ROOT_PATH = 'server'
const SERVER_JAVA_PATH = SERVER_ROOT_PATH + '/src/main/java'
const SERVER_RESOURCES_PATH = SERVER_ROOT_PATH + '/src/main/resources'
const WEB_ROOT_PATH = 'web'
const WEB_PAGES_PATH = WEB_ROOT_PATH + '/pages'

const terminate = require('terminate')
const Convert = require('ansi-to-html')
const shell = require('shelljs')

@Injectable()
export class ProjectProvider {

  @Inject(HttpService) http: HttpService;

  appProvider: AppProvider;
  websocketProvider?: WebsocketProvider

  constructor(injector: InjectorProvider) {
    this.appProvider = injector.getProvider(AppProvider)
    this.websocketProvider = injector.getProvider(WebsocketProvider)
  }

  getProjectPaths(cwd?: string) {
    let glob_result = []
    let project_path = cwd ? cwd : process.cwd()
    let root_path = path.parse(cwd ? cwd : process.cwd()).root

    let complete = false

    while (!complete && project_path !== path.normalize(root_path)) {
      glob_result = globSync(`${BASE_SEARCH_PATH}`, {
        cwd: project_path,
        absolute: true,
        matchBase: true
      })

      if (glob_result.length > 0) {
        complete = true
      } else {
        project_path = path.normalize(path.resolve(project_path, '..'))
      }
    }

    let paths: ProjectPaths | null = null

    if (project_path !== root_path) {
      paths = {
        project_path: path.normalize(project_path),
        server_root_path: path.normalize(path.resolve(project_path, SERVER_ROOT_PATH)),
        server_java_path: path.normalize(path.resolve(project_path, SERVER_JAVA_PATH)),
        server_resources_path: path.normalize(path.resolve(project_path, SERVER_RESOURCES_PATH)),
        web_root_path: path.normalize(path.resolve(project_path, WEB_ROOT_PATH)),
        web_pages_path: path.normalize(path.resolve(project_path, WEB_PAGES_PATH)),
      }

      function get_current_package(dirname: string) {
        if (paths != null && path.normalize(dirname).startsWith(paths?.server_java_path!)) {
          return path
            .normalize(dirname)
            .replace(path.normalize(paths.server_java_path), '')
            .split(path.sep)
            .filter((value) => value.trim() !== '')
            .join('.')
        }
      }

      paths.get_current_package = get_current_package
      paths.server_current_package = get_current_package(cwd ? cwd : process.cwd())
    }
    return paths
  }

  getAppdata(cwd?: string): Promise<ProjectAppData | undefined> {
    const paths = this.getProjectPaths(cwd)

    if (paths == null) {
      // logger('error', `Vous n'êtes pas dans un projet kraken.`)
      return
    }

    try {
      const file_path = path.join(paths.server_root_path, "target", "appdata.json")
      if (!fs.existsSync(file_path)) {
        return undefined
      }
      const file_content = fs.readFileSync(file_path)
      return JSON.parse(file_content.toString())
    } catch (err) {
      console.log(err);
      // logger('error', 'Erreur survenue lors de la lecture du fichier')
    }
  }

  async refreshAppData(cwd?: string) {
    const paths = this.getProjectPaths(cwd)

    if (paths == null) {
      // logger('error', `Vous n'êtes pas dans un projet kraken.`)
      return
    }

    const res = await shell.exec("mvn clean spring-boot:run -q -D\"spring-boot.run.arguments\"=\"--socle.core.appdata.close-on-startup=true --server.port=55555 --spring.main.log-startup-info=false --logging.level.ROOT=off\"", {cwd: paths?.server_root_path, silent: true})
    // logger('success', 'Fichier appdata.json généré dans le dossier ' + path.join(paths?.server_root_path!, "target"))

    if (res.code > 0) {
      // logger('error', 'Erreur survenue lors du lancement du projet et de la génération du fichier')
      throw new Error('Erreur survenue lors du lancement du projet et de la génération du fichier')
    }

    return this.getAppdata(paths?.server_root_path)
  }

  async ping(cwd: string) {
    const appdata = await this.getAppdata(cwd);

    try {
      await axios.get(appdata?.api_host + '/socle/devtools/ping', {headers: {'Authorization_devtools': appdata?.security_key}})
      return true
    } catch (err) {
      return false
    }
  }

  async getLogs(cwd: string) {
    const appdata = await this.getAppdata(cwd);

    try {
      const res = await axios.get(appdata?.api_host + '/socle/devtools/logs', {headers: {'Authorization_devtools': appdata?.security_key}})
      return res.data.data
    } catch (err) {
      return false
    }
  }

  async runApplication(cwd: string, profile = 'default', check = false) {
    this.appProvider?.clearLogs()

    if (!check || (shell.which('mvn') != null && shell.which('npm') != null)) {
      const paths = this.getProjectPaths(cwd)

      const mvn = spawn(`mvn clean spring-boot:run -q -D"spring-boot.run.arguments"="--spring.output.ansi.enabled=always --spring.profiles.active=${profile}"`, { cwd: paths?.server_root_path, shell: true })
      const npm = spawn('npm run dev', { cwd: paths?.web_root_path, shell: true })

      mvn.stdout.setEncoding('latin1')
      npm.stdout.setEncoding('latin1')

      this.appProvider?.addThread('mvn', mvn)
      this.appProvider?.addThread('npm', npm)

      if (this.websocketProvider != null) {
        const convert = new Convert({ fg: '#000' })
        mvn.stdout.on('data', data => {
          this.appProvider?.addLog(convert.toHtml(data.toString()))
        })

        npm.stdout.on('data', data => {
          this.appProvider?.addLog(convert.toHtml(data.toString()))
        })
      }
    }
  }

  async stopApplication(cwd: string) {
    try {
      await terminate(this.appProvider?.threads.get('mvn').pid)
      await terminate(this.appProvider?.threads.get('npm').pid)
      return true
    } catch (err) {
      return false
    }
  }

}
