import {Argv as YargsOptions} from 'yargs'
import {get_project_paths} from "../../utils/folders.js";
import {logger} from "../../utils/logger.js";
import path from "path";
import inquirer from "inquirer";
import {isBlank} from "../../utils/string.js";
import {generate} from "../../services/template.js";

export default {
  command: 'store [-n]',
  description: 'Génération d\'un store vuex',
  builder(yargs: YargsOptions) {
    yargs.option('name', {alias: 'n', describe: `Nom du fichier`, type: 'string'})
  },
  async handler(options: any) {
    const paths = await get_project_paths()

    if (paths == null) {
      logger('error', `Vous n'êtes pas dans un projet kraken`)
      return;
    }

    const answers = await inquirer.prompt([
      {
        type: 'input', name: 'name', message: 'Nom du fichier du store (sans extension) ?', when(answers) {
          if (isBlank(options['name'])) {
            return true
          }
          answers['name'] = options['name']
          return false
        }
      },
    ])

    const data = {
      filename: answers['name'],
    }

    await generateStore(options, paths)
  }
}

export async function generateStore(options: { cwd?: string, data: { filename: string } }, paths?: any) {
  const {cwd, data} = options

  if (paths == null) {
    paths = get_project_paths(cwd)
  }

  await generate({
      cwd,
      data,
      templatePath: 'store',
      targetPath: path.join(paths.web_root_path, 'store'),
    },
    async () => {
      logger('success', `Store ${options.data.filename} généré avec succès.`)
    }
  )
}
