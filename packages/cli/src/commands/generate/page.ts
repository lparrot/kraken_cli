import {Argv as YargsOptions} from 'yargs'
import {get_project_paths} from "../../utils/folders.js";
import {logger} from "../../utils/logger.js";
import path from "path";
import inquirer from "inquirer";
import {isBlank} from "../../utils/string.js";
import {sentencecase} from "stringcase";
import {generate} from "../../services/template.js";

export default {
  command: 'page',
  description: 'Génération d\'une page .vue',
  builder(yargs: YargsOptions) {
    yargs.option('name', {alias: 'n', describe: `Nom du fichier`, type: 'string'})
    yargs.option('title', {alias: 't', describe: `Titre de la page`, type: 'string'})
    yargs.option('path', {
      alias: 'p',
      describe: `Dossier où se positionner pour executer la commande`,
      type: 'string'
    })
  },
  async handler(options: any) {
    const paths = await get_project_paths(options['path'])

    if (paths == null) {
      logger('error', `Vous n'êtes pas dans un projet kraken`)
      return;
    }

    const answers = await inquirer.prompt([
      {
        type: 'input', name: 'name', message: 'Nom du fichier de la page (sans extension) ?', when(answers) {
          if (isBlank(options['name'])) {
            return true
          }
          answers['name'] = options['name']
          return false
        }
      },
      {
        type: 'input', name: 'title', message: 'Titre de la page ?', default: (answers: any) => sentencecase(path.normalize(answers['name']).replaceAll(path.sep, ' ')), when(answers) {
          if (isBlank(options['title'])) {
            return true
          }
          answers['title'] = options['title']
          return false
        }
      },
    ])

    const data = {
      name: answers['name'],
      title: answers['title'],
    }

    await generatePage({
      data
    })
  }
}

export async function generatePage(options: { cwd?: string, data: { name: string, title: string } }, paths?: any) {
  const {cwd, data} = options

  if (paths == null) {
    paths = get_project_paths(cwd)
  }

  await generate({
      cwd,
      data,
      templatePath: 'page',
      targetPath: paths.web_pages_path,
    }, () => {
      logger('success', `Page ${options.data.name} générée avec succès.`)
    }
  )
}
