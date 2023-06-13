import shell from "shelljs";
import {generate} from "../services/template.js";
import {TemplateInitOptions} from "../../types/index.js";
import {dotcase, pascalcase, pathcase, snakecase} from "stringcase";
import path from "path";
import {logger} from "../utils/logger.js";

export default {
  command: 'init',
  description: 'Initialise un nouveau projet Kraken',
  async handler() {
    const versions = await get_versions()

  }
}

export async function get_versions() {
  const is_node_installed = shell.which('node') != null
  const is_mvn_installed = shell.which('mvn') != null
  const last_npm_version = shell.exec('npm view @socle/core version', {silent: true}).replace(/[\n\r]+/g, '')
  const node_version = shell.exec('node -v', {silent: true}).stdout.replace(/[\n\r]+/g, '')

  return {
    is_node_installed,
    is_mvn_installed,
    last_npm_version,
    node_version
  }
}

export async function initializeProject(templateType: string, data: TemplateInitOptions) {
  const short_name = snakecase(data.name)
  const group_id = dotcase(data.group_id)
  const classname = pascalcase(short_name)
  const cwd = data.cwd == null ? process.cwd() : data.cwd

  console.log({
    ...data,
    short_name,
    group_id,
    classname,
    version: '1.0.0',
    package: `${group_id}.${short_name}`,
    package_folder: `${pathcase(group_id)}/${short_name}`
  })

  await generate({
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
    },
    ({targetPath}) => {
      let result

      if (data.install_librairies) {
        logger('info', '... Installation des dépendances Java')

        result = shell.exec('mvn dependency:resolve', {silent: true, cwd: path.resolve(cwd, targetPath, 'server')})

        if (result.code !== 0) {
          return logger('error', `Erreur lors de l'installation des dépendances Java`)
        }

        logger('info', '... Installation des dépendances Node')

        result = shell.exec('npm install', {silent: true, cwd: path.resolve(cwd, targetPath, 'web')})

        if (result.code !== 0) {
          return logger('error', `Erreur lors de l'installation des dépendances node`)
        }
      }


      if (data.create_git_repo) {
        let gitErrorMessage = `Erreur lors de l'initialisation du dépôt Git`

        logger('info', `... Initialisation d'un dépôt Git`)

        result = shell.exec('git init', {silent: true, cwd: path.resolve(cwd, targetPath)})

        if (result.code !== 0) {
          return logger('error', gitErrorMessage)
        }

        result = shell.exec('git add -A', {silent: true, cwd: path.resolve(cwd, targetPath)})

        if (result.code !== 0) {
          return logger('error', gitErrorMessage)
        }

        result = shell.exec('git commit -m "commit initial"', {silent: true, cwd: path.resolve(cwd, targetPath)})

        if (result.code !== 0) {
          return logger('error', gitErrorMessage)
        }
      }

      logger('success', `Projet créé avec succès dans le dossier ${path.resolve(cwd, targetPath)}`)
    }
  )
}
