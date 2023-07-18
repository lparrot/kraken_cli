import {Router} from "express";
import {normalize} from "path";
import {Project} from "../../db/index.js";
// @ts-ignore
import cloc from "node-cloc";
import {ProjectAttributes} from "@kraken/types";
import {api_logs, api_ping, api_stopApplication} from "../../services/app.js";
import {runApplication} from "../../services/shell_commands.js";

const router = Router()

router.get('/', async (req, res) => {
  return res.json(await Project.findAll())
})

router.get('/:id', async (req, res) => {
  const id = req.params.id
  const project: ProjectAttributes = await Project.findByPk(id)
  return res.json(project)
})

router.post('/', async (req, res) => {
  const {name, path} = req.body

  const projects: ProjectAttributes[] = await Project.findAll({where: {path: normalize(path)}})

  if (projects.length > 0) {
    return res.status(400).json({message: 'Project déjà enregistré'})
  }

  await Project.create({name, path: normalize(path)})
  return res.json(await Project.findAll())
})

router.delete('/:id', async (req, res) => {
  await Project.destroy({
    where: {
      id: req.params.id
    }
  })
  return res.status(200).send()
})

router.get('/:id/ping', async (req, res) => {
  const project: ProjectAttributes = await Project.findByPk(req.params.id)

  if (project == null) {
    return res.json({success: false})
  }

  const project_ping = await api_ping(project.path);
  return res.json({success: project_ping})
})

router.get('/:id/logs', async (req, res) => {
  const project: ProjectAttributes = await Project.findByPk(req.params.id)

  if (project == null) {
    return res.json({success: false})
  }

  const project_logs = await api_logs(project.path);
  return res.json(project_logs)
})

router.get('/:id/exit', async (req, res) => {
  const project: ProjectAttributes = await Project.findByPk(req.params.id)

  if (project == null) {
    return res.json({success: false})
  }

  const project_exit = await api_stopApplication(project.path);
  return res.json({success: project_exit})
})

router.get('/:id/restart', async (req, res) => {
  const project: ProjectAttributes = await Project.findByPk(req.params.id)

  if (project == null) {
    return res.json({success: false})
  }

  const project_exit = await api_stopApplication(project.path);

  if (!project_exit) {
    return res.json({success: false})
  }

  try {
    await runApplication(project.path)
    return res.json({success: true})
  } catch (err) {
    return res.json({success: false})

  }
})

export default router
