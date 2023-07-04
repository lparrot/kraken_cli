import {Router} from 'express'
// @ts-ignore
import selectFolder from 'win-select-folder'
import {Path} from 'path-scurry';
import {basename, dirname, extname, join, normalize, resolve, sep} from "path";
import {body} from "express-validator";
import {get_project_paths} from "../../utils/folders.js";
import {globSync} from "glob";
import sortBy from "lodash/sortBy.js";
import {isNotBlank} from "../../utils/string.js";
import {mkdirSync, readdirSync} from "fs";

const router = Router()

router.get('/folder', async (req, res) => {
  const folder = await selectFolder({
    root: 'MyComputer',
    description: 'Selectionnez un dossier où sera créé le projet Kraken par la suite'
  })
  return res.json(folder === 'cancelled' ? null : folder + sep)
})

router.get('/packages', async (req, res) => {
  const path = req.query.path as string
  const projectPaths = get_project_paths(path);
  const folders = globSync('**', {cwd: projectPaths?.server_java_path, mark: false, ignore: {ignored: p => !p.isDirectory()}})
  return res.json(folders.map(f => ({folder: f.replaceAll(sep, '.'), fullpath: join(projectPaths?.server_java_path!, f)})).filter(f => f.folder !== '.'))
})

router.get('/files', async (req, res) => {
  const query = req.query


  // TODO : A améliorer en utilisant la liste de dossier en mode flat

  const getData = (result: string[]): any => {
    return sortBy(result).filter(f => f !== '.').map(f => {
      return {
        label: basename(f),
        dirname: dirname(f),
        extension: extname(f),
        selectable: true,
        path: f,
        children: getData(globSync('*', {cwd: f, absolute: true, ignore: {ignored: globIgnoreFn}}))
      }
    })
  }

  const result = globSync('*', {cwd: <string>query?.path, absolute: true, ignore: {ignored: globIgnoreFn}})

  const tree = getData(result)

  tree[0].root = true

  return res.json(tree)
})

/**
 * Liste de tous les fichiers en récursif dans le dossier
 * [path]: {string} chemin du dossier racine a rechercher
 */
router.get('/files/java', (req, res) => {
  const query = req.query
  const path = query.path as string

  return res.json(globSync('**/*.java', {cwd: path, absolute: true}))
})

router.get('/path/info', (req, res) => {
  const query = req.query as unknown as { path: string, root: string | null }

  let query_path = normalize(query.path)
  let query_root = normalize(query.root!)

  function getInfo(dirpath: string) {
    return {
      label: basename(dirpath),
      path: dirpath
    }
  }

  function getBreadcrumb() {
    let bread_path = query_path

    if (isNotBlank(query_root)) {
      bread_path = query_path.replaceAll(query_root!, '')
    } else {
      query_root = ''
    }

    const splitted_bread = bread_path.split(sep)
    const bread_items = []
    let bread_item_path = query_root

    for (let i = 0; i < splitted_bread.length; i++) {
      if (isNotBlank(splitted_bread[i])) {
        bread_item_path = join(bread_item_path!, splitted_bread[i])
        bread_items.push({
          path: bread_item_path + sep,
          label: splitted_bread[i]
        })
      }
    }
    return bread_items
  }

  const result = {
    ...getInfo(query_path),
    parent: query_path === resolve('/') ? undefined : dirname(query_path),
    breadcrumb: getBreadcrumb(),
    children: sortBy(globSync('*', {cwd: query_path, absolute: true, ignore: {ignored: globIgnoreFn}})).map(f => getInfo(f))
  }

  return res.json(result)
})

/**
 * Dossier du premier fichier java trouvé
 */
router.get('/rootdir', (req, res) => {
  const query = req.query

  const path = query.path as string

  const javaFiles = globSync('**/*.java', {cwd: path, absolute: true})

  return res.json({path: dirname(javaFiles[0])})
})

router.put('/cwd', body('path').notEmpty({ignore_whitespace: true}), async (req, res) => {
  const cwd = req.body.path
  process.chdir(cwd)
  return res.status(200).send()
})

router.post('/dir', (req, res) => {
  const body = req.body as unknown as { path: string, name: string }

  const dir = readdirSync(body.path)

  if (dir.indexOf(body.name) > -1) {
    return res.status(400).json({message: 'Dossier deja existant'})
  }

  mkdirSync(join(body.path, body.name))

  return res.json({})
})

const globIgnoreFn = (p: Path) => !p.isDirectory()

export default router
