import {Argv as YargsOptions} from "yargs";
import {get_project_paths} from "../../utils/folders.js";
import {logger} from "../../utils/logger.js";
import {convertJavaFilenameToClassFullName, convertJavaFilenameToClassSimpleName, get_file_by_basename} from "../../utils/template.js";
import pluralize from "pluralize";
import stringcase, {snakecase} from "stringcase";
import inquirer from "inquirer";
import {generate} from "../../services/template.js";
import {ProjectPath} from "../../../types/index.js";
import kebabCase from "lodash/kebabCase.js";

export interface GenerateReferentielData {
  template: string
  entity_name: string
  url: string
  id_type: string
  dao_name: string
  fields: any[]
  with_page: boolean
  page_name?: string
  page_title?: string
}

export default {
  command: 'ref [-e]',
  description: `Permet de créer les classes de type referentiel à l'emplacement actuel`,
  builder(yargs: YargsOptions) {
    yargs.option('entity', {alias: 'e', describe: `Classe de l'entité à utiliser`, type: 'string'})
  },
  async handler(options: any) {
    const paths = get_project_paths()

    if (paths == null) {
      logger('error', `Vous n'êtes pas dans un projet kraken`)
      return;
    }

    let entity_simple_name = ''

    const answers = await inquirer.prompt([
      {
        type: 'list', name: 'template', message: 'Type de réferentiel ?', choices: [
          {value: 'simple', name: 'Consultation'},
          {value: 'crud', name: 'Consultation/Modification'},
        ]
      },
      {
        type: 'fuzzypath', name: 'entity_name', rootPath: paths.server_java_path, itemType: 'file', message: 'Classe de l\'entité ?', excludeFilter: (nodepath: string) => !nodepath.endsWith('.java'), default: () => get_file_by_basename(`${options['entity']}.java`, paths.server_java_path)
      },
      {
        type: 'fuzzypath', name: 'dao_name', rootPath: paths.server_java_path, itemType: 'file', message: 'Classe de la DAO ?', excludeFilter: (nodepath: string) => !nodepath.endsWith('.java'), default: (answers: any) => {
          entity_simple_name = convertJavaFilenameToClassSimpleName(answers['entity_name'])
          return get_file_by_basename(`${entity_simple_name}Dao.java`, paths.server_java_path)
        }
      },
      {
        type: 'input', name: 'url', message: 'Url du webservice ?', default: () => {
          return `/api/referentiels/${pluralize(snakecase(entity_simple_name))}`
        }
      },
      {type: 'input', name: 'id_type', message: 'Type de la propriété @Id', default: 'Long'}
    ])

    const data: GenerateReferentielData = {
      template: answers['template'],
      entity_name: answers['entity_name'],
      dao_name: answers['dao_name'],
      url: answers['url'],
      id_type: answers['id_type'],
      fields: [],
      with_page: false
    }

    await generateReferentiel({data}, paths)
  }
}

export async function generateReferentiel(options: { cwd?: string, data: GenerateReferentielData }, paths?: ProjectPath | null) {
  const {cwd, data} = options

  if (paths == null) {
    paths = get_project_paths(cwd)
  }

  const entity_full_name = convertJavaFilenameToClassFullName(data.entity_name, paths?.server_java_path)
  const dao_name = convertJavaFilenameToClassSimpleName(data.dao_name)
  const dao_full_name = convertJavaFilenameToClassFullName(data.dao_name, paths?.server_java_path)

  await generate({
    cwd,
    templatePath: `referentiel/${data.template}`,
    targetPath: '.',
    add_to_git: true,
    data: {
      ...data,
      entity_name: convertJavaFilenameToClassSimpleName(data.entity_name),
      entity_full_name,
      dao_name,
      dao_full_name,
      package_name: paths?.server_current_package
    }
  }, () => {
    logger('success', `Classes de référentiel créées dans le package ${paths?.server_current_package}`)
  })

  if (data.with_page) {
    await generate({
      cwd,
      templatePath: `referentiel/page`,
      targetPath: paths?.web_pages_path!,
      add_to_git: true,
      data: {
        ...data,
        ref_state_name: `ref_${stringcase.snakecase(kebabCase(data.url))}`,
        fields: data.fields.map(it => ({...it, label: stringcase.sentencecase(it.name)}))
      }
    }, () => {
      logger('success', `Génération de la page ${data.page_name} dans le dossier ${paths?.web_pages_path}`)
    })
  }
}
