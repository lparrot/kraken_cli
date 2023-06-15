import {Router} from 'express'
import shell from "shelljs";
import {get_project_paths} from "../../utils/folders.js";

const meta = {
  url: '/api/shell',
  router: Router()
}

meta.router.get('/open_current_project', (req, res) => {
  const path = req.query.path as string
  const {project_path} = get_project_paths(path)!
  shell.exec(`start ${project_path}`)
  return res.status(200).send()
})

export default meta
