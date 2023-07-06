import shell from "shelljs";
import {generate} from "../services/template.js";
import {TemplateInitOptions} from "../../types/index.js";
import {dotcase, pascalcase, pathcase, snakecase} from "stringcase";
import path from "path";
import {logger} from "../utils/logger.js";
import {removeAllAccents} from "../utils/string.js";
import inquirer from "inquirer";
import {io} from "../api/index.js";
import {gitAdd, gitCommit, gitInit, installMavenLibraries, installNpmLibraries} from "../services/shell_commands.js";

let GIT_ERROR_MESSAGE = `Erreur lors de l'initialisation du dépôt Git`

export default {
  command: 'init',
  description: 'Initialise un nouveau projet Kraken',
  async handler() {
    const versions = await get_versions()

    if (!versions.is_node_installed) {
      return logger('error', `Node.js doit être installé et la variable d'environnement PATH correctement configurée.`)
    }

    if (!versions.is_mvn_installed) {
      return logger('error', `Maven doit être installé et la variable d'environnement PATH correctement configurée.`)
    }

    const current_dir = process.cwd()

    const answers = await inquirer.prompt([
      {
        type: 'list', name: 'template', message: 'Template à utiliser ?', choices: [
          {value: 'simple', name: 'Simple'},
          {value: 'complete', name: 'Complet'},
        ]
      },
      {type: 'input', name: 'name', message: 'Nom du projet ?', transformer: (value: string) => removeAllAccents(value)},
      {type: 'input', name: 'description', message: 'Description du projet ?', transformer: (value: string) => removeAllAccents(value)},
      {type: 'input', name: 'group_id', message: 'GroupID ?', default: 'fr.intradef.cdadr'},
      {
        type: 'input',
        name: 'artifact_id',
        message: 'ArtifactID ?',
        default: (answers: any) => removeAllAccents(snakecase(answers['name'])),
        transformer: (value: string) => removeAllAccents(snakecase(value))
      },
      {type: 'input', name: 'socle_version', message: 'Version de Kraken ?', default: versions.last_npm_version.replace(/[\n\r]+/g, '')},
      {type: 'input', name: 'node_version', message: 'Version de NodeJS ?', default: () => versions.node_version.replace(/[\n\r]+/g, '')},
      {type: 'input', name: 'db_host', message: `IP ou nom d'hôte de la BDD de dev ?`, default: '127.0.0.1', when: (answers: any) => answers['template'] === 'complete'},
      {type: 'input', name: 'db_port', message: `Port utilisé par la BDD de dev ?`, default: '3306', when: (answers: any) => answers['template'] === 'complete'},
      {type: 'input', name: 'db_name', message: `Nom de la base de données de dev ?`, default: (answers: any) => snakecase(answers['name']), transformer: (value: string) => snakecase(value), when: (answers) => answers['template'] === 'complete'},
      {type: 'input', name: 'db_user', message: `Utilisateur de la BDD de dev ?`, default: 'root', when: (answers: any) => answers['template'] === 'complete'},
      {type: 'input', name: 'db_password', message: `Mot de passe de la BDD de dev ?`, default: 'root', when: (answers: any) => answers['template'] === 'complete'},
      {type: 'confirm', name: 'install_librairies', message: `Télécharger et installer les librairies Maven et NPM ?`, default: true},
      {type: 'confirm', name: 'create_git_repo', message: `Initialiser un dépôt Git ?`, default: true},
    ])

    await initializeProject(answers['template'], {
      cwd: current_dir,
      name: answers['name'],
      description: answers['description'],
      group_id: answers['group_id'],
      artifact_id: answers['artifact_id'],
      socle_version: answers['socle_version'],
      node_version: answers['node_version'],
      db_host: answers['db_host'],
      db_port: answers['db_port'],
      db_name: answers['db_name'],
      db_user: answers['db_user'],
      db_password: answers['db_password'],
      install_librairies: answers['install_librairies'],
      create_git_repo: answers['create_git_repo'],
    })
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
  )

  try {
    if (data.install_librairies) {
      logger('info', 'Installation des dépendances Java')
      io.emit('loader:show', 'Installation des dépendances Java')

      try {
        await installMavenLibraries(path.resolve(cwd, data.artifact_id, 'server'))
      } catch (err) {
        return logger('error', `Erreur lors de l'installation des dépendances Java`)
      }

      logger('info', 'Installation des dépendances Node')
      io.emit('loader:show', 'Installation des dépendances Node')

      try {
        installNpmLibraries(path.resolve(cwd, data.artifact_id, 'web'))
      } catch (err) {
        return logger('error', `Erreur lors de l'installation des dépendances node`)
      }
    }

    const project_folder = path.resolve(cwd, data.artifact_id);
    if (data.create_git_repo) {
      logger('info', `Initialisation d'un dépôt Git`)
      io.emit('loader:show', `Initialisation d'un dépôt Git`)

      try {
        await gitInit(project_folder)
        await gitAdd(project_folder)
        await gitCommit(project_folder, "commit initial")
      } catch (err) {
        return logger('error', `Erreur lors de l'initialisation du dépôt Git`)
      }
    }

    logger('success', `Projet créé avec succès dans le dossier ${project_folder}`)
  } finally {
    io.emit('loader:hide')
  }
}
