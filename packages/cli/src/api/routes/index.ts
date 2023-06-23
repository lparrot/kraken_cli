import {Router} from 'express'
import {validationResult} from "express-validator";
import {get_project_paths} from "../../utils/folders.js";
import {resolve, sep} from "path";
import {homedir, tmpdir} from "os";
import {get_versions} from "../../commands/init.js";

const router = Router()

router.get('/paths', (req, res) => {
  const result = validationResult(req)

  if (result.isEmpty()) {
    const path = req.query.path as string
    const project_paths = get_project_paths(path);

    if (path != null && project_paths == null) {
      return res.status(400).json({message: `Le dossier choisi n'est pas un projet Kraken`})
    }

    return res.status(200).json({
      ...project_paths,
    })
  }

  return res.status(400).json({errors: result.array()})
})

router.get('/infos', async (req, res) => {
  const versions = await get_versions()
  return res.json({
    ...versions,
    separator: sep,
    home_dir: homedir(),
    root_dir: resolve('/'),
    tmp_dir: tmpdir()
  })
})

export default router
