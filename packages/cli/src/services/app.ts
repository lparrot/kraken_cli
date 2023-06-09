import fs from "fs";
import path, {dirname} from "path";
import {isBlank} from "../utils/string.js";
import {get_project_paths} from "../utils/folders.js";
import {render} from "ejs";
import {fileURLToPath} from "url";

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
      contents = render(contents, {...data, ...paths, directory_path: targetPath}, {views: [path.join(dirname(fileURLToPath(import.meta.url)), '..', 'templates', 'partials')]})

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
