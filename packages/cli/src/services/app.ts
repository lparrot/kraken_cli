import fs from "fs";
import path, {dirname} from "path";
import {isBlank} from "../utils/string.js";
import {get_project_paths} from "../utils/folders.js";
import {render} from "ejs";
import {fileURLToPath} from "url";
import shell from "shelljs";
import {logger} from "../utils/logger.js";

export const SKIP_FILES = ['node_modules', '.template.json']
export const SKIP_RENDER_EXTENSIONS = ['.png', '.gif', '.jpg', '.jpeg']

export function renameFileOrDirectoryByTemplateVariable(fileName: string, data: any) {
  return fileName.replace(/__\[(.*?)\]__/g, function (a, b) {
    return isBlank(b) || isBlank(data[b]) ? '' : data[b]
  })
}

export function createProject(projectPath: string) {
  if (fs.existsSync(projectPath)) {
    return false;
  }
  fs.mkdirSync(projectPath, {recursive: true});

  return true;
}

export function createDirectoryContents(templatePath: string, targetPath: string, data: any) {
  // read all files/folders (1 level) from template folder
  const filesToCreate = fs.readdirSync(templatePath);
  const paths = get_project_paths(targetPath)

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
      contents = render(contents, {...data, ...paths, directory_path: targetPath}, {rmWhitespace: true, compileDebug: true, views: [path.join(dirname(fileURLToPath(import.meta.url)), '..', 'templates', 'partials')]})

      // write file to destination folder
      const writePath = path.join(targetPath, file);
      fs.writeFileSync(writePath, contents, 'binary');
      renameFileOrDirectoryByTemplateVariable(writePath, data)
    } else if (stats.isDirectory()) {
      // create folder in destination folder
      fs.mkdirSync(path.join(targetPath, file));
      // copy files/folder inside current folder recursively

      createDirectoryContents(path.join(templatePath, file), path.join(targetPath, file), data);

      renameFileOrDirectoryByTemplateVariable(path.join(targetPath, file), data)
    }
  });
}

export async function refreshAppData(cwd?: string) {
  const paths = get_project_paths(cwd)

  if (paths == null) {
    logger('error', `Vous n'êtes pas dans un projet kraken.`)
    return
  }

  const res = await shell.exec("mvn clean spring-boot:run -q -D\"spring-boot.run.arguments\"=\"--app.generate-appdata=true --server.port=55555 --spring.main.log-startup-info=false --logging.level.ROOT=off\"", {cwd: paths?.server_root_path, silent: true})
  logger('success', 'Fichier appdata.json généré dans le dossier ' + path.join(paths?.server_root_path!, "target"))

  if (res.code > 0) {
    logger('error', 'Erreur survenue lors du lancement du projet et de la génération du fichier')
    throw new Error('Erreur survenue lors du lancement du projet et de la génération du fichier')
  }

  return getAppdata(paths?.server_root_path)
}

export async function getAppdata(cwd?: string) {
  const paths = get_project_paths(cwd)

  if (paths == null) {
    logger('error', `Vous n'êtes pas dans un projet kraken.`)
    return
  }

  try {
    const file_path = path.join(paths.server_root_path, "target", "appdata.json")
    if (!fs.existsSync(file_path)) {
      return null
    }
    const file_content = fs.readFileSync(file_path)
    return JSON.parse(file_content.toString())
  } catch (err) {
    console.log(err);
    logger('error', 'Erreur survenue lors de la lecture du fichier')
  }
}
