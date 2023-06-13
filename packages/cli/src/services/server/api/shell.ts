import {Router} from 'express'
import {get_project_paths} from "../../../utils/folders.js";
import shell from "shelljs";

const meta = {
  url: '/api/shell',
  router: Router()
}

meta.router.get('/open_current_project', (req, res) => {
  const {project_path} = get_project_paths()!
  shell.exec(`start ${project_path}`)
  return res.status(200)
})

export default meta
