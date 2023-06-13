import {Router} from 'express'
import {get_project_paths} from "../../../utils/folders.js";
import {generatePage} from "../../../commands/generate/page.js";
import {get_versions, initializeProject} from "../../../commands/init.js";
import {TemplateInitOptions} from "../../../../types/index.js";
import shell from "shelljs";
import path from "path";
import {snakecase} from "stringcase";

const meta = {
  url: '/api/generate',
  router: Router()
}

meta.router.post('/page', async (req, res) => {
  let project_paths = get_project_paths();
  await generatePage({targetPath: project_paths?.web_pages_path!, data: req.body})
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
    shell.exec(`idea ${project_path}`)
  } else {
    shell.exec(`start ${project_path}`)
  }

  return res.json()
})

export default meta
