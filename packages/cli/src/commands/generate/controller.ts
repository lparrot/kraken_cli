import {Argv as YargsOptions} from "yargs";
import {get_project_paths} from "../../utils/folders.js";
import {logger} from "../../utils/logger.js";
import inquirer from "inquirer";
import {isBlank} from "../../utils/string.js";
import {pascalcase, pathcase} from "stringcase";
import {generate} from "../../services/template.js";

export default {
  command: 'ctrl [-n]',
  description: `Génération d'un controlleur Rest`,
  builder(yargs: YargsOptions) {
    yargs.option('name', {alias: 'n', describe: `Nom du fichier`, type: 'string'})
    yargs.option('url', {alias: 'u', describe: `Url du webservice`, type: 'string'})
  },
  async handler(options: any) {
    const paths = get_project_paths()

    if (paths == null) {
      logger('error', `Vous n'êtes pas dans un projet kraken`)
      return;
    }

    const answers = await inquirer.prompt([
      {
        type: 'input', name: 'name', message: 'Nom du controller (sans suffixe) ?', when(answers) {
          if (isBlank(options['name'])) {
            return true
          }
          answers['name'] = options['name']
          return false
        }
      },
      {
        type: 'input', name: 'url', message: 'Url du webservice ?', when(answers) {
          if (isBlank(options['url'])) {
            return true
          }
          answers['url'] = options['url']
          return false
        }
      },
    ])

    const data = {
      name: pascalcase(answers['name']),
      url: pathcase(answers['url']),
    }

    await generateControlleur({data})
  }
}

export async function generateControlleur(options: { cwd?: string, data: { name: string, url: string } }) {
  const {cwd, data} = options

  data.name = pascalcase(data.name)
  data.url = pathcase(data.url)

  await generate({
      cwd,
      data,
      templatePath: 'ctrl',
      targetPath: '.',
    },
    () => {
      logger('success', `Controlleur ${data.name} généré avec succès.`)
    })
}
