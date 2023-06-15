import {Router} from 'express'
import shell from "shelljs";
import path from "path";
import {snakecase} from "stringcase";
import {get_project_paths} from "../../utils/folders.js";
import {generatePage} from "../../commands/generate/page.js";
import {get_versions, initializeProject} from "../../commands/init.js";
import {TemplateInitOptions} from "../../../types/index.js";
import {Project} from "../../db/index.js";

const meta = {
  url: '/api/generate',
  router: Router()
}

meta.router.post('/page', async (req, res) => {
  const {cwd, name, title} = req.body
  let project_paths = get_project_paths(cwd);
  await generatePage({
    cwd,
    targetPath: project_paths?.web_pages_path!,
    data: {
      name,
      title
    }
  })
  return res.status(200).json({success: true})
})

meta.router.get('/init/info', async (req, res) => {
  return res.json(await get_versions())
})

meta.router.post('/init', async (req, res) => {
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

export default meta
