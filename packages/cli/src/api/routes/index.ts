import {Router} from 'express'
import {validationResult} from "express-validator";
import {get_project_paths} from "../../utils/folders.js";

const router = Router()

router.get('/paths', (req, res) => {
  const result = validationResult(req)

  if (result.isEmpty()) {
    const path = req.query.path as string
    const project_paths = get_project_paths(path);

    if (path != null && project_paths == null) {
      return res.status(400).json({message: `Le dossier choisi n'est pas un projet Kraken`})
    }

    return res.status(200).json({...project_paths})
  }

  return res.status(400).json({errors: result.array()})
})

export default router
