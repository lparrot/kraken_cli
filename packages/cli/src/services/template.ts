import path, {dirname} from "path";
import {removeAllAccents} from "../utils/string.js";
import {createDirectoryContents, createProject, renameFileOrDirectoryByTemplateVariable} from "./app.js";
import {logger} from "../utils/logger.js";
import {globSync} from 'glob'
import fs_extra from "fs-extra";
import {fileURLToPath} from "url";
import {TemplateGeneratorOptions} from "../../types/index.js";
import {gitAdd} from "./shell_commands.js";

export async function generate(options: TemplateGeneratorOptions, postProcess?: (options: TemplateGeneratorOptions) => void) {
  const templatePath = path.join(dirname(fileURLToPath(import.meta.url)), '..', 'templates', options.templatePath)

  const targetPath = options.targetPath
  const targetPathAbsolute = path.resolve(options.cwd == null ? process.cwd() : options.cwd, targetPath)

  Object.keys(options.data).forEach(key => {
    options.data[key] = removeAllAccents(options.data[key])
  })

  // Création du dossier, erreur si dossier déjà existant
  if (!createProject(targetPathAbsolute)) {
    if (options.errorIfFolderAlreadyExists) {
      logger('error', `Dossier ${targetPathAbsolute} déjà existant. Supprimez l'ancien dossier ou modifiez le nom.`)
      return;
    }
  }

  logger('info', `Copie des fichiers du template ${options.templatePath} vers le dossier ${targetPathAbsolute}`)

  // Copie du contenu du template dans le dossier du projet
  createDirectoryContents(templatePath, targetPathAbsolute, options.data)

  const foldersToRename = globSync('**/*__[*/', {
    cwd: targetPathAbsolute,
    absolute: true
  })

  foldersToRename.forEach(folder => {
    const newFolderName = renameFileOrDirectoryByTemplateVariable(folder, options.data)

    fs_extra.mkdirsSync(path.resolve(newFolderName, '..'));
    fs_extra.moveSync(folder, newFolderName)

    foldersToRename.filter(f => f.startsWith(folder)).map(f => f.replace(new RegExp(folder, 'g'), newFolderName))
  })

  const filesToRename = globSync('**/*__[*', {
    cwd: targetPathAbsolute,
    absolute: true,
    dot: true
  })

  filesToRename.forEach(file => {
    const newFileName = renameFileOrDirectoryByTemplateVariable(file, options.data)

    fs_extra.moveSync(file, newFileName)
  })

  if (options.add_to_git) {
    await gitAdd(targetPathAbsolute, true)
  }

  if (postProcess != null) {
    await postProcess(options)
  }
}
