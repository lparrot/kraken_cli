import {Router} from 'express'
import {get_project_paths} from "../../../utils/folders.js";

const meta = {
  url: '/api',
  router: Router()
}

meta.router.get('/paths', (req, res) => {
  return res.status(200).json({...get_project_paths()})
})

export default meta
