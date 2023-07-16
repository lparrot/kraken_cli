import {Router} from 'express'
import shell from "shelljs";
import {get_project_paths} from "../../utils/folders.js";
import {runApplication} from "../../services/shell_commands.js";

const router = Router()

router.get('/open_current_project', (req, res) => {
  const path = req.query.path as string
  const {project_path} = get_project_paths(path)!
  shell.exec(`start ${project_path}`)
  return res.status(200).send()
})

router.get('/open_in_idea', (req, res) => {
  const path = req.query.path as string
  const {project_path} = get_project_paths(path)!
  shell.exec(`idea ${project_path}`)
  return res.status(200).send()
})

router.get('/run/java', async (req, res) => {
  const cwd = req.query.cwd as string
  await runApplication(cwd)
  return res.status(200).send()
})

export default router
