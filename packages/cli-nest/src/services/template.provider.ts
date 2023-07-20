import {Global, Inject, Injectable} from '@nestjs/common';
import * as path from "path";
import {dirname} from "path";
import {globSync} from "glob";
import {ProjectProvider} from "./project.provider";
import * as fs from "fs-extra";
import {TemplateGeneratorOptions} from "@kraken/types";
import {isBlank, removeAllAccents} from "../utils/string.utils";
import {render} from "ejs";
import {ShellCommandsProvider} from "./shell-commands.provider";

const SKIP_FILES = ['node_modules', '.template.json']

@Global()
@Injectable()
export class TemplateProvider {

  @Inject(ProjectProvider) projectProvider: ProjectProvider;
  @Inject(ShellCommandsProvider) shellCommandProvider: ShellCommandsProvider;

  convertJavaFilenameToClassFullName(file: string, cwd?: string) {
    if (cwd == null) {
      const paths = this.projectProvider.getProjectPaths(cwd)

      if (paths == null) {
        // logger('error', `Vous n'êtes pas dans un projet kraken`)
        return;
      }

      cwd = paths.server_java_path
    }
    return path.normalize(file).replaceAll(path.normalize(cwd) + path.sep, '').replaceAll(path.sep, '.').replaceAll('.java', '')
  }

  convertJavaFilenameToClassSimpleName(file: string) {
    return path.basename(file).replaceAll('.java', '')
  }

  getFileByBasename(basename: string, cwd: string) {
    if (cwd == null) {
      const paths = this.projectProvider.getProjectPaths()

      if (paths == null) {
        // logger('error', `Vous n'êtes pas dans un projet kraken`)
        return null;
      }

      cwd = paths.project_path
    }

    if (basename != null && basename.trim() !== '') {
      const result = globSync(basename, {cwd, absolute: true, matchBase: true, nocase: true})
      if (result.length) {
        return path.normalize(result[0])
      }
    }
    return null
  }

  async generate(options: TemplateGeneratorOptions, postProcess?: (options: TemplateGeneratorOptions) => void) {
    const templatePath = path.join(__dirname, '..', '..', 'templates', options.templatePath)

    const targetPath = options.targetPath
    const targetPathAbsolute = path.resolve(options.cwd == null ? process.cwd() : options.cwd, targetPath)

    Object.keys(options.data).forEach(key => {
      options.data[key] = removeAllAccents(options.data[key])
    })

    // Création du dossier, erreur si dossier déjà existant
    if (!this.createProject(targetPathAbsolute)) {
      if (options.errorIfFolderAlreadyExists) {
        // logger('error', `Dossier ${targetPathAbsolute} déjà existant. Supprimez l'ancien dossier ou modifiez le nom.`)
        return;
      }
    }

    // logger('info', `Copie des fichiers du template ${options.templatePath} vers le dossier ${targetPathAbsolute}`)

    // Copie du contenu du template dans le dossier du projet
    this.createDirectoryContents(templatePath, targetPathAbsolute, options.data)

    const foldersToRename = globSync('**/*__[*/', {
      cwd: targetPathAbsolute,
      absolute: true
    })

    foldersToRename.forEach(folder => {
      const newFolderName = this.renameFileOrDirectoryByTemplateVariable(folder, options.data)

      fs.mkdirsSync(path.resolve(newFolderName, '..'));
      fs.moveSync(folder, newFolderName)

      foldersToRename.filter(f => f.startsWith(folder)).map(f => f.replace(new RegExp(folder, 'g'), newFolderName))
    })

    const filesToRename = globSync('**/*__[*', {
      cwd: targetPathAbsolute,
      absolute: true,
      dot: true
    })

    filesToRename.forEach(file => {
      const newFileName = this.renameFileOrDirectoryByTemplateVariable(file, options.data)

      fs.moveSync(file, newFileName)
    })

    if (options.add_to_git) {
      await this.shellCommandProvider.gitAdd(targetPathAbsolute, true)
    }

    if (postProcess != null) {
      await postProcess(options)
    }
  }

  createProject(projectPath: string) {
    if (fs.existsSync(projectPath)) {
      return false;
    }
    fs.mkdirSync(projectPath, {recursive: true});

    return true;
  }

  createDirectoryContents(templatePath: string, targetPath: string, data: any) {
    // read all files/folders (1 level) from template folder
    const filesToCreate = fs.readdirSync(templatePath);
    const paths = this.projectProvider.getProjectPaths(targetPath)

    // loop each file/folder
    filesToCreate.forEach(file => {
      const origFilePath = path.join(templatePath, file);

      // get stats about the current file
      const stats = fs.statSync(origFilePath);

      // skip files that should not be copied
      if (SKIP_FILES.indexOf(file) > -1) return;

      if (stats.isFile()) {
        // read file content and transform it using template engine
        let contents = fs.readFileSync(origFilePath, 'binary');

        // render template with ejs
        contents = render(contents, {...data, ...paths, directory_path: targetPath}, {views: [path.join(dirname(__dirname), '..', '..', 'templates', 'partials')]})

        // write file to destination folder
        const writePath = path.join(targetPath, file);
        fs.writeFileSync(writePath, contents, 'binary');
        this.renameFileOrDirectoryByTemplateVariable(writePath, data)
      } else if (stats.isDirectory()) {
        // create folder in destination folder
        fs.mkdirSync(path.join(targetPath, file));
        // copy files/folder inside current folder recursively

        this.createDirectoryContents(path.join(templatePath, file), path.join(targetPath, file), data);

        this.renameFileOrDirectoryByTemplateVariable(path.join(targetPath, file), data)
      }
    });
  }

  renameFileOrDirectoryByTemplateVariable(fileName: string, data: any) {
    return fileName.replace(/__\[(.*?)\]__/g, function (a, b) {
      return isBlank(b) || isBlank(data[b]) ? '' : data[b]
    })
  }
}
