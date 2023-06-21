import {Router} from 'express'
// @ts-ignore
import selectFolder from 'win-select-folder'
import {Path} from 'path-scurry';
import path, {join, sep} from "path";
import {body} from "express-validator";
import {get_project_paths} from "../../utils/folders.js";
import {globSync} from "glob";
import sortBy from "lodash/sortBy.js";

const router = Router()

router.get('/folder', async (req, res) => {
  const folder = await selectFolder({
    root: 'MyComputer',
    description: 'Selectionnez un dossier où sera créé le projet Kraken par la suite'
  })
  return res.json(folder === 'cancelled' ? null : folder + path.sep)
})

router.get('/packages', async (req, res) => {
  const path = req.query.path as string
  const projectPaths = get_project_paths(path);
  const folders = globSync('**', {cwd: projectPaths?.server_java_path, mark: false, ignore: {ignored: p => !p.isDirectory()}})
  return res.json(folders.map(f => ({folder: f.replaceAll(sep, '.'), fullpath: join(projectPaths?.server_java_path!, f)})).filter(f => f.folder !== '.'))
})

router.put('/cwd', body('path').notEmpty({ignore_whitespace: true}), async (req, res) => {
  const cwd = req.body.path
  process.chdir(cwd)
  return res.status(200).send()
})

router.get('/files', async (req, res) => {
  const query = req.query

  const globIgnoreFn = (p: Path) => !p.isDirectory()

  // TODO : A améliorer en utilisant la liste de dossier en mode flat

  const getData = (result: string[]): any => {
    return sortBy(result).filter(f => f !== '.').map(f => {
      return {
        label: path.basename(f),
        dirname: path.dirname(f),
        extension: path.extname(f),
        selectable: true,
        path: f,
        children: getData(globSync('*', {cwd: f, absolute: true, ignore: {ignored: globIgnoreFn}}))
      }
    })
  }

  const result = globSync('*', {cwd: <string>query?.path, absolute: true, ignore: {ignored: globIgnoreFn}})

  const tree = getData(result)

  const javaFiles = globSync('**/*.java', {cwd: <string>query?.path, absolute: true})

  tree[0].root = true
  tree[0].rootDir = path.dirname(javaFiles[0])

  return res.json(tree)
})

export default router
