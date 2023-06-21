import {Router} from 'express'
import shell from "shelljs";
import path from "path";
import {snakecase} from "stringcase";
import {get_versions, initializeProject} from "../../../commands/init.js";
import {TemplateInitOptions} from "../../../../types/index.js";
import {Project} from "../../../db/index.js";

const router = Router()

router.post('/', async (req, res) => {
  const body = req.body as TemplateInitOptions;
  await initializeProject('complete', body)

  const is_idea_installed = shell.which('idea') != null
  const project_path = path.join(req.body.cwd, snakecase(req.body.name))

  if (is_idea_installed) {
    shell.exec(`idea ${project_path}`, {async: true})
  } else {
    shell.exec(`start ${project_path}`, {async: true})
  }

  if (req.body.with_create) {
    return res.json(await Project.create({
      name: req.body.name,
      path: project_path
    }))
  }

  return res.json(body)
})

router.get('/info', async (req, res) => {
  return res.json(await get_versions())
})

export default router
