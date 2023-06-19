import {Argv as YargsOptions} from 'yargs'
import {get_project_paths} from "../../utils/folders.js";
import {logger} from "../../utils/logger.js";
import inquirer from "inquirer";
import {isNotBlank} from "../../utils/string.js";
import * as stringcase from "stringcase";
import {snakecase} from "stringcase";
import {generate} from "../../services/template.js";
import dayjs from "dayjs";
import path from "path";

export default {
  command: 'timer',
  description: 'Crée une classe de timer et le script SQL associé',
  builder(yargs: YargsOptions) {
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

    if (paths.server_current_package == null) {
      logger('error', `Vous devez être dans un package du projet 'server' pour créer le timer`)
      return;
    }

    const answers = await inquirer.prompt([
      {type: 'input', name: 'timer_name', message: 'Nom du timer ?', transformer: (input) => snakecase(input), validate: (input) => isNotBlank(input)},
      {type: 'input', name: 'timer_description', message: 'Description du timer ?', validate: (input) => isNotBlank(input)},
    ])

    const data = {
      name: answers['timer_name'],
      description: answers['timer_description'],
    }

    await generateTimer({
      data
    })
  }
}

export async function generateTimer(options: { cwd?: string, data: { name: string, description: string } }, paths?: any) {
  const {cwd, data} = options

  if (paths == null) {
    paths = get_project_paths(cwd)
  }

  const timer_name = snakecase(data.name)
  const timer_description = data.description
  const timer_class = `${timer_name.includes('timer') ? '' : 'Timer'}${stringcase.pascalcase(timer_name)}`
  const flyway_datetime = dayjs().format('YYYYMMDDHHmm')

  await generate({
      cwd,
      templatePath: 'timer/java',
      targetPath: '.',
      data: {
        timer_name,
        timer_class,
        timer_package: paths.server_current_package
      }
    }
  )

  await generate({
    templatePath: 'timer/sql',
    targetPath: path.join(paths.server_resources_path, 'db', 'migration'),
    cwd: paths.server_java_path,
    data: {
      timer_name,
      timer_description,
      flyway_datetime,
      timer_class,
      timer_package: paths.server_current_package
    }
  })
}
